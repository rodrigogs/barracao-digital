const { shedsRepository } = require('../repository');

module.exports = {
  async create(shed) {
    const cepSheds = (await shedsRepository.getAllByCep(shed.cep)).length;
    return shedsRepository.create({
      ...shed,
      index: cepSheds,
    });
  },

  async getAllByCep(cep) {
    return shedsRepository.getAllByCep(cep);
  },

  async getOneByCepAndId(cep, id) {
    return shedsRepository.getAllByCep(cep, id);
  },
};
