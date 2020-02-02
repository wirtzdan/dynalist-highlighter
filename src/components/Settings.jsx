/*global chrome*/
import React, { useState, useEffect } from "react";
import Frame from "react-frame-component";
import { ScopeProvider } from "../util/scope-provider";
import { FrameProvider } from "../util/frame-provider";
import { ChakraProvider } from "../util/chakra-provider";
import DanielAvatar from "../daniel-avatar.jpg";

import { isKeyValid, getFiles } from "../util/api";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  Button,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  FormControl,
  FormLabel,
  Select,
  Icon,
  Link,
  Text,
  SlideIn,
  IconButton,
  Alert,
  AlertIcon,
  Flex,
  Divider,
  useColorMode,
  CSSReset,
  Avatar
} from "@chakra-ui/core";

function Settings({ isOpen, onClose, setWidgetState }) {
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [areDetailsVisible, setAreDetailsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();

  const color = { light: "gray.800", dark: "white" };
  const descColor = { light: "gray.500", dark: "gray.400" };
  const footerColor = { light: "gray.400", dark: "gray.600" };
  const keyColor = { light: "gray.300", dark: "gray.500" };
  const primaryColor = { light: "blue.500", dark: "blue.300" };
  const bgColor = { light: "white", dark: "gray.900" };

  const initialRef = React.useRef();
  const finalRef = React.useRef();

  useEffect(() => {
    if (isOpen) {
      chrome.storage.sync.get(["key"], function(result) {
        const { key } = result;

        if (key) {
          restoreOptions();
        }
      });
    }
  }, [isOpen]);

  async function handleClick() {
    const buttonText = document
      .getElementById("dyn-settings")
      .contentWindow.document.getElementById("dyn-api-key-button").innerHTML;
    const key = document
      .getElementById("dyn-settings")
      .contentWindow.document.getElementById("dyn-api-key").value;

    if (buttonText === "Save") {
      setIsLoading(true);
      const response = await isKeyValid(key);
      setIsLoading(false);

      if (response) {
        chrome.storage.sync.set({
          key: key
        });

        loadDetails();
        setWidgetState("active");
      } else {
        setIsAlertVisible(true);
      }
    } else if (buttonText === "Reset") {
      document
        .getElementById("dyn-settings")
        .contentWindow.document.getElementById("dyn-api-key").value = "";
      setAreDetailsVisible(false);
      chrome.storage.sync.clear(() => {
        setWidgetState("setup");
      });
    }
  }

  function handleSelect(e) {
    const el = e.target;

    if (el.id === "dyn-inbox-select") {
      chrome.storage.sync.set({
        fileid: el.value
      });
    } else if (el.id === "dyn-toposition-select") {
      chrome.storage.sync.set({
        toposition: el.value
      });
    }
  }

  function loadDetails() {
    chrome.storage.sync.get(["key"], async function(result) {
      const { key } = result;

      if (key) {
        const files = await getFiles(key);
        document
          .getElementById("dyn-settings")
          .contentWindow.document.getElementById("dyn-api-key").value = key;
        updateSelect(files);
        selectOption("dyn-inbox-select");
        selectOption("dyn-toposition-select");
        setAreDetailsVisible(true);
        setIsAlertVisible(false);
      }
    });
  }

  function restoreOptions() {
    chrome.storage.sync.get(["key", "fileid", "toposition"], async function(
      result
    ) {
      const { key, fileid, toposition } = result;

      const files = await getFiles(key);
      document
        .getElementById("dyn-settings")
        .contentWindow.document.getElementById("dyn-api-key").value = key;
      updateSelect(files);
      selectOption("dyn-inbox-select", fileid);
      selectOption("dyn-toposition-select", toposition);
      setAreDetailsVisible(true);
      setIsAlertVisible(false);
    });
  }

  function updateSelect(files) {
    let options = "";
    const select = document
      .getElementById("dyn-settings")
      .contentWindow.document.getElementById("dyn-inbox-select");

    for (const file of files) {
      const option = `<option value="${file.id}">${file.title}</option>`;
      options = options + option;
    }

    select.innerHTML = options;
  }

  function selectOption(selectid, value) {
    if (value) {
      var select = document
        .getElementById("dyn-settings")
        .contentWindow.document.getElementById(selectid);
      const key = `"${value}"`;

      chrome.storage.sync.get(key, function(result) {
        select.value = value;
      });
    } else {
      var select = document
        .getElementById("dyn-settings")
        .contentWindow.document.getElementById(selectid);
      select.options[0].selected = true;

      if (selectid === "dyn-inbox-select") {
        chrome.storage.sync.set({
          fileid: select.options[0].value
        });
      } else if (selectid === "dyn-toposition-select") {
        chrome.storage.sync.set({
          toposition: select.options[0].value
        });
      }
    }
  }

  return (
    <SlideIn in={isOpen}>
      {styles => (
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
          isCentered
        >
          <ScopeProvider scope={"#root .App"}>
            <Frame
              head={[
                <>
                  <link
                    type="text/css"
                    rel="stylesheet"
                    href={chrome.runtime.getURL("/static/css/content.css")}
                  ></link>
                </>
              ]}
              id="dyn-settings"
            >
              <ChakraProvider>
                <CSSReset />
                <FrameProvider>
                  <ModalOverlay opacity={styles.opacity} />
                  <ModalContent
                    rounded="lg"
                    bg={bgColor[colorMode]}
                    {...styles}
                  >
                    <ModalHeader color={color[colorMode]}>Settings</ModalHeader>
                    <ModalCloseButton
                      top="16px"
                      right="24px"
                      color={color[colorMode]}
                    />
                    <ModalBody pb={6}>
                      <FormControl color={color[colorMode]}>
                        <FormLabel fontWeight="bold">
                          <Flex align="center">
                            <Icon
                              mr={2}
                              name="check-circle"
                              size="16px"
                              color="green.500"
                              d={areDetailsVisible ? "block" : "none"}
                            />
                            <Text>API Key</Text>
                          </Flex>
                        </FormLabel>
                        <Text color={descColor[colorMode]} fontSize="sm">
                          {" "}
                          You can find your API key on the{" "}
                          <Link
                            href="https://dynalist.io/developer"
                            isExternal
                            color={primaryColor[colorMode]}
                          >
                            Developer Page
                          </Link>
                          .
                        </Text>
                        <InputGroup size="md" mt={2}>
                          <InputLeftElement
                            children={
                              <Icon
                                name="key"
                                color={
                                  areDetailsVisible
                                    ? keyColor[colorMode]
                                    : primaryColor[colorMode]
                                }
                              />
                            }
                          />
                          <Input
                            id="dyn-api-key"
                            pr="4.5rem"
                            type={areDetailsVisible ? "password" : "text"}
                            placeholder="API Key"
                            isDisabled={areDetailsVisible ? true : false}
                            variant="filled"
                          />
                          <InputRightElement width="4.5rem">
                            <Button
                              id="dyn-api-key-button"
                              h="1.75rem"
                              variantColor={areDetailsVisible ? "gray" : "blue"}
                              size="sm"
                              onClick={handleClick}
                              isLoading={isLoading}
                            >
                              {areDetailsVisible ? "Reset" : "Save"}
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                        <Alert
                          status="error"
                          variant="subtle"
                          rounded="md"
                          mt={2}
                          lineHeight="shorter"
                          d={isAlertVisible ? "block" : "none"}
                        >
                          <AlertIcon />
                          There was an error. Verify your API Key.
                        </Alert>
                      </FormControl>
                      <FormControl
                        mt={4}
                        d={areDetailsVisible ? "block" : "none"}
                      >
                        <FormLabel fontWeight="bold" color={color[colorMode]}>
                          Highlight Inbox
                        </FormLabel>
                        <Text color={descColor[colorMode]} fontSize="sm">
                          Highlights are send to one of your choosen files.
                        </Text>
                        <Select
                          id="dyn-inbox-select"
                          placeholder="Select a file"
                          mt={2}
                          onChange={e => handleSelect(e)}
                        >
                          <option value="option1">File 1</option>
                        </Select>
                      </FormControl>
                      <FormControl
                        mt={4}
                        d={areDetailsVisible ? "block" : "none"}
                      >
                        <FormLabel fontWeight="bold" color={color[colorMode]}>
                          Move to position
                        </FormLabel>
                        <Text color={descColor[colorMode]} fontSize="sm">
                          Add the highlight bookmark to the end or to the start
                        </Text>
                        <Select
                          id="dyn-toposition-select"
                          mt={2}
                          onChange={e => handleSelect(e)}
                        >
                          <option value="0">Start</option>
                          <option value="-1">End</option>
                        </Select>
                      </FormControl>
                      <Divider my={4} />
                      <Flex justify="space-between" align="center">
                        <Link
                          href="https://twitter.com/wirtzdan"
                          isExternal
                          _hover={{ textDecoration: "none" }}
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            color={footerColor[colorMode]}
                            fontWeight="normal"
                          >
                            <Avatar
                              size="2xs"
                              name="Daniel Wirtz"
                              src="http://bit.ly/daniel-avatar"
                              mr={2}
                            />
                            @wirtzdan
                          </Button>
                        </Link>
                        <Link
                          href="mailto:danielwirtzx@gmail.com"
                          isExternal
                          _hover={{ textDecoration: "none" }}
                        >
                          <Button
                            leftIcon="feedback"
                            size="sm"
                            variant="ghost"
                            color={footerColor[colorMode]}
                            fontWeight="normal"
                          >
                            Feedback
                          </Button>
                        </Link>
                        <Button
                          leftIcon={colorMode === "light" ? "moon" : "sun"}
                          size="sm"
                          onClick={toggleColorMode}
                          variant="ghost"
                          color={footerColor[colorMode]}
                          fontWeight="normal"
                        >
                          {colorMode === "light" ? "Dark Mode" : "Light Mode"}
                        </Button>
                      </Flex>
                    </ModalBody>
                  </ModalContent>
                </FrameProvider>
              </ChakraProvider>
            </Frame>
          </ScopeProvider>
        </Modal>
      )}
    </SlideIn>
  );
}

export default Settings;
