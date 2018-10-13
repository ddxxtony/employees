import _ from 'lodash';

export const rootReducer = (state = {}, action) => {
  switch (action.type) {
    case 'EMPLOYEE_ADDED': return { employees: { ...state.employees, ..._.keyBy(action.objects, 'id') } };
    case 'EMPLOYEE_REMOVED': return { employees: _.omit(state.employees, _.map(action.objects, 'id')) };
    default: return state;
  }

};
