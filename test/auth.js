
const { expect } = require('chai');
const helpers = require('./helpers');
const server = require('../server');

describe.only('Auth', () => {

	before(() => server.start());
	after(() => server.stop());

	describe('Authentication', () => {
		it('should authenticate registered user', async () => {
			const response = await helpers.http.post('/auth', {
				username: 'admin',
				password: 'admin'
			});
			expect(response.status).to.equal(helpers.http.Status.Ok);
			expect(Object.keys(response.body)).to.be.deep.equal([ 'token' ]);
			expect(response.body.token).to.be.not.null;
		});

		it('should reject registered user', async () => {
			const response = await helpers.http.post('/auth', {
				username: 'nobody',
				password: 'nothing'
			});
			expect(response.status).to.equal(helpers.http.Status.Unauthorized);
			expect(response.body).to.be.deep.equal({ message: 'Invalid credentials' });
		});

		it('should return invalid request', async () => {
			const response = await helpers.http.post('/auth', {
				uzername: 'nobody',
				pazzword: 'nothing'
			});
			expect(response.status).to.equal(helpers.http.Status.BadRequest);
			expect(response.body).to.be.deep.equal({ message: 'Username and password are required' });
		});

		it('should request without a body', async () => {
			const response = await helpers.http.post('/auth');
			expect(response.status).to.equal(helpers.http.Status.BadRequest);
			expect(response.body).to.be.deep.equal({ message: 'Username and password are required' });
		});
	});

	describe('Authorization', () => {

		describe('Admin users', () => {
			it('admin users can access any route', async done => {
				done();
			});
		});

		describe('Standard users', () => {
			it('standard users can access only view routes', async done => {
				done();
			});
		});
	});
});
