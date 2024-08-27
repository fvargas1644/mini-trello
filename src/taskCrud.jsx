import { v4 as uuidv4 } from 'uuid';

import { arrayMoveImmutable } from 'array-move';

async function taskCrud(action) {
    let state = JSON.parse(localStorage.getItem('appData'));

    switch(action.type) {
        default:
            return state;
    }
}

export default taskCrud;