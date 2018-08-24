
# Super Heroes Catalogue

NodeJS application to make simple CRUD operations for a catalogue of Super Heroes.

## Install, test, run

These are the commands to install, test and run project:

```bash
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
