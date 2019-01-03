import fetch from 'dva/fetch';
import { message } from 'antd';


function parseJSON(response) {
  return response.json();
}

function checkLoginStatus(data){
  console.log('>>>>>',data);
  if (data.errcode == -1) {
    message.warn('请先登录');
    let a = window.location.origin + window.location.pathname;
    window.location = a + '#/login';
    return false;
  }
  return data;
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url) {
  return fetch(url, { credentials: 'include' })
    .then(checkStatus)
    .then(parseJSON)
    .then(checkLoginStatus)
    .catch(err => ({ err }));
}

export function post(url, data){
  return fetch(url, {
    credentials: 'include',
    body: JSON.stringify(data),
    method: 'POST',
    headers: {"Content-Type": "application/json"}
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(checkLoginStatus)
    .catch(err => ({ err }));
}
