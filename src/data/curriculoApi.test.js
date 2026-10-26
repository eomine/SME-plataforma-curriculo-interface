import { configureStore } from '@reduxjs/toolkit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AlertReducer from 'reducers/AlertReducer';
import { curriculoApi, markSequenceSaved } from 'data/curriculoApi';

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
