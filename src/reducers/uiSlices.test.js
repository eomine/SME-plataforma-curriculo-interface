import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it } from 'vitest';
import body, {
  hideMobileMenu,
  loadingFinished,
  loadingStarted,
  selectIsLoading,
  showMobileMenu,
  withGlobalLoading,
} from 'reducers/bodySlice';
import home, { toggleHomePreview } from 'reducers/homeSlice';
import project, { projectSaved } from 'reducers/projectSlice';
import projects, { showAllProjects, toggleProjectPreview } from 'reducers/projectsSlice';
import sequences, { searchSequencesWithFilter, showAllSequences, toggleSequencePreview } from 'reducers/sequencesSlice';

const createStore = () => configureStore({ reducer: { body, home, project, projects, sequences } });

describe('slices de UI', () => {
  it('body: o loading global é um contador, e o menu do celular abre e fecha', () => {
    const store = createStore();
    store.dispatch(loadingStarted());
    store.dispatch(loadingStarted());
    store.dispatch(loadingFinished());
    expect(selectIsLoading(store.getState())).toBe(true);
    store.dispatch(loadingFinished());
    store.dispatch(loadingFinished());
    expect(store.getState().body.loadingCount).toBe(0);

    store.dispatch(showMobileMenu());
    expect(store.getState().body.hasMobileMenu).toBe(true);
    store.dispatch(hideMobileMenu());
    expect(store.getState().body.hasMobileMenu).toBe(false);
  });

  it('withGlobalLoading: some quando a Promise termina, mesmo com erro', async () => {
    const store = createStore();
    const ok = withGlobalLoading(store.dispatch, Promise.resolve());
    const failed = withGlobalLoading(store.dispatch, Promise.reject(new Error('x'))).catch(() => {});
    expect(store.getState().body.loadingCount).toBe(2);
    await ok;
    await failed;
    expect(selectIsLoading(store.getState())).toBe(false);
  });

  it('prévia expandida: abre, troca e fecha', () => {
    const store = createStore();
    store.dispatch(toggleHomePreview(1));
    expect(store.getState().home.expandedId).toBe(1);
    store.dispatch(toggleHomePreview(2));
    expect(store.getState().home.expandedId).toBe(2);
    store.dispatch(toggleHomePreview(2));
    expect(store.getState().home.expandedId).toBeNull();
  });

  it('uma nova busca fecha a prévia expandida', () => {
    const store = createStore();
    store.dispatch(toggleSequencePreview(5));
    store.dispatch(searchSequencesWithFilter({ type: 'curricular_components', id: 3 }));
    expect(store.getState().sequences.expandedId).toBeNull();
    expect(store.getState().sequences.query).not.toBe('');
    store.dispatch(showAllSequences());
    expect(store.getState().sequences.query).toBe('');

    store.dispatch(toggleProjectPreview(7));
    store.dispatch(showAllProjects());
    expect(store.getState().projects).toEqual({ query: '', expandedId: null });
  });

  it('project: guarda os projetos salvos na sessão', () => {
    const store = createStore();
    store.dispatch(projectSaved(3));
    store.dispatch(projectSaved(8));
    expect(store.getState().project.savedIds).toEqual([3, 8]);
  });
});
