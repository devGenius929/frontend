import React from 'react';
import { connect } from 'react-redux';
import cssModules from 'react-css-modules';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import store from '../../../store';
import { history, errors } from '../../../constants';
import { isLoggedIn } from '../../../utils';
import actions from './actions';


function mapStateToProps(state) {
  return {
    token: state.login.token,
    status: state.login.status,
    error: state.login.error,
  };
}


const styles = {
  root: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    justifyContent: 'center',
    alignItems: 'center',
  },

  form: {
    padding: '20px 50px',
  },

  button: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },

  title: {
    textAlign: 'center',
    fontFamily: 'inherit',
  },
};


const Login = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
    status: React.PropTypes.string,
    error: React.PropTypes.string,
  },

  getInitialState() {
    return {
      email: '',
      password: '',
    };
  },

  componentWillMount() {
    if (isLoggedIn()) {
      history.push('/');
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === 'error') {
      this.setState({ status: 'error', message: nextProps.error });
      store.dispatch(actions.reset());
    }
  },

  shouldComponentUpdate() {
    if (isLoggedIn()) {
      history.push('/');
      return false;
    }
    return true;
  },

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  },

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  },

  handleSubmit(event) {
    event.preventDefault();
    store.dispatch(actions.login(this.state.email, this.state.password));
  },

  handleNotificationClose() {
    this.setState({ status: '', message: '' });
  },

  render() {
    const notificationOpen = this.state.status === 'error';
    const notification = notificationOpen ? errors.login[this.state.message] : '';
    return (
      <div style={styles.root}>
        <Paper zDepth={3}>
          <form style={styles.form} onSubmit={this.handleSubmit}>
            <h1 style={styles.title}>Login</h1>
            <div>
              <TextField
                floatingLabelText="Email"
                onChange={this.handleEmailChange}
                autoFocus
                required
              />
            </div>
            <div>
              <TextField
                floatingLabelText="Password"
                type="password"
                onChange={this.handlePasswordChange}
                required
              />
            </div>
            <div style={styles.button}>
              <RaisedButton label="login" type="submit" />
            </div>
          </form>
        </Paper>
        <Snackbar
          open={notificationOpen}
          message={notification}
          autoHideDuration={4000}
          action="close"
          onActionTouchTap={this.handleNotificationClose}
          onRequestClose={this.handleNotificationClose}
        />
      </div>
    );
  },
});


export default connect(mapStateToProps, actions)(cssModules(Login, styles));
