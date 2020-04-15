# Create BigQuery table to store historical data

## Setup

### Create BigQuery dataset and table

### Prerequisites
You need to have Google Cloud SDK installed and BigQuery and Deployment Manager enabled in your Google Cloud Platform project.

### Create a BQ Dataset, Table and setup schema accordingly

```bash
# Set environment variables
export PROJECT_ID=<gcp-project-id-here>
export DATASET_NAME=<bq-dataset-name-here>
export TABLE_NAME=<bq-table-name-here>
export LOCATION=<insert-bq-location-here>

export BQ_DATASET=${PROJECT_ID}:${DATASET_NAME}
export BQ_TABLE=${BQ_DATASET}.${TABLE_NAME}

# Create a BQ dataset
bq mk -d --data_location=${LOCATION} --description="COVID-19 India historical data" ${BQ_DATASET}

# Create BQ table in the dataset
bq mk -t --description="COVID-19 India historical data" ${BQ_TABLE} ./schema.json

```

### Now you can use this table to load data from MoHFW website / API already deployed
