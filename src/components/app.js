import './app.less';
import 'semantic-ui-css/semantic.min.css';

import React from 'react';
import { Helmet } from 'react-helmet/es/Helmet';
import { Route, Switch } from 'react-router-dom';
import favicon from 'img/favicon.png';
import { EmployeesDetails } from './eployeesDetails';
import { EmployeesList } from './employeesList';



export class App extends React.PureComponent {
  render() {
    return (
      <div className='main-app'>
        <Helmet >
          <title>Administración de empleados</title>
          <html lang='en' />
          <meta charset='utf-8' />
          <meta name='description' content='Awesome react starter' />
          <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
          <link rel='icon' href={favicon} type='image/png' sizes='32x32' />
        </Helmet>
        <Switch>
          <Route exact path='/employees-list' component={EmployeesList} />
          <Route exact path='/employees-details/:action(create)' component={EmployeesDetails} />
          <Route exact path='/employees-details/:employeeId/:action(edit)?' component={EmployeesDetails} />
          <Route render={() => <h1>404</h1>} />
        </Switch>
      </div>
    );
  }
}