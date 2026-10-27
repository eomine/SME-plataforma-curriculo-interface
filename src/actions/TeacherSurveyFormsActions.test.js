import { configureStore } from '@reduxjs/toolkit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AlertReducer from 'reducers/AlertReducer';
import TeacherSurveyFormsActions from 'actions/TeacherSurveyFormsActions';
import { curriculoApi } from 'data/curriculoApi';
import { history } from 'utils/history';

vi.mock('utils/history', () => ({ history: { push: vi.fn(), back: vi.fn() } }));

function createStore() {
  return configureStore({
    reducer: { AlertReducer, [curriculoApi.reducerPath]: curriculoApi.reducer },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({ serializableCheck: false }).concat(curriculoApi.middleware),
  });
}

const json = (body, init) => Promise.resolve(new Response(JSON.stringify(body), init));

describe('TeacherSurveyFormsActions', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', { getItem: () => 'token', removeItem: vi.fn() });
    history.push.mockClear();
  });
  afterEach(() => vi.unstubAllGlobals());

  it('salvar a resposta envia JSON e recarrega os formulários finalizados', async () => {
    const fetch = vi.fn((url, options) => (options && options.method === 'POST' ? json({ id: 1 }, { status: 201 }) : json([])));
    vi.stubGlobal('fetch', fetch);
    const store = createStore();
    store.dispatch(curriculoApi.endpoints.getFinishedSurveyForms.initiate(1));
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const answer = { survey_form_id: 3, finished: true, answers_attributes: [{ rating: 2 }] };
    await store.dispatch(TeacherSurveyFormsActions.create(answer));

    const post = fetch.mock.calls[1];
    expect(post[0]).toMatch(/\/api\/survey_form_answers$/);
    expect(JSON.parse(post[1].body)).toEqual(answer);
    expect(post[1].headers.Authorization).toBe('token');
    expect(store.getState().AlertReducer.message).toBe('Resposta salva com sucesso.');
    expect(history.push).toHaveBeenCalledWith('/consultas-publicas');
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
    expect(fetch.mock.calls[2][0]).toMatch(/\/api\/professores\/1\/todas_respostas$/);
  });
});
