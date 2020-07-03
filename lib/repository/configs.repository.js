import { singleTableDriver } from '../providers/aws/dynamoDB'
import { CONFIGS_TABLE } from '../config'

const configsTable = singleTableDriver(CONFIGS_TABLE)

const repository = {
  async put({ partition, sort, lock = true, ...attributes }) {
    return configsTable.put({
      ...attributes,
      partition,
      sort,
      lock,
    })
  },

  async get({ partition, sort }) {
    return configsTable.get({ partition, sort })
  },

  async remove({ partition, sort }) {
    return configsTable.delete({ partition, sort })
  },
}

export default repository
