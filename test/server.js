
const { expect } = require('chai');
const helpers = require('./helpers');

const HttpHelper = helpers.HttpHelper;
const HttpStatus = HttpHelper.Status;

describe('Server', () => {

	before(async () => {
		await require('../server').start();
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
				uzername: 'admin',
				pazzword: 'admin'
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

		describe('# admin users', async () => {

			before(async () => {
				// auth admin user
				const response = await HttpHelper.post('/auth', {
					username: 'admin',
					password: 'admin'
				});
				adminToken = response.body.token;
			});
	
			it('create user', async () => {
				// creates standard user
				let response = await HttpHelper.post('/users', standardUser, adminToken);
				expect(response.status).to.equal(HttpStatus.Ok);
				expect(response.body).to.have.property('name').equal(standardUser.name);

				// auth standard user
				response = await HttpHelper.post('/auth', {
					username: standardUser.username,
					password: standardUser.password
				});
				standardToken = response.body.token;
				expect(response.status).to.equal(HttpStatus.Ok);
				expect(response.body).to.have.property('token');
			});

			it('create and delete super powers', async () => {
				const superPower = {
					name: 'superpower',
					description: 'superpower'
				};

				let response = await HttpHelper.post('/super-powers', superPower, adminToken);
				expect(response.status).to.equal(HttpStatus.Ok);
				Object.keys(superPower).forEach(prop => expect(response.body).to.have.property(prop));

				const id = response.body.id;
				response = await HttpHelper.delete(`/super-powers/${id}`, adminToken);
				expect(response.status).to.equal(HttpStatus.Ok);
			});

			it('create and delete super heroes', async () => {
				const superHero = {
					name: 'superhero',
					alias: 'superhero',
					protectionAreaId: 1
				};

				let response = await HttpHelper.post('/super-heroes', superHero, adminToken);
				expect(response.status).to.equal(HttpStatus.Ok);
				Object.keys(superHero).forEach(prop => expect(response.body).to.have.property(prop));

				const id = response.body.id;
				response = await HttpHelper.delete(`/super-heroes/${id}`, adminToken);
				expect(response.status).to.equal(HttpStatus.Ok);
			});
		});

		describe('# standard users', () => {

			it('authenticate', async () => {
				let response = await HttpHelper.get('/', standardToken);
				expect(response.status).to.equal(HttpStatus.Ok);
			});
			
			describe('Users', () => {

				it('list users', async () => {
					const response = await HttpHelper.get('/users', standardToken);
					expect(response.status).to.equal(HttpStatus.Forbidden);
				});

				it('should not create a user', async () => {
					const response = await HttpHelper.post('/users', standardUser, standardToken);
					expect(response.status).to.equal(HttpStatus.Forbidden);
				});

				it('should not update a user', async () => {
					const response = await HttpHelper.update('/users/standard', standardUser, standardToken);
					expect(response.status).to.equal(HttpStatus.Forbidden);
				});

				it('should not delete a user', async () => {
					const response = await HttpHelper.delete('/users/standard', standardToken);
					expect(response.status).to.equal(HttpStatus.Forbidden);
				});
			});

			describe('Super Powers', () => {

				it('list super powers', async () => {
					const response = await HttpHelper.get('/super-powers', standardToken);
					expect(response.status).to.equal(HttpStatus.Ok);
					expect(response.body).to.be.an('array');
				});

				it('should not create a super power', async () => {
					const response = await HttpHelper.post('/super-powers', {}, standardToken);
					expect(response.status).to.equal(HttpStatus.Forbidden);
				});

				it('should not update a super power', async () => {
					const response = await HttpHelper.update('/super-powers/1', {}, standardToken);
					expect(response.status).to.equal(HttpStatus.Forbidden);
				});

				it('should not delete a super power', async () => {
					const response = await HttpHelper.delete('/super-powers/1', standardToken);
					expect(response.status).to.equal(HttpStatus.Forbidden);
				});
			});
		});
	});
});