import React from "react";
import { theme } from "@chakra-ui/core";

const customIcons = {
  feedback: {
    path: (
      <g fill="currentColor" stroke="currentColor">
        <path d="M22 1h-7a2.44 2.44 0 00-2.41 2l-.92 5.05a2.44 2.44 0 00.53 2 2.47 2.47 0 001.88.88H17l-.25.66a3.26 3.26 0 003 4.41 1 1 0 00.92-.59l2.24-5.06A1 1 0 0023 10V2a1 1 0 00-1-1zm-1 8.73l-1.83 4.13a1.33 1.33 0 01-.45-.4 1.23 1.23 0 01-.14-1.16l.38-1a1.68 1.68 0 00-.2-1.58A1.7 1.7 0 0017.35 9h-3.29a.46.46 0 01-.35-.16.5.5 0 01-.09-.37l.92-5A.44.44 0 0115 3h6zM9.94 13.05H7.05l.25-.66A3.26 3.26 0 004.25 8a1 1 0 00-.92.59l-2.24 5.06a1 1 0 00-.09.4v8a1 1 0 001 1h7a2.44 2.44 0 002.41-2l.92-5a2.44 2.44 0 00-.53-2 2.47 2.47 0 00-1.86-1zm-.48 7.58A.44.44 0 019 21H3v-6.73l1.83-4.13a1.33 1.33 0 01.45.4 1.23 1.23 0 01.14 1.16l-.38 1a1.68 1.68 0 00.2 1.58 1.7 1.7 0 001.41.74h3.29a.46.46 0 01.35.16.5.5 0 01.09.37z" />
      </g>
    )
  },
  key: {
    path: (
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
      </g>
    )
  },
  help: {
    path: (
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
      </g>
    )
  },
  undo: {
    path: (
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <path d="M1 4v6h6" />
        <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
      </g>
    )
  },
  inbox: {
    path: (
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <path d="M22 12h-6l-2 3h-4l-2-3H2" />
        <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
      </g>
    )
  },
  settings: {
    path: (
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
      </g>
    )
  },
  end: {
    path: (
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <path d="M15 10l5 5-5 5" />
        <path d="M4 4v7a4 4 0 004 4h12" />
      </g>
    )
  },
  start: {
    path: (
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <path d="M15 14l5-5-5-5" />
        <path d="M4 20v-7a4 4 0 014-4h12" />
      </g>
    )
  }
};

export default {
  ...theme,
  icons: {
    ...theme.icons,
    ...customIcons
  }
};
