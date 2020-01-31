import React from "react";
import { ThemeProvider, ColorModeProvider } from "@chakra-ui/core";
import theme from "../theme";

export function ChakraProvider({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ThemeProvider>
  );
}
