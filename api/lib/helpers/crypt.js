/**
 * Crypt module is used to encode and check user passwords.
 * @module lib/helpers/crypt
 */

const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const pvtKey = fs.readFileSync(config.token.pvtKeyPath).toString();

/**
 * Generates a JWT with the given payload.
 * @param {Object} payload JSON object representing JWT payload.
 * @returns {String} JWT in base64 format.
 */
module.exports.generateJWT = async payload => {
	return await jwt.sign(payload, pvtKey, {
		expiresIn: config.token.expiresIn,
		algorithm: config.token.algorithm
	});
};

/**
 * Encodes a password by generating a new salt, crypting and hashing it.
 * @param {String} password Password to be encoded as plain string.
 * @returns {String} Base64 encoded password.
 */
module.exports.encodePassword = async password => {
	// more info at https://github.com/kelektiv/node.bcrypt.js#a-note-on-rounds
	const salt = await bcrypt.genSalt(config.auth.saltRounds);
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
