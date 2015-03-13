'use strict';

module.exports = Test;

Test.$inject = ['app', 'extensions/helloWorld'];
function Test(app, world) {

  app.get('/hello-world', function(req, res) {
    res.send(world());
  });

}
