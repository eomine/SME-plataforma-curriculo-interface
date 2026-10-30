import { configureStore } from '@reduxjs/toolkit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import messages from 'reducers/messagesSlice';
import {
  projectFiltersActions,
  projectFiltersReducer,
  sequenceFiltersActions,
  sequenceFiltersReducer,
} from 'reducers/filtersSlice';

vi.mock('utils/history', () => ({ history: { push: vi.fn() } }));

const createStore = () =>
  configureStore({
    reducer: { messages, sequenceFilters: sequenceFiltersReducer, projectFilters: projectFiltersReducer },
  });

const json = body => Promise.resolve(new Response(JSON.stringify(body)));
const filtros = {
  segments: [{ id: 1, name: 'Ensino Fundamental' }, { id: 2, name: 'Ensino Médio' }],
  stages: [{ id: 1, name: 'Ciclo de Alfabetização' }],
  curricular_components: [{ id: 3, name: 'Arte', slug: 'arte' }],
  regional_education_boards: [{ id: 2, name: 'DRE Penha' }],
};
const active = state => state.filters.filter(item => item.isActive).map(item => `${item.type}:${item.id}`);

describe('filtersSlice', () => {
  let fetch;
  beforeEach(() => {
    vi.stubGlobal('localStorage', { getItem: () => null, removeItem: vi.fn() });
    fetch = vi.fn(() => json(filtros));
    vi.stubGlobal('fetch', fetch);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('carrega os filtros de cada lista com os tipos dela', async () => {
    const store = createStore();
    await store.dispatch(sequenceFiltersActions.load());
    await store.dispatch(projectFiltersActions.load());

    const types = list => [...new Set(list.map(item => item.type))];
    expect(types(store.getState().sequenceFilters.filters)).toEqual(['segments', 'stages', 'curricular_components']);
    expect(types(store.getState().projectFilters.filters)).toContain('regional_education_boards');
  });

  it('só um segmento ativo por vez, e as listas não se misturam', async () => {
    const store = createStore();
    await store.dispatch(sequenceFiltersActions.load());
    await store.dispatch(projectFiltersActions.load());
    const [fundamental, medio] = store.getState().sequenceFilters.filters;

    store.dispatch(sequenceFiltersActions.toggleSegments(fundamental));
    expect(active(store.getState().sequenceFilters)).toEqual(['segments:1']);
    store.dispatch(sequenceFiltersActions.toggleSegments(medio));
    expect(active(store.getState().sequenceFilters)).toEqual(['segments:2']);
    expect(active(store.getState().projectFilters)).toEqual([]);
  });

  it('recarregar as etapas mantém ativo o que já estava', async () => {
    const store = createStore();
    await store.dispatch(sequenceFiltersActions.load());
    const fundamental = store.getState().sequenceFilters.filters[0];
    store.dispatch(sequenceFiltersActions.toggleSegments(fundamental));

    await store.dispatch(sequenceFiltersActions.getStages(store.getState().sequenceFilters.filters[0]));

    expect(fetch.mock.calls[1][0]).toMatch(/\/api\/filtros\?segment_id\[\]=1$/);
    expect(active(store.getState().sequenceFilters)).toEqual(['segments:1']);
  });

  it('ano ou componente carrega os filtros extras; limpar desativa tudo', async () => {
    const store = createStore();
    await store.dispatch(sequenceFiltersActions.load());
    fetch.mockReturnValueOnce(json({ learning_objectives: [{ id: 9, code: 'EF01AR01' }] }));
    const arte = store.getState().sequenceFilters.filters.find(item => item.type === 'curricular_components');

    await store.dispatch(sequenceFiltersActions.toggleFilter(arte));
    expect(store.getState().sequenceFilters.filtersExtra).toEqual([
      { id: 9, code: 'EF01AR01', isActive: false, type: 'learning_objectives' },
    ]);

    store.dispatch(sequenceFiltersActions.setQuery('água'));
    store.dispatch(sequenceFiltersActions.clearFilters());
    expect(active(store.getState().sequenceFilters)).toEqual([]);
    expect(store.getState().sequenceFilters.query).toBe('');
  });

  it('objetivos de aprendizagem sem ano ou componente: alerta', async () => {
    const store = createStore();
    await store.dispatch(sequenceFiltersActions.load());

    store.dispatch(sequenceFiltersActions.showCategory({ slug: 'learning_objectives' }));

    expect(store.getState().sequenceFilters.isShowingCategory).toBe(false);
    expect(store.getState().messages.alert.message).toBe('Selecione uma etapa ou componente curricular.');
  });
});
