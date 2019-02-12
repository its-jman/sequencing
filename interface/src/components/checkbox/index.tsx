import React from "react";
import { FiCheck } from "react-icons/fi";

import styles from "./_checkbox.module.scss";

class Checkbox extends React.PureComponent {
  state = {
    checked: false
  };

  _onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      checked: event.target.checked
    });
  };

  render() {
    const { checked } = this.state;

    return (
      <div className={styles.container}>
        <input type="checkbox" checked={checked} onChange={this._onChange} />
        <div className={styles.state}>
          <FiCheck className={styles.icon} size={16} />
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
//         <input type="checkbox" id={"asdf"} checked={this.state.checked} onChange={this._onChange} />
//         <div className="state">
//           <i className="icon mdi mdi-check" />
//           <label htmlFor={"asdf"}>{"MyLabel"}</label>
//         </div>
//       </div>
//     );
//   }
// }

export default Checkbox;
