import React from "react";

import styles from "./_FileInput.module.scss";

class FileInput extends React.PureComponent {
  rawInput: HTMLInputElement | null = null;
  // value: string = (this.rawInput || { value: "" }).value;

  _forceUpdate = () => {
    this.forceUpdate();
  };
  get value() {
    return (this.rawInput || { value: "" }).value;
  }
  set value(val) {
    if (this.rawInput !== null) {
      this.rawInput.value = val;
    }
  }

  setExternalFile = (file: any) => {
    if (!file) {
      this.value = "";
    }
  };

  _openFileDialog = () => {
    /*
    TODO: If state.uploads.length > 0
              dispatch(showConfirmation(RESUME_UPLOAD));
     */
    if (this.rawInput !== null) {
      this.rawInput.click();
    }
  };

  _getDescriptor = (): React.ReactNode | null => {
    if (this.rawInput) {
      console.log(this.rawInput.files);
    }
    if (this.value) {
      return <span className={styles.fileValue}>{this.value}</span>;
    }
    return null;
  };

  render() {
    return (
      <div className={styles.container}>
        <input
          type="file"
          className={styles.rawFileInput}
          ref={(inp) => (this.rawInput = inp)}
          onChange={this._forceUpdate}
        />
        <button className={styles.fileInput} onClick={this._openFileDialog}>
          Choose File
        </button>
        {this._getDescriptor()}
      </div>
    );
  }
}

export default FileInput;
