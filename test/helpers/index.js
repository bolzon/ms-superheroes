/**
 * Test helper module has useful methods to help on tests.
 * @module test/helpers
 */

const fetch = require('node-fetch');
const config = require('../../api/config.json');

/** HTTP helper class. */
class HttpHelper {

	static get(url) {
		return HttpHelper.fetch(url, { method: 'GET' });
	}

	static post(url, body) {
		return HttpHelper.fetch(url, { method: 'POST' }, body);
	}

	static fetch(url, opts, body) {
		opts = opts || {};
		opts.headers = opts.headers || {};
		opts.headers['Content-type'] = 'application/json';

		url = `http://localhost:${config.port}${url}`;
		opts = { ...opts, ...(body ? { body: JSON.stringify(body) } : {}) };

		return fetch(url, opts).then(async response => {
			return { status: response.status, body: await response.json() }
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

module.exports.http = HttpHelper;
