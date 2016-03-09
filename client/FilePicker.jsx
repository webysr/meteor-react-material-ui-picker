import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import DriveFiles from './DriveFiles.jsx';

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


  getInitialState() {
    return {
      open: false
    };
  },

  open() {
    this.setState({open: true});
  },

  handleClose() {
    this.setState({open: false});
  },

  renderActions() {
    return [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Choose"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />
    ]
  },

  renderFiles() {
    return this.data.driveFiles.map((file) => <li key={file.id}>{file.title}</li>);
  },

  render() {
    let {folderId, ...props} = this.props;
    return (
      <Dialog
        open={this.state.open}
        title="Pick File"
        modal={false}
        actions={this.renderActions()}
        {...props}>
        {this.data.ready ?
        <ul>
          {this.renderFiles()}
        </ul> : ''}
      </Dialog>
    );
  }
});

export default FilePicker;