import { generateClient } from 'aws-amplify/api'
import { listSkaters as listSkatersQuery } from '../graphql/queries'

const client = generateClient()

export const listSkaters = async () => {
  try {
    const resp = await client.graphql({
      query: listSkatersQuery,
    })
    return resp.data.listSkaters
  } catch (e) {
    console.error(e)
  }
}
