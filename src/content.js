/*global chrome*/
/* src/content.js */
import React from "react";
import ReactDOM from "react-dom";
import Widget from "./components/Widget";
import "./util/highlighter";
import "./content.css";
import "./cssreset.css";
import "./app.css";
import Frame from "react-frame-component";
import { ScopeProvider } from "./util/scope-provider";
import { FrameProvider } from "./util/frame-provider";
import { ChakraProvider } from "./util/chakra-provider";
import { CSSReset } from "@chakra-ui/core";

class Main extends React.Component {
  render() {
    return (
      <ScopeProvider scope={"#root .App"}>
        <Frame
          head={[
            <>
              <link
                type="text/css"
                rel="stylesheet"
                href={chrome.runtime.getURL("/static/css/content.css")}
              ></link>
            </>
          ]}
          id="dyn-widget"
        >
          <ChakraProvider>
            <FrameProvider>
              <CSSReset />
              <Widget />
            </FrameProvider>
          </ChakraProvider>
        </Frame>
      </ScopeProvider>
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
    app.id = "dynalist-highlighter-app";
    document.body.appendChild(app);
    ReactDOM.render(<Main />, app);
    active = true;
    sendResponse("Activated.");
  } else {
    sendResponse("Response: Nothing happend.");
  }
});
