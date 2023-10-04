const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const Koa_mount = require('koa-mount');
const Koa_static = require('koa-static');
const {graphqlHTTP} = require('koa-graphql');

const schema = require('./lib');

const STATIC_DIR = path.resolve(process.cwd(), './video/source');
const TEMPLATE_DIR = path.resolve(process.cwd(), './video/template/index.html');

const PORT = 7777;

const koa = new Koa();

const buffer = fs.readFileSync(TEMPLATE_DIR);

koa.use(Koa_static(STATIC_DIR));

koa.use(Koa_mount('/api', graphqlHTTP({
    schema
})));

koa.use(Koa_mount('/', async ctx => {
    const {response} = ctx;
    response.status = 200;
    response.type = 'html';
    response.body = buffer;
}));

koa.listen(PORT, () => {
    console.log(`The server is running at http://localhost:${PORT}!`);
});