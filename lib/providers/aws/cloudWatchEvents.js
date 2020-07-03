import AWS from 'aws-sdk'
import { STAGE, STACK_NAME, AWS_REGION } from '../../config'

const cloudWatchEvents = new AWS.CloudWatchEvents()

const putRule = async ({ name, description, scheduleExpression, tags = [] }) =>
  cloudWatchEvents
    .putRule({
      Name: name,
      Description: description,
      ScheduleExpression: scheduleExpression,
      State: 'ENABLED',
      Tags: [
        ...tags,
        {
          Key: 'NAME',
          Value: name,
        },
        {
          Key: 'STACK',
          Value: STACK_NAME,
        },
        {
          Key: 'STAGE',
          Value: STAGE,
        },
        {
          Key: 'REGION',
          Value: AWS_REGION,
        },
      ],
    })
    .promise()

const deleteRule = async ({ name, force = true }) =>
  cloudWatchEvents
    .deleteRule({
      Name: name,
      Force: force,
    })
    .promise()

const describeRule = async ({ name }) => {
  try {
    return await cloudWatchEvents
      .describeRule({
        Name: name,
      })
      .promise()
  } catch (err) {
    if (err.constructor.name === 'ResourceNotFoundException') return null
    throw err
  }
}

const putTargets = async ({ rule, targets }) =>
  cloudWatchEvents
    .putTargets({
      Rule: rule,
      Targets: targets,
    })
    .promise()

const removeTargets = async ({ rule, ids, force = true }) =>
  cloudWatchEvents
    .removeTargets({
      Rule: rule,
      Ids: ids,
      Force: force,
    })
    .promise()

const listTargetsByRule = async ({ rule, limit, targets = [], nextToken }) => {
  const results = await cloudWatchEvents
    .listTargetsByRule({
      Rule: rule,
      Limit: 1,
      NextToken: nextToken,
    })
    .promise()

  targets.push(...results.Targets)

  if (results.NextToken) {
    return listTargetsByRule({
      rule,
      limit,
      targets,
      nextToken: results.NextToken,
    })
  }

  return targets
}

export { putRule, deleteRule, describeRule, putTargets, removeTargets, listTargetsByRule }
