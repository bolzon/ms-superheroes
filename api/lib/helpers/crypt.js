/**
 * Crypt module is used to encode and check user passwords.
 * @module lib/helpers/crypt
 */

const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = JSON.parse(fs.readFileSync('./api/config.json'));
config.token.secret = fs.readFileSync(config.auth.keyPath);

/**
 * Generates a JWT with the given payload.
 * @param {Object} payload JSON object representing JWT payload.
 * @returns {String} JWT in base64 format.
 */
module.exports.generateJWT = async payload => {
	return await jwt.sign(payload, config.token.secret, {
		expiresIn: config.token.expiresIn || '1d'
	});
};

/**
 * Verifies whether a JWT is valid or not.
 * @param {String} token JWT token.
 * @return {Object} Decoded payload if token is valid or false value otherwise.
 */
module.exports.verifyJWT = async token => {
	return await jwt.verify(token, config.token.secret, {
		expiresIn: config.token.expiresIn || '1d'
	});
};

/**
 * Encodes a password by generating a new salt, crypting ans hashing it.
 * @param {String} password Password to be encoded as plain string.
 * @returns {String} Base64 encoded password.
 */
module.exports.encodePassword = async password => {
	// more info at https://github.com/kelektiv/node.bcrypt.js#a-note-on-rounds
	const salt = await bcrypt.genSalt(config.auth.saltRounds || 10);
	return await bcrypt.hash(password, salt);
};

/**
 * Checks whether a password is genuinely valid.
 * @param {String} plainPassword Password to be checked as plain string.
 * @param {String} encodedPassword Base64 encoded password.
 * @returns {String} `true` if valid, `false` otherwise.
 */
module.exports.checkPassword = async (plainPassword, encodedPassword) => {
	return await bcrypt.compare(plainPassword, encodedPassword);
};
