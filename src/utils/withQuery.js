import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import BodyActions from 'actions/BodyActions';

// Liga um hook de query do RTK Query (data/curriculoApi) a um componente de
// classe: chama o hook e passa o resultado como props, via `mapResult`.
// - `arg`: tira das props o argumento da query (ex.: o id da URL).
// - `showLoading`: mostra o loading global enquanto a primeira carga não chega;
//   ou uma função que decide a partir do resultado da query.
export default function withQuery(useQuery, { arg = () => undefined, mapResult, showLoading = false }) {
  return Component => {
    function WithQuery(props) {
      const result = useQuery(arg(props));
      const dispatch = useDispatch();
      const isLoading = typeof showLoading === 'function' ? showLoading(result) : showLoading && result.isLoading;

      useEffect(() => {
        if (!isLoading) {
          return undefined;
        }
        dispatch(BodyActions.showLoading());
        return () => dispatch(BodyActions.hideLoading());
      }, [dispatch, isLoading]);

      return <Component {...props} {...mapResult(result, props)} />;
    }

    WithQuery.displayName = `withQuery(${Component.displayName || Component.name})`;
    return WithQuery;
  };
}
