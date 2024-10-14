// frontend/src/store/csrf.js

import Cookies from 'js-cookie';

/**
 * A wrapper for fetch that includes CSRF token handling.
 * @param {string} url - The URL to send the request to.
 * @param {object} options - The fetch options (method, headers, body, etc.).
 * @returns {Promise} The response from the fetch call.
 */
export async function csrfFetch(url, options = {}) {
  // Default the method to 'GET' if none is provided
  options.method = options.method || 'GET';

  // Ensure headers exist
  options.headers = options.headers || {};

  // If method is not GET, include the CSRF token in the headers
  if (options.method.toUpperCase() !== 'GET') {
    options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
    options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN'); // Read token from cookies
  }

  // Perform the fetch
  const response = await window.fetch(url, options);

  // If the response status is 400 or above, throw an error
  if (response.status >= 400) throw response;

  // Otherwise, return the response to the next .then() handler
  return response;
}
