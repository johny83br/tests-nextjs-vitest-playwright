import {
  insertTestTodos,
  makeTestTodoRepository,
} from "@/core/__tests__/utils/make-test-todo-repository";
import { test, expect, Page } from "@playwright/test";

const HOME_URL = "/";
const HEADING = "Lista de tarefas";
const INPUT = "Tarefa";
const BUTTON = "Criar tarefa";
const BUTTON_BUSY = "Criando tarefa...";
const NEW_TODO_TEXT = "New Todo";

const getHeading = (p: Page) => p.getByRole("heading", { name: HEADING });
const getInput = (p: Page) => p.getByRole("textbox", { name: INPUT });
const getButton = (p: Page) => p.getByRole("button", { name: BUTTON });
const getButtonBusy = (p: Page) => p.getByRole("button", { name: BUTTON_BUSY });

const getAll = (p: Page) => ({
  heading: getHeading(p),
  input: getInput(p),
  button: getButton(p),
  buttonBusy: getButtonBusy(p),
});

test.beforeEach(async ({ page }) => {
  const { deleteTodoNoWhere } = await makeTestTodoRepository();
  await deleteTodoNoWhere();

  await page.goto(HOME_URL);
});

test.afterAll(async () => {
  const { deleteTodoNoWhere } = await makeTestTodoRepository();
  await deleteTodoNoWhere();
});

