import React from 'react';
import _ from 'lodash';
import DriveFiles from './DriveFiles.jsx';
import Dialog from 'material-ui/lib/dialog';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import FileFolder from 'material-ui/lib/svg-icons/file/folder';
import EditorInsertDriveFile from 'material-ui/lib/svg-icons/editor/insert-drive-file';
import KeyboardArrowRight from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-right';
import NavigationArrowBack from 'material-ui/lib/svg-icons/navigation/arrow-back';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import CircularProgress from 'material-ui/lib/circular-progress';
import {blue500 as fileColor, grey400 as folderColor} from 'material-ui/lib/styles/colors';

const MIME_TYPE_FOLDER = 'application/vnd.google-apps.folder';

const FilePicker = React.createClass({

  propTypes: {
    initialFolderId: React.PropTypes.string.isRequired,
    apiRequestOverride: React.PropTypes.object,
    onFilePicked: React.PropTypes.func
  },

  mixins: [ReactMeteorData],

  getDefaultProps() {
    return {
      onFilePicked: () => 0
    }
  },

  getInitialState() {
    return {
      open: false,
      folderId: null
    };
  },

  getMeteorData() {
    if (this.state.folderId) {
      let APIRequest = {
        orderBy: 'folder,title',
        maxResults: 1000,
        q: `'${this.state.folderId}' in parents and trashed != true`,
        fields: "items(id,defaultOpenWithLink,mimeType,thumbnailLink,title)"
      };

      if (this.props.apiRequestOverride) {
        _.forOwn(this.props.apiRequestOverride, (value, key) => {
          if (key == 'q') {
            APIRequest.q = value ? APIRequest.q + ' and ' + value : APIRequest.q;
          } else {
            APIRequest[key] = value || APIRequest[key]
          }
        });
      }

      let sub = Meteor.subscribe('drive.files.list', APIRequest);

      return {
        ready: sub.ready(),
        driveFiles: DriveFiles.find({}).fetch()
      }
    } else {
      return {ready: false};
    }
  },

  componentWillMount() {
    this.prevFolderIds = [];
  },

  open(folderId) {
    if (!folderId) {
      this.setState({
        open: true,
        folderId: this.props.initialFolderId
      });
    } else {
      this.setState({
        open: true,
        folderId
      });
    }
  },

  rememberPrevFolderId(folderId) {
    this.prevFolderIds.push(this.state.folderId);
  },

  handleOpenFolder(folderId) {
    this.rememberPrevFolderId(this.state.folderId);
    this.setState({folderId});
  },

  handleClose() {
    this.setState({open: false});
  },

  handleFilePicked(file) {
    this.props.onFilePicked(file);
    this.handleClose();
  },

  handleGoBack() {
    let length = this.prevFolderIds.length;
    if (length) {
      let prevFolderId = this.prevFolderIds.splice(length - 1, 1);
      this.setState({folderId: prevFolderId});
    } else {
      this.handleClose();
    }
  },

  getFileAvatar(file) {
    switch (file.mimeType) {
      case MIME_TYPE_FOLDER:
        return (<Avatar icon={<FileFolder />} backgroundColor={folderColor}/>);
      default:
        return (<Avatar icon={<EditorInsertDriveFile />} backgroundColor={fileColor}/>);
    }
  },

  renderActions() {
    return [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.handleClose}
      />]
  },

  renderTitle() {
    return (
      <FlatButton
        label="Back"
        icon={<NavigationArrowBack />}
        onTouchTap={this.handleGoBack}
      />
    );
  },

  renderFiles() {
    return this.data.driveFiles.map((file) => {
      let props = {
        key: file.id,
        primaryText: file.title,
        leftAvatar: this.getFileAvatar(file),
        onTouchTap: this.handleFilePicked.bind(this, file)
      };
      if (file.mimeType == MIME_TYPE_FOLDER) {
        props.rightIconButton = (
          <IconButton
            onTouchTap={this.handleOpenFolder.bind(this, file.id)}
          >
            <KeyboardArrowRight/>
          </IconButton>
        );
      }
      return <ListItem {...props}/>;
    });
  },

  render() {
    let {folderId, ...props} = this.props;
    return (
      <Dialog
        open={this.state.open}
        title={this.renderTitle()}
        modal={false}
        autoScrollBodyContent={true}
        bodyStyle={{padding: 0}}
        actions={this.renderActions()}
        onRequestClose={this.handleClose}
        {...props}>
        {this.data.ready ?
        <List>
          {this.renderFiles()}
        </List> : <CircularProgress size={2}/>}
      </Dialog>
    );
  }
});

export default FilePicker;