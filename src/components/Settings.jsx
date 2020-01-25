/*global chrome*/
import React, { useState } from "react";
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

  async function handleClick() {
    const buttonText = document.getElementById("dyn-api-key-button").innerHTML;
    const key = document.getElementById("dyn-api-key").value;

    if (buttonText === "Save") {
      setIsLoading(true);
      const response = await isKeyValid(key);
      setIsLoading(false);

      if (response) {
        chrome.storage.sync.set(
          {
            key: key
          },
          function() {
            console.log("Success");
          }
        );

        loadDetails();
      } else {
        setIsAlertVisible(true);
      }
    } else if (buttonText === "Reset") {
      document.getElementById("dyn-api-key").value = "";
      setAreDetailsVisible(false);
    }
  }

  function loadDetails() {
    chrome.storage.sync.get(["key", "files", "fileid"], async function(result) {
      console.log("TCL: functionrestore_options -> Google Storage:", result);
      const { key } = result;

      if (key) {
        const files = await getFiles(key);
        console.log("TCL: loadDetails -> files", files);
        updateSelect(files);
        const fileid = "hc5cMje-Z4IErKf6xOO_hGz3";
        selectOption(fileid);

        setAreDetailsVisible(true);
        setIsAlertVisible(false);
      }
    });
  }

  function updateSelect(files) {
    console.log("TCL: updateSelect -> files", files);

    let options = "";
    const select = document.getElementById("dyn-files-select");

    for (const file of files) {
      const option = `<option value="${file.id}">${file.title}</option>`;
      options = options + option;
    }

    select.innerHTML = options;
  }

  function selectOption(fileid) {
    var select = document.getElementById("dyn-files-select");
    select.value = fileid;
  }

  /* async function getFiles(key) {
    chrome.storage.sync.set({
      files: body.files
    });

    updateSelect(body.files);
  } */

  return (
    <>
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
            <ModalContent rounded="lg" {...styles}>
              <ModalHeader>Settings</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel fontWeight="bold">
                    <Flex align="center">
                      <Icon
                        mr={2}
                        name="check-circle"
                        size="18px"
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
                          color={areDetailsVisible ? "gray.200" : "blue.500"}
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

                <FormControl mt={4} d={areDetailsVisible ? "block" : "none"}>
                  <FormLabel fontWeight="bold">Highlight Inbox</FormLabel>
                  <Text color="gray.500" fontSize="sm">
                    Highlights are send to one of your choosen files.
                  </Text>
                  <Select
                    id="dyn-files-select"
                    placeholder="Select a file"
                    mt={2}
                  >
                    <option value="option1">File 1</option>
                    <option value="option2">File 2</option>
                    <option value="option3">File 3</option>
                  </Select>
                </FormControl>
                <FormControl mt={4} d={areDetailsVisible ? "block" : "none"}>
                  <FormLabel fontWeight="bold">Move to position</FormLabel>
                  <Text color="gray.500" fontSize="sm">
                    Add the highlight bookmark to the end or to the start
                  </Text>
                  <Select mt={2}>
                    <option value="option1">Start</option>
                    <option value="option2">End</option>
                  </Select>
                </FormControl>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </SlideIn>
    </>
  );
}

export default Settings;
