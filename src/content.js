/*global chrome*/
/* src/content.js */
import React, { useState } from "react";
import ReactDOM from "react-dom";
import Widget from "./components/Widget";
import "./content.css";
import "./cssreset.css";
import "./app.css";
import Frame from "react-frame-component";
import { ScopeProvider } from "./util/scope-provider";
import { FrameProvider } from "./util/frame-provider";
import { ChakraProvider } from "./util/chakra-provider";
import { CSSReset } from "@chakra-ui/core";
import { highlighter, rangy } from "./util/highlighter";

function Main() {
  const [buttonText, setButtonText] = useState("Save Bookmark");

  function addHighlight(e) {
    highlighter.highlightSelection("dyn-highlight");
    highlighter.getHighlightForElement(e.target);
    rangy.getSelection().removeAllRanges();
    updateButtonText();
  }

  function updateButtonText() {
    const highlights = highlighter.highlights;
    const length = highlights.length;

    if (length > 0) {
      if (length === 1) {
        setButtonText(`Save ${length} Highlight`);
      } else {
        setButtonText(`Save ${length} Highlights`);
      }
    } else {
      setButtonText(`Save Bookmark`);
    }
  }

  function removeHighlight(e) {
    const target = e.target;
    var highlight = highlighter.getHighlightForElement(target);

    if (highlight) {
      highlighter.removeHighlights([highlight]);
      updateButtonText();
    }
  }

  // ---- Handle Functions ---- //
  function handleMouseup(e) {
    if (e.target.className === "dyn-highlight") {
      removeHighlight(e);
    } else if (!rangy.getSelection.isCollapsed) {
      rangy.getSelection().expand("word", {
        trim: true
      });
      addHighlight(e);
    }
  }

  function addHighlightListener() {
    document.addEventListener("mouseup", e => handleMouseup(e));
  }

  addHighlightListener();

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
            <Widget buttonText={buttonText} />
          </FrameProvider>
        </ChakraProvider>
      </Frame>
    </ScopeProvider>
  );
}

let active = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
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
