import * as React from 'react';
import { StoryContext } from '@storybook/react';
import { MockProvider } from '../src/storybook/provider';
import { FunctionComponent } from 'react';

const withUrql = (Story: FunctionComponent, { parameters: { urqlQuery } }: StoryContext) => (
  <MockProvider value={urqlQuery}>
    <Story />
  </MockProvider>
);

export const decorators = [withUrql];
