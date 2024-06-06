import * as Actions from './action';

const initialState = {
    workers: [],
    roles: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.GET_WORKERS:
            return { ...state, workers: action.payload };
        case Actions.ADD_WORKER:
            const newWorkers = [...state.workers, action.payload];
            return { ...state, workers: newWorkers };
        case Actions.EDIT_WORKER: {
            const updatedWorkers = state.workers.map(worker =>
                worker.id === action.payload.id ? action.payload : worker
            );
            return { ...state, workers: updatedWorkers };
        }
        case Actions.DELETE_WORKER: {
            const filteredWorkers = state.workers.filter(worker =>
                worker.id !== action.payload.id
            );
            return { ...state, workers: filteredWorkers };
        }
        case Actions.GET_ROLES:
            return { ...state, roles: action.payload };
        case Actions.ADD_ROLE:
            const newRoles = [...state.roles, action.payload];
            return { ...state, roles: newRoles };
        default:
            return state;
    }
};

export default reducer;
