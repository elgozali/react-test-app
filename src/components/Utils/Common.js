// return the user data from the localStorage
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  else return null;
}

// return the token from the localStorage
export const getToken = () => {
  return localStorage.getItem('accessToken') || null;
}

// remove the token and user from the localStorage
export const removeUserSession = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
}

// set the token and user from the localStorage
export const setUserSession = (token, user) => {
  localStorage.setItem('accessToken', token);
  localStorage.setItem('user', JSON.stringify(user));
  window.location.reload();
}