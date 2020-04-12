export const zip = (cep) => {
  if (!cep) return true
  const cepClean = cep.replace(/[^\d]+/g, '')
  const exp = /\d{2}\.\d{3}-\d{3}/
  if (!exp.test(cep) && cepClean.length !== 8) {
    return false
  }
  return true
}

export const cpf = (cpf) => {
  if (!cpf) return true
  const exp = /[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}/g
  if (!exp.test(cpf)) {
    return false
  }
  return true
}

export const phone = (phone) => {
  if (!phone) return true
  const exp = /\(\d{2,}\) \d{4,}-\d{4}/
  if (!exp.test(phone)) {
    return false
  }
  return true
}
