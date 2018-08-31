/**
 * Test helpers module has useful methods to help on tests.
 * @module test/helpers
 */

const fetch = require('node-fetch');
const config = require('../../api/config.json');

/** HTTP helper class. */
class HttpHelper {

	static get(url, token) {
		return HttpHelper.fetch(url, { ...(token ? { headers: { 'Authorization': `bearer ${token}` } } : {}), ...{ method: 'GET' } });
	}

	static post(url, body, token) {
		return HttpHelper.fetch(url, { ...(token ? { headers: { 'Authorization': `bearer ${token}` } } : {}), ...{ method: 'POST' } }, body);
	}

	static update(url, body, token) {
		return HttpHelper.fetch(url, { ...(token ? { headers: { 'Authorization': `bearer ${token}` } } : {}), ...{ method: 'PUT' } }, body);
	}

	static delete(url, token) {
		return HttpHelper.fetch(url, { ...(token ? { headers: { 'Authorization': `bearer ${token}` } } : {}), ...{ method: 'DELETE' } });
	}

	static fetch(url, opts, body) {
		opts = opts || {};
		opts.headers = opts.headers || {};
		opts.headers['Content-type'] = 'application/json';

		url = `http://localhost:${config.port}${url}`;
		opts = { ...opts, ...(body ? { body: JSON.stringify(body) } : {}) };

		return fetch(url, opts).then(async response => {
			try {
				const jsonResponse = await response.json();
				return { status: response.status, headers: response.headers, body: jsonResponse };
			}
			catch (ex) {
				return { status: response.status, headers: response.headers, body: {} };
			}
		});
	}

	static get Status() {
		return Object.freeze({
			Ok: 200,
			BadRequest: 400,
			Unauthorized: 401,
			Forbidden: 403,
			NotFound: 404,
			UnprocessableEntity: 422,
			InternalServerError: 500,
			NotImplemented: 501
		});
	}
}

module.exports.HttpHelper = HttpHelper;
