import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadingFinished, loadingStarted } from 'reducers/bodySlice';

// Mostra o loading global enquanto `isLoading` for true e o componente estiver
// montado (veja o contador em reducers/bodySlice).
export default function useGlobalLoading(isLoading) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoading) {
      return undefined;
    }
    dispatch(loadingStarted());
    return () => dispatch(loadingFinished());
  }, [dispatch, isLoading]);
}
