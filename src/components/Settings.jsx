import React from "react";

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
  SlideIn
} from "@chakra-ui/core";

function Settings({ isOpen, onClose }) {
  const [show, setShow] = React.useState(true);
  const handleClick = () => setShow(!show);

  const initialRef = React.useRef();
  const finalRef = React.useRef();

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
                          color={show ? "blue.500" : "gray.200"}
                        />
                      }
                    />
                    <Input
                      pr="4.5rem"
                      type={show ? "text" : "password"}
                      placeholder="API Key"
                      isDisabled={show ? false : true}
                      variant="filled"
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        variantColor={show ? "blue" : "gray"}
                        size="sm"
                        onClick={handleClick}
                        loadingText="Testing"
                      >
                        {show ? "Save" : "Reset"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl mt={4} d={show ? "none" : "block"}>
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
                <FormControl mt={4} d={show ? "none" : "block"}>
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
