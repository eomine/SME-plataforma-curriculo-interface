import { configureStore } from '@reduxjs/toolkit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AlertReducer from 'reducers/AlertReducer';
import ChallengesReducer from 'reducers/ChallengesReducer';
import SnackbarReducer from 'reducers/SnackbarReducer';
import ChallengeActions from 'actions/ChallengeActions';
import { curriculoApi } from 'data/curriculoApi';

vi.mock('utils/history', () => ({ history: { push: vi.fn(), back: vi.fn() } }));

function createStore() {
  return configureStore({
    reducer: {
      AlertReducer,
      ChallengesReducer,
      SnackbarReducer,
      [curriculoApi.reducerPath]: curriculoApi.reducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({ serializableCheck: false }).concat(curriculoApi.middleware),
  });
}

const json = (body, init) => Promise.resolve(new Response(JSON.stringify(body), init));

describe('ChallengeActions', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', { getItem: key => (key === 'teacherId' ? '1' : 'token'), removeItem: vi.fn() });
  });
  afterEach(() => vi.unstubAllGlobals());

  it('ao salvar um favorito, carrega os favoritos para marcar as listas', async () => {
    const fetch = vi.fn()
      .mockReturnValueOnce(json({ id: 9 }, { status: 201 }))
      .mockReturnValueOnce(json({ challenges: [3, 9] }));
    vi.stubGlobal('fetch', fetch);
    const store = createStore();

    await store.dispatch(ChallengeActions.save(9));
    await vi.waitFor(() => expect(store.getState().ChallengesReducer.saved).toEqual([3, 9]));

    expect(fetch.mock.calls[0][1].method).toBe('POST');
    expect(fetch.mock.calls[0][1].body.get('favourite[challenge]')).toBe('9');
    expect(fetch.mock.calls[1][0]).toMatch(/\/api\/professores\/1\/favoritos$/);
    expect(store.getState().SnackbarReducer.message).toBe('Desafio salvo');
  });

  it('se salvar o favorito falha (a API dá 404), mostra o alerta e não marca nada', async () => {
    vi.stubGlobal('fetch', vi.fn(() => json({ status: 404, error: 'Not Found' }, { status: 404 })));
    const store = createStore();

    await store.dispatch(ChallengeActions.save(9));

    expect(store.getState().AlertReducer.message).toBe('Ocorreu um erro: Not Found');
    expect(store.getState().ChallengesReducer.saved).toEqual([]);
  });

  it('enviar resultado recarrega os resultados do desafio', async () => {
    const fetch = vi.fn((url, options) => (options && options.method === 'POST' ? json({ id: 1 }, { status: 201 }) : json([])));
    vi.stubGlobal('fetch', fetch);
    const store = createStore();
    store.dispatch(curriculoApi.endpoints.getChallengeResults.initiate('meu-desafio'));
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    await store.dispatch(ChallengeActions.sendResult('meu-desafio', 'Turma A', 'Descrição', ['http://x'], []));

    const post = fetch.mock.calls[1];
    expect(post[0]).toMatch(/\/api\/desafios\/meu-desafio\/resultados$/);
    expect(post[1].body.get('result[class_name]')).toBe('Turma A');
    expect(post[1].body.getAll('result[links_attributes][][link]')).toEqual(['http://x']);
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
    expect(fetch.mock.calls[2][0]).toMatch(/\/api\/desafios\/meu-desafio\/resultados$/);
  });
});
