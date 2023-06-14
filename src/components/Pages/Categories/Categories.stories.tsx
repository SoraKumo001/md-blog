import { Categories } from '.'
import { Decorator } from '@/storybook'
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Categories> = {
  component: Categories,
  decorators: [Decorator],
  parameters: {},
  args: {},
};
export default meta;


export const Primary: StoryObj<typeof Categories> = {
//  args:{},
//  play: async ({ canvasElement }) => {},
};
