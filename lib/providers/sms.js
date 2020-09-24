import { SNS } from 'aws-sdk'

const send = async (phoneNumber, message) => {
  const sns = new SNS({
    apiVersion: '2010-03-31',
    region: 'us-west-2',
  })

  await sns
    .setSMSAttributes({
      attributes: {
        DefaultSMSType: 'Transactional',
      },
    })
    .promise()

  await sns
    .publish({
      PhoneNumber: phoneNumber,
      Message: message,
      MessageStructure: 'string',
    })
    .promise()
}

export { send }
