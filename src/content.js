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

const app = document.createElement("div");
app.id = "my-extension-root";

document.body.appendChild(app);
ReactDOM.render(<Main />, app);

app.style.display = "none";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "clicked_browser_action") {
    console.log("TCL: clicked_browser_action", "clicked_browser_action");
    toggle();
  }
});

function toggle() {
  if (app.style.display === "none") {
    app.style.display = "block";
  } else {
    app.style.display = "none";
  }
}
