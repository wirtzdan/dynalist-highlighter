console.log("Content Script Loaded!");

// ---- Imports ---- //
import rangy from "rangy";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-highlighter";
import "rangy/lib/rangy-textrange";
import "rangy/lib/rangy-serializer";
import "../src/styles/style.css";
import TurndownService from "turndown";

const axios = require("axios").default;

// ---- Initialise App ---- //
// TODO: Restore the selection

rangy.init();

const highlighter = rangy.createHighlighter(); // Adds a highlighter object that stores all highlights
highlighter.addClassApplier(rangy.createClassApplier("dyn-highlight"));

const dynDocument = axios.create({
  baseURL: "https://dynalist.io/api/v1/doc",
  timeout: 1000
});

const url = document.URL;

const Adder = createAdder();
const Tooltip = createTooltip();
const Widget = createWidget();
const FeedbackLink = createFeedbackLink();

// ---- Create all elements ---- //
// TODO: Try to import the SVGs from the Filesystem
function createFeedbackLink() {
  const FeedbackLink = document.createElement("div");
  FeedbackLink.innerHTML = `<a href="mailto:danielwirtzx@gmail.com" target="_blank">Give Feedback</a>`;
  FeedbackLink.classList.add("dyn-feedback-link");
  return FeedbackLink;
}

function createAdder() {
  const Adder = document.createElement("div");
  Adder.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 13.37 16.51"><path d="M12.87 16.51a.5.5 0 01-.5-.5v-2.26L9.84 11.2a1 1 0 01-.3-.73V8.79L4 8.76v1.57a1 1 0 01-.3.73L1 13.73V16a.5.5 0 01-.5.5.5.5 0 01-.5-.5v-2.25A1 1 0 01.3 13L3 10.35V8.79a1 1 0 011-1h5.5a1 1 0 011 1v1.68L13.07 13a1 1 0 01.3.73V16a.5.5 0 01-.5.51z"fill="#4e4d4d"/><path d="M10 6H3.48V3a.46.46 0 01.28-.43L9.2.05a.6.6 0 01.8.54z"fill="#FFD43B"/></svg>`;
  Adder.classList.add("dyn-adder");
  return Adder;
}

function createTooltip() {
  const Tooltip = document.createElement("div");
  Tooltip.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"fill="none"stroke="currentColor"stroke-linecap="round"stroke-linejoin="round"stroke-width="2"class="feather feather-trash-2"viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>`;
  Tooltip.classList.add("dyn-tooltip");
  return Tooltip;
}

function createWidget() {
  const Widget = document.createElement("div");
  Widget.innerHTML = `
<textarea class="dyn-title" name="title">
${document.title || document.location.href.split("/").pop()}
</textarea>
<div class="dyn-widget-bar">
  <button class="dyn-button">Send to Dynalist</button>
  <div class="dyn-highlight-counter">
    <span class="dyn-highlight-number">0</span>
    <div>Highlights</div>
  </div>
</div>
`;

  Widget.classList.add("dyn-widget");
  return Widget;
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

  return {
    mouseX,
    mouseY
  };
}

function addHighlight(e) {
  highlighter.highlightSelection("dyn-highlight");
  highlighter.getHighlightForElement(e.target);
  rangy.getSelection().removeAllRanges();

  document.getElementsByClassName("dyn-highlight-number")[0].innerHTML =
    highlighter.highlights.length;

  if (highlighter.highlights.length > 0) {
    document.getElementsByClassName("dyn-highlight-counter")[0].style.display =
      "flex";
  }
}

function removeHighlight(target) {
  var highlight = highlighter.getHighlightForElement(target);

  if (highlight) {
    highlighter.removeHighlights([highlight]);
    document.getElementsByClassName("dyn-highlight-number")[0].innerHTML =
      highlighter.highlights.length;
    if (highlighter.highlights.length === 0) {
      document.getElementsByClassName(
        "dyn-highlight-counter"
      )[0].style.display = "none";
    }
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
    el.setAttribute("style", `display: block; `);
  }
}

function hideElement(el) {
  el.style.display = "none";
}

