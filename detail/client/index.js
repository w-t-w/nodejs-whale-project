const path = require('path');
const Koa = require('koa');
const Koa_mount = require('koa-mount');
const Koa_static = require('koa-static');

const socket = require('./lib');
const create_template = require('./template');

const PORT = 3000;

const STATIC_DIR = path.resolve(process.cwd(), './detail/client/source');
const TEMPLATE_DIR = path.resolve(process.cwd(), './detail/client/template/index.html');

const koa = new Koa();

koa.use(Koa_static(STATIC_DIR));

koa.use(Koa_mount('/', async ctx => {
    const {request, response} = ctx;
    const {query: {column_id}} = request;

    if (typeof column_id === 'undefined') {
        response.status = 400;
        response.body = '';
        return false;
    }

    const result = await new Promise((resolve, reject) => {
        socket.write({
            column_id
        }, (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });

    const template = create_template(TEMPLATE_DIR);

    response.status = 200;
    response.body = template(result);
}));

koa.listen(PORT, () => {
    console.log(`The detail page is running at http://localhost:${PORT}!`);
});