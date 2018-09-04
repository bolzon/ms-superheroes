
const { expect } = require('chai');
const helpers = require('./helpers');

const HttpHelper = helpers.HttpHelper;
const HttpStatus = HttpHelper.Status;

const adminUser = {
	username: 'admin',
	password: 'admin'
};

describe('Server', () => {

	before(async () => {
		await require('../server').start();
	});

	describe('Authentication', () => {

		it('should authenticate admin user', async () => {
			const response = await HttpHelper.post('/auth', adminUser);

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

		describe('Admin Role', async () => {

			before(async () => {
				// auth admin user
				const response = await HttpHelper.post('/auth', adminUser);
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

		describe('Standard Role', () => {

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

	describe('Entities', () => {

		let adminToken;

		before(async () => {
			// auth admin user
			const response = await HttpHelper.post('/auth', adminUser);
			adminToken = response.body.token;
		});

		describe('Users', () => {

			const baseUser = {
				username: 'baseuser',
				name: 'baseuser',
				password: 'baseuser',
				roleId: 'Standard'
			};
			
			let totalCount = 0;
			const range = [ 1, 30 ];
			const timeout = 10000;

			it('list users', async () => {
				const response = await HttpHelper.get('/users', adminToken);
				expect(response.status).to.equal(HttpStatus.Ok);
				expect(response.body).to.be.an('array');
				expect(response.headers.has('X-Total-Count')).to.be.true;
				totalCount = parseInt(response.headers.get('X-Total-Count'));
			});

			it('list single user', async () => {
				const response = await HttpHelper.get(`/users/admin`, adminToken);
				expect(response.status).to.equal(HttpStatus.Ok);
				expect(response.body).to.be.an('object');
				expect(response.body).to.have.all.keys([ 'username', 'name', 'roleId' ]);
			});

			it('create users', done => {
				const promises = [];
				for (let i=range[0]; i<=range[1]; i++) {
					promises.push(new Promise(async resolve => {
						const response = await HttpHelper.post('/users', {
							username: `${baseUser.username}${i}`,
							name: `${baseUser.name}${i}`,
							password: 'baseuser',
							roleId: baseUser.roleId
						}, adminToken);
						expect(response.status).to.equal(HttpStatus.Ok);
						expect(response.body).to.be.an('object');
						expect(response.body).to.have.all.keys([ 'username', 'name', 'roleId' ]);
						resolve();
					}));
				}
				Promise.all(promises).then(() => done());
			}).timeout(timeout);

			it('list 10 users per page', async () => {
				let response = await HttpHelper.get('/users?per_page=10', adminToken);
				expect(response.status).to.equal(HttpStatus.Ok);
				expect(response.body).to.be.an('array');
				expect(response.body.length).to.equal(10);
				expect(response.headers.has('X-Total-Count')).to.be.true;
				const auxTotalCount = parseInt(response.headers.get('X-Total-Count'));
				expect(auxTotalCount).to.equal(totalCount + range[1]);
				totalCount = auxTotalCount;
			});

			it('list more than 100 users per page will assume 100', async () => {
				let response = await HttpHelper.get('/users?per_page=1000', adminToken);
				expect(response.status).to.equal(HttpStatus.Ok);
				expect(response.body).to.be.an('array');
				expect(response.body.length <= 100).to.be.true;
			});

			it('list 10 users per page and check last page items', async () => {
				const numOfItems = totalCount % 10;
				const lastPage = Math.ceil(totalCount / 10);
				let response = await HttpHelper.get(`/users?per_page=10&page=${lastPage}`, adminToken);
				expect(response.status).to.equal(HttpStatus.Ok);
				expect(response.body).to.be.an('array');
				expect(response.body.length).to.equal(numOfItems);
			});

			it('update users', done => {
				const promises = [];
				for (let i=range[0]; i<=range[1]; i++) {
					promises.push(new Promise(async resolve => {
						const response = await HttpHelper.update(`/users/${baseUser.username}${i}`, { name: 'updated' }, adminToken);
						expect(response.status).to.equal(HttpStatus.Ok);
						expect(response.body).to.be.an('object');
						expect(response.body).to.have.all.keys([ 'username', 'name', 'roleId' ]);
						resolve();
					}));
				}
				Promise.all(promises).then(() => done());
			}).timeout(timeout);

			it('return unprocessable entity when creating an user with an existing username', async () => {
				let existingUser = { ...baseUser };
				existingUser.username = `${baseUser.username}${range[0]}`;
				const response = await HttpHelper.post(`/users`, existingUser, adminToken);
				expect(response.status).to.equal(HttpStatus.UnprocessableEntity);
			});

			it('return not found when listing a single non existent user', async () => {
				const response = await HttpHelper.get(`/users/xxxxxxxxxxxx`, adminToken);
				expect(response.status).to.equal(HttpStatus.NotFound);
			});

			it('return not found when updating a non existent user', async () => {
				const response = await HttpHelper.update(`/users/xxxxxxxxxxxx`, baseUser, adminToken);
				expect(response.status).to.equal(HttpStatus.NotFound);
			});

			it('return not found when deleting a non existent user', async () => {
				const response = await HttpHelper.delete(`/users/xxxxxxxxxxxx`, adminToken);
				expect(response.status).to.equal(HttpStatus.NotFound);
			});

			it('return unexpected error when passing wrong parameters on create', async () => {
				const wrongUser = {
					username: 'wronguser',
					name: 'wronguser',
					password: 'wronguser',
					wrongParam: 'wrong content'
				};
				const response = await HttpHelper.post(`/users`, wrongUser, adminToken);
				expect(response.status).to.equal(HttpStatus.InternalServerError);
			});

			it('return unexpected error when passing wrong parameters on update', async () => {
				const response = await HttpHelper.update(`/users/${baseUser.username}${range[1]}`, { wrongParam: 'wrong content' }, adminToken);
				expect(response.status).to.equal(HttpStatus.InternalServerError);
			});

			it('delete users', done => {
				const promises = [];
				for (let i=range[0]; i<=range[1]; i++) {
					promises.push(new Promise(async resolve => {
						const response = await HttpHelper.delete(`/users/${baseUser.username}${i}`, adminToken);
						expect(response.status).to.equal(HttpStatus.Ok);
						resolve();
					}));
				}
				Promise.all(promises).then(() => done());
			}).timeout(timeout);
		});

		describe('Super Powers', () => {
		});

		describe('Super Heroes', () => {
		});
	});

});
