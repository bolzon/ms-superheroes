
# Super Heroes Catalogue

[![Travis Build](https://travis-ci.org/bolzon/ms-superheroes.svg?branch=master)](https://travis-ci.org/bolzon/ms-superheroes) [![Code Coverage](https://codecov.io/gh/bolzon/ms-superheroes/branch/master/graph/badge.svg)](https://codecov.io/gh/bolzon/ms-superheroes)

NodeJS application to make simple CRUD operations for a catalogue of Super Heroes.


## Install, test, run

First of all, install modules listed in following table:

| Module   |  Version  |
|----------|:---------:|
| NodeJS   | 8.11.4    |
| NPM      | 5.6.0     |
| MySQL    | 5.7       |
| Docker   | 17.03.2   |


Then install and start MySQL docker instance.

```bash
npm docker:install
npm docker:start
```

Now install project dependencies.

```bash
npm install
```

And run tests to get test results and code coverage.

```bash
npm test
```

To start the app locally:

```bash
npm start
```


## Documentation

Project documentation was written following [jsdoc](http://usejsdoc.org) format.

To generate project documentation:

```bash
npm run doc
```


## Project considerations

It was implemented following microservices architecture and provides a REST API that allows clients to create, delete, update and list entities below:

- Super Heroes
- Super Powers
- Users


### API

This microservice uses REST routes to access or modify contents.

#### Considerations

The REST API follows some standards, such as:

##### Pagination

List of contents is paginated and uses query params `page` and `per_page` to specify the range of contents you want to list.

- `page` - number of page you want to list
- `per_page` - number of items to list per page, limited in 100

This standard was based on [GitHub pagination standard](https://developer.github.com/v3/guides/traversing-with-pagination/#navigating-through-the-pages), without considering the `Link` header.

##### Total count

When calling a route that returns a list of contents, apart the pagination standard, it also uses a header to specify the total number of items for the given query, so the client can adjust their pagination as well as they want.

Total number of items is returned on header `X-Total-Count` in `GET` routes.


### Authentication

To call the API it's necessary to authenticate the caller through the `/auth` endpoint, that will return a JWT token to be used for every call as bearer token in `Authorization` header such as following:

```
Authorization: bearer <jwt-token>
```


### Authorization

Users are divided in two roles:

- **Admin:** able to do whatever they want.
- **Standard:** able to:
  - list super heroes
  - view a single hero
  - list super powers
  - view a single super power
  - _as a bonus feature:_ give a geo location in order to get nearest 8 super heroes


### List of endpoints

| Module | Verb   | URL | Body | Description |
|--------|--------|-----|------|-------------|
| Auth   | `POST` | `/auth` | `{ username: '', password: '' }` | Authenticates a user by validating their username/password and gererating a new token in JWT format. |
| Users | `GET`  | `/users` | | Gets the list of users. |
| Users | `GET`  | `/users/{username}` | | Get a single user by their username. |
| Users | `POST` | `/users` | `{ username: '', name: '', password: '', roleId: 'Admin/Standard' }` | Creates a new user. |
| Users | `PUT` | `/users/{username}` | `{ username: '', name: '', password: '', roleId: 'Admin/Standard' }` | Updates an existing user. |
| Users | `DELETE` | `/users/{username}` | | Deletes an existing user. |
| Super Powers | `GET` | `/super-powers` | | Gets the list of super powers. |
| Super Powers | `GET` | `/super-powers/{id}` | | Gets a single super power by its ID. |
| Super Powers | `POST` | `/super-powers` | `{ name: '', description: '' }` | Creates a new super power. |
| Super Powers | `PUT` |  `/super-powers/{id}` | `{ name: '', description: '' }` | Updates an existing super power. |
| Super Powers | `DELETE` | `/super-powers/{id}` | | Deletes an existing super power by its ID. |
| Super Heroes | `GET` | `/super-heroes` | | Gets the list of super hero. |
| Super Heroes | `GET` | `/super-heroes/{id}` | | Gets a single super hero by its ID. |
| Super Heroes | `POST`| `/super-heroes` | `{ name: '', alias: '' }` | Creates a new super hero. |
| Super Heroes | `PUT` | `/super-heroes/{id}` | `{ name: '', alias: '' }` | Updates an existing super hero. |
| Super Heroes | `DELETE` | `/super-heroes/{id}` | | Deletes an existing super hero by its ID. |

### Audit

Every action executed by a user that modifies some content will be mapped by an Audit Service.

This service is injected in database hooks, so for each modification action an audit event will be dispatched and registered in database with following information:

- entity name (Super Powers, Super Heroes, User etc)
- entity ID (or string `"<array>"` if a list is returned)
- action (`CREATE`, `UPDATE` or `DELETE`)
- username that triggered the action
- timestamp of the action

It's also possible clients to connect to server via [socket.io](https://socket.io/docs/) to listen for audit events in `auditEvent` channel.

All connected clients should receive the events.

#### Test client

A push client was created to test receiving audit event messages from this server and can be found on GitHub [ms-superheroes-testclient](https://github.com/bolzon/ms-superheroes-testclient) repo.

# Author

August, 2018<br/>
[Alexandre Bolzon](https://about.me/bolzon)
