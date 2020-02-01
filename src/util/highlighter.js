import rangy from "rangy";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-highlighter";
import "rangy/lib/rangy-textrange";
import "rangy/lib/rangy-serializer";

rangy.init();

export const highlighter = rangy.createHighlighter();
highlighter.addClassApplier(rangy.createClassApplier("dyn-highlight"));

function addHighlight(e) {
  highlighter.highlightSelection("dyn-highlight");
  highlighter.getHighlightForElement(e.target);
  rangy.getSelection().removeAllRanges();
  updateButtonText();
}

function updateButtonText() {
  const highlights = highlighter.highlights;
  const length = highlights.length;
  const saveButton = document
    .getElementById("dyn-widget")
    .contentWindow.document.getElementById("dyn-save-button");

  // if (length > 0) {
  //   if (length === 1) {
  //     saveButton.innerText = `Save ${length} Highlight`;
  //   } else {
  //     saveButton.innerText = `Save ${length} Highlights`;
  //   }
  // } else {
  //   saveButton.innerText = `Save Bookmark`;
  // }
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

function addAllEventListener() {
  document.addEventListener("mouseup", e => handleMouseup(e));
}

addAllEventListener();
