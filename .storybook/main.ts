import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/**/stories.@(js|jsx|ts|tsx)",
  ],
  framework: "@storybook/nextjs",
  staticDirs: ["../public"],
  features: {
    backgrounds: false,
  },
};
export default config;
