/**
 * HTTP module provides common functions for a standard HTTP server.
 * @module lib/helpers/http
 */

 /**
  * List of static HTTP status to help controllers to return the right status code.
  */
module.exports.status = Object.freeze({
	Ok: 200,
	BadRequest: 400,
	Unauthorized: 401,
	Forbidden: 403,
	NotFound: 404,
	UnprocessableEntity: 422,
	InternalServerError: 500,
	NotImplemented: 501
});
