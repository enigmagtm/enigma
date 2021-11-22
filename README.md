# Enigma
Enigma - Framework for node server applications with expressjs and knex

## Documentation

How to get started with Enigma

## Setup - Development

### Prerequisites

- Install [Node.js] which includes [Node Package Manager][npm]

### Setting up an application

Install the Enigma CLI globally:
```
npm install -g @enigma/cli
```

Create new application:
```
ngm new PROJECT_NAME
```

After create the application, you should install one of the following database packages so your application can run, detailed instructions at the installation section [Knexjs.org][knex]

Run the application:
```
cd PROJECT_NAME
npm run start
```

Create a resource controller:
```
ngm g c DIRECTORY SCHEMA [TABLE]
```

[Node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/get-npm
[knex]: https://knexjs.org/#Installation-node