'use strict';

module.exports = Forward;

Forward.$inject = ['app', 'config', 'ext/forward'];
function Forward(app, config, $forward) {

  console.log($forward);

  app.get('/forward', function(req, res) {
    $forward.query().then(function(list) {
      res.send(list);
    });
  });

}
