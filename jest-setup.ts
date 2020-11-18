
// NOTE prevent node errors within tests
process.on('unhandledRejection', reason => {
  console.log('unhandledRejection', reason);
});
