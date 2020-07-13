module.exports = (service, method) => (...args) => {
  let serviceModule;
  try {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    serviceModule = require(`./${service}.service`);
  } catch (err) {
    console.error(err);
  }
  if (!serviceModule) throw new Error(`Dispatcher Error: Service ${service} not found`);

  const serviceMethod = serviceModule[method];
  if (!serviceMethod) throw new Error(`Dispatcher Error: Method ${method} not found for service ${service}`);

  return serviceMethod(...args);
};
