import * as React from "react";
import { StoryContext } from "@storybook/react";
import { ThemeProvider } from "@mui/material";
import { MockProvider } from "../src/storybook/provider";
import { FunctionComponent } from "react";

const withMuiTheme = (Story: FunctionComponent) => (
  <ThemeProvider theme={{}}>
    <Story />
  </ThemeProvider>
);

const withUrql = (
  Story: FunctionComponent,
  { parameters: { urqlQuery } }: StoryContext
) => (
  <MockProvider value={urqlQuery}>
    <Story />
  </MockProvider>
);

export const decorators = [withMuiTheme, withUrql];
