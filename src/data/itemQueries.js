import { skipToken } from '@reduxjs/toolkit/query/react';
import {
  useGetPerformedSequencesQuery,
  useGetProjectQuery,
  useGetSequenceCollectionsQuery,
  useGetSequenceQuery,
} from 'data/curriculoApi';
import getTeacherId from 'data/getTeacherId';
import isLogged from 'data/isLogged';
import withQuery from 'utils/withQuery';

// Ligações das telas de sequência e de projeto com o curriculoApi. Por padrão
// o slug vem da URL (match.params.slug).
const slugFromUrl = props => props.match.params.slug;

// A sequência, como `data` (null enquanto carrega).
export const withSequence = (slug = slugFromUrl, options = {}) =>
  withQuery(useGetSequenceQuery, {
    arg: props => slug(props) || skipToken,
    mapResult: result => ({ data: result.currentData || null }),
    ...options,
  });

// Coleções do professor em que a sequência está: `inCollections` e `isSaved`.
export const withSequenceCollections = (slug = slugFromUrl) =>
  withQuery(useGetSequenceCollectionsQuery, {
    arg: props => (isLogged() && slug(props) ? { teacherId: getTeacherId(), slug: slug(props) } : skipToken),
    mapResult: result => ({
      inCollections: result.currentData || [],
      isSaved: !!(result.currentData && result.currentData.length),
    }),
  });

// Sequências realizadas pelo professor logado, como `performed`.
export const withPerformedSequences = withQuery(useGetPerformedSequencesQuery, {
  arg: () => (isLogged() ? getTeacherId() : skipToken),
  mapResult: result => ({ performed: result.data || [] }),
});

// O projeto, como `data` ({} enquanto carrega), e `isSearching` enquanto busca.
export const withProject = withQuery(useGetProjectQuery, {
  arg: props => slugFromUrl(props),
  mapResult: result => ({ data: result.currentData || {}, isSearching: result.isFetching }),
  showLoading: true,
});
