import React from "react";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { connect } from "react-redux";

import * as a from "../state/actions";
import Modal from "./modal";

class UploadModal extends React.Component {
  state = {
    visible: false
  };

  _components = {};

  _setVisible = (visible) => {
    return () => {
      this.setState({
        visible: visible
      });
    };
  };

  _handleUpload = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", this._components.nameInput.value);
    data.append("file", this._components.uploadInput.files[0]);
    data.append("file_type", this._components.fileTypeInput.value);

    this.props.uploadDataset(data);
  };

  render() {
    const { visible } = this.state;

    return (
      <React.Fragment>
        <button className="upload-button" onClick={this._setVisible(true)}>
          <IoMdAdd size="24" />
          <span>Upload New</span>
        </button>

        <Modal visible={visible} onBgClick={this._setVisible(false)}>
          <div className="modal-content">
            <form
              onSubmit={this._handleUpload}
              ref={(ref) => {
                this._components.form = ref;
              }}
            >
              <div className="modal-content-header">
                <input
                  type="text"
                  ref={(ref) => (this._components.nameInput = ref)}
                  placeholder="Name this upload"
                  required
                />
                <IoMdClose size="36" className="clickable" onClick={this._setVisible(false)} />
              </div>
              <div className="separator-dark" />

              <div className="modal-content-body">
                <input type="file" ref={(ref) => (this._components.uploadInput = ref)} required />
                <label style={{ marginTop: "15px" }}>File Type</label>
                <select
                  ref={(ref) => (this._components.fileTypeInput = ref)}
                  defaultValue="fasta"
                  disabled
                  required
                >
                  <option value="fasta">Fasta</option>
                </select>

                <input className="submit-btn" type="submit" />
              </div>
            </form>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default connect(
  (state, ownProps) => {
    return {};
  },
  (dispatch, ownProps) => {
    return {
      uploadDataset: (data) => dispatch(a.uploadDataset(data))
    };
  }
)(UploadModal);
