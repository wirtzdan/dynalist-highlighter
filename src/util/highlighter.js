import rangy from "rangy";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-highlighter";
import "rangy/lib/rangy-textrange";
import "rangy/lib/rangy-serializer";

rangy.init();

const highlighter = rangy.createHighlighter();
highlighter.addClassApplier(rangy.createClassApplier("dyn-highlight"));

export { highlighter, rangy };
