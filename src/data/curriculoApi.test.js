import { configureStore } from '@reduxjs/toolkit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AlertReducer from 'reducers/AlertReducer';
import { curriculoApi, markProjectSaved, markSequenceSaved } from 'data/curriculoApi';

// O history real precisa de window.
vi.mock('utils/history', () => ({ history: { push: vi.fn() } }));

function createStore() {
  return configureStore({
    reducer: {
      AlertReducer,
      [curriculoApi.reducerPath]: curriculoApi.reducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(curriculoApi.middleware),
  });
}

function mockFetch(status, body, headers = {}) {
  const fetch = vi.fn(() =>
    Promise.resolve(
      new Response(typeof body === 'string' ? body : JSON.stringify(body), { status, headers })
    )
  );
  vi.stubGlobal('fetch', fetch);
  return fetch;
}

describe('curriculoApi', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: key => (key === 'accessToken' ? 'token-123' : null),
      removeItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('carrega pelo Api.get, com o token e o meta de paginação', async () => {
    const fetch = mockFetch(200, [{ id: 1 }], {
      link: '<https://x/api/ods?page=2>; rel="next"',
      total: '17',
    });
    const store = createStore();

    const result = await store.dispatch(curriculoApi.endpoints.getSustainableDevGoals.initiate());

    expect(result.data).toEqual([{ id: 1 }]);
    expect(fetch.mock.calls[0][0]).toMatch(/\/api\/ods$/);
    expect(fetch.mock.calls[0][1].headers).toEqual({ Authorization: 'token-123' });
    const [query] = Object.values(store.getState().curriculoApi.queries);
    expect(query.status).toBe('fulfilled');
  });

  it('não repete a requisição quando o dado já está no cache', async () => {
    const fetch = mockFetch(200, { id: 3 });
    const store = createStore();

    await store.dispatch(curriculoApi.endpoints.getSustainableDevGoal.initiate(3));
    await store.dispatch(curriculoApi.endpoints.getSustainableDevGoal.initiate(3));

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('ordena os critérios de avaliação pela sequência', async () => {
    mockFetch(200, [{ id: 'b', sequence: 2 }, { id: 'c', sequence: 3 }, { id: 'a', sequence: 1 }]);
    const store = createStore();

    const result = await store.dispatch(curriculoApi.endpoints.getRatingCriteria.initiate());

    expect(result.data.map(item => item.id)).toEqual(['a', 'b', 'c']);
  });

  it('pagina as sequências pela URL do header Link', async () => {
    const fetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: 1 }]), {
        headers: { link: '<https://x/api/sequencias?q=agua&page=2>; rel="next"', total: '2' },
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: 2 }])));
    vi.stubGlobal('fetch', fetch);
    const store = createStore();
    const { getSequences } = curriculoApi.endpoints;

    await store.dispatch(getSequences.initiate('q=agua'));
    const result = await store.dispatch(getSequences.initiate('q=agua', { direction: 'forward' }));

    expect(fetch.mock.calls[0][0]).toMatch(/\/api\/sequencias\?q=agua$/);
    expect(fetch.mock.calls[1][0]).toBe('https://x/api/sequencias?q=agua&page=2');
    expect(result.data.pages.map(page => page.items)).toEqual([[{ id: 1 }], [{ id: 2 }]]);
    expect(result.data.pages[0].totalItems).toBe('2');
    expect(result.hasNextPage).toBe(false);
  });

  it('marca a sequência salva em todas as buscas em cache', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve(new Response(JSON.stringify([{ id: 1 }, { id: 2, isSaved: false }])))
    ));
    const store = createStore();
    const { getSequences } = curriculoApi.endpoints;
    await store.dispatch(getSequences.initiate(''));
    await store.dispatch(getSequences.initiate('q=agua'));

    store.dispatch(markSequenceSaved(2));

    for (const arg of ['', 'q=agua']) {
      const { data } = getSequences.select(arg)(store.getState());
      expect(data.pages[0].items).toEqual([{ id: 1 }, { id: 2, isSaved: true }]);
    }
  });

  it('marca o projeto salvo só na lista de projetos', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response(JSON.stringify([{ id: 2 }])))));
    const store = createStore();
    const { getProjects, getSequences } = curriculoApi.endpoints;
    await store.dispatch(getProjects.initiate(''));
    await store.dispatch(getSequences.initiate(''));

    store.dispatch(markProjectSaved(2));

    expect(getProjects.select('')(store.getState()).data.pages[0].items).toEqual([{ id: 2, isSaved: true }]);
    expect(getSequences.select('')(store.getState()).data.pages[0].items).toEqual([{ id: 2 }]);
  });

  it('salvar numa coleção envia o FormData das actions e recarrega a coleção e a lista', async () => {
    const fetch = vi.fn(() => Promise.resolve(new Response(JSON.stringify([]))));
    vi.stubGlobal('fetch', fetch);
    const store = createStore();
    const { addToCollection, getCollections, getCollectionSequences } = curriculoApi.endpoints;
    // Assinaturas ativas, como as de uma tela aberta.
    store.dispatch(getCollections.initiate('1'));
    store.dispatch(getCollectionSequences.initiate({ teacherId: '1', id: 7 }));
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    await store.dispatch(addToCollection.initiate({ teacherId: '1', id: 7, kind: 'sequence', itemId: 42 })).unwrap();

    const [url, options] = fetch.mock.calls[2];
    expect(url).toMatch(/\/api\/professores\/1\/colecoes\/7\/sequencias$/);
    expect(options.method).toBe('POST');
    expect(options.body.get('collection_activity_sequence[activity_sequence_id]')).toBe('42');
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(5));
    const refetched = fetch.mock.calls.slice(3).map(call => call[0].replace(/^.*\/api\//, ''));
    expect(refetched.sort()).toEqual(['professores/1/colecoes', 'professores/1/colecoes/7/sequencias']);
  });

  it('grava o comentário em JSON e recarrega o projeto', async () => {
    const fetch = vi.fn(() => Promise.resolve(new Response(JSON.stringify({ id: 1, comments: [] }))));
    vi.stubGlobal('fetch', fetch);
    const store = createStore();
    const { createComment, getProject } = curriculoApi.endpoints;
    store.dispatch(getProject.initiate('meu-projeto'));
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    await store.dispatch(createComment.initiate({ comment: { body: '<p>Oi</p>', project_id: 1 }, slug: 'meu-projeto' })).unwrap();

    const [url, options] = fetch.mock.calls[1];
    expect(url).toMatch(/\/api\/comments$/);
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(options.body)).toEqual({ body: '<p>Oi</p>', project_id: 1 });
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
    expect(fetch.mock.calls[2][0]).toMatch(/\/api\/projects\/meu-projeto$/);
  });

  it('mostra o alerta de erro, como as actions faziam', async () => {
    mockFetch(422, { error: 'não encontrado' });
    const store = createStore();

    const result = await store.dispatch(curriculoApi.endpoints.getConsultation.initiate(9));

    expect(result.error).toBe('não encontrado');
    expect(store.getState().AlertReducer).toEqual({
      isOpened: true,
      message: 'Ocorreu um erro: não encontrado',
    });
  });
});
