import * as sanitizeStrMod from "@/utils/sanitize-str";
import { makeValidatedTodo } from "./make-validated-todo";
import * as validateTodoDescriptionMod from "../schemas/validate-todo-description";
import * as makeNewTodoMod from "./make-new-todo";
import { InvalidTodo, ValidTodo } from "../schemas/todo.contract";

describe("makeValidatedTodo (unit)", () => {
  test("deve chamar a função sanitizeStr com o valor correto", () => {
    const { sanitizeStrSpy, description } = makeMocks("abcde");
    makeValidatedTodo(description);
    expect(sanitizeStrSpy).toHaveBeenCalledExactlyOnceWith(description);
  });

  test("deve chamar a função validateTodoDescription com o retorno de sanitizeStr", () => {
    const { sanitizeStrSpy, description, validateTodoDescriptionSpy } =
      makeMocks("abcde"); // Pegando os spies

    // Variável que será o retorno da sanitizeStr
    const sanitizeStrReturn = "retorno da sanitizeStr";

    // Mock o retorno da sanitizeStr
    sanitizeStrSpy.mockReturnValue(sanitizeStrReturn);

    makeValidatedTodo(description) as ValidTodo;

    expect(validateTodoDescriptionSpy).toHaveBeenCalledExactlyOnceWith(
      sanitizeStrReturn,
    );
  });

  test("deve chamar makeNewTodo se validatedDescription se retornou sucesso", () => {
    const { description } = makeMocks("abcde"); // Pegando os spies

    const result = makeValidatedTodo(description) as ValidTodo;

    expect(result.success).toBe(true);
    // expect(result.data).toStrictEqual({
    //     id: 'any-id',
    //     description: 'abcde',
    //     createdAt: expect.any(String)
    // });

    expect(result.todo.id).toBe("any-id");

    expect(result.todo.description).toBe("abcde");

    // expect(result.data.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(result.todo.createdAt).toBe("any-date");
  });

  test("deve chamar retornar validatedDescription.errors se a validação falhou", () => {
    const { description, errors, validateTodoDescriptionSpy } = makeMocks(); // Pegando os spies

    validateTodoDescriptionSpy.mockReturnValue({ errors, success: false });

    const result = makeValidatedTodo(description) as InvalidTodo;

    expect(result).toStrictEqual({ errors, success: false });
  });
});

const makeMocks = (description = "abcd") => {
  const errors = ["any", "error"];

  const todo = {
    id: "any-id",
    description,
    createdAt: "any-date",
  };

  const sanitizeStrSpy = vi
    .spyOn(sanitizeStrMod, "sanitizeStr")
    .mockReturnValue(description);

  const validateTodoDescriptionSpy = vi
    .spyOn(validateTodoDescriptionMod, "validateTodoDescription")
    .mockReturnValue({
      success: true,
      errors: [],
    });

  const makeNewTodoSpy = vi
    .spyOn(makeNewTodoMod, "makeNewTodo")
    .mockReturnValue(todo);

  return {
    description,
    sanitizeStrSpy,
    validateTodoDescriptionSpy,
    makeNewTodoSpy,
    todo,
    errors,
  };
};
