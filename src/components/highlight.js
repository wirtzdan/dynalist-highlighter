function createHighlightInstance() {
  const Highlight = document.createElement("span");
  Highlight.classList.add("dyn-highlight");
  return Highlight;
}

function highlightText({ selection, highlightElement }) {
  const range = selection.getRangeAt(0).cloneRange();
  range.surroundContents(highlightElement);
  selection.removeAllRanges();
  selection.addRange(range);
}

export { createHighlightInstance, highlightText };
