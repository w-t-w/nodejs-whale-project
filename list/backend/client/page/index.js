if (typeof window === 'undefined' || typeof self === 'undefined') {
    global.window = {};
    global.self = {};
}

const {List} = require('../../../component/build/component_index');

function App({columns}) {
    return <List
        columns={columns}
        sort={() => {
        }}
        filter={() => {
        }}
    />
}

module.exports = App;