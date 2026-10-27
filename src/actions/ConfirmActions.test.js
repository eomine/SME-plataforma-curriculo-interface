import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it } from 'vitest';
import ConfirmReducer from 'reducers/ConfirmReducer';
import ConfirmActions from 'actions/ConfirmActions';

const createStore = () => configureStore({ reducer: { ConfirmReducer } });

describe('ConfirmActions', () => {
  it('abre o diálogo só com os textos e resolve com a resposta', async () => {
    const store = createStore();
    const answer = store.dispatch(ConfirmActions.open('Excluir?', 'Sem volta.', 'Excluir', 'Cancelar'));

    expect(store.getState().ConfirmReducer).toEqual({
      isOpened: true, title: 'Excluir?', message: 'Sem volta.', labelYes: 'Excluir', labelNo: 'Cancelar',
    });
    store.dispatch(ConfirmActions.answer(true));
    await expect(answer).resolves.toBe(true);
    expect(store.getState().ConfirmReducer.isOpened).toBe(false);
  });

  it('fechar resolve com false, e abrir outro diálogo cancela o anterior', async () => {
    const store = createStore();
    const first = store.dispatch(ConfirmActions.open('A?', '', 'Sim', 'Não'));
    const second = store.dispatch(ConfirmActions.open('B?', '', 'Sim', 'Não'));
    await expect(first).resolves.toBe(false);

    store.dispatch(ConfirmActions.answer(false));
    await expect(second).resolves.toBe(false);
  });
});
