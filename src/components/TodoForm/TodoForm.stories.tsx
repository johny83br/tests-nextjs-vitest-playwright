import type { Meta, StoryObj } from "@storybook/nextjs";
import { TodoForm } from ".";
import { todoActionStoryMock } from "@/core/__tests__/mocks/todo-action-story";

const meta = {
  title: "Components/Forms/Todo",
  component: TodoForm,
  decorators: [
    (Story) => (
      <div className="p-12 w-100 flex-auto">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    action: {
      control: false,
    },
  },
} satisfies Meta<typeof TodoForm>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    action: todoActionStoryMock.create.success,
  },
} satisfies Story;

export const WithError = {
  args: {
    action: todoActionStoryMock.create.error,
  },
} satisfies Story;
