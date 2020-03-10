import React from "react";

class Header extends React.Component {
  render() {
    return (
      <header className="header">
        <h1>cat.ly</h1>
        <h3>Url Count {this.props.countUrls}</h3>
      </header>
    );
  }
}

export default Header;
