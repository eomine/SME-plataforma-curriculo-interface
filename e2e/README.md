# Testes de ponta a ponta

Playwright (veja `playwright.config.mjs`):

- **desktop** e **mobile** (`e2e/visual`): capturas de página inteira de 20
  páginas, em 1280×900 e 375×812, comparadas com capturas de referência.
  Tocam respostas da API gravadas antes, então não precisam de API nem de
  banco para rodar.

Todo teste falha se a página lançar uma exceção ou escrever um erro no console.

As respostas gravadas (`e2e/visual/hars`) e as capturas de referência
(`e2e/visual/__screenshots__`) não vão para o repositório: dependem do
conteúdo falso (aleatório) do banco local e do sistema operacional, que
renderiza as fontes de um jeito próprio. Cada um gera as suas, a partir de
uma versão do código que sirva de referência.

## Preparando

1. Instale o navegador: `npx playwright install chromium`.
2. Suba a API local com conteúdo: `docker compose up` na raiz do projeto (o
   `docker-compose.override.yml` roda `db:seed` e `db:seed:dev_content`).
3. Sirva o app. O alvo é `BASE_URL`, que por padrão é `http://localhost` (o
   nginx do docker compose, com o servidor do Vite). Para testar o build de
   produção, sirva o `build/` com o `/api` apontando para a API local e use
   essa URL.

## Gerando as respostas e as capturas de referência

Com a versão de referência do código (por exemplo, o branch de base de uma
mudança) servida em `BASE_URL`:

```sh
E2E_RECORD=1 npm run e2e:visual -- --update-snapshots
```

Isso:

- busca na API os slugs das páginas com slug (sequência, atividade, projeto,
  desafio, metodologia) e guarda em `e2e/visual/hars/slugs.json`;
- grava as respostas da API, das imagens e do que vem de fora (fontes,
  MathJax) em `e2e/visual/hars`, sem o login e sem os cabeçalhos das
  requisições;
- tira as capturas de referência em
  `e2e/visual/__screenshots__/<plataforma>/`.

Cada gravação apaga a anterior. Grave de novo quando a API ou o conteúdo do
banco mudarem.

## Comparando

Troque para a versão a testar (as duas pastas estão no `.gitignore`, então
continuam lá depois do `git checkout`; num `git worktree` novo, copie-as) e
rode:

```sh
npm run e2e:visual                     # não precisa de API
npx playwright show-report e2e-report  # relatório, com o diff das capturas
```

Se a diferença for esperada, aceite as capturas novas como referência:

```sh
npm run e2e:visual -- --update-snapshots
```

## Comparando com a API ao vivo

Com `E2E_LIVE=1` as páginas usam a API ao vivo, sem tocar nem gravar
respostas, e `SNAPSHOT_DIR` guarda as capturas em outra pasta. Serve para
comparar builds que pedem coisas diferentes à API (por exemplo, um bem mais
antigo). Com os builds servidos nas portas 4101 (antes) e 4102 (depois):

```sh
E2E_LIVE=1 BASE_URL=http://localhost:4101 SNAPSHOT_DIR=/tmp/antes npm run e2e:visual -- --update-snapshots
E2E_LIVE=1 BASE_URL=http://localhost:4102 SNAPSHOT_DIR=/tmp/antes npm run e2e:visual
npx playwright show-report e2e-report
```
