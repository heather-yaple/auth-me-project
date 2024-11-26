import Cookies from 'js-cookie';

/**
 * The `csrfFetch` function adds the CSRF token to the request headers
 * and performs a fetch request with the appropriate headers, including
 * the XSRF-TOKEN cookie for protection against CSRF attacks.
 */
export async function csrfFetch(url, options = {}) {
  // Ensure the method is GET by default
  options.method = options.method || 'GET';
  
  // Set headers to empty object if not present
  options.headers = options.headers || {};

  // If the request is not GET, set the appropriate headers for JSON data
  if (options.method.toUpperCase() !== 'GET') {
    options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';

    // Attach the XSRF-TOKEN cookie to protect against CSRF attacks
    const csrfToken = Cookies.get('XSRF-TOKEN');
    if (csrfToken) {
      options.headers['XSRF-Token'] = csrfToken;
    } else {
      console.error('CSRF token not found.');
    }
  }

  // Perform the fetch request
  const res = await window.fetch(url, options);

  // Handle errors by parsing the response and throwing a more readable message
  if (res.status >= 400) {
    try {
      const errorResponse = await res.json();
      throw new Error(errorResponse.message || 'Something went wrong!');
    } catch (error) {
      throw new Error('Failed to fetch. Please try again later.');
    }
  }

  // If successful, return the response
  return res;
}

/**
 * Restore the CSRF token by sending a GET request to the server
 * for the csrf/restore endpoint.
 */
export function restoreCSRF() {
  return csrfFetch('/api/csrf/restore');
}

