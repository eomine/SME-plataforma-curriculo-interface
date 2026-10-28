import { openAlert } from 'reducers/messagesSlice';
import BodyActions from 'actions/BodyActions';
import { API_URL } from 'data/constants';
import { history } from 'utils/history';

function getNextPage(headers) {
  if (headers.has('link')) {
    // Ex.: <https://.../api/sequences?page=2>; rel="next", <...>; rel="last"
    const next = headers
      .get('link')
      .split(/,\s*(?=<)/)
      .map(link => link.match(/^<([^>]*)>(.*)$/))
      .find(match => match && /;\s*rel="?([^";]*\s)?next(\s[^";]*)?"?/.test(match[2]));
    return next ? next[1] : null;
  }

  return null;
}

function getPromise(dispatch, func, method, url, data, isJson) {
  return new Promise((resolve, reject) => {
    func
      .apply(this, [method, url, data, isJson])
      .then(response => {
        response.text().then(text => {
          if (response.status === 401) {
            // Unauthorized
            localStorage.removeItem('accessToken');
            history.push('/');
            dispatch(BodyActions.hideLoading());
          }

          if (text.length) {
            try {
              const data = JSON.parse(text);
              const { headers } = response;
              const nextPage = getNextPage(headers);
              const totalItems = headers.has('total')
                ? headers.get('total')
                : 0;
              if (data.error) {
                reject(data.error);
              } else if (data.errors) {
                reject(data.errors.message);
              } else {
                resolve({ data, headers, nextPage, totalItems });
              }
            } catch (e) {
              console.error('error', e);
              reject(e);
            }
          } else {
            resolve({});
          }
        })
      })
      .catch(reject);
  });
}

function doRequest(method, url, data, isJson) {
  const options = { method };
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    options.headers = { Authorization: accessToken };
  }

  if (data) {
    if (data instanceof FormData) {
      // Formulários que já montam o FormData (projeto)
      options.body = data;
    } else if (isJson) {
      options.headers = { ...options.headers, 'Content-Type': 'application/json' };
      options.body = JSON.stringify(data);
    } else {
      const body = new FormData();
      for (const key in data) {
        const value = data[key];
        if (Array.isArray(value)) {
          value.forEach(item => body.append(key, item));
        } else {
          body.append(key, value);
        }
      }
      options.body = body;
    }
  }

  const fullUrl = url.match(/http/) ? url : API_URL + url;

  return fetch(fullUrl, options)
    .then(response => response)
    .catch(error => {
      throw error;
    });
}

class Api {
  static simpleGet(url, onCall, onSuccess) {
    return dispatch => {
      if (onCall) {
        dispatch({ type: onCall });
      }

      return Api.get(dispatch, url)
        .then(response => dispatch({ ...response, type: onSuccess }))
        .catch(error =>
          dispatch(openAlert(`Ocorreu um erro: ${error}`))
        );
    };
  }

  static get(dispatch, url) {
    return getPromise(dispatch, doRequest, 'GET', url);
  }

  static put(dispatch, url, data, isJson) {
    return getPromise(dispatch, doRequest, 'PUT', url, data, isJson);
  }

  static post(dispatch, url, data, isJson) {
    return getPromise(dispatch, doRequest, 'POST', url, data, isJson);
  }

  static delete(dispatch, url, data, isJson) {
    return getPromise(dispatch, doRequest, 'DELETE', url, data, isJson);
  }
}

export default Api;
