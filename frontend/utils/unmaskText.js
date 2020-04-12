const defaultDelimiters = /[-!$%^&*()_+|~=`{}[\]:";'<>?,./\\ ]/
export default (text) =>
  text ? String(text).replace(new RegExp(defaultDelimiters, 'g'), '') : text
