import {useState} from 'react';

import {List} from '../../../component/build/component_index';

function App() {
    const [columns, setColumns] = useState(renderData);
    const [sort, setSort] = useState(renderSort);
    const [filter, setFilter] = useState(renderFilter);

    return <List
        columns={columns['columns']}
        sort={sortType => {
            fetch(`./data?sort=${sortType}&filter=${filter}`)
                .then(result => result.json())
                .then(json => {
                    setSort(sortType);
                    setColumns(json);
                });
        }}
        filter={filterType => {
            fetch(`./data?sort=${sort}&filter=${filterType}`)
                .then(result => result.json())
                .then(json => {
                    setFilter(filterType);
                    setColumns(json);
                });
        }}
    />
}

export default App;