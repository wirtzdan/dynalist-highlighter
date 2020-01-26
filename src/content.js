/*global chrome*/
/* src/content.js */
import React from "react";
import ReactDOM from "react-dom";
import Frame, { FrameContextConsumer } from "react-frame-component";
import "./content.css";
import Widget from "./components/Widget";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import theme from "./theme";

class Main extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Widget />
      </ThemeProvider>
    );
  }
}

let active = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("TCL: request", request);

  if (request.msg === "deactivate") {
    sendResponse("Response: Deactivate");
  } else if (request.msg === "activate" && active === false) {
    const app = document.createElement("div");
    app.id = "dynalist-highlighter";

    document.body.appendChild(app);
    ReactDOM.render(<Main />, app);

    active = true;
    sendResponse("Activated.");
  } else {
    sendResponse("Response: Nothing happend.");
  }
});
