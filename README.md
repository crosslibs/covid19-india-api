# API for COVID-19 India Data from official source, Ministry of Health and Family Welfare (mohfw.gov.in)



# Build and Start the service

## Run locally

### Prerequisites
You need to have `Node.js version 12.0 or later` installed in your machine. Please follow setup instructions from https://nodejs.org/en/download/ if you do not have Node.js installed already.


``` bash
# Install dependencies
npm install

# Run the HTTP server (starts the HTTP server on PORT 8080)
npm start

```

## Run in Docker

```bash
# Build Docker image
docker build -t covid19-india:latest .
```

```bash
# Start container
docker run -p 8080:8080 -d covid19-india:latest
```


# API Documentation

You can refer to the API documentation by clicking [here](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/crosslibs/covid19-india-api/master/swagger.yaml).


