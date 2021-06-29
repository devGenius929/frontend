import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import Service from '../../molecules/service';
import CreateServiceForm from '../../molecules/service/createForm';
import List from '../../molecules/transition-appear';
import removeActions from './actions/remove';
import settingsActions from '../../layouts/layout/actions/settings';
import store from '../../../store';
import serviceDetail from '../service';
import Add from '../../atoms/add';
import actions from './actions';
import serviceActions from '../../molecules/service/actions/create';


const mapStateToProps = state => {
  const data = {
    services: state.serviceList.services,
    status: state.serviceList.status,
  };
  if (state.serviceCreate) {
    data.createStatus = state.serviceCreate.status;
  }
  if (state.serviceRemove) {
    data.removeStatus = state.serviceRemove.status;
    data.removeService = state.serviceRemove.service;
  }
  return data;
};

const ServiceList = React.createClass({
  propTypes: {
    services: React.PropTypes.array,
    status: React.PropTypes.string,
    createStatus: React.PropTypes.string,
    iconId: React.PropTypes.string,
    close: React.PropTypes.func,
    removeStatus: React.PropTypes.string,
    removeService: React.PropTypes.object,
  },

  getDefaultProps() {
    return {
      services: [],
    };
  },

  getInitialState() {
    return {
      name: '',
    };
  },

  componentWillMount() {
    store.dispatch(actions.get());
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.createStatus === 'success') {
      store.dispatch(actions.get());
      store.dispatch(serviceActions.reset());
    }
    if (nextProps.removeStatus === 'success') {
      store.dispatch(removeActions.reset());
      store.dispatch(actions.get());
    }
    return true;
  },

  componentWillUnmount() {
    store.dispatch(actions.reset());
  },

  showCreate() {
    store.dispatch(settingsActions.open(<CreateServiceForm />));
  },

  hideCreate() {
    this.setState({
      create: false,
      name: '',
    });
  },

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  },

  handleClose(event) {
    event.preventDefault();
    store.dispatch(this.props.close(this.props.iconId));
  },

  handleRemove(event) {
    event.preventDefault();
    store.dispatch(removeActions.remove(this.props.removeService.id));
  },

  handleCancel(event) {
    event.preventDefault();
    store.dispatch(removeActions.reset());
  },

  render() {
    const services = (
      <div>
        <h1>Services</h1>
        {
          this.props.services.map(
            service => {
              const url = `services/${service.id}`;
              return (
                <Link to={url} key={service.id}>
                  <Service
                    name={service.name}
                    iconId={service.id}
                    close={removeActions.confirm}
                  />
                </Link>
              );
            }
          )
        }
      </div>
    );
    if (this.props.removeStatus === 'confirm') {
      return (
        <div>
          <h1>Remove service {this.props.removeService.id}?</h1>
          <FlatButton
            onTouchTap={this.handleRemove}
            label="yes"
            secondary
          />
          <FlatButton
            onTouchTap={this.handleCancel}
            label="no"
            primary
          />
        </div>
      );
    }
    return (
      <div>
        <List>
          {services}
        </List>
        <div onClick={this.showCreate}>
          <Add />
        </div>
      </div>
    );
  },
});

const routes = {
  path: 'services',
  indexRoute: {
    component: connect(mapStateToProps, actions)(ServiceList),
  },
  childRoutes: [
    serviceDetail,
  ],
};

export default routes;
