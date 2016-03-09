import React from 'react';
import DriveFiles from './FilePicker.jsx';

const FilePicker = React.createClass({

  propTypes: {
    folderId: React.PropTypes.string.isRequired
  },

  mixins: [ReactMeteorData],

  getMeteorData() {

    let sub = Meteor.subscribe('drive.files.list', {
      orderBy: 'title',
      maxResults: 10,
      q: `'${this.props.folderId}' in parents`,
      fields: "items(id,defaultOpenWithLink,thumbnailLink,title)"
    });

    return {
      ready: sub.ready(),
      driveFiles: DriveFiles.find({}).fetch()
    }
  },

  renderFiles() {

    return this.data.driveFiles.map((file) => <li key={file.id}>{file.title}</li>);
  },

  render() {
    return (
      <div>
        <h1>File Picker</h1>
        {this.data.ready ?
        <ul>
          {this.renderFiles()}
        </ul> : ''}
      </div>
    );
  }
});

export default FilePicker;