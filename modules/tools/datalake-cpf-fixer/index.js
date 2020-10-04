const AWS = require('aws-sdk');

const credentials = new AWS.SharedIniFileCredentials({profile: 'barracao-digital'});
if (credentials) AWS.config.credentials = credentials;

const runQuery = async (query) => {
  const athena = new AWS.Athena({ region: 'sa-east-1' })
  const queryExecution = await athena.startQueryExecution({
    QueryString: query,
    ResultConfiguration: {
      OutputLocation: `s3://barracao-digital-production-query-results-bucket/`,
      EncryptionConfiguration: {
        EncryptionOption: 'SSE_S3', /* required */
      }
    }
  }).promise();

  let queryExecutionStatus = {}
  do {
    queryExecutionStatus = await athena.getQueryExecution({QueryExecutionId: queryExecution.QueryExecutionId}).promise()
    console.log('Current query executation status is', queryExecutionStatus.QueryExecution.Status.State)
    await new Promise((resolve) => setTimeout(resolve, 3000))
  } while (['SUCCEEDED', 'FAILED', 'CANCELED'].indexOf(queryExecutionStatus.QueryExecution.Status.State) === -1)

  if (queryExecutionStatus.QueryExecution.Status.State === 'SUCCEEDED') {
    const results = await athena.getQueryResults({QueryExecutionId: queryExecution.QueryExecutionId}).promise()
    return results.ResultSet.Rows.reduce((prev, curr, index) => {
      if (index === 0) return {...prev, columns: curr.Data.map(col => col.VarCharValue)}
      const row = {}
      prev.columns.forEach((col, index) => {
        row[col] = curr.Data[index].VarCharValue
      })
      prev.rows.push(row)
      return prev
    }, {columns: [], rows: []})
  }

  return null
}

(async () => {
  try {


    const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'sa-east-1' })
    let Items, LastEvaluatedKey
    do {
      ({ Items, LastEvaluatedKey } = await dynamodb.scan({
        TableName: 'barracao-digital-production-patients-table',
        ExclusiveStartKey: LastEvaluatedKey,
        Limit: 100,
      }).promise())
      for (const item of Items) {
        await dynamodb.put({
          TableName: 'barracao-digital-production-patients-table',
          Item: { ...item, version: item.version + 1 },
        }).promise()
        console.log(`Updated patient ${item.name}`)
      }
    } while (LastEvaluatedKey)

    const results = await runQuery(`SELECT DISTINCT(id), * FROM "barracao_digital_production_events_lake_glue_database"."patients"
        WHERE
          name NOT LIKE '%test%'
        LIMIT 100;`)
    console.log(results)
  } catch (err) {
    console.error(err)
  }
})();
