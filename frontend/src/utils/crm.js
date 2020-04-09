import axios from 'axios';

const API_URLS = {
  SC: 'https://api.cremesc.org.br/crvirtual-general/consultapf?especialidade=&municipio=&delegacia=&situacao=Todas&nomeCrm=',
  RS: 'https://servicos.cremers.org.br/crvirtual-general/consultapf?nomeCrm=',
};

const getUrl = (fu, code) => `${API_URLS[fu]}${code}`;

const normalize = (result, fu) => {
  if (!result) return null;
  switch (fu) {
    case 'SC':
    case 'RS':
      return {
        nome: result.nome,
        situacao: result.situacao,
        especialidade: result.especialidade,
      };
    default:
      return null;
  }
};

const retrieve = async (fu, code) => {
  const federalUnity = fu.toUpperCase();
  const { data } = await axios.get(getUrl(federalUnity, code));
  return normalize(data[0], federalUnity);
};

const validate = (result) => {
  if (!result) return 'Nenhum resultado encontrado';
  if (result.situacao !== 'Regular') return 'Situação da CRM não está regular';
  return null;
};

export default {
  retrieve,
  validate,
};
