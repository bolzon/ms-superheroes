
# Super Heroes Catalogue

Consists in a NodeJS server to make simple CRUD operations for a catalogue of Super Heroes.

It's a microservice that provide a REST API that allows clients to create, delete, update and list entities below:

- Super Heroes
- Super Powers
- Area of Protection
- Users

## Authentication

To call the API it's necessary to authenticate the caller through the `/auth` endpoint, that will return a JWT token to be used for every call.

## Authorization

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

## Installation

To install application:

```bash
npm install
```

## Test

To test application:

```bash
npm test
```

## Run

To run application:

```bash
npm start
```
