import store from 'store';

export function isLoggedIn() {
  return !!store.get('loggedIn');
}

export function login(data) {
  store.set('loggedIn', true);
  store.set('user', data);
  data.userId && setCookie('userId', data.userId)
}

export function logout() {
  store.set('loggedIn', false);
  store.set('user', null);
  store.set('permission', null);
  store.set('role', null);
  store.set('info', null);
  deleteCookie('userId');
}

export function getToken() {
  if (!isLoggedIn()) {
    return '';
  } else {
    return store.get('user').accessToken;
  }
}

export function getRefreshToken() {
  if (!isLoggedIn()) {
    return '';
  } else {
    return store.get('user').refreshToken;
  }
}

export function storePermission(data: Array<Object>) {
  store.set('permission', data);
}

export function getPermission() {
  if (!isLoggedIn()) {
    return [];
  } else {
    return store.get('permission') || [];
  }
}
export function getRole() {
  if (!isLoggedIn()) {
    return [];
  } else {
    return store.get('role') || [];
  }
}
export function storeInfo(data: Object) {
  store.set('info', data);
}

export function getInfo() {
  if (!isLoggedIn()) {
    return {};
  } else {
    return { ...store.get('info'), userId: store.get('user').userId };
  }
}
export function getUser() {
  return { ...store.get('user') };
}

function setCookie(name, value) {
  document.cookie = name +'='+ value +'; Path=/;';
}
function deleteCookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}