import useGlobalLoading from 'utils/useGlobalLoading';

// Fallback do Suspense enquanto o código de uma página ou modal carrega:
// mostra o mesmo loading global das cargas de dados.
export default function PageLoading() {
  useGlobalLoading(true);
  return null;
}
