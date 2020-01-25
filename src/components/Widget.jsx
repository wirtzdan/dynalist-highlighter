/*global chrome*/
import React, { useState, useEffect } from "react";
import { sendToDynalist } from "../util/api";

import Settings from "./Settings";

import {
  Textarea,
  Box,
  Button,
  Flex,
  IconButton,
  useDisclosure
} from "@chakra-ui/core";

function Widget() {
  const [buttonText, setButtonText] = useState("Save Bookmark");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTitle(document.title);
    console.log(title);
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
    setIsLoading(true);
    const response = await sendToDynalist();
    setIsLoading(false);
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
        bg="white"
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
          onInput={e => handleResize(e)}
          pt={0}
          fontWeight="600"
          textDecoration="underline"
          id="dyn-title"
        />
        <Flex justify="space-between">
          <Button
            variantColor="blue"
            size="sm"
            loadingText="Saving"
            isLoading={isLoading}
            onClick={handleClick}
          >
            {buttonText}
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
