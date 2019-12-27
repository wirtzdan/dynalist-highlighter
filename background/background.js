console.log("I am from background script!!");

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.insertCSS({ file: "./static/css/content-script.css" });
  chrome.tabs.executeScript(null, { file: "content-script.js" });
});
