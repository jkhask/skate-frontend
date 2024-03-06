import { generateClient } from 'aws-amplify/api'
import { UpdateSkaterMutationVariables } from '../API'
import { updateSkater as updateSkaterMutation } from '../graphql/mutations'
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

export const updateSkater = async (skater: UpdateSkaterMutationVariables) => {
  try {
    const resp = await client.graphql({
      query: updateSkaterMutation,
      variables: skater,
    })
    return resp.data.updateSkater
  } catch (e) {
    console.error(e)
  }
}
