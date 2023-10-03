const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const Koa_mount = require('koa-mount');
const Koa_static = require('koa-static');

const PORT = 7777;

const TEMPLATE_DIR = path.resolve(__dirname, './template/index.html');
const STATIC_DIR = path.resolve(__dirname, './source');

const koa = new Koa();

const buffer = fs.readFileSync(TEMPLATE_DIR);

koa.use(Koa_static(STATIC_DIR));

koa.use(Koa_mount('/', ctx => {
    const {response} = ctx;
    response.status = 200;
    response.type = 'html';
    response.body = buffer;
}));

koa.listen(PORT, () => {
    console.log(`The server is running at http://localhost:${PORT}!`);
});