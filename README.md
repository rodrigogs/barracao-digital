# [Barracão Digital](https://github.com/rodrigogs/barracoes-covid-19/blob/master/media/Barraca%CC%83o%20Digital%20COVID-19.pdf)
Estruturação rápida de “postos de triagem” virtuais descentralizados para redução de visitas desnecessárias às emergências

# Informações técnicas

### Status
| Production | Development |
|:----------:|:-----------:|
| [![Production Build Status](https://travis-ci.com/rodrigogs/barracoes-covid-19.svg?branch=production)](https://travis-ci.com/rodrigogs/barracoes-covid-19) | [![Development Build Status](https://travis-ci.com/rodrigogs/barracoes-covid-19.svg?branch=development)](https://travis-ci.com/rodrigogs/barracoes-covid-19) |

### Setup
**Make sure `bash` is available from your terminal**
```bash
$ npm install serverless -g
$ serverless login
$ npm install
```

### Deploying a new stage
*DANGER* you must know exactly what you are doing here!
- Log into your [Serverless Dashboard](https://dashboard.serverless.com/) and create a new app reflecting serlverless.yml "service" field
- Deplot the frontend, it's needed to create the CloudFront distribution
```bash
$ NODE_ENV={stage_name} npm run deploy:frontend
```
- [Create a distribution](https://console.aws.amazon.com/cloudfront/home?region=sa-east-1#create-distribution) pointing to the frontend bucket
  - Don't forget to create a custom error responses for 404 errors
- Verify if the serverless.yml `provider.deploymentBucket.name` bucket exists. Create if needed.
- Deploy the service
```bash
$ serverless deploy
```
- Create the route53 api domain
```bash
$ serverless create_domain
```

### Deploy
#### Frontend & backend
```bash
$ NODE_ENV=development|production npm run deploy
```

#### Frontend
```bash
$ NODE_ENV=development|production npm run deploy:frontend
```

#### Backend
```bash
$ NODE_ENV=development|production npm run deploy:backend
```

### Troubleshooting
#### Got `User is not authorized to access this resource` when using the API
* Open the [AWS Console](https://console.aws.amazon.com/console), open the [API Gateway](https://console.aws.amazon.com/apigateway) service and find your deployed service
* Navigate to `Authorizers` tab and you shall see the `authorizer`
* Click `Edit`, check `Authorization Caching` and click `Save`
    ![api-gateway-workaround](https://github.com/rodrigogs/barracoes-covid-19/blob/master/media/api-gateway-workaround.png)
* Click `Edit` again, uncheck `Authorization Caching` and click `Save`
* Redeploy the application
* Yes, it sucks!
