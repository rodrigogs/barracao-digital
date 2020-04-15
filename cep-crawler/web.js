const querystring = require('querystring');
const Koa = require('koa');
const app = new Koa();

const cepCrawler = require('.');

app.use(async ctx => {
  if (!ctx.path.startsWith('/address')) {
    ctx.status = 404;
    ctx.body = 'Not Found';
    return;
  }
  const address = ctx.path.replace('/address/', '');
  if (address.length < 1) return (ctx.body = 'Invalid parameter');
  const ceps = await cepCrawler(querystring.unescape(address));
  if (!ceps.length) return (ctx.body = 'Nenhum CEP encontrado');
  ctx.body = ceps.join(', ');
});

app.listen(9008);
