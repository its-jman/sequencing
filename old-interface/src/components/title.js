import React from "react";
import { Link } from "react-router-dom";

class Title extends React.Component {
  render() {
    if (this.props.location.pathname === "/visualize") {
      return null;
    }

    return (
      <div className="title-container">
        <div className="title">
          <Link to={`/`} className="title-link">
            Title
          </Link>
        </div>
        <div className="separator" />
      </div>
    );
  }
}

export default Title;
