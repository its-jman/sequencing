import React from "react";
import { FiCheck } from "react-icons/fi";

import styles from "./_checkbox.module.scss";
import { getClassNames } from "src/utils";

type ICheckboxProps = {
  className?: string;
  size: number;
};

class Checkbox extends React.PureComponent<ICheckboxProps> {
  state = {
    checked: false
  };

  _onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      checked: event.target.checked
    });
  };

  render() {
    const { size, className } = this.props;
    const { checked } = this.state;

    return (
      <div
        className={getClassNames(className, styles.container)}
        style={{ width: size, height: size }}
      >
        <input type="checkbox" checked={checked} onChange={this._onChange} />
        <div className={styles.state}>
          <FiCheck className={styles.icon} size={Math.floor(size * 0.8)} />
        </div>
      </div>
    );
  }
}

// export class OldCheckbox extends React.Component {
//   state = {
//     checked: false
//   };
//
//   _onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     this.setState({ checked: event.target.checked });
//   };
//
//   render() {
//     return (
//       <div className="pretty p-icon">
//         <input type="checkbox" datasetId={"asdf"} checked={this.state.checked} onChange={this._onChange} />
//         <div className="state">
//           <i className="icon mdi mdi-check" />
//           <label htmlFor={"asdf"}>{"MyLabel"}</label>
//         </div>
//       </div>
//     );
//   }
// }

export default Checkbox;
