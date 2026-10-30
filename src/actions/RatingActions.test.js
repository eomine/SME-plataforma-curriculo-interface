import { configureStore } from '@reduxjs/toolkit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import messages from 'reducers/messagesSlice';
import RatingActions from 'actions/RatingActions';
import { curriculoApi } from 'data/curriculoApi';

vi.mock('utils/history', () => ({ history: { push: vi.fn(), back: vi.fn() } }));

function createStore() {
  return configureStore({
    reducer: { messages, [curriculoApi.reducerPath]: curriculoApi.reducer },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({ serializableCheck: false }).concat(curriculoApi.middleware),
  });
}

const json = (body, init) => Promise.resolve(new Response(JSON.stringify(body), init));

describe('RatingActions', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', { getItem: key => (key === 'teacherId' ? '1' : 'token'), removeItem: vi.fn() });
  });
  afterEach(() => vi.unstubAllGlobals());

  it('salva a avaliação e recarrega as sequências da coleção aberta', async () => {
    const fetch = vi.fn((url, options) => (options && options.method === 'POST' ? json({ id: 1 }, { status: 201 }) : json([])));
    vi.stubGlobal('fetch', fetch);
    const store = createStore();
    store.dispatch(curriculoApi.endpoints.getCollectionSequences.initiate({ teacherId: '1', id: 4 }));
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    await store.dispatch(RatingActions.save('minha-sequencia', { 2: 5, 3: 4 }));

    const post = fetch.mock.calls[1];
    expect(post[0]).toMatch(/\/api\/sequencias\/minha-sequencia\/avaliacao$/);
    expect(JSON.parse(post[1].body)).toEqual({
      activity_sequence_rating: { teacher_id: '1', ratings: [{ rating_id: '2', score: 5 }, { rating_id: '3', score: 4 }] },
    });
    expect(store.getState().messages.alert.message).toBe('Avaliação salva com sucesso!');
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
    expect(fetch.mock.calls[2][0]).toMatch(/\/colecoes\/4\/sequencias$/);
  });

  it('se a API recusa, mostra só o erro', async () => {
    vi.stubGlobal('fetch', vi.fn(() => json({ status: 422, error: 'Unprocessable Entity' }, { status: 422 })));
    const store = createStore();

    await store.dispatch(RatingActions.save('minha-sequencia', {}));

    expect(store.getState().messages.alert.message).toMatch(/^Ocorreu um erro: /);
  });
});
