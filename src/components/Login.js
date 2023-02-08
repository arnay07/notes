import { useState } from 'react';
import loginService from '../services/login.js';
import notesService from '../services/notes.js';

const Login = ({ setErrorMessage, setUser }) => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  //eslint-disable-next-line

  const handleLogin = (event) => {
    event.preventDefault();
    console.log(`Logging in with ${username} and ${password}`);
    loginService
      .login({
        username,
        password,
      })
      .then((user) => {
        window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user));
        setUser(user);
        notesService.setToken(user.token);
        setUserName('');
        setPassword('');
      })
      .catch((error) => {
        setErrorMessage('Wrong credentials');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  return (
    <>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">username</label>
        &nbsp;
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUserName(target.value)}
        />
        <br />
        <label htmlFor="password">password</label>
        &nbsp;
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
        <br />
        <button type="submit">login</button>
      </form>
    </>
  );
};

export default Login;
