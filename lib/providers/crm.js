const axios = require('axios');

const API_URLS = {
  SC: 'https://api.cremesc.org.br/crvirtual-general/consultapf?especialidade=&municipio=&delegacia=&situacao=Todas&nomeCrm=',
  RS: 'https://servicos.cremers.org.br/crvirtual-general/consultapf?nomeCrm=',
};

const getUrl = (fu, code) => `${API_URLS[fu]}${code}`;

module.exports = {
  async retrieve(fu, code) {
    const federalUnity = fu.toUpperCase();
    const { data } = await axios.get(getUrl(federalUnity, code));
    return data[0];
  },
  validate(result) {
    if (!result) return 'Nenhum resultado encontrado';
    if (!result.situacao === 'Regular') return 'Situação da CRM não está regular';
    return null;
  },
};