test.describe("<Home /> (E2E)", () => {
  test.describe("Renderização", () => {
    test("deve ter o title html correto", async ({ page }) => {
      await expect(page).toHaveTitle("Lista de tarefas");
    });

    test("deve renderizar o cabeçalho, o input e o botão para criar TODOS", async ({
      page,
    }) => {
      await expect(getHeading(page)).toBeVisible();
      await expect(getInput(page)).toBeVisible();
      await expect(getButton(page)).toBeVisible();
    });
  });

  test.describe("Criação", () => {
    test("deve permitir criar um TODO", async ({ page }) => {
      const { button, input } = getAll(page);

      await input.fill(NEW_TODO_TEXT);
      await button.click();

      const createdTodo = page
        .getByRole("listitem")
        .filter({ hasText: NEW_TODO_TEXT });
      await expect(createdTodo).toBeVisible();
    });

    test("deve fazer o trim da descrição do input ao criar o TODO", async ({
      page,
    }) => {
      const { button, input } = getAll(page);

      const textToBeTrimmed = "                 no spaces here           ";
      const textTrimmed = textToBeTrimmed.trim();

      await input.fill(textToBeTrimmed);
      await button.click();

      const createdTodo = page
        .getByRole("listitem")
        .filter({ hasText: textTrimmed });
      const createdTodoText = await createdTodo.textContent();

      await expect(createdTodoText).toBe(textTrimmed);
    });

    test("deve permitir que eu crie mais de um TODO", async ({ page }) => {
      const { button, input } = getAll(page);

      const todo1 = "Todo1";
      const todo2 = "Todo2";

      await input.fill(todo1);
      await button.click();
      const todo1Item = page.getByRole("listitem").filter({ hasText: todo1 });
      await expect(todo1Item).toBeVisible();

      await input.fill(todo2);
      await button.click();
      const todo2Item = page.getByRole("listitem").filter({ hasText: todo2 });
      await expect(todo2Item).toBeVisible();
    });

    test("deve desativar o input enquanto cria o TODO", async ({ page }) => {
      const { button, input, buttonBusy } = getAll(page);

      await input.fill(NEW_TODO_TEXT);
      await button.click();

      await expect(buttonBusy).toBeVisible();
      await expect(buttonBusy).toBeDisabled();

      const createdTodo = page
        .getByRole("listitem")
        .filter({ hasText: NEW_TODO_TEXT });

      await expect(createdTodo).toBeVisible();

      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
    });

    test("deve desativar o input enquanto cria o TODO", async ({ page }) => {
      const { input, button } = getAll(page);

      await input.fill(NEW_TODO_TEXT);
      await button.click();

      await expect(input).toBeDisabled();

      const createdTodo = page
        .getByRole("listitem")
        .filter({ hasText: NEW_TODO_TEXT });
      await expect(createdTodo).toBeVisible();

      await expect(input).toBeEnabled();
    });

    test("deve limpar o input após criar um todo", async ({ page }) => {
      const { button, input } = getAll(page);
      await input.fill(NEW_TODO_TEXT);
      await button.click();

      await expect(input).toHaveValue("");
    });
  });

  test.describe("Exclusão", () => {
    test("deve permitir apagar um todo", async ({ page }) => {
      const todos = await insertTestTodos();
      await page.reload(); // make next.js revalidate cache

      const itemToDelete = page
        .getByRole("listitem")
        .filter({ hasText: todos[1].description });
      await expect(itemToDelete).toBeVisible();

      const deleteBtn = itemToDelete.getByRole("button");

      await deleteBtn.click();

      await itemToDelete.waitFor({ state: "detached" });

      expect(itemToDelete).not.toBeVisible();
    });

    test("deve permitir apagar todos os TODOs", async ({ page }) => {
      await insertTestTodos();
      await page.reload(); // make next.js revalidate cache

      while (true) {
        const item = page.getByRole("listitem").first();
        const isVisible = await item.isVisible().catch(() => false);
        if (!isVisible) break;

        const text = await item.textContent();
        if (!text) {
          throw new Error("Item text not found");
        }

        const deleteButton = item.getByRole("button");
        await deleteButton.click();

        const renewedItem = page
          .getByRole("listitem")
          .filter({ hasText: text });
        await renewedItem.waitFor({ state: "detached" });
        await expect(renewedItem).not.toBeVisible();
      }
    });

    test("deve desativar os items da lista enquanto envia a action", async ({
      page,
    }) => {
      await insertTestTodos();
      await page.reload(); // make next.js revalidate cache

      const itemToBeDeleted = page.getByRole("listitem").first();
      const itemToBeDeletedText = await itemToBeDeleted.textContent();

      if (!itemToBeDeletedText) {
        throw new Error("O texto do item está vazio");
      }

      const deleteButton = itemToBeDeleted.getByRole("button");
      await deleteButton.click();

      const allDeleteButtons = await page
        .getByRole("button", { name: /^apagar:/i })
        .all();

      for (const btn of allDeleteButtons) {
        await expect(btn).toBeDisabled();
      }

      const deleteItemNotVisible = page
        .getByRole("listitem")
        .filter({ hasText: itemToBeDeletedText });
      await deleteItemNotVisible.waitFor({ state: "detached" });
      await expect(deleteItemNotVisible).not.toBeVisible();

      const renewedAllButtons = await page
        .getByRole("button", { name: /^apagar:/i })
        .all();

      for (const btn of renewedAllButtons) {
        await expect(btn).toBeEnabled();
      }
    });
  });

  test.describe("Erros", () => {
    test("deve mostrar erro se a descrição tem 3 ou menos caracteres", async ({
      page,
    }) => {
      const { button, input } = getAll(page);

      await input.fill("abc");
      await button.click();

      const errorText = "Descrição precisa ter mais de 3 caracteres";
      const error = page.getByText(errorText);

      await error.waitFor({ state: "attached" });
      await expect(error).toBeVisible();
    });

    test("deve mostrar se um TODO já existir com a mesma descrição", async ({
      page,
    }) => {
      const { button, input } = getAll(page);

      await input.fill("eu já existo");
      await button.click();

      await input.fill("eu já existo");
      await button.click();

      const errorText = "Já existe um todo com o ID ou descrição enviados";
      const error = page.getByText(errorText);

      await error.waitFor({ state: "attached", timeout: 5000 });
      await expect(error).toBeVisible();
    });

    test("deve remover o erro da tela quando o usuário corrigir o erro", async ({
      page,
    }) => {
      const { button, input } = getAll(page);

      await input.fill("abc");
      await button.click();

      const errorText = "Descrição precisa ter mais de 3 caracteres";
      const error = page.getByText(errorText);

      await error.waitFor({ state: "attached" });
      await expect(error).toBeVisible();

      await input.fill("Essa descrição é válida");
      await button.click();

      await error.waitFor({ state: "detached", timeout: 5000 });
      await expect(error).not.toBeVisible();
    });
  });
});
