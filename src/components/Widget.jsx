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
  const bgColor = { light: "white", dark: "gray.700" };
  const color = { light: "gray.800", dark: "white" };

  const [success, setSuccess] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setTitle(document.title);
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  let handleTitleChange = e => {
    let value = e.target.value;
    setTitle(value);
  };

  function handleResize(e) {
    const textarea = e.target;
    textarea.style.height = "";
    textarea.style.height = textarea.scrollHeight + "px";
  }

  async function handleClick() {
    if (success) {
      window.open(url, "_blank");
    } else {
      setIsLoading(true);
      const { fileid, nodeid } = await sendToDynalist(highlighter.highlights);
      setUrl(`https://dynalist.io/d/${fileid}#z=${nodeid}`);
      setIsLoading(false);
      setSuccess(true);
    }
  }

  return (
    <>
      <Settings isOpen={isOpen} onClose={onClose} />
      <Box
        w={280}
        borderWidth="1px"
        rounded="lg"
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
          isDisabled={success}
          onInput={e => handleResize(e)}
          pt={0}
          fontWeight="600"
          textDecoration="underline"
          id="dyn-title"
          color={color[colorMode]}
        />
        <Flex justify="space-between">
          <Button
            variantColor={success ? "green" : "blue"}
            rightIcon={success ? "external-link" : ""}
            size="sm"
            loadingText="Saving"
            isLoading={isLoading}
            onClick={handleClick}
            id="dyn-save-button"
          >
            {success ? "Open in Dynalist" : "Save Bookmark"}
          </Button>

          <Flex>
            <IconButton
              icon="settings"
              variant="ghost"
              variantColor="gray"
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
