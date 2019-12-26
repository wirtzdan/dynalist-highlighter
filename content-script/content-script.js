console.log("Dynalist Annotator Loaded");
import "../src/styles/style.css";
import MarkerSVG from "../src/assets/marker.svg";

const Tooltip = document.createElement("div");
Tooltip.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.37 16.51"><path d="M12.87 16.51a.5.5 0 01-.5-.5v-2.26L9.84 11.2a1 1 0 01-.3-.73V8.79L4 8.76v1.57a1 1 0 01-.3.73L1 13.73V16a.5.5 0 01-.5.5.5.5 0 01-.5-.5v-2.25A1 1 0 01.3 13L3 10.35V8.79a1 1 0 011-1h5.5a1 1 0 011 1v1.68L13.07 13a1 1 0 01.3.73V16a.5.5 0 01-.5.51z" fill="#4e4d4d"/><path d="M10 6H3.48V3a.46.46 0 01.28-.43L9.2.05a.6.6 0 01.8.54z" fill="#3f7dc0"/></svg>`;
Tooltip.classList.add("dyn-tooltip");
Tooltip.addEventListener("mousedown", handleClick)
document.body.appendChild(Tooltip;

const SubmitButton = document.createElement("button");
SubmitButton.innerHTML = `Send to Dynalist`;
SubmitButton.classList.add("dyn-send-button");
SubmitButton.addEventListener("click", SendHighlights)
document.body.appendChild(SubmitButton);

function createHighlightElement() {
  const span = document.createElement("span");
  span.classList.add("dyn-highlight");
  span.addEventListener("click", () => alert("Clicked"));
  return span;
}

function highlightText({ selection, highlightElement }) {
  const range = selection.getRangeAt(0).cloneRange();

  range.surroundContents(highlightElement);
  selection.removeAllRanges();
  selection.addRange(range);
}

function handleClick(e) {
  const selection = document.getSelection();
  const highlightElement = createHighlightElement();
  highlightText({ selection, highlightElement });
}

function showHighlighter({ mouseX, mouseY }) {
  const element = document.getElementsByClassName("dyn-tooltip");
  element[0].setAttribute(
    "style",
    `display:block; top: ${mouseY + 5}px; left: ${mouseX + 5}px;`
  );
}

function hideHighlighter() {
  const element = document.getElementsByClassName("dyn-tooltip");
    element[0].setAttribute("style",`display:none;`);
}

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

document.addEventListener("mouseup", e => {
  const { mouseX, mouseY } = getMousePosition(e);
  showHighlighter({ mouseX, mouseY});
});

function SendHighlights() {
  const htmlHighlights = document.getElementsByClassName("dyn-highlight");

  const highlights = []
  
  for (let highlight of htmlHighlights) {
    highlights.push(highlight.innerText)
  }
}

// Make a general handleFunction that gets a callback and a event



