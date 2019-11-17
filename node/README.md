## Install Packages

```
npm install
```

### Setup configuration

#### Make below variables available in environment

AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_INPUT_BUCKET_NAME
AWS_REGION
AWS_DOCUMENT_CLASSIFIER_ARN
AWS_DATA_ACCESS_ROLE_ARN
DB_CONNECTION_STRING
CRON_PATTERN

update the variables in the config file.


### Start the server

```
npm start
```

### Start the data formatting worker

```
node friendsUpload.js
```