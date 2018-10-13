import './emplyeesDetails.less';

import _ from 'lodash';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet/es/Helmet';
import { Form, Button, Input, Grid, Popup as SemanticPopup, Segment, Icon } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import Joi from 'joi';

import { saveEmployee, deleteEmployee } from '../actions';

export const language = {
  key: '{{!label}} ',
  any: {
    invalid: 'contiene un valor invalido.',
    empty: 'no puede estar vacío(a).',
    required: 'es requerido(a).',
  },
  array: {
    min: 'necesitan ser al menos {{limit}}.',
    max: 'necesitan ser como máximo {{limit}}.',
    length: 'necesitan ser {{limit}}.',
    unique: 'no pueden estar repetidos(as).'
  },
  string: {
    base: 'debe de ser una cadena válida',
    min: 'necesita tener una longitud mínima de {{limit}} caracteres.',
    max: 'necesita tener una longitud maxima de {{limit}} caracteres.',
    length: 'necesita tener una longitud de {{limit}} caracteres',
    email: 'no es valido.',
    alphanum: 'debe contener solamente caracteres alfanuméricos',
    trim: 'no debe tener espacios en blanco iniciales o finales.',
    regex: {
      base: 'necesita ser de al menos 8 caracteres con al menos una letra y un dígito.'
    },
    uri: 'necesita ser una dirección válida.',
  },
  number: {
    base: 'necesita ser un número',
  }
};


export const employeeSchema = {
  name: Joi.string().trim().required().max(50).label('El nombre'),
  email: Joi.string().trim().required().max(50).label('El email'),
  dob: Joi.string().regex(/^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$/).options({ language: { string: { regex: { base: 'necesita seguir el formato dd/mm/yyyy' } } } }).label('La fecha de nacimiento'),

  street: Joi.string().trim().required().label('La calle'),
  num: Joi.number().required().label('El numero de la calle'),
  suburb: Joi.string().trim().required().label('La colonia'),
  zip: Joi.number().required().label('El código postal')

};

const mapStateToProps = (state, props) => ({
  employee: state.employees[props.match.params.employeeId],
  isCreating: props.match.params.action === 'create',
  isEditing: props.match.params.action === 'edit',
});

const triggers = ['hover', 'focus'];

export const Popup = ({ children, message, enabled, disabled, ...rest }) => ( // eslint-disable-line react/prop-types
  <SemanticPopup
    position='right center'
    on={triggers}
    content={message}
    open={enabled !== undefined ? (enabled ? undefined : false) : (disabled ? false : undefined)}
    trigger={children}
    {...rest}
  />
);

const mapDispatchToProps = (dispatch) => bindActionCreators({ saveEmployee, deleteEmployee }, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
export class EmployeesDetails extends PureComponent {

  static propTypes = {
    employee: PropTypes.object,
    saveEmployee: PropTypes.func.isRequired
  }

  state= {
    errors: {},
    source: {}
  }

  updateSource = (employee) => {
    this.setState({ source: employee });
  }

  componentDidMount() {
    const { employee } = this.props;
    if (employee && _.isEmpty(this.state.source))
      this.updateSource(employee);
  }
  componentDidUpdate (oldProps) {
    const { employee } = this.props;
    if (!oldProps.employee && employee !== oldProps.employee) {
      this.updateSource(employee);
    }
  }



  onPropChange = (prop, value, { value: maybeValue, checked: maybeValue2 } = {}) => {
    const newVal = _.has(value, 'target.value')
      ? value.target.value
      : _.has(value, 'target.checked')
        ? value.target.checked
        : !_.isUndefined(maybeValue) ? maybeValue : (!_.isUndefined(maybeValue2) ? maybeValue2 : value);
    this.setState((prevState) => {
      prevState.source[prop] = newVal;
      return ({ source: prevState.source, errors: { ...prevState.errors, [prop]: '' } });
    });
    return true;
  }

  validateProps = () => {

    const { source } = this.state;
    this.setState({ errors: {} });

    const { error } = Joi.validate(
      source.attributes ? _.pick(source, _.keys(employeeSchema)) : source,
      employeeSchema,
      { abortEarly: false, allowUnknown: true, language },
    );

    if (error) {
      const errors = _.transform(error.details, (errors, { path: [key], message }) => errors[key] = message, {});
      this.setState({ errors, loading: false });
      return false;
    }

    return true;
  };

  calculateSoource = createSelector(
    (state) => state.errors,
    (state) => state.source,
    (errors, source) => {
      const schemaOnChange = _.mapValues(employeeSchema, (val, key) => _.partial(this.onPropChange, key));
      return _.mapValues(schemaOnChange, (onChangeProp, key) => ({
        message: errors[key] || '',
        errored: !!errors[key],
        value: source[key],
        onChange: onChangeProp
      }));
    }
  );



  handleFormSubmit =(e) => {
    this.setState({ loading: true });
    _.invoke(e, 'preventDefault');
    let result = this.validateProps();
    if (result) {
      result = this.props.saveEmployee(this.state.source);
      this.props.history.replace(`/employees-details/${result.id}`);
    }
    this.setState({ loading: false });
  }

  deleteEmployee = () => {
    const { deleteEmployee, employee } = this.props;
    deleteEmployee(employee);
    this.props.history.push('/employees-list');
  };

  render() {
    const { loading } = this.state;
    const { isCreating, isEditing, employee } = this.props;
    const { name, email, dob, street, num, suburb, zip } = this.calculateSoource(this.state);

    return (
      <section className='employees-details'>
        <Helmet title={isCreating ? 'Crear nuevo empleado' : 'Detalles de empleado'} />

        <Grid stackable centered>
          <Grid.Column computer={8} largeScreen={8} widescreen={8} >
            <Segment>
              <h2>{isCreating ? 'Formulario para registro de empleado' : 'Detalles de empleado'}</h2>
              <div className='actions'>
                <div>
                  <Button color='green' as={Link} to='/employees-list'>
                    <Icon name='arrow left' />Volver al listado
                  </Button>
                </div>
                {!isCreating &&
                <div>
                  <Button color='red' disabled={isEditing} onClick={this.deleteEmployee}>
                    <Icon name='delete' />Eliminar
                  </Button>
                  <Button primary disabled={isEditing} as={Link} to={`/employees-details/${employee.id}/edit`}>
                    <Icon name='edit' />Editar
                  </Button>
                </div>}
              </div>
              <Form onSubmit={this.handleFormSubmit}>
                <Form.Field error={name.errored} required >
                  <label>Nombre</label>
                  <Popup message={name.message} enabled={name.errored} >
                    <Input disabled={!isEditing && !isCreating} value={name.value || ''} onChange={name.onChange} autoComplete='off' />
                  </Popup>
                </Form.Field>
            <Form.Field error={dob.errored} required >
                  <label>Fecha de nacimiento</label>
                  <Popup message={dob.message} enabled={dob.errored} >
                    <Input disabled={!isEditing && !isCreating} value={dob.value || ''} onChange={dob.onChange} autoComplete='off' />
                  </Popup>
                </Form.Field>

                <Form.Field error={email.errored} required >
                  <label>Correo</label>
                  <Popup message={email.message} enabled={email.errored} >
                    <Input disabled={!isEditing && !isCreating} value={email.value || ''} onChange={email.onChange} autoComplete='off' />
                  </Popup>
                </Form.Field>
                <Form.Field error={street.errored} >
                  <label>Calle</label>
                  <Popup message={street.message} enabled={street.errored} >
                    <Input disabled={!isEditing && !isCreating} value={street.value || ''} onChange={street.onChange} autoComplete='off' />
                  </Popup>
                </Form.Field>
                <Form.Field error={num.errored} >
                  <label>Numero de casa</label>
                  <Popup message={num.message} enabled={num.errored} >
                    <Input disabled={!isEditing && !isCreating} value={num.value || ''} onChange={num.onChange} autoComplete='off' />
                  </Popup>
                </Form.Field>
                <Form.Field error={suburb.errored} required >
                  <label>Colonia</label>
                  <Popup message={suburb.message} enabled={suburb.errored} >
                    <Input disabled={!isEditing && !isCreating} value={suburb.value || ''} onChange={suburb.onChange} autoComplete='off' />
                  </Popup>
                </Form.Field>
                <Form.Field error={zip.errored} required >
                  <label>Código postal</label>
                  <Popup message={zip.message} enabled={zip.errored} >
                    <Input disabled={!isEditing && !isCreating} value={zip.value || ''} onChange={zip.onChange} autoComplete='off' />
                  </Popup>
                  <Form.Field control={Button} disabled={(!isEditing && !isCreating)|| loading} className='button' loading={loading} >Guardar</Form.Field>
                </Form.Field>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid>
      </section>
    );
  }
}