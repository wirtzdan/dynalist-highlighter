const axios = require("axios").default;

const dynInbox = axios.create({
  baseURL: "https://dynalist.io/api/v1/inbox/add",
  timeout: 1000
});

const dynFiles = axios.create({
  baseURL: "https://dynalist.io/api/v1/file/list",
  timeout: 1000
});

const dynDocument = axios.create({
  baseURL: "https://dynalist.io/api/v1/doc",
  timeout: 1000
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

// async function

// async function sendHighlightsToDynalist(key, fileid) {
//   const title = document.getElementsByClassName("dyn-title")[0].value.trim();

//   document.getElementsByClassName(
//     "dyn-widget"
//   )[0].innerHTML = `<div class="dyn-widget-container"><!-- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL -->
// <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="#038aff">
//     <g fill="none" fill-rule="evenodd" stroke-width="2">
//         <circle cx="22" cy="22" r="1">
//             <animate attributeName="r"
//                 begin="0s" dur="1.8s"
//                 values="1; 20"
//                 calcMode="spline"
//                 keyTimes="0; 1"
//                 keySplines="0.165, 0.84, 0.44, 1"
//                 repeatCount="indefinite" />
//             <animate attributeName="stroke-opacity"
//                 begin="0s" dur="1.8s"
//                 values="1; 0"
//                 calcMode="spline"
//                 keyTimes="0; 1"
//                 keySplines="0.3, 0.61, 0.355, 1"
//                 repeatCount="indefinite" />
//         </circle>
//         <circle cx="22" cy="22" r="1">
//             <animate attributeName="r"
//                 begin="-0.9s" dur="1.8s"
//                 values="1; 20"
//                 calcMode="spline"
//                 keyTimes="0; 1"
//                 keySplines="0.165, 0.84, 0.44, 1"
//                 repeatCount="indefinite" />
//             <animate attributeName="stroke-opacity"
//                 begin="-0.9s" dur="1.8s"
//                 values="1; 0"
//                 calcMode="spline"
//                 keyTimes="0; 1"
//                 keySplines="0.3, 0.61, 0.355, 1"
//                 repeatCount="indefinite" />
//         </circle>
//     </g>
// </svg></div>`;

//   const turndown = new TurndownService();

//   const response = await dynDocument.post("/edit", {
//     token: key,
//     index: "0",
//     file_id: fileid,
//     changes: [
//       {
//         action: "insert",
//         parent_id: "root",
//         index: 0,
//         content: `[${title}](${url})`
//       }
//     ]
//   });
//   console.log("TCL: sendHighlightsToDynalist -> response", response);

//   for (const highlight of highlighter.highlights) {
//     await dynDocument.post("/edit", {
//       token: key,
//       file_id: fileid,
//       changes: [
//         {
//           action: "insert",
//           parent_id: response.data.new_node_ids[0],
//           index: -1,
//           content: turndown.turndown(highlight.getRange().toHtml())
//         }
//       ]
//     });
//   }

//   document.getElementsByClassName(
//     "dyn-widget"
//   )[0].innerHTML = `<div class="dyn-widget-container"><a class="dyn-link" href="https://dynalist.io/d/${fileid}#z=${response.data.new_node_ids[0]}" target="_blank">Open in Dynalist</a></div>`;
// }
