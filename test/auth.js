
const { expect } = require('chai');
const helpers = require('./helpers');
const server = require('../server');

const HttpHelper = helpers.HttpHelper;
const HttpStatus = HttpHelper.Status;

describe.only('Authentication / Authorization', () => {

	before(() => {
		return server.start();
	});

	describe('Authentication', () => {

		it('should authenticate admin user', async () => {
			const response = await HttpHelper.post('/auth', {
				username: 'admin',
				password: 'admin'
			});

			expect(response.status).to.equal(HttpStatus.Ok);
			expect(Object.keys(response.body)).to.be.deep.equal([ 'token' ]);
			expect(response.body.token).to.be.not.null;
		});

		it('should reject a user that does not exist', async () => {
			const response = await HttpHelper.post('/auth', {
				username: 'nobody',
				password: 'nothing'
			});

			expect(response.status).to.equal(HttpStatus.Unauthorized);
			expect(response.body).to.be.deep.equal({ message: 'Invalid credentials' });
		});

		it('should return invalid request due to wrong parameters in body', async () => {
			const response = await HttpHelper.post('/auth', {
				uzername: 'nobody',
				pazzword: 'nothing'
			});

			expect(response.status).to.equal(HttpStatus.BadRequest);
			expect(response.body).to.be.deep.equal({ message: 'Username and password are required' });
		});

		it('should reject requests without a body', async () => {
			const response = await HttpHelper.post('/auth');
			expect(response.status).to.equal(HttpStatus.BadRequest);
			expect(response.body).to.be.deep.equal({ message: 'Username and password are required' });
		});
	});

	describe('Authorization', () => {

		let adminToken, standardToken;

		const standardUser = {
			username: 'standard',
			name: 'Standard User',
			password: 'standard',
			roleId: 'Standard'
		};

		after(async () => {
			// deletes standard user
			await HttpHelper.delete(`/users/${standardUser.username}`, adminToken);
		});

		describe('Admin users', async () => {

			it('should create users', async () => {
				// auth admin user
				let response = await HttpHelper.post('/auth', {
					username: 'admin',
					password: 'admin'
				});
				adminToken = response.body.token;

				// creates standard user
				await HttpHelper.post('/users', standardUser, adminToken);
				
				// auth standard user
				response = await HttpHelper.post('/auth', {
					username: standardUser.username,
					password: standardUser.password
				});
				standardToken = response.body.token;
			});

			it('should create and delete super powers', async () => {
				let response = await HttpHelper.post('/super-powers', {
					name: 'superpower',
					description: 'superpower'
				}, adminToken);

				expect(response.status).to.equal(HttpStatus.Ok);
				expect(response.body).to.have.property('id');

				const id = response.body.id;
				response = await HttpHelper.delete(`/super-powers/${id}`, adminToken);
				expect(response.status).to.equal(HttpStatus.Ok);
			});
		});

		describe('Standard users', () => {

			it('should authenticate to system', async () => {
				let response = await HttpHelper.get('/', standardToken);
				expect(response.status).to.equal(HttpStatus.Ok);
			});

			it('should not create a user', async () => {
				let response = await HttpHelper.post('/users', standardUser, standardToken);
				expect(response.status).to.equal(HttpStatus.Forbidden);
			});

			it('should not create a super power', async () => {
				let response = await HttpHelper.post('/super-powers', {}, standardToken);
				expect(response.status).to.equal(HttpStatus.Forbidden);
			});

			it('should not create a super hero', async () => {
				let response = await HttpHelper.post('/super-heroes', {}, standardToken);
				expect(response.status).to.equal(HttpStatus.Forbidden);
			});
		});
	});
});
