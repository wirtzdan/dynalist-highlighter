/*global chrome*/
import TurndownService from "turndown";
const axios = require("axios").default;

const dynInbox = axios.create({
  baseURL: "https://dynalist.io/api/v1/inbox/add",
  timeout: 2000
});

const dynFiles = axios.create({
  baseURL: "https://dynalist.io/api/v1/file/list",
  timeout: 2000
});

const dynDocument = axios.create({
  baseURL: "https://dynalist.io/api/v1/doc",
  timeout: 2000
});

export async function isKeyValid(key) {
  const response = await dynFiles.post("", {
    token: key
  });

  if (response.data._code === "Ok") {
    return true;
  } else {
    return false;
  }
}

export async function getFiles(key) {
  const response = await dynFiles.post("", {
    token: key
  });

  return response.data.files;
}

export async function sendToDynalist(highlights) {
  const title = document
    .getElementById("dyn-widget")
    .contentWindow.document.getElementById("dyn-title")
    .value.trim();
  const url = document.URL;

  const turndown = new TurndownService({
    emDelimiter: "__"
  });

  turndown.remove("hr");

  turndown.addRule("code", {
    filter: "pre",
    replacement: function(content) {
      return "```" + content + "```";
    }
  });

  turndown.addRule("bullets", {
    filter: "li",
    replacement: function(content) {
      return "" + content + "\n\n";
    }
  });

  const { key, fileid, toposition } = await new Promise((res, rej) => {
    chrome.storage.sync.get(["key", "fileid", "toposition"], result =>
      res(result)
    );
  });

  const response = await dynDocument.post("/edit", {
    token: key,
    file_id: fileid,
    changes: [
      {
        action: "insert",
        parent_id: "root",
        index: toposition,
        content: `[${title}](${url})`
      }
    ]
  });

  for (const highlight of highlights) {
    await dynDocument.post("/edit", {
      token: key,
      file_id: fileid,
      changes: [
        {
          action: "insert",
          parent_id: response.data.new_node_ids[0],
          index: -1,
          content: turndown.turndown(highlight.getRange().toHtml())
        }
      ]
    });
  }

  const nodeid = response.data.new_node_ids[0];

  return { fileid, nodeid };
}
