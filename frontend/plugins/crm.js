import InvalidCrmError from '~/errors/InvalidCrmError'

const API_URLS = {
  SC:
    'https://api.cremesc.org.br/crvirtual-general/consultapf?especialidade=&municipio=&delegacia=&situacao=Todas&nomeCrm=',
  RS: 'https://servicos.cremers.org.br/crvirtual-general/consultapf?nomeCrm=',
}

const getUrl = (fu, code) => `${API_URLS[fu]}${code}`

const normalize = (result, fu) => {
  if (!result) return null
  switch (fu) {
    case 'SC':
    case 'RS':
      return {
        nome: result.nome,
        situacao: result.situacao,
        especialidade: result.especialidade,
      }
    default:
      return null
  }
}

const validate = (result) => {
  if (!result) return 'Nenhum resultado encontrado para este CRM'
  if (result.situacao !== 'Regular') return 'Situação da CRM não está regular'
  return null
}

const crmFactory = (axios) => ({
  searchByStateAndCode: async (fu, code) => {
    const federalUnity = fu.toUpperCase()
    const data = await axios.$get(getUrl(federalUnity, code))
    const normalizedData = normalize(data[0], federalUnity)

    const validatedData = validate(normalizedData)
    if (validatedData) return Promise.reject(new InvalidCrmError(validatedData))

    return Promise.resolve(normalizedData)
  },
})

export default ({ $axios }, inject) => {
  // Inject `crm` key
  // -> app.$crm
  // -> this.$crm in vue components
  // -> this.$crm in store actions/mutations
  const axios = $axios.create()
  axios.setToken(false)
  const crm = crmFactory(axios)
  inject('crm', crm)
}
