import AWS from 'aws-sdk'

const s3 = new AWS.S3()
const bucket = `barracao-digital-${process.env.STAGE}-conversation-files-bucket`

export const requestUploadUrl = async (request) => {
  const s3Params = {
    Bucket: bucket,
    Key: request.name,
    ContentType: request.type,
  }
  return s3.getSignedUrl('putObject', s3Params)
}

export const downloadFile = async (request) => {
  const key = request.file
  const s3Params = {
    Bucket: bucket,
    Key: key,
    Expires: 600,
  }
  return s3.getSignedUrl('getObject', s3Params)
}
