const axios = require("axios").default;

const title = document.title;
const url = document.URL;

const dynInbox = axios.create({
  baseURL: "https://dynalist.io/api/v1/inbox",
  timeout: 1000
});

const dynDocument = axios.create({
  baseURL: "https://dynalist.io/api/v1/doc",
  timeout: 1000
});

function createSubmitButton() {
  const SubmitButton = document.createElement("div");
  SubmitButton.innerHTML = `Send to Dynalist`;
  SubmitButton.classList.add("dyn-submit-button");
  return SubmitButton;
}

function sendHighlightsToDynalist(key, fileid) {
  const htmlHighlights = document.getElementsByClassName("dyn-highlight");

  const highlights = [];

  for (let highlight of htmlHighlights) {
    highlights.push(highlight.innerText);
  }

  dynInbox
    .post("/add", {
      token: key,
      index: "0",
      content: `[${title}](${url})`
    })
    .then(function(response) {
      for (let i in highlights) {
        dynDocument
          .post("/edit", {
            token: key,
            file_id: fileid,
            changes: [
              {
                action: "insert",
                parent_id: response.data.node_id,
                index: 0,
                content: highlights[i]
              }
            ]
          })
          .then(function(response) {
            console.log("DocumentChange", response);
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}

export { createSubmitButton, sendHighlightsToDynalist };
