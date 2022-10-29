const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontSize: 14,
    position: 'absolute',
    bottom: 0,
    height: 30,
    width: '100%',
    textAlign: 'center',
  };
  return (
    <div style={footerStyle}>
      Note app, made with ❤️ by Arnaud K. &copy; Copyright 2022
    </div>
  );
};

export default Footer;
