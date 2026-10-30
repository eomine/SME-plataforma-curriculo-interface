import Api from 'data/Api';
import { openAlert } from 'reducers/messagesSlice';
import { curriculoApi } from 'data/curriculoApi';
import { history } from 'utils/history';

// As listas de sequências e projetos em cache foram buscadas sem login e não
// marcam o que o professor já salvou.
const invalidateLoggedOutData = () => curriculoApi.util.invalidateTags(['SequenceList', 'ProjectList']);

const LoginActions = {
  LOGGED_IN: 'LoginActions.LOGGED_IN',
  LOGGED_OUT: 'LoginActions.LOGGED_OUT',

  login(username, password) {
    return dispatch => {
      const data = {
        'user[login]': username,
        'user[password]': password,
      };

      return Api.post(dispatch, `/api/login`, data)
        .then(response => {
          localStorage.setItem(
            'accessToken',
            response.headers.get('Authorization'),
          );

          history.push('/perfil');
          dispatch({ type: LoginActions.LOGGED_IN });
          dispatch(invalidateLoggedOutData());
        })
        .catch(error =>
          dispatch(openAlert(`Ocorreu um erro: ${error}`))
        );
    };
  },
  tokenLogin(token) {
    return dispatch => {
      const data = {
        'token': token,
      };

      return Api.post(dispatch, `/api/token_login`, data)
        .then(response => {
          localStorage.setItem(
            'accessToken',
            response.headers.get('Authorization'),
          );

          history.push('/perfil');
          dispatch({ type: LoginActions.LOGGED_IN });
          dispatch(invalidateLoggedOutData());
        })
        .catch(error =>
          dispatch(openAlert(`Ocorreu um erro: ${error}`))
        );
    };
  },
  logout() {
    return dispatch => {
      Api.get(dispatch, '/api/logout');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('blocked');
      localStorage.removeItem('teacherId');
      dispatch({ type: LoginActions.LOGGED_OUT });
      // O cache do curriculoApi guarda dados do professor (coleções etc.).
      dispatch(curriculoApi.util.resetApiState());

      if (history.location.pathname.match(/perfil|colecao/)) {
        history.push('/');
      }
    };
  },
};

export default LoginActions;
