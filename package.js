Package.describe({
  name: 'webysr:react-material-ui-picker',
  version: '1.0.0',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3-beta.11');
  api.use('ecmascript@0.4.0-beta.11');
  api.use('mongo@1.1.4-beta.11');
  api.use('react-meteor-data@0.2.5');
  api.use('webysr:googleapis-pub');

  //api.addFiles(['lib/FilePicker.jsx']);
  api.addFiles(['server/driveFilesPub.js'], 'server');
  api.mainModule('client/FilePicker.jsx', 'client');
  //api.export('FilePicker');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('webysr:react-material-ui-picker');
  api.mainModule('test/react-material-ui-picker-tests.js');
});
