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

You can view the documentation at [http://localhost:8080/v1/api-docs](http://localhost:8080/v1/api-docs) once the server is up and running.

Alternatively, you can also view the API documentation by clicking [here](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/crosslibs/covid19-india-api/master/swagger.yaml).

## Access the current COVID-19 cases in India and across the states from mohfw.gov.in through this API
HTTP GET [http://localhost:8080/v1/data/current](http://localhost:8080/v1/data/current)

## Access the  COVID-19 cases in India and across the states as of a specific date through this API

### For example to access the COVID-19 case count in India as of 2020-04-14 00:00:00 UTC time:
HTTP GET [http://localhost:8080/v1/data?date=2020-04-14T00:00:00Z](http://localhost:8080/v1/data?date=2020-04-14T00:00:00Z)

## Contact
For any queries, please reach out to me at cpdevws@gmail.com or post an issue in the repo.