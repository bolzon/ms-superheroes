/**
 * Crypt module is used to encode and check user passwords.
 * @module lib/helpers/crypt
 */

const bcrypt = require('bcrypt');

/**
 * More about salt rounds can be found in
 * [official page](https://github.com/kelektiv/node.bcrypt.js#a-note-on-rounds).
 */
const SALT_ROUNDS = 10;

/**
 * Encodes a password by generating a new salt, crypting ans hashing it.
 * @param {String} password Password to be encoded as plain string.
 * @returns {String} Base64 encoded password.
 */
module.exports.encodePassword = async (password) => {
	const salt = await bcrypt.genSalt(SALT_ROUNDS);
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
