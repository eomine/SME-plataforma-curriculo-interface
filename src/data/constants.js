// Em produção o placeholder 'API_URL' é substituído pelo entrypoint.sh;
// no servidor de desenvolvimento do Vite usa URL relativa (o nginx local
// encaminha /api).
export const API_URL =
  process.env.NODE_ENV === 'development' ? '' : 'API_URL';
