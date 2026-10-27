import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query/react';
import {
  curriculoApi,
  useGetChallengeQuery,
  useGetChallengeResultQuery,
  useGetChallengeResultsInfiniteQuery,
  useGetFinishedChallengesQuery,
  useGetOngoingChallengesQuery,
} from 'data/curriculoApi';
import withQuery from 'utils/withQuery';

const markSaved = (items, saved) => items.map(item => ({ ...item, isSaved: saved.includes(item.id) }));

// Desafios em andamento e, depois de `loadFinished()`, também os encerrados
// (como antes, o botão "Ver desafios encerrados" acrescenta os encerrados).
// Passa `challenges` (com isSaved pelos favoritos) e `loadFinished`.
export function withChallengeLists(Component) {
  function WithChallengeLists(props) {
    const [showFinished, setShowFinished] = useState(false);
    const ongoing = useGetOngoingChallengesQuery();
    const finished = useGetFinishedChallengesQuery(showFinished ? undefined : skipToken);
    const saved = useSelector(state => state.ChallengesReducer.saved);
    const loadFinished = useCallback(() => setShowFinished(true), []);
    const challenges = useMemo(
      () => markSaved([...(ongoing.data || []), ...((showFinished && finished.data) || [])], saved),
      [ongoing.data, finished.data, showFinished, saved]
    );

    return <Component {...props} challenges={challenges} loadFinished={loadFinished} />;
  }

  WithChallengeLists.displayName = `withChallengeLists(${Component.displayName || Component.name})`;
  return WithChallengeLists;
}

// Desafios favoritos entre as listas já em cache, para o perfil (que não
// carrega as listas; antes lia o que as páginas de desafios tinham carregado).
export function selectSavedChallenges(state) {
  const { saved } = state.ChallengesReducer;
  const { getFinishedChallenges, getOngoingChallenges } = curriculoApi.endpoints;
  const items = [
    ...(getOngoingChallenges.select()(state).data || []),
    ...(getFinishedChallenges.select()(state).data || []),
  ];
  return markSaved(items, saved).filter(item => item.isSaved);
}

const slugFromUrl = props => props.match.params.slug;

// O desafio da URL, como `prop` (null enquanto carrega).
export const withChallenge = (prop = 'challenge', options = {}) =>
  withQuery(useGetChallengeQuery, {
    arg: slugFromUrl,
    mapResult: result => ({ [prop]: result.currentData || null }),
    ...options,
  });

// Resultados do desafio da URL: `results`, `nextPage` (se há mais),
// `totalItems`, `isLoading` e `loadMore`.
export const withChallengeResults = withQuery(useGetChallengeResultsInfiniteQuery, {
  arg: slugFromUrl,
  mapResult: result => {
    const pages = result.currentData ? result.currentData.pages : [];
    return {
      results: pages.flatMap(page => page.items),
      nextPage: result.hasNextPage,
      totalItems: pages.length ? pages[0].totalItems : 0,
      isLoading: result.isFetching,
      loadMore: result.fetchNextPage,
    };
  },
});

// O resultado da URL, como `currResult`.
export const withChallengeResult = withQuery(useGetChallengeResultQuery, {
  arg: props => ({ slug: props.match.params.slug, id: props.match.params.id }),
  mapResult: result => ({ currResult: result.currentData || null }),
});
