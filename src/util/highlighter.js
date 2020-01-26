import rangy from "rangy";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-highlighter";
import "rangy/lib/rangy-textrange";
import "rangy/lib/rangy-serializer";

rangy.init();

const highlighter = rangy.createHighlighter();
highlighter.addClassApplier(rangy.createClassApplier("dyn-highlight"));

function addHighlight(e) {
  highlighter.highlightSelection("dyn-highlight");
  highlighter.getHighlightForElement(e.target);
  rangy.getSelection().removeAllRanges();

  //   document.getElementsByClassName("dyn-highlight-number")[0].innerHTML =
  //     highlighter.highlights.length;

  //   if (highlighter.highlights.length > 0) {
  //     document.getElementsByClassName("dyn-highlight-counter")[0].style.display =
  //       "flex";
  //   }
}

function removeHighlight(e) {
  const target = e.target;
  var highlight = highlighter.getHighlightForElement(target);

  if (highlight) {
    highlighter.removeHighlights([highlight]);
    // document.getElementsByClassName("dyn-highlight-number")[0].innerHTML =
    //   highlighter.highlights.length;
    // if (highlighter.highlights.length === 0) {
    //   document.getElementsByClassName(
    //     "dyn-highlight-counter"
    //   )[0].style.display = "none";
    // }
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

  //   document.addEventListener("mousedown", e => handleMousedown(e));

  //   document.addEventListener("mousedown", e => addHighlight(e));

  //   document
  //     .getElementsByClassName("dyn-button")[0]
  //     .addEventListener("click", () => handleClick());
}

addAllEventListener();
