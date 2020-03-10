import React from "react";

import CONSTANTS from "../utils/constants";

function handleUrl(code, e) {
  e.preventDefault();
  const win = window.open(
    window.location.origin + CONSTANTS.url.baseServer + "/" + code,
    "_blank"
  );
  win.focus();
}

function ListItem(props) {
  // Correct! There is no need to specify the key here:
  return (
    <li className="url-item" onClick={e => handleUrl(props.value.urlCode, e)}>
      <span className="long-link">{props.value.originalUrl}</span>
      <span className="short-link">
        {CONSTANTS.url.baseServer +
          "/" +
          props.value.urlCode}
      </span>
    </li>
  );
}

class List extends React.Component {
  render() {
    let options;
    if (this.props.urlValue.length) {
      const search = this.props.urlValue.split(" ");
      const searchPattern = new RegExp(
        search.map(term => `(?=.*${term})`).join(""),
        "i"
      );
      options = this.props.urls.filter(option =>
        option.originalUrl.match(searchPattern)
      );
    } else {
      options = this.props.urls;
    }
    options = options.map(url => ({
      originalUrl: url.originalUrl,
      urlCode: url.urlCode
    }));

    const listItems = options.map((option, i) => (
      <ListItem key={option + i} value={option} />
    ));

    return (
      <div className="url-list-container">
        <ul className="url-list">{listItems}</ul>
      </div>
    );
  }
}

export default List;
