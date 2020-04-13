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

``` bash
# runnin e2e tests
$ yarn test:e2e

# opening cypress environment
$ yarn test:e2e:open
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
