import React, { Component } from "react";
import "./App.css";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import theme from "./theme";
import Widget from "./components/Widget";

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <CSSReset />
        <div className="App">
          <Widget />
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
