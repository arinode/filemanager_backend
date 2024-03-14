export { PORT };

const PORT = getPort();

function getPort() {
  const port = parseInt(process.env.PORT);

  if (isNaN(port)) {
    return 25401;
  }

  return port;
}
