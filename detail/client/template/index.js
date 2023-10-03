const vm = require('vm');
const fs = require('fs');

const templateCache = {};

const templateContext = vm.createContext({
    _(val) {
        if (!val) return '';
        return val.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/'/g, '&#39;')
            .replace(/"/g, '&quot;');
    },
    include(name, data) {
        const template = templateCache[name] || createTemplate(name);
        return template(data);
    }
});

function createTemplate(name) {
    templateCache[name] = vm.runInNewContext(`(function(data) {
        with(data) {
            return \`${fs.readFileSync(name, 'utf-8')}\`
        }
    })`, templateContext);

    return templateCache[name];
}

module.exports = createTemplate;