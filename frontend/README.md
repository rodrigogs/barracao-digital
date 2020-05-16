# Frontend module

Frontend module of the project.

## Build Setup

```bash
# install dependencies
$ yarn

# add the dotenv file
$ cp .env.sample .env

# add firebase configuration
FIREBASE_CONFIG=your-base64-config

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

## Testing

### Unit tests

```bash
yarn test
```

### E2E tests

- Make sure you finish the [Build Setup](#build-setup) step
- Ask for a `serviceAccount.json` file from our Firebase, this file is required in order to run the tests
- Then you can run the tests

```bash
# start your dev environemnt
$ yarn dev

# runnin e2e tests
$ yarn test:e2e

# or opening cypress environment
$ yarn test:e2e:open

# if you don't want to start the dev environment (yarn dev) you can run this command
yarn test:e2e:ci
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
