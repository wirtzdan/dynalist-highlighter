/*global chrome*/
import React, { useState, useEffect } from "react";
import { sendToDynalist } from "../util/api";
import { highlighter } from "../util/highlighter";

import Settings from "./Settings";

import {
  Textarea,
  Box,
  Button,
  Flex,
  IconButton,
  useDisclosure,
  useColorMode
} from "@chakra-ui/core";

function Widget() {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { colorMode } = useColorMode();
  const bgColor = { light: "white", dark: "gray.900" };
  const borderColor = { light: "gray.200", dark: "gray.700" };
  const color = { light: "gray.800", dark: "white" };

  const [widgetState, setWidgetState] = useState("setup");
  const [url, setUrl] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setTitle(document.title);

    chrome.storage.sync.get(["key"], function(result) {
      const { key } = result;

      if (key) {
        setWidgetState("active");
        resizeTextareaToContent();
      } else {
        onOpen();
        resizeTextareaToContent();
      }
    });
  }, []);

  let handleTitleChange = e => {
    let value = e.target.value;
    setTitle(value);
  };

  function resizeTextareaToContent() {
    const textarea = document
      .getElementById("dyn-widget")
      .contentWindow.document.getElementById("dyn-title");
    textarea.style.height = "";
    textarea.style.height = textarea.scrollHeight + "px";
  }

  async function handleClick() {
    if (widgetState === "success") {
      window.open(url, "_blank");
    } else {
      setIsLoading(true);
      const { fileid, nodeid } = await sendToDynalist(highlighter.highlights);
      setUrl(`https://dynalist.io/d/${fileid}#z=${nodeid}`);
      setIsLoading(false);
      setWidgetState("success");
    }
  }

  return (
    <>
      <Settings
        isOpen={isOpen}
        onClose={onClose}
        setWidgetState={setWidgetState}
      />
      <Box
        w={300}
        borderWidth="1px"
        borderColor={borderColor[colorMode]}
        rounded="lg"
        roundedBottomRight={2}
        p="3"
        pos="fixed"
        right="3"
        bottom="3"
        boxShadow="md"
        bg={bgColor[colorMode]}
        zIndex={9999}
      >
        <Textarea
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
          resize="none"
          variant="unstyled"
          height="auto"
          minH={2}
          isDisabled={
            widgetState === "setup" || widgetState === "success" ? true : false
          }
          opacity={widgetState === "setup" ? "50%" : ""}
          onInput={resizeTextareaToContent}
          pt={0}
          fontWeight="600"
          lineHeight="1.2"
          id="dyn-title"
          color={color[colorMode]}
        />
        <Flex justify="space-between">
          <Button
            variantColor={widgetState === "success" ? "green" : "blue"}
            rightIcon={widgetState === "success" ? "external-link" : ""}
            size="sm"
            loadingText="Saving"
            isLoading={isLoading}
            onClick={handleClick}
            id="dyn-save-button"
            isDisabled={widgetState === "setup" ? true : false}
          >
            {widgetState === "success" ? "Open in Dynalist" : "Save Bookmark"}
          </Button>

          <Flex>
            <IconButton
              icon="settings"
              variant={widgetState === "setup" ? "solid" : "ghost"}
              variantColor={widgetState === "setup" ? "teal" : "gray"}
              size="sm"
              onClick={onOpen}
            ></IconButton>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default Widget;
