import AWS from 'aws-sdk'

export const requestUploadUrl = async (params) => {
  const s3 = new AWS.S3()
  const s3Params = {
    Bucket: `barracao-digital-${process.env.STAGE}-conversation-files-bucket`,
    Key: params.name,
    ContentType: params.type,
    ACL: 'public-read',
  }
  return s3.getSignedUrl('putObject', s3Params)
}
