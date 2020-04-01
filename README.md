# [Barracão Digital](https://barracaodigital.com)
Estruturação rápida de “postos de triagem” virtuais descentralizados para redução de visitas desnecessárias às emergências

# Informações técnicas

### Status
| Production | Development |
|:----------:|:-----------:|
| [![Production Build Status](https://travis-ci.com/rodrigogs/barracao-digital.svg?branch=master)](https://travis-ci.com/rodrigogs/barracao-digital) | [![Development Build Status](https://travis-ci.com/rodrigogs/barracao-digital.svg?branch=development)](https://travis-ci.com/rodrigogs/barracao-digital) |

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
  - Don't forget to create a custom error responses for 404 and other errors
- Create a Route53 Hosted Zone with the api host
- Create the APIGateway domain
```bash
$ NODE_ENV={stage_name} sls create_domain
```
- Verify if the serverless.yml `provider.deploymentBucket.name` bucket exists. Create if needed.
- Deploy the service
```bash
$ serverless deploy
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
    ![api-gateway-workaround](https://github.com/rodrigogs/barracao-digital/blob/master/media/api-gateway-workaround.png)
* Click `Edit` again, uncheck `Authorization Caching` and click `Save`
* Redeploy the application
* Yes, it sucks!
