const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontSize: 14,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: '100%',
  };
  return (
    <div style={footerStyle}>
      Note app, made with ❤️ by Arnaud K. &copy; Copyright 2023
    </div>
  );
};

export default Footer;
