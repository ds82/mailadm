var app = require('app');

app.config(['$translateProvider',
  function( $translateProvider ) {

    $translateProvider.translations('de', {
      SAVE: 'Speichern',
      ADD:  'Hinzufügen',
      USER_EDIT_PASSWORD_INFO: 'Wenn das Passwort nicht geändert werden soll, die Felder leer lassen.'
    });
    $translateProvider.preferredLanguage('de');
}]);
