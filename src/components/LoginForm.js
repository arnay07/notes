const LoginForm = ({
  handleLogin,
  username,
  password,
  setPassword,
  setUserName,
}) => {
  const login = (event) => {
    event.preventDefault();
    handleLogin({
      username,
      password,
    });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={login}>
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
    </div>
  );
};

export default LoginForm;
