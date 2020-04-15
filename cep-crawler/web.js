const Koa = require('koa');
const app = new Koa();

const cepCrawler = require('.');

app.use(async ctx => {
  const address = ctx.path.substr(1);
  const ceps = await cepCrawler(address);
  ctx.body = ceps.join(', ');
});

app.listen(9008);
