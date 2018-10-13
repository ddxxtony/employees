
import _ from 'lodash';
const storageKeyName = 'employees';

export const getEmployees = () => (dispatch)=>{
  let employees = localStorage.getItem(storageKeyName);
  if (employees)
    employees = JSON.parse(employees);
  dispatch({ type: 'EMPLOYEE_ADDED', objects: employees });
};


export const saveEmployee = (employee) =>(dispatch)=> {
  if(!employee.id) employee.id= ''+Math.random();
  let employees = localStorage.getItem('employees');
  let updatedEmployees;
  if (employees) {
    employees = JSON.parse(employees);
    updatedEmployees = { ...employees, [employee.id]: employee };
  } else {
    updatedEmployees = { [employee.id]: employee };
  }

  localStorage.setItem(storageKeyName, JSON.stringify(updatedEmployees));

  dispatch({ type: 'EMPLOYEE_ADDED', objects: [employee] });
  return { id: employee.id } ;
};

export const deleteEmployee = (employee) =>(dispatch)=> {
  let employees = localStorage.getItem('employees');
  if (employees) {
    employees = JSON.parse(employees);
    employees = _.omit(employees, employee.id);
    localStorage.setItem(storageKeyName, JSON.stringify(employees));
  } else {
    return;
  }
  dispatch({ type: 'EMPLOYEE_REMOVED', objects: [employee] });
};
