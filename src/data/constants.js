// Em produção o placeholder 'API_URL' é substituído pelo entrypoint.sh;
// no webpack-dev-server usa URL relativa (o nginx local encaminha /api).
export const API_URL =
  process.env.NODE_ENV === 'development' ? '' : 'API_URL'; // change to you url.
