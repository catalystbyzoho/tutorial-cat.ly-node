import React from "react";

class InputForm extends React.Component {
  render() {
    return (
      <form className="form">
        <input
          type="text"
          className="form__input"
          placeholder="shrink url"
          onChange={this.props.handleChange}
          value={this.props.urlValue}
        />
        <button
          className="form__button"
          type="submit"
          onClick={this.props.handleShrink}
        >
          Shrink
        </button>
      </form>
    );
  }
}

export default InputForm;
