const isObject = (value) => value && typeof value === 'object' && value.constructor === Object

const removeConditionalProps = (object, condition) =>
  Object.keys(object).reduce((result, key) => {
    const value = object[key]
    if (typeof condition === 'function' && condition(value)) return result
    if (typeof condition !== 'function' && value === condition) return result
    if (isObject(value)) return { ...result, [key]: removeConditionalProps(value, condition) }
    return { ...result, [key]: value }
  }, {})

const removeUndefinedProps = (object) => removeConditionalProps(object, undefined)

export { isObject, removeConditionalProps, removeUndefinedProps }
