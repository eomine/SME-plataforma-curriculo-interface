import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';

// replay (padrão): toca as respostas gravadas em hars/, sem API.
// record (E2E_RECORD=1): usa a API local e regrava hars/ e slugs.json.
// live (E2E_LIVE=1): usa a API local sem gravar nada (para comparar builds).
export const mode = process.env.E2E_RECORD ? 'record' : process.env.E2E_LIVE ? 'live' : 'replay';

export const harsDir = path.join(import.meta.dirname, 'hars');
export const slugsFile = path.join(harsDir, 'slugs.json');

// As respostas gravadas e as capturas não vão para o repositório.
export const notRecorded =
  'Faltam as respostas gravadas em e2e/visual/hars. Com a API local no ar, grave com ' +
  '"E2E_RECORD=1 npm run e2e:visual -- --update-snapshots" (veja e2e/README.md).';

// Nas respostas gravadas, a origem do app vira esta (veja global-teardown.mjs).
export const appOrigin = 'http://app.e2e';

// Responde com o que foi gravado no HAR. Não usa o routeFromHAR do Playwright
// porque ele compara a URL inteira, com a porta em que se gravou.
export async function replayHar(page, harPath, url, baseURL) {
  const { origin } = new URL(baseURL);
  const { log } = JSON.parse(fs.readFileSync(harPath, 'utf8'));
  const responses = new Map();
  for (const { request, response } of log.entries) {
    const key = `${request.method} ${request.url}`;
    if (!responses.has(key)) responses.set(key, response);
  }

  await page.route(url, route => {
    const request = route.request();
    const requestUrl = request.url().startsWith(origin + '/')
      ? appOrigin + request.url().slice(origin.length)
      : request.url();
    let response = responses.get(`${request.method()} ${requestUrl}`);
    // Segue os redirecionamentos dentro do HAR: o navegador não passa a
    // requisição redirecionada por aqui, e iria à rede (as imagens do Active
    // Storage redirecionam para uma URL assinada que expira em minutos).
    for (let target = requestUrl, hops = 0; response?.redirectURL && hops < 5; hops++) {
      target = new URL(response.redirectURL, target).href;
      response = responses.get(`GET ${target}`);
    }
    if (!response || response.status < 0) return route.abort();

    const { content } = response;
    const headers = Object.fromEntries(
      response.headers
        .filter(({ name }) => !/^(content-length|content-encoding|transfer-encoding)$/i.test(name))
        .map(({ name, value }) => [name, value])
    );
    return route.fulfill({
      status: response.status,
      headers,
      ...(content._file
        ? { path: path.join(path.dirname(harPath), content._file) }
        : { body: Buffer.from(content.text || '', content.encoding === 'base64' ? 'base64' : 'utf8') }),
    });
  });
}
