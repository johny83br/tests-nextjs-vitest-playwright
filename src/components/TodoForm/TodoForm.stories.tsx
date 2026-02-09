import type { Meta, StoryObj } from "@storybook/nextjs";
import { TodoForm } from ".";
import { fn } from "storybook/test";
import { CreateTodoAction } from "@/core/todo/actions/todo.action.types";

const meta = {
  title: "Components/Forms/Todo",
  component: TodoForm,
  decorators: [
    (Story) => (
      <div className="p-12 w-100">
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
    action: fn(async () => {
      return {
        success: true,
        todo: {
          id: "id",
          description: "description",
          createdAt: "date",
        },
      };
    }) as CreateTodoAction,
  },
} satisfies Story;

export const WithError = {
  args: {
    action: fn(async () => {
      return {
        success: false,
        errors: ["Falha ao criar o todo"],
      };
    }) as CreateTodoAction,
  },
} satisfies Story;
