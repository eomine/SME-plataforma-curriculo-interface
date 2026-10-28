import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// Com outros nomes: `showLoading` também é uma opção do withQuery.
import { hideLoading as hideGlobalLoading, showLoading as showGlobalLoading } from 'reducers/bodySlice';

// Liga um hook de query do RTK Query (data/curriculoApi) a um componente de
// classe: chama o hook e passa o resultado como props, via `mapResult`.
// - `arg`: tira das props o argumento da query (ex.: o id da URL).
// - `options`: opções do hook (ex.: refetchOnMountOrArgChange).
// - `showLoading`: mostra o loading global enquanto a primeira carga não chega;
//   ou uma função que decide a partir do resultado da query.
export default function withQuery(useQuery, { arg = () => undefined, options, mapResult, showLoading = false }) {
  return Component => {
    function WithQuery(props) {
      const result = useQuery(arg(props), options);
      const dispatch = useDispatch();
      const isLoading = typeof showLoading === 'function' ? showLoading(result) : showLoading && result.isLoading;

      useEffect(() => {
        if (!isLoading) {
          return undefined;
        }
        dispatch(showGlobalLoading());
        return () => dispatch(hideGlobalLoading());
      }, [dispatch, isLoading]);

      return <Component {...props} {...mapResult(result, props)} />;
    }

    WithQuery.displayName = `withQuery(${Component.displayName || Component.name})`;
    return WithQuery;
  };
}
