import React, { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'
import SubmitButton from './SubmitButton'

const css = require('../css/login.css')


const ConfigStatusMessage = (props: any) => {
  const enabled = props.enabled
  let result;

  if (enabled === true) {
    result = (<div className="db-warn-msg">
      <p>
        <FormattedMessage id="login.hsqldbcofig" defaultMessage="Although HSQLDB is bundled with WiseMapping by default during the installation, we do not recommend this database for production use. Please consider using MySQL 5.7 instead. You can find more information how to configure MySQL" description="Missing production database configured" /><a href="https://wisemapping.atlassian.net/wiki/display/WS/Database+Configuration"> here</a>
      </p>
    </div>);
  } else {
    result = <span></span>;
  }
  return result;
}

const LoginError = (props: any) => {
  // @Todo: This must be reviewed to be based on navigation state.
  // Login error example: http://localhost:8080/c/login?login.error=2
  const errorCode = new URLSearchParams(window.location.search).get('login_error');

  let result;
  if (errorCode) {
    if (errorCode === "3") {
      result = (
        <div className='form-error-dialog'>
          <FormattedMessage id="login.userinactive" defaultMessage="Sorry, your account has not been activated yet. You'll receive a notification login.email when it becomes active. Stay tuned!." />
        </div>)
    } else {
      result = (
        <div className='form-error-dialog'>
          <FormattedMessage id="login.error" defaultMessage="The login.email address or login.password you entered is  not valid." />
        </div>)
    }
  }
  return (<span>{result}</span>);

}
const LoginForm = () => {
  const intl = useIntl();

  return (
    <div className="wrapper">
      <div className="content">
        <h1><FormattedMessage id="login.welcome" defaultMessage="Welcome" /></h1>
        <p><FormattedMessage id="login.loginto" defaultMessage="Log Into Your Account" /></p>

        <LoginError />

        <form action="/c/perform-login" method="POST">
          <input type="email" name="username" placeholder={intl.formatMessage({ id: "login.email", defaultMessage: "Email" })} required={true} autoComplete="email" />
          <input type="password" name="password" placeholder={intl.formatMessage({ id: "login.password", defaultMessage: "Password" })} required={true} autoComplete="current-password" />

          <div>
            <input name="_spring_security_login.remberme" id="staySignIn" type="checkbox" />
            <label htmlFor="staySignIn"><FormattedMessage id="login.remberme" defaultMessage="Remember me" /></label>
          </div>
          <SubmitButton value={intl.formatMessage({ id: "login.signin", defaultMessage: "Sign In" })}/>
        </form>
        <Link to="/c/user/resetPassword"><FormattedMessage id="login.forgotpwd" defaultMessage="Forgot Password ?" /></Link>
      </div>
    </div>
  );
}

const LoginPage = (props: any) => {

  useEffect(() => {
    document.title = 'Login | WiseMapping';
  });

  return (
    <div>
      <Header type='only-signup' />
      <LoginForm />
      <ConfigStatusMessage enabled='false' />
      <Footer />
    </div>
  );
}

export default LoginPage;

