import './employeesList.less';

import _ from 'lodash';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet/es/Helmet';
import { bindActionCreators } from 'redux';
import { Form, Button, Input, Grid, Popup as SemanticPopup, Segment, Table, Menu, Icon, Message } from 'semantic-ui-react';


const mapStateToProps = (state) => ({
  employees: state.employees
});

@connect(mapStateToProps)
export class EmployeesList extends PureComponent {

  static propTypes = {
    employees: PropTypes.object,
  }



  render() {
    const { employees } = this.props;
    return (
      <section className='employees-list'>
        <Helmet title='Lista de empleados' />

        <Grid stackable centered>
          <Grid.Column computer={15} largeScreen={15} widescreen={15} >
            <Segment className='container'>

              <h1>Listado de empleados</h1>
              <div className='actions'>
                <Button primary as={Link} to='/employees-details/create'>
                    <Icon name='add user' />Agregar un nuevo empleado
                  </Button>
              </div>
              {_.isEmpty(employees) ?
                <Message >
                  <Message.Header>No tiene ningun trabajador registrado</Message.Header>
                  <p>Haga click en el botton azul para registrar uno.</p>
                </Message>
                :

                <Table celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Nombre</Table.HeaderCell>
                      <Table.HeaderCell>Email</Table.HeaderCell>
                      <Table.HeaderCell>Fecha de nacimiento</Table.HeaderCell>
                      <Table.HeaderCell>Calle</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {_.map(employees, ({ name, email, dob, street, id }) => {
                      return (
                        <Table.Row>
                          <Table.Cell><Link to={`/employees-details/${id}`}>{name}</Link></Table.Cell>
                          <Table.Cell>{email}</Table.Cell>
                          <Table.Cell>{dob}</Table.Cell>
                          <Table.Cell>{street}</Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>

                  <Table.Footer>
                  </Table.Footer>
                </Table>}
            </Segment>
          </Grid.Column>
        </Grid>
      </section>
    );
  }
}