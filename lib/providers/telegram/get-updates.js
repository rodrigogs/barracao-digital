import request from './request'

export default async () => {
  const { data } = await request.get('/getUpdates')
  return data
}
