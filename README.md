# Simple NestJS Lambda-lith

This code repository shows you how you can use NestJS as a lambda-lith fronted by API GW.

![](./docs/api-gw-lambda-nestjs.png)

### Setting up your environment

In your terminal, set the URL where your API GW is running in a variable.

```
URL=https://v9aworvsb2.execute-api.eu-central-1.amazonaws.com/prod
```

### Adding / Updating a customer

```
curl -s -X POST $URL/customers \
-H 'Content-Type: application/json' \
-d '{
    "id":"123",
    "firstName":"John",
    "lastName":"Doe",
    "email": "jdoe@acmecorp.com",
    "customerType": "SIMPLE"
}'
```

### Retrieving a customer

```
curl -s $URL/customers/123
```

### Retrieving all customers

```
curl -s $URL/customers
```

### Removing a cusomter

```
curl -s -X DELETE $URL/customers/123
```

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
