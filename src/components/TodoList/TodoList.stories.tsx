import { mockTodos } from "@/core/__tests__/mocks/todos";
import { TodoList } from ".";
import { todoActionStoryMock } from "@/core/__tests__/mocks/todo-action-story";
import { Meta, StoryObj } from "@storybook/nextjs";

const meta: Meta<typeof TodoList> = {
  title: "Components/Lists/TodoList",
  component: TodoList,
  decorators: [
    (Story) => (
      <div className="w-100 p-12 mx-auto flex-auto">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    todos: { control: false },
    action: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof TodoList>;

export const Default: Story = {
  args: {
    todos: mockTodos,
    action: todoActionStoryMock.delete.success,
  },
};

export const WithError: Story = {
  args: {
    todos: mockTodos,
    action: todoActionStoryMock.delete.error,
  },
};

export const Delayed: Story = {
  args: {
    todos: mockTodos,
    action: todoActionStoryMock.delete.delayed,
  },
};

export const NoTodos: Story = {
  args: {
    todos: [],
    action: todoActionStoryMock.delete.success,
  },
};
