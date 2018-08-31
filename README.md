
# Super Heroes Catalogue

NodeJS application to make simple CRUD operations for a catalogue of Super Heroes.


## Install, test, run

First of all, you need to install modules listed in following table:

| Module   |  Version  |
|----------|:---------:|
| NodeJS   | 8.11.4    |
| NPM      | 5.6.0     |
| MySQL    | 5.7       |
| Docker   | 17.03.2   |

These are the commands to install, test and run project:

```bash
# mysql will run in a container

npm docker:install
npm docker:start

# app will run locally

npm install
npm test
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
- Area of Protection
- Users


### API

This microservice uses REST routes to access or modify contents.

#### Considerations

The REST API follows some standards, such as:

##### Pagination

List of contents is paginated and uses query params `page` and `per_page` to specify the range of contents you want to list.

- `page` - the page you want to list
- `per_page` - number of items to consider per page

This standard was based on [GitHub pagination standard](https://developer.github.com/v3/guides/traversing-with-pagination/#navigating-through-the-pages), without considering the `Link` header.

##### Total count

When calling a route that returns a list of contents, apart from pagination standard, it also uses a header to specify the total number of items for the given query, so the client can adjust their pagination as they want.

Total number of items is returned in header `X-Total-Count`.


### Authentication

To call the API it's necessary to authenticate the caller through the `/auth` endpoint, that will return a JWT token to be used for every call as bearer token in `Authorization` header.


### Authorization

Users are divided in two roles:

- Admin
- Standard

Admin users are able to do whatever they want.

Standard users are able just to:

- list super heroes
- view a single hero
- list super powers
- view a single super power
- _as a bonus feature:_ give a geo location in order to get nearest 8 super heroes


### Endpoints


#### Authentication

##### `POST /auth`

Authenticates a user by validating their username/password and gererating a new token in JWT format.

Body:

`{ username: '', password: '' }`


#### Users

##### `GET /users`

Gets the list of users.

##### `GET /users/{username}`

Get a single user by their username.

##### `POST /users`

Creates a new user.

Body:

`{ username: '', name: '', password: '', roleId: 'Admin|Standard' }`

##### `PUT /users/{username}`

Updates an existing user.

Body:

`{ username: '', name: '', password: '', roleId: 'Admin|Standard' }`

##### `DELETE /users/{username}`

Deletes an existing user.


#### Super Powers

##### `GET /super-powers`

Gets the list of super powers.

##### `GET /super-powers/{id}`

Gets a single super power by its ID.

##### `POST /super-powers`

Creates a new super power.

Body:

`{ name: '', description: '' }`

##### `PUT /super-powers/{id}`

Updates an existing super power.

Body:

`{ name: '', description: '' }`

##### `DELETE /super-powers/{id}`

Deletes an existing super power by its ID.


#### Super Heroes

##### `GET /super-heroes`

Gets the list of super hero.

##### `GET /super-heroes/{id}`

Gets a single super hero by its ID.

##### `POST /super-heroes`

Creates a new super hero.

Body:

`{ name: '', alias: '' }`

##### `PUT /super-heroes/{id}`

Updates an existing super hero.

Body:

`{ name: '', alias: '' }`

##### `DELETE /super-heroes/{id}`

Deletes an existing super hero by its ID.


#### Audit

#### `POST /audit`

Register client to listen to audit events.


### Audit

Every action executed by a user will be mapped by an Audit Service.

This service is injected in database hooks and for each action, an audit event is dispatched to be registered in database and includes:

- entity name
- entity ID (or string `"<array>"` if a list is returned)
- action (`CREATE`, `UPDATE` or `DELETE`)
- username that triggered the action
- timestamp of the action

It's also possible clients to connect to server via [socket.io](https://socket.io/docs/) to listen for audit events in `auditEvent` channel.

All connected clients should receive the events.

# Author

August, 2018<br/>
[Alexandre Bolzon](https://about.me/bolzon)
