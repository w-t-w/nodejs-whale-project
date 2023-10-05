const Koa = require('koa');
const path = require('path');
const Koa_mount = require('koa-mount');
const Koa_static = require('koa-static');
const {renderToString} = require('react-dom/server');

const socket = require('./lib');
const create_template = require('./template');
const App = require('../build/ssr_index.js');

const PORT = 3000;

const STATIC_DIR = path.resolve(process.cwd(), './list/backend/client/source');
const TEMPLATE_DIR = path.resolve(process.cwd(), './list/backend/client/template/index.html');

const koa = new Koa();

koa.use(Koa_static(STATIC_DIR));

koa.use(Koa_mount('/data', async ctx => {
    const {request, response} = ctx;
    const {query: {sort, filter}} = request;

    if (typeof sort === 'undefined' || typeof filter === 'undefined') {
        response.status = 400;
        response.body = '';
        return false;
    }

    const result = await new Promise((resolve, reject) => {
        socket.write({
            sort: +sort,
            filter: +filter
        }, (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });

    response.status = 200;
    response.body = result;
}));

koa.use(Koa_mount('/', async ctx => {
    const {request, response} = ctx;
    const {query: {sort = 0, filter = 0}} = request;

    const result = await new Promise((resolve, reject) => {
        socket.write({
            sort: +sort,
            filter: +filter
        }, (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });

    const renderString = renderToString(App(result));

    const template = create_template(TEMPLATE_DIR);

    response.status = 200;
    response.body = template({
        renderString,
        renderData: result,
        sort,
        filter
    });
}));

koa.listen(PORT, () => {
    console.log(`The list page is running at http://localhost:${PORT}!`);
});