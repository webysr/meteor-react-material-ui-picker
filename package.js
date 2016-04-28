Package.describe({
  name: 'webysr:react-material-ui-picker',
  version: '2.0.0',
  summary: 'A simple file picker for Google Drive made with React and Material UI',
  git: 'https://github.com/webysr/meteor-react-material-ui-picker.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2');
  api.use('ecmascript@0.4.3');
  api.use('mongo@1.1.7');
  api.use('react-meteor-data@0.2.9');
  api.use('webysr:googleapis-pub@1.0.0');

  api.addFiles(['server/driveFilesPub.js'], 'server');
  api.mainModule('client/FilePicker.jsx', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('webysr:react-material-ui-picker');
  api.mainModule('test/react-material-ui-picker-tests.js');
});
