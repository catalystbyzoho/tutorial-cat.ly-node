import React from "react";
import Input from "./Input/InputForm";
import Header from "./Input/Header";
import List from "./Input/List";
import CONSTANTS from "./utils/constants";

import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlValue: "",
      urls: []
    };
  }
  componentDidMount = async () => {
    const response = await fetch(CONSTANTS.url.getAllUrls, {
      method: "GET",
      cache: "no-cache"
    }).catch(() => null);
    let urls = await response.json().catch(() => []);
    urls = urls.map(url => ({
      originalUrl: url.originalUrl,
      urlCode: url.urlCode
    }));
    if (urls && urls.length > 0) {
      this.setState({
        urls
      });
    }
  };
  handleChange = event => {
    this.setState({
      urlValue: event.target.value
    });
  };

  handleShrink = async event => {
    event.preventDefault();
    let shrinkUrl = this.state.urlValue;
    if (shrinkUrl !== "") {
      if (!/^https?:\/\//i.test(shrinkUrl)) {
        shrinkUrl = "http://" + shrinkUrl;
      }
      const response = await fetch(CONSTANTS.url.posturl, {
        method: "POST",
        headers: new Headers({
          Accept: "application/json",
          "Content-Type": "application/json"
        }),
        cache: "no-cache",
        body: JSON.stringify({
          originalUrl: shrinkUrl
        })
      });
      const resJson = await response.json();
      if (response.ok) {
        this.setState({
          urlValue: "",
          urls: [
            {
              originalUrl: resJson.originalUrl,
              urlCode: resJson.urlCode
            },
            ...this.state.urls
          ]
        });
      } else {
        console.log(response);
      }
    }
  };

  render() {
    return (
      <div>
        <div className="container">
          {!navigator.onLine && (
            <h3 className="header">Please connect to network</h3>
          )}
          <Header countUrls={this.state.urls.length} />
          <Input
            handleShrink={this.handleShrink}
            handleChange={this.handleChange}
            urlValue={this.state.urlValue}
          />
        </div>
        <List urlValue={this.state.urlValue} urls={this.state.urls} />
      </div>
    );
  }
}
export default App;
