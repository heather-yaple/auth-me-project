// frontend/src/store/csrf.js
import Cookies from 'js-cookie';

export async function csrfFetch(url, options = {}) {
  // Set options.method to 'GET' if there is no method
  options.method = options.method || 'GET';
  // Set options.headers to an empty object if there are no headers
  options.headers = options.headers || {};

  // If the options.method is not 'GET', then set the "Content-Type" header
  // to "application/json", and set the "XSRF-Token" header to the value of the 
  // "XSRF-TOKEN" cookie
  if (options.method.toUpperCase() !== 'GET') {
    options.headers['Content-Type'] =
      options.headers['Content-Type'] || 'application/json';
    
    // Ensure the XSRF-Token header is set correctly
    const csrfToken = Cookies.get('XSRF-TOKEN');
    if (csrfToken) {
      options.headers['XSRF-Token'] = csrfToken;
    }
  }

  // Call the default window's fetch with the url and the options passed in
  const res = await window.fetch(url, options);

  // If the response status code is 400 or above, then throw an error with the
  // error being the response
  if (res.status >= 400) throw res;

  // If the response status code is under 400, then return the response to the
  // next promise chain
  return res;
}

export function restoreCSRF() {
  return csrfFetch('/api/csrf/restore');
}
