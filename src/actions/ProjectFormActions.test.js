import { configureStore } from '@reduxjs/toolkit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import messages from 'reducers/messagesSlice';
import CreateProjectActions from 'actions/CreateProjectActions';
import EditProjectActions from 'actions/EditProjectActions';
import { curriculoApi } from 'data/curriculoApi';
import { history } from 'utils/history';

vi.mock('utils/history', () => ({ history: { push: vi.fn(), back: vi.fn() } }));

function createStore() {
  return configureStore({
    reducer: { messages, [curriculoApi.reducerPath]: curriculoApi.reducer },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({ serializableCheck: false }).concat(curriculoApi.middleware),
  });
}

const json = (body, init) => Promise.resolve(new Response(JSON.stringify(body), init));

function projectForm(title) {
  const form = new FormData();
  form.append('project[title]', title);
  return form;
}

describe('formulários de projeto', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', { getItem: () => 'token', removeItem: vi.fn() });
    history.push.mockClear();
  });
  afterEach(() => vi.unstubAllGlobals());

  it('criar envia o FormData do formulário e vai para o perfil', async () => {
    const fetch = vi.fn(() => json({ id: 1 }, { status: 201 }));
    vi.stubGlobal('fetch', fetch);
    const store = createStore();
    const form = projectForm('Novo');

    await store.dispatch(CreateProjectActions.create(form));

    expect(fetch.mock.calls[0][0]).toMatch(/\/api\/projects$/);
    expect(fetch.mock.calls[0][1].method).toBe('POST');
    expect(fetch.mock.calls[0][1].body).toBe(form);
    expect(store.getState().messages.alert.message).toBe('Projeto salvo com sucesso.');
    expect(history.push).toHaveBeenCalledWith('/perfil');
  });

  it('atualizar não busca de novo o projeto aberto na edição (o slug pode mudar)', async () => {
    const fetch = vi.fn((url, options) => (options && options.method === 'PUT' ? json({}, { status: 201 }) : json({ slug: 'antigo' })));
    vi.stubGlobal('fetch', fetch);
    const store = createStore();
    store.dispatch(curriculoApi.endpoints.getProjectToEdit.initiate('antigo'));
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    await store.dispatch(EditProjectActions.update(projectForm('Novo título'), 'antigo'));
    await new Promise(resolve => setTimeout(resolve, 20));

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch.mock.calls[1][0]).toMatch(/\/api\/projects\/antigo$/);
    expect(fetch.mock.calls[1][1].body.get('project[title]')).toBe('Novo título');
    expect(store.getState().messages.alert.message).toBe('Projeto atualizado com sucesso.');
    expect(history.push).toHaveBeenCalledWith('/perfil');
  });

  it('se salvar falha, mostra só o erro e fica no formulário', async () => {
    vi.stubGlobal('fetch', vi.fn(() => json({ status: 422, error: 'Unprocessable Entity' }, { status: 422 })));
    const store = createStore();

    await store.dispatch(CreateProjectActions.create(projectForm('Novo')));

    expect(store.getState().messages.alert.message).toMatch(/^Ocorreu um erro: /);
    expect(history.push).not.toHaveBeenCalled();
  });
});