async function sendHighlightsToDynalist(key, fileid) {
  const title = document.getElementsByClassName("dyn-title")[0].value.trim();

  document.getElementsByClassName(
    "dyn-widget"
  )[0].innerHTML = `<div class="dyn-widget-container"><!-- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL -->
<svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="#038aff">
    <g fill="none" fill-rule="evenodd" stroke-width="2">
        <circle cx="22" cy="22" r="1">
            <animate attributeName="r"
                begin="0s" dur="1.8s"
                values="1; 20"
                calcMode="spline"
                keyTimes="0; 1"
                keySplines="0.165, 0.84, 0.44, 1"
                repeatCount="indefinite" />
            <animate attributeName="stroke-opacity"
                begin="0s" dur="1.8s"
                values="1; 0"
                calcMode="spline"
                keyTimes="0; 1"
                keySplines="0.3, 0.61, 0.355, 1"
                repeatCount="indefinite" />
        </circle>
        <circle cx="22" cy="22" r="1">
            <animate attributeName="r"
                begin="-0.9s" dur="1.8s"
                values="1; 20"
                calcMode="spline"
                keyTimes="0; 1"
                keySplines="0.165, 0.84, 0.44, 1"
                repeatCount="indefinite" />
            <animate attributeName="stroke-opacity"
                begin="-0.9s" dur="1.8s"
                values="1; 0"
                calcMode="spline"
                keyTimes="0; 1"
                keySplines="0.3, 0.61, 0.355, 1"
                repeatCount="indefinite" />
        </circle>
    </g>
</svg></div>`;

  const turndown = new TurndownService();

  const response = await dynDocument.post("/edit", {
    token: key,
    index: "0",
    file_id: fileid,
    changes: [
      {
        action: "insert",
        parent_id: "root",
        index: 0,
        content: `[${title}](${url})`
      }
    ]
  });
  console.log("TCL: sendHighlightsToDynalist -> response", response);

  for (const highlight of highlighter.highlights) {
    await dynDocument.post("/edit", {
      token: key,
      file_id: fileid,
      changes: [
        {
          action: "insert",
          parent_id: response.data.new_node_ids[0],
          index: -1,
          content: turndown.turndown(highlight.getRange().toHtml())
        }
      ]
    });
  }

  document.getElementsByClassName(
    "dyn-widget"
  )[0].innerHTML = `<div class="dyn-widget-container"><a class="dyn-link" href="https://dynalist.io/d/${fileid}#z=${response.data.new_node_ids[0]}" target="_blank">Open in Dynalist</a></div>`;
}

// ---- Handle Functions ---- //
function handleMouseup(e) {
  const selection = document.getSelection();

  if (Adder.style.display === "block" || selection.isCollapsed) {
    hideElement(Adder);
  } else {
    rangy.getSelection().expand("word", {
      trim: true
    });
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
  console.log("Clicked!");

  chrome.storage.sync.get(["key", "fileid"], function(result) {
    console.log("TCL: handleClick -> result", result);
    const { key, fileid } = result;

    if (!key || !fileid) {
      alert(
        "You need to add your API key to make the connection to Dynalist. Head to the options (Right click on the extension icon) to add the key."
      );
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

  document
    .getElementsByClassName("dyn-button")[0]
    .addEventListener("click", () => handleClick());
}

function removeAllEventListener() {
  document.removeEventListener("mouseup", e => handleMouseup(e));

  document.removeEventListener("mousedown", e => handleMousedown(e));

  Adder.removeEventListener("mousedown", e => addHighlight(e));

  document
    .getElementsByClassName("dyn-button")[0]
    .removeEventListener("click", () => handleClick());
}

// ---- On Message Listener ---- //

function removeElements(classNames) {
  for (let index = 0; index < classNames.length; index++) {
    var element = document.getElementsByClassName(classNames[index])[0];
    element.parentNode.removeChild(element);
  }
}

let active = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("TCL: request", request);

  if (request.msg === "deactivate") {
    sendResponse("Response: Deactivated");
    highlighter.removeAllHighlights();
    removeAllEventListener();
    removeElements(["dyn-adder", "dyn-widget", "dyn-tooltip"]);
  } else if (request.msg === "activate" && active === false) {
    if (document.getElementsByClassName("dyn-adder").length > 0) {
      return;
    }
    sendResponse("Response: Activated");
    document.body.appendChild(Widget);
    document.body.appendChild(Adder);
    document.body.appendChild(Tooltip);
    document.body.appendChild(FeedbackLink);
    addAllEventListener();
    active = true;
  } else {
    sendResponse("Response: Nothing happend.");
  }
});
