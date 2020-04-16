const Koa = require('koa');
const Router = require('koa-router');
const Pug = require('koa-pug');
const bodyParser = require('koa-bodyparser');

const states = require('../../frontend/enums/states').brazil;
const cache = require('./cache');
const cepCrawler = require('..');

const app = new Koa();
const router = new Router();

new Pug({
  app,
  viewPath: './views',
});

router.get('/', (ctx) => ctx.render('index', { states }));

router.post('/', async (ctx) => {
  const { state, location, neighborhood } = ctx.request.body;
  const query = { state, location, neighborhood };

  const cached = await cache.get(query);
  if (cached) return ctx.render('index', { states, results: cached });

  const ceps = await cepCrawler(query);
  if (!ceps.length) return ctx.render('index', { states, error: 'Nem um resultado encontrado' });
  await cache.put(query, ceps);

  return ctx.render('index', { states, results: ceps });
});

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(9008);
