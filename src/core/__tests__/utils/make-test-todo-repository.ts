import { DrizzleTodoRepository } from "@/core/todo/repositories/drizzle-todo.repository";
import { drizzleDatabase } from "@/db/drizzle";
import { eq } from "drizzle-orm";

export function makeTestTodoRepository() {
  const { db, todoTable } = drizzleDatabase;

  const repository = new DrizzleTodoRepository(db);
  const todos = makeTestTodos();

  const insertTodo = () => db.insert(todoTable);
  const deleteTodoNoWhere = () => db.delete(todoTable);
  const deleteTodo = (id: string) =>
    db.delete(todoTable).where(eq(todoTable.id, id));

  return {
    repository,
    insertTodo,
    deleteTodoNoWhere,
    deleteTodo,
    todos,
  };
}

export const insertTestTodos = async () => {
  const { insertTodo } = await makeTestTodoRepository();
  const todos = makeTestTodos();

  await insertTodo().values(todos);

  return todos;
};

export const makeTestTodos = () => {
  return Array.from({ length: 5 }).map((_, index) => {
    const newTodo = {
      id: index.toString(),
      description: `Todo ${index}`,
      createdAt: `date ${index}`,
    };

    return newTodo;
  });
};
