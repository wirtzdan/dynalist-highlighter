console.log("Background Script Loaded!");

var on = false;
var firstTime = true;
chrome.browserAction.setIcon({ path: "./icon/icon-off-16.png" });

chrome.browserAction.onClicked.addListener(function() {
  while (firstTime) {
    firstTime = false;
    chrome.tabs.insertCSS({ file: "./static/css/content-script.css" });
    chrome.tabs.executeScript(null, { file: "content-script.js" });
  }

  on = on ? true : false;

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    console.log("Extension clicked. State: " + on);
    if (on) {
      on = false;
      chrome.browserAction.setIcon({ path: "./icon/icon-off-16.png" });

      chrome.tabs.sendMessage(tabs[0].id, { msg: "deactivate" }, function(
        response
      ) {
        console.log(response);
      });
    } else {
      on = true;

      chrome.browserAction.setIcon({ path: "./icon/icon-on-16.png" });
      chrome.tabs.sendMessage(tabs[0].id, { msg: "activate" }, function(
        response
      ) {
        console.log(response);
      });
    }
  });
});
