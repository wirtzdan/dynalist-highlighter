import "../src/styles/style.css";
import {
  createSubmitButton,
  sendHighlightsToDynalist
} from "../src/components/submit";
import {
  createTooltip,
  showTooltip,
  hideTooltip
} from "../src/components/tooltip";
import {
  createHighlightInstance,
  highlightText
} from "../src/components/highlight";

import "../src/styles/style.css";

// ---- Helper functions ---- //

function mountComponent(component) {
  document.body.appendChild(component);
}

// ––––– Simple state –––– //

let isTooltipVisible = false;

// ––––– Mount components –––– //

const Tooltip = createTooltip();
mountComponent(Tooltip);
Tooltip.addEventListener("mousedown", e => {
  handleClick(e);
});

const SubmitButton = createSubmitButton();
mountComponent(SubmitButton);
SubmitButton.addEventListener("click", e => {
  chrome.storage.sync.get(["key", "fileid"], function(result) {
    sendHighlightsToDynalist(result.key, result.fileid);
  });
});

// –––– Add event listner –––– //

document.addEventListener("mouseup", e => {
  const selection = document.getSelection();
  if (isTooltipVisible || selection.isCollapsed) {
    hideTooltip();
    isTooltipVisible = false;
  } else {
    showTooltip(e);
    isTooltipVisible = true;
  }
});

document.addEventListener("mousedown", e => {
  if (isTooltipVisible) {
    hideTooltip();
    isTooltipVisible = false;
  }
});

// ---- Handle functions ---- //

function handleClick(e) {
  const selection = document.getSelection();
  const highlightElement = createHighlightInstance();
  highlightText({ selection, highlightElement });
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
}
