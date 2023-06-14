import React from 'react';
import { Decorator } from '@/storybook';
import { ContentMarkdown } from '.';

const StoryInfo = {
  title: 'Components/Contents/ContentMarkdown',
  decorators: [Decorator],
  component: ContentMarkdown,
};
export default StoryInfo;

export const Primary = (args: Parameters<typeof ContentMarkdown>[0]) => {
  return (
    <>
      <ContentMarkdown {...args}>Test</ContentMarkdown>
    </>
  );
};
Primary.args = {} as Parameters<typeof ContentMarkdown>[0];

Primary.parameters = {};
