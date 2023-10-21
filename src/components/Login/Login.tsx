import './Login.scss';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Input from '../Common/Input';
import { useState } from 'react';
import { isValidEmail } from '../../utils/email';
import Logo from '../Common/Logo';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    try {
      setLoading(true);
      setLoginError('');
      await login(username, password);
      navigate('/');
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);

      if (error.name === 'FirebaseError') {
        setLoginError('Error: Invalid Credentials.');
      } else {
        setLoginError('Error: Something went wrong.');
      }
    }
  }

  function canSubmit(): boolean {
    return username.length > 0 && password.length > 0 && !usernameError.length;
  }

  function validateUsername() {
    if (!username.length || isValidEmail(username)) {
      setUsernameError('');
    } else {
      setUsernameError('Invalid email.');
    }
  }

  function handleSubmit() {
    if (canSubmit()) {
      onLogin();
    }
  }

  return (
    <div className="Login">
      <div className="ui card">
        <div className="content">
          <div className='ImageContainer'></div>
          <div className='FormContainer'>
            <div className='Header'>
              <Logo />
              <h3 className="ui header contrast">Employee Portal</h3>
            </div>
            <div className="Body">
              <div className="ui form">
                <Input
                  type="text"
                  name="username"
                  placeholder="Username"
                  icon="at"
                  value={username}
                  onChange={e => setUsername(e)}
                  onBlur={validateUsername}
                  disabled={loading}
                  error={usernameError}
                  onSubmit={handleSubmit}
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  icon="lock"
                  value={password}
                  onChange={e => setPassword(e)}
                  disabled={loading}
                  onSubmit={handleSubmit}
                />
                <button className="ui button hover-animation" disabled={loading || !canSubmit()} onClick={handleSubmit}>
                  <p className='label'>Log In</p>
                  <p className='IconContainer'><i className='arrow right icon'></i></p>
                </button>
              </div>
              {loginError &&
                <div className="ui negative message">
                  <b><p>{loginError}</p></b>
                </div>
              }
            </div>
            <div className='Footer'>
              <p className='quote'><i>"Perfection is not attainable, but if we chase perfection we can catch excellence."</i></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
