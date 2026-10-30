import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it } from 'vitest';
import messages, {
  answerConfirmation,
  askConfirmation,
  closeAlert,
  closeSnackbar,
  openAlert,
  openSnackbar,
} from 'reducers/messagesSlice';

const createStore = () => configureStore({ reducer: { messages } });

describe('messagesSlice', () => {
  it('abre e fecha o alerta', () => {
    const store = createStore();
    store.dispatch(openAlert('Salvo.'));
    expect(store.getState().messages.alert).toEqual({ isOpened: true, message: 'Salvo.' });
    store.dispatch(closeAlert());
    expect(store.getState().messages.alert).toEqual({ isOpened: false, message: '' });
  });

  it('abre o snackbar com o destaque separado da mensagem, e fecha', () => {
    const store = createStore();
    store.dispatch(openSnackbar('Salvo em', 'Minha coleção'));
    expect(store.getState().messages.snackbar).toEqual({ isOpened: true, message: 'Salvo em', highlight: 'Minha coleção' });
    store.dispatch(openSnackbar('Desafio salvo'));
    expect(store.getState().messages.snackbar.highlight).toBeNull();
    store.dispatch(closeSnackbar());
    expect(store.getState().messages.snackbar.isOpened).toBe(false);
  });

  it('abre o diálogo de confirmação só com os textos e resolve com a resposta', async () => {
    const store = createStore();
    const answer = store.dispatch(askConfirmation('Excluir?', 'Sem volta.', 'Excluir', 'Cancelar'));

    expect(store.getState().messages.confirm).toEqual({
      isOpened: true, title: 'Excluir?', message: 'Sem volta.', labelYes: 'Excluir', labelNo: 'Cancelar',
    });
    store.dispatch(answerConfirmation(true));
    await expect(answer).resolves.toBe(true);
    expect(store.getState().messages.confirm.isOpened).toBe(false);
  });

  it('fechar resolve com false, e abrir outro diálogo cancela o anterior', async () => {
    const store = createStore();
    const first = store.dispatch(askConfirmation('A?', '', 'Sim', 'Não'));
    const second = store.dispatch(askConfirmation('B?', '', 'Sim', 'Não'));
    await expect(first).resolves.toBe(false);

    store.dispatch(answerConfirmation(false));
    await expect(second).resolves.toBe(false);
  });
});
