# BARRACÕES-COVID-19

## Setup
**Make sure `bash` is available from your terminal**
```bash
$ npm install serverless -g
$ serverless login
$ npm install
```

## Deploy
### Frontend & backend
```bash
$ NODE_ENV=development|production npm run deploy
```

### Frontend
```bash
$ NODE_ENV=development|production npm run deploy:frontend
```

### Backend
```bash
$ NODE_ENV=development|production npm run deploy:backend
```

## Troubleshooting
### Got `User is not authorized to access this resource` when using the API
* Open the [AWS Console](https://console.aws.amazon.com/console), open the [API Gateway](https://console.aws.amazon.com/apigateway) service and find your deployed service
* Navigate to `Authorizers` tab and you shall see the `authorizer`
* Click `Edit`, check `Authorization Caching` and click `Save`
    ![api-gateway-workaround](https://github.com/rodrigogs/barracoes-covid-19/blob/master/media/api-gateway-workaround.png)
* Click `Edit` again, uncheck `Authorization Caching` and click `Save`
* Redeploy the application
* Yes, it sucks!
