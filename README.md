# KubeDrop Email Service

A Reactive Microservice to listen kafka events and send out emails using SendGrid 

---

### Pre-requisite

Create a file `.env` with appropriate ENV. VARIABLES Values. Application reads this value while bootstrapping. e.g. Fill the SandGrid API Key and Template Id.

```shell
# Application Config
NODE_ENV="development"
EMAILS="vijay.soni@srijan.net,ashish.thakur@srijan.net"

# API Related Config
SENDGRID_API_KEY=""
FROM_EMAIL="continua@srijan.net"       # Verify "from-email" address from sendgrid as well
EMAIL_TEMPLATE_ID=""                   # If you want to use Template from SendGrid, otherwise keep it blank

# Kafka Related Config
KAFKA_CLIENT_ID="unique-client-id"
KAFKA_GROUP_ID="email-service"
KAFKA_BROKERS="localhost:9092"
KAFKA_USERNAME=""
KAFKA_PASSWORD=""
KAFKA_TOPIC="article.created"
```

---

## Running

### Run without Docker

- `npm install` OR `yarn`
- `node src/app.js`

### Run with Docker

- `docker build -t email-service .`
- `docker run -p 3009:3009 --env-file=".env" email-service`

---

## Push image to registry

- `docker build -t kubedrop/email-service .`
- `docker login`
- `docker push kubedrop/email-service`