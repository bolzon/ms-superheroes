
# Super Heroes Catalogue

[![Build Status](https://travis-ci.org/bolzon/ms-superheroes.svg?branch=master)](https://www.travis-ci.org/bolzon/ms-superheroes/)

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
npm docker:install
npm docker:start

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

# Author

**Alexandre Bolzon**<br/>
[about.me/bolzon](https://about.me/bolzon)<br/>
August, 2018
