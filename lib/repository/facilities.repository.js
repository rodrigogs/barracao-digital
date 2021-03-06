import { v4 as uuid } from 'uuid'
import { FACILITIES_TABLE } from '../config'
import { dynamoDB } from '../providers/aws'
import { singleTableDriver } from '../providers/aws/dynamoDB'
import { firestore } from '../providers/firebase'
import { removeConditionalProps } from '../helpers/object.helper'

const parseDynamoQueryResult = (results) => {
  const items = results.Items
  const lastEvaluatedKey = results.LastEvaluatedKey

  return {
    items,
    lastEvaluatedKey,
  }
}

const facilitiesTable = singleTableDriver(FACILITIES_TABLE)

const getValidFields = ({
  type = 'shed',
  origin,
  name,
  techDirector,
  contact,
  cantBeAssistedMessage,
  active = false,
}) => ({
  type,
  origin,
  name,
  techDirector,
  contact,
  cantBeAssistedMessage,
  active,
})

const repository = {
  async create(object) {
    const fileds = getValidFields(object)
    const facility = {
      id: uuid(),
      origin: fileds.origin,
      destination: fileds.origin,
      name: fileds.name,
      type: fileds.type,
      contact: fileds.contact,
      cantBeAssistedMessage: fileds.cantBeAssistedMessage,
      techDirector: fileds.techDirector,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 0,
    }

    await dynamoDB
      .put({
        TableName: FACILITIES_TABLE,
        Item: facility,
      })
      .promise()

    await repository.updateReactiveDocument(facility)

    return facility
  },

  async update(facility) {
    const fields = getValidFields(facility)
    const updatedFacility = {
      ...fields,
      destination: facility.origin,
      updatedAt: Date.now(),
      createdAt: facility.createdAt,
      version: (facility.version || 0) + 1,
    }

    let params = {
      TableName: FACILITIES_TABLE,
      Item: updatedFacility,
    }

    if (facility.version !== undefined && facility.version !== null) {
      params = {
        ...params,
        ConditionExpression: '#version = :expectedVersion',
        ExpressionAttributeNames: {
          '#version': 'version',
        },
        ExpressionAttributeValues: {
          ':expectedVersion': facility.version,
        },
      }
    }

    await dynamoDB.put(params).promise()
    await repository.updateReactiveDocument(updatedFacility)

    return updatedFacility
  },

  async delete(origin) {
    const storedFacility = await repository.getOneByOrigin(origin)
    if (!storedFacility) return

    await dynamoDB
      .delete({
        TableName: FACILITIES_TABLE,
        Key: { origin, destination: origin },
        ConditionExpression: '#version = :expectedVersion',
        ExpressionAttributeNames: {
          '#version': 'version',
        },
        ExpressionAttributeValues: {
          ':expectedVersion': storedFacility.version,
        },
      })
      .promise()

    await repository.updateReactiveDocument(storedFacility, true)
  },

  async updateReactiveDocument(facility, remove) {
    const doc = firestore // /facilities/{cep}}
      .collection('facilities')
      .doc(facility.origin)

    if (remove) {
      await doc.get().then((d) => d && d.ref && d.ref.delete())
    }

    const normalized = removeConditionalProps(
      facility,
      (value) =>
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim().length === 0) // No empty strings
    )

    return doc.set(normalized)
  },

  async addOriginDestinations(origin, destinations) {
    if (!destinations || !destinations.length) return

    const writeItems = (requestItems) =>
      dynamoDB
        .batchWrite({
          RequestItems: requestItems,
        })
        .promise()
        .then(async ({ UnprocessedItems }) => {
          if (Object.keys(UnprocessedItems).length > 0) {
            console.log('Reprocessing unprocessed items')
            await writeItems(UnprocessedItems)
          }
        })

    const requestItems = {
      [FACILITIES_TABLE]: destinations.map((destination) => ({
        PutRequest: {
          Item: {
            origin,
            destination,
            type: 'destination',
          },
        },
      })),
    }

    await writeItems(requestItems)
  },

  async removeOriginDestinations(origin, destinations) {
    if (!destinations || !destinations.length) return

    const writeItems = (requestItems) =>
      dynamoDB
        .batchWrite({
          RequestItems: requestItems,
        })
        .promise()
        .then(async ({ UnprocessedItems }) => {
          if (Object.keys(UnprocessedItems).length > 0) {
            console.log('Reprocessing unprocessed items')
            await writeItems(UnprocessedItems)
          }
        })

    const requestItems = {
      [FACILITIES_TABLE]: destinations.map((destination) => ({
        DeleteRequest: {
          Key: { origin, destination },
        },
      })),
    }

    await writeItems(requestItems)
  },

  async getAll(type = 'shed', { lastEvaluatedKey, pageSize = 10 }) {
    return parseDynamoQueryResult(
      await dynamoDB
        .query({
          TableName: FACILITIES_TABLE,
          IndexName: 'type',
          KeyConditionExpression: '#type = :type',
          ExpressionAttributeNames: {
            '#type': 'type',
          },
          ExpressionAttributeValues: {
            ':type': type,
          },
          Limit: pageSize > 20 ? 20 : pageSize,
          ExclusiveStartKey: lastEvaluatedKey,
          ScanIndexForward: true,
        })
        .promise()
    )
  },

  async getOneByOrigin(origin) {
    return dynamoDB
      .get({
        TableName: FACILITIES_TABLE,
        Key: {
          origin,
          destination: origin,
        },
      })
      .promise()
      .then((result) => result.Item)
  },

  async getAllByOrigin(origin) {
    return facilitiesTable.query({
      partition: origin,
      partitionName: 'origin',
    })
  },

  async getAllDestinationsByOrigin(origin) {
    const facilities = await facilitiesTable.query({
      partition: origin,
      partitionName: 'origin',
    })
    return facilities.map((facility) => facility.destination)
  },

  async getOneByDestination(destination) {
    const { Items } = await dynamoDB
      .query({
        TableName: FACILITIES_TABLE,
        IndexName: 'destinationOrigin',
        KeyConditionExpression: '#destination = :destination',
        ExpressionAttributeNames: {
          '#destination': 'destination',
        },
        ExpressionAttributeValues: {
          ':destination': destination,
        },
        Limit: 1,
      })
      .promise()
    return Items[0]
  },
}

export default repository
