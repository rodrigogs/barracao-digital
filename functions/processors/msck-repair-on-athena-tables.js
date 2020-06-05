import qs from 'querystring';
import { Athena } from 'aws-sdk';

const athena = new Athena();

const loadPartitions = (entity) => athena.startQueryExecution({
  QueryString: `MSCK REPAIR TABLE barracao_digital_${process.env.STAGE}_events_lake_glue_database.${entity}`,
  ResultConfiguration: {
    OutputLocation: `s3://barracao-digital-${process.env.STAGE}-query-results-bucket`,
  },
}).promise();

export const handler = async (event) => {
  await Promise.all(event.Records.map(async (record) => {
    const objectKey = record.s3.object.key;
    const [type, entity] = qs.unescape(objectKey).split('/');
    if (type !== 'lake') return;
    // const [, entity, rYear, rMonth, rDay, rHour] = qs.decode(objectKey).toString().split('/');
    // eslint-disable-next-line max-len
    // const [year, month, day, hour] = [rYear, rMonth, rDay, rHour].map((part) => part.split('=')[1]);
    // console.log({
    //   year, month, day, hour,
    // });
    await loadPartitions(entity);
  }));
};
