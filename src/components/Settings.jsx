/*global chrome*/
import React, { useState, useEffect } from "react";
import Frame from "react-frame-component";
import { ThemeProvider } from "@chakra-ui/core";
import theme from "../theme";
import { ScopeProvider } from "../scope-provider";
import { FrameProvider } from "../frame-provider";

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
  Alert,
  AlertIcon,
  Flex
} from "@chakra-ui/core";

function Settings({ isOpen, onClose }) {
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [areDetailsVisible, setAreDetailsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    const buttonText = document.getElementById("dyn-api-key-button").innerHTML;
    const key = document.getElementById("dyn-api-key").value;

    if (buttonText === "Save") {
      setIsLoading(true);
      const response = await isKeyValid(key);
      setIsLoading(false);

      if (response) {
        chrome.storage.sync.set({
          key: key
        });

        loadDetails();
      } else {
        setIsAlertVisible(true);
      }
    } else if (buttonText === "Reset") {
      document.getElementById("dyn-api-key").value = "";
      setAreDetailsVisible(false);
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
      console.log("TCL: loadDetails -> result", result);

      if (key) {
        const files = await getFiles(key);
        document.getElementById("dyn-api-key").value = key;
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
      console.log("TCL: restoreOptions -> result", result);

      const files = await getFiles(key);
      document.getElementById("dyn-api-key").value = key;
      updateSelect(files);
      selectOption("dyn-inbox-select", fileid);
      selectOption("dyn-toposition-select", toposition);
      setAreDetailsVisible(true);
      setIsAlertVisible(false);
    });
  }

  function updateSelect(files) {
    let options = "";
    const select = document.getElementById("dyn-inbox-select");

    for (const file of files) {
      const option = `<option value="${file.id}">${file.title}</option>`;
      options = options + option;
    }

    select.innerHTML = options;
  }

  function selectOption(selectid, value) {
    if (value) {
      var select = document.getElementById(selectid);
      const key = `"${value}"`;

      chrome.storage.sync.get(key, function(result) {
        result ? console.log("True") : console.log("false");
        select.value = value;
      });
    } else {
      var select = document.getElementById(selectid);
      select.options[0].selected = true;

      if (selectid === "dyn-inbox-select") {
        chrome.storage.sync.set({
          fileid: select.options[0].value
        });
      } else if (selectid === "dyn-toposition-select") {
        chrome.storage.sync.set({
          fileid: select.options[0].value
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
          <ModalOverlay opacity={styles.opacity} />

          <ScopeProvider scope={"#root .App"}>
            <Frame
              head={[
                <>
                  <link
                    type="text/css"
                    rel="stylesheet"
                    href={chrome.runtime.getURL("/static/css/content.css")}
                  ></link>
                  <link
                    type="text/css"
                    rel="stylesheet"
                    href={chrome.runtime.getURL("/static/css/cssreset.css")}
                  ></link>
                </>
              ]}
            >
              <ThemeProvider theme={theme}>
                <FrameProvider>
                  <ModalContent rounded="lg" {...styles}>
                    <ModalHeader>Settings</ModalHeader>
                    <ModalCloseButton top="16px" right="24px" />
                    <ModalBody pb={6}>
                      <FormControl>
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
                        <Text color="gray.500" fontSize="sm">
                          {" "}
                          You can find your API key on the{" "}
                          <Link
                            href="https://dynalist.io/developer"
                            isExternal
                            color="blue.500"
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
                                  areDetailsVisible ? "gray.200" : "blue.500"
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
                              loadingText="Testing"
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
                        <FormLabel fontWeight="bold">Highlight Inbox</FormLabel>
                        <Text color="gray.500" fontSize="sm">
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
                        <FormLabel fontWeight="bold">
                          Move to position
                        </FormLabel>
                        <Text color="gray.500" fontSize="sm">
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
                    </ModalBody>
                  </ModalContent>
                </FrameProvider>
              </ThemeProvider>
            </Frame>
          </ScopeProvider>
        </Modal>
      )}
    </SlideIn>
  );
}

export default Settings;
