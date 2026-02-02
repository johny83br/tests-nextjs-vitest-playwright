import {
  insertTestTodos,
  makeTestTodoRepository,
} from "@/core/__tests__/utils/make-test-todo-repository";

describe("DrizzleTodoRepository (integration)", () => {
  beforeEach(async () => {
    const { deleteTodoNoWhere } = makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  afterAll(async () => {
    // console.log("Executo depois de cada teste");
  });

  describe("findAll", () => {
    test("deve retornar um array vazio se a tabela estiver limpa", async () => {
      const { repository } = makeTestTodoRepository();
      const result = await repository.findAll();

      expect(result).toStrictEqual([]);
      expect(result).toHaveLength(0);
    });

    test("deve retornar todos os TODOs em ordem decrescente", async () => {
      const { repository } = makeTestTodoRepository();
      await insertTestTodos();
      const results = await repository.findAll();
      // console.log(results);
      expect(results[0].createdAt).toBe("date 4");
      expect(results[1].createdAt).toBe("date 3");
      expect(results[2].createdAt).toBe("date 2");
      expect(results[3].createdAt).toBe("date 1");
      expect(results[4].createdAt).toBe("date 0");
    });
  });

  describe("create", () => {
    test("cria um todo se os dados estão válidos", async () => {
      const { repository, todos } = makeTestTodoRepository();

      // Cria um novo todo
      const newTodo = await repository.create(todos[0]);

      expect(newTodo).toStrictEqual({
        success: true,
        todo: todos[0],
      });
    });

    test("falha se houver uma descrição igual na tabela", async () => {
      const { repository, todos } = makeTestTodoRepository();

      // Cria um novo todo
      await repository.create(todos[0]);

      // Cria um outro todo com o mesmo ID
      const anotherTodo = {
        id: "any id",
        description: todos[0].description,
        createdAt: "any date",
      };

      const result = await repository.create(anotherTodo);

      expect(result).toStrictEqual({
        success: false,
        errors: ["Já existe um todo com o ID ou descrição enviados"],
      });
    });

    test("falha se houver um ID igual na tabela", async () => {
      const { repository, todos } = makeTestTodoRepository();

      // Cria um novo todo
      await repository.create(todos[0]);

      // Cria um outro todo com a mesma descrição
      const anotherTodo = {
        id: todos[0].id,
        description: "any description",
        createdAt: "any date",
      };

      const result = await repository.create(anotherTodo);

      expect(result).toStrictEqual({
        success: false,
        errors: ["Já existe um todo com o ID ou descrição enviados"],
      });
    });

    test("falha se houver um ID e Descrição iguais", async () => {
      const { repository, todos } = makeTestTodoRepository();

      // Cria um novo todo
      await repository.create(todos[0]);

      // Cria um outro todo com a mesma descrição
      const anotherTodo = {
        id: todos[0].id,
        description: todos[0].description,
        createdAt: "any date",
      };

      const result = await repository.create(anotherTodo);

      expect(result).toStrictEqual({
        success: false,
        errors: ["Já existe um todo com o ID ou descrição enviados"],
      });
    });
  });

  describe("remove", () => {
    test("apaga um todo se ele existir", async () => {
      const { repository, todos } = makeTestTodoRepository();
      await insertTestTodos();
      const result = await repository.remove(todos[0].id);

      expect(result).toStrictEqual({
        success: true,
        todo: todos[0],
      });
    });

    test("falha ao apagar se o todo não existir", async () => {
      const { repository } = makeTestTodoRepository();
      const result = await repository.remove("any id");

      expect(result).toStrictEqual({
        success: false,
        errors: ["Todo não existe"],
      });
    });
  });
});
