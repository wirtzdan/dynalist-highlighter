console.log("Content Script Loaded!");

// ---- Imports ---- //
import rangy from "rangy";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-highlighter";
import "rangy/lib/rangy-textrange";
import "rangy/lib/rangy-serializer";
import "../src/styles/style.css";

const axios = require("axios").default;

// ---- Initialise App ---- //
// TODO: Restore the selection

rangy.init();

const highlighter = rangy.createHighlighter(); // Adds a highlighter object that stores all highlights
highlighter.addClassApplier(rangy.createClassApplier("dyn-highlight"));

const dynInbox = axios.create({
  baseURL: "https://dynalist.io/api/v1/inbox",
  timeout: 1000
});

const dynDocument = axios.create({
  baseURL: "https://dynalist.io/api/v1/doc",
  timeout: 1000
});

const title = document.title;
const url = document.URL;

const Adder = createAdder();
const Tooltip = createTooltip();
const SubmitButton = createSubmitButton();

// ---- Create all elements ---- //
// TODO: Try to import the SVGs from the Filesystem
function createAdder() {
  const Adder = document.createElement("div");
  Adder.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.37 16.51"><path d="M12.87 16.51a.5.5 0 01-.5-.5v-2.26L9.84 11.2a1 1 0 01-.3-.73V8.79L4 8.76v1.57a1 1 0 01-.3.73L1 13.73V16a.5.5 0 01-.5.5.5.5 0 01-.5-.5v-2.25A1 1 0 01.3 13L3 10.35V8.79a1 1 0 011-1h5.5a1 1 0 011 1v1.68L13.07 13a1 1 0 01.3.73V16a.5.5 0 01-.5.51z" fill="#4e4d4d"/><path d="M10 6H3.48V3a.46.46 0 01.28-.43L9.2.05a.6.6 0 01.8.54z" fill="#FFD43B"/></svg>`;
  Adder.classList.add("dyn-adder");
  return Adder;
}

function createSubmitButton() {
  const SubmitButton = document.createElement("div");
  SubmitButton.innerHTML = `Send to Dynalist`;
  SubmitButton.classList.add("dyn-submit-button");
  return SubmitButton;
}

function createTooltip() {
  const Tooltip = document.createElement("div");
  Tooltip.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-trash-2" viewBox="0 0 24 24">
  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
</svg>`;
  Tooltip.classList.add("dyn-tooltip");
  return Tooltip;
}

// ---- Functions ---- //
function getMousePosition(e) {
  var mouseX = e.pageX;
  var mouseY = e.pageY;

  if (mouseX === undefined) {
    mouseX =
      e.clientX +
      document.body.scrollLeft +
      document.documentElement.scrollLeft;
    mouseY =
      e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  return { mouseX, mouseY };
}

function addHighlight(e) {
  highlighter.highlightSelection("dyn-highlight");
  highlighter.getHighlightForElement(e.target);
  const selectionTxt = rangy.getSelection();
  rangy.getSelection().removeAllRanges();
}

function removeHighlight(target) {
  var highlight = highlighter.getHighlightForElement(target);
  if (highlight) {
    highlighter.removeHighlights([highlight]);
  }
}

function showElement(el, e) {
  if (e) {
    const { mouseX, mouseY } = getMousePosition(e);
    el.setAttribute(
      "style",
      `display: block; top: ${mouseY}px; left: ${mouseX}px;`
    );
  } else {
    el.setAttribute("style", `display: block;`);
  }
}

function hideElement(el) {
  el.style.display = "none";
}

function sendHighlightsToDynalist(key, fileid) {
  const htmlHighlights = document.getElementsByClassName("dyn-highlight");

  const highlights = [];

  for (let highlight of htmlHighlights) {
    highlights.push(highlight.innerText);
  }

  dynInbox
    .post("/add", {
      token: key,
      index: "0",
      content: `[${title}](${url})`
    })
    .then(function(response) {
      for (let i in highlights) {
        dynDocument
          .post("/edit", {
            token: key,
            file_id: fileid,
            changes: [
              {
                action: "insert",
                parent_id: response.data.node_id,
                index: 1,
                content: highlights[i]
              }
            ]
          })
          .then(function(response) {
            console.log("DocumentChange", response);
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}

// ---- Handle Functions ---- //

function handleMouseup(e) {
  rangy.getSelection().expand("word", {
    trim: true
  });
  const selection = document.getSelection();

  if (Adder.style.display === "block" || selection.isCollapsed) {
    hideElement(Adder);
  } else {
    showElement(Adder, e);
  }
}

function handleMousedown(e) {
  if (e.target.className === "dyn-highlight") {
    showElement(Tooltip, e);
    const target = e.target; // Save the original target into variable

    Tooltip.addEventListener("click", () => {
      removeHighlight(target);
      hideElement(Tooltip);
    });
  }

  if (Adder.style.display === "block") {
    hideElement(Tooltip);
  }
}

function handleClick() {
  // TODO: Extract all the text nodes from the highlight object

  chrome.storage.sync.get(["key", "fileid"], function(result) {
    const { key, fileid } = result;

    if (!key || !fileid) {
      alert("API key and File ID are missing.");
      sendHighlightsToDynalist(key, fileid);
    } else {
      sendHighlightsToDynalist(key, fileid);
    }
  });
}

// ---- Add Event Listeners ---- //

function addAllEventListener() {
  document.addEventListener("mouseup", e => handleMouseup(e));

  document.addEventListener("mousedown", e => handleMousedown(e));

  Adder.addEventListener("mousedown", e => addHighlight(e));

  SubmitButton.addEventListener("click", () => handleClick());
}

function removeAllEventListener() {
  document.removeEventListener("mouseup", e => handleMouseup(e));

  document.removeEventListener("mousedown", e => handleMousedown(e));

  Adder.removeEventListener("mousedown", e => addHighlight(e));

  SubmitButton.removeEventListener("click", () => handleClick());
}

// ---- On Message Listener ---- //

function removeElements(classNames) {
  for (let index = 0; index < classNames.length; index++) {
    var element = document.getElementsByClassName(classNames[index])[0];
    element.parentNode.removeChild(element);
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.msg === "deactivate") {
    sendResponse("Deactivated");
    highlighter.removeAllHighlights();
    removeAllEventListener();
    removeElements(["dyn-adder", "dyn-submit-button", "dyn-tooltip"]);
  }

  if (request.msg === "activate") {
    sendResponse("Activated");
    document.body.appendChild(Adder);
    document.body.appendChild(SubmitButton);
    document.body.appendChild(Tooltip);
    addAllEventListener();
  }
});
