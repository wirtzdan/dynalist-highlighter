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

  if (length > 0) {
    document
      .getElementById("dyn-widget")
      .contentWindow.document.getElementById(
        "dyn-save-button"
      ).innerHTML = `Save ${length} Highlights`;
  } else {
    document
      .getElementById("dyn-widget")
      .contentWindow.document.getElementById(
        "dyn-save-button"
      ).innerHTML = `Save Bookmark`;
  }

  if (highlighter.highlights.length > 0) {
    document.getElementsByClassName("dyn-save-button")[0].style.display =
      "flex";
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
    console.log("Clicked on a highlight");
    removeHighlight(e);
  } else {
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
