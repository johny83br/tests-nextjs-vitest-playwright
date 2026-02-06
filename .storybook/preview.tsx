import type { Preview } from "@storybook/react";

import "../src/app/globals.css";
import "./storybook.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className="flex justify-center items-center h-11/12">
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: {
      values: [
        // { name: 'dark', value: '#000000' },
        { name: "light", value: "ffffff" },
      ],
      default: "light",
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
