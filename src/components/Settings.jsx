import React, { useState } from "react";
import isKeyValid from "../util/api";

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
  AlertIcon
} from "@chakra-ui/core";

function Settings({ isOpen, onClose }) {
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [areDetailsVisible, setAreDetailsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialRef = React.useRef();
  const finalRef = React.useRef();

  async function handleKeySave() {
    const value = document.getElementById("dyn-api-key").value;

    setIsLoading(true);
    const response = await isKeyValid(value);
    setIsLoading(false);

    if (response) {
      setAreDetailsVisible(true);
      setIsAlertVisible(false);
    } else {
      setIsAlertVisible(true);
    }
  }

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
                  <FormLabel fontWeight="bold">API Key</FormLabel>
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
                        h="1.75rem"
                        variantColor={areDetailsVisible ? "gray" : "blue"}
                        size="sm"
                        onClick={handleKeySave}
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
                    We could'nt connect to Dynalist. Check the key and try
                    again.
                  </Alert>
                </FormControl>

                <FormControl mt={4} d={areDetailsVisible ? "block" : "none"}>
                  <FormLabel fontWeight="bold">Highlight Inbox</FormLabel>
                  <Text color="gray.500" fontSize="sm">
                    Highlights are send to one of your choosen files.
                  </Text>
                  <Select placeholder="Select a file" mt={2}>
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
