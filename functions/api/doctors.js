const { doctorsService } = require('barracao-digital/services');
const { getRequestContext, responseBuilder } = require('../helpers');

const methods = {
  async GET(ctx) {
    const {
      consumer: user,
      pathParameters,
      queryStringParameters,
    } = ctx;

    const { cep, username } = pathParameters || {};
    const { active, lastEvaluatedKey, pageSize } = queryStringParameters || {};
    const parsedLastKey = lastEvaluatedKey ? JSON.parse(lastEvaluatedKey) : undefined;

    if (cep) {
      if (!user.master && (user.cep !== cep)) {
        return responseBuilder.errors.forbidden('Você só pode visualizar dados da sua região');
      }
      const results = active
        ? await doctorsService.getAllByCepAndActive(cep, active === 'true', { lastEvaluatedKey: parsedLastKey, pageSize })
        : await doctorsService.getAllByCep(cep, { lastEvaluatedKey: parsedLastKey, pageSize });
      return responseBuilder.success.ok({
        body: {
          lastEvaluatedKey: results.lastEvaluatedKey,
          items: results.items.map((doctor) => ({ ...doctor, password: undefined })),
        },
      });
    }

    if (username) {
      const doctor = await doctorsService.getOneByUsername(username);
      if (!doctor) return responseBuilder.errors.notFound('Doctor Not Found');
      return responseBuilder.success.ok({
        body: { ...doctor, password: undefined },
      });
    }

    return responseBuilder.errors.badRequest();
  },

  async POST(ctx) {
    const {
      consumer: user,
      body,
      path,
    } = ctx;

    const isAlternatingActivity = (path && path.endsWith('alternate'));

    if (isAlternatingActivity) {
      return responseBuilder.success.ok({
        body: await doctorsService.alternateActive(user.username),
      });
    }

    const {
      master: wantsToBeMaster,
      admin: wantsTobeAdmin,
    } = body;

    const {
      master: isMaster,
    } = user;

    const isFromSameFacility = user.cep === body.cep;

    if (!isFromSameFacility && !isMaster) {
      return responseBuilder.errors.forbidden('Administradores só podem criar cadástros de suas regiões');
    }

    if (wantsToBeMaster && !isMaster) {
      return responseBuilder.errors.forbidden('Somente um usário master pode criar outro usuário master');
    }

    if (wantsTobeAdmin && !isMaster) {
      return responseBuilder.errors.forbidden('Somente um usuário master pode criar um administrador');
    }

    const newDoctor = await doctorsService.create(body);
    return responseBuilder.success.created({ body: { ...newDoctor, password: undefined } });
  },

  async PUT(ctx) {
    const {
      consumer: user,
      pathParameters,
      body,
    } = ctx;

    const {
      master: wantsToBeMaster,
      admin: wantsTobeAdmin,
    } = body;

    const { master: isMaster } = user;
    const { username } = pathParameters;
    const isSelfUpdate = user.username === username;

    if (wantsToBeMaster && !isMaster) {
      return responseBuilder.errors.forbidden('Somente um usário master pode criar outro usuário master');
    }

    if (wantsTobeAdmin && !isMaster) {
      return responseBuilder.errors.forbidden('Somente um usuário master pode criar um administrador');
    }

    if (username) {
      const storedDoctor = await doctorsService.getOneByUsername(username);
      if (!storedDoctor) {
        return responseBuilder.errors.notFound('Doutor não encontrado');
      }

      const isTryingToChangeAnotherAdmin = !isSelfUpdate
        && (storedDoctor.admin || storedDoctor.master);
      if (isTryingToChangeAnotherAdmin && !isMaster) {
        return responseBuilder.errors.forbidden('Você não pode alterar o cadástro de outros administradores');
      }

      const updatedDoctor = await doctorsService.update(username, body);
      return responseBuilder.success.ok({ body: { ...updatedDoctor, password: undefined } });
    }

    return responseBuilder.errors.badRequest();
  },

  async DELETE(ctx) {
    const {
      consumer: user,
      pathParameters,
    } = ctx;

    const {
      master: isMaster,
    } = user;

    const {
      username,
    } = pathParameters;

    const storedDoctor = await doctorsService.getOneByUsername(username);
    const isFromSameFacility = user.cep === storedDoctor.cep;

    if (!isFromSameFacility && !isMaster) {
      return responseBuilder.errors.forbidden('Administradores só podem deletar cadástros de suas regiões');
    }

    await doctorsService.delete(username);
    return responseBuilder.success.noContent();
  },
};

module.exports.handler = async (event) => {
  try {
    const requestContext = await getRequestContext(event);
    const method = methods[requestContext.httpMethod];

    if (!method) return responseBuilder.errors.methodNotAllowed();

    return await method(requestContext);
  } catch (err) {
    return responseBuilder.genericError(err);
  }
};
