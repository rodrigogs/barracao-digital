import request from './request'

export default async function () {
  const { data } = await request.get('/getUpdates')
  return data
}
