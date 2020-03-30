const isValidEmail = (email) => {
  const re = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const isValidCEP = (cep) => String(cep).length === 8;

module.exports = {
  isValidEmail,
  isValidCEP,
};
