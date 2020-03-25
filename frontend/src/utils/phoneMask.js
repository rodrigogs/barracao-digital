export default function (e) {
  let x = e.target.value;
  x = x.replace(/\D/g, '');
  x = x.replace(/^(\d{2})(\d)/g, '($1) $2');
  x = x.replace(/(\d)(\d{4})$/, '$1-$2');

  return x;
}
