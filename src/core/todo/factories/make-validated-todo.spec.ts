import * as sanitizeStrMod from '@/utils/sanitize-str';
import * as makeValidatedTodoMod from './make-validated-todo';

describe('makeValidatedTodo (unit)', () => {
  test('deve chamar a função sanitizeStr com o valor correto', () => {
    // Arrange
    const description = 'abcd';
    const sanitizeStrSpy = vi.spyOn(sanitizeStrMod, 'sanitizeStr')
      .mockReturnValue(description);

    // Action
    makeValidatedTodoMod.makeValidatedTodo(description);

    // Assert
    expect(sanitizeStrSpy).toHaveBeenCalledExactlyOnceWith(description);
    expect(sanitizeStrSpy).toHaveBeenCalledTimes(1);
    expect(sanitizeStrSpy).toHaveBeenCalledWith(description);
  });

  // test('deve chamar a função validateTodoDescription com o retorno de sanitizeStr', () => {

  //   const description = 'abcd';
  //   const sanitizeStr = sanitizeStrMod.sanitizeStr(description);

  //   const makeValidatedTodoSpy = vi.spyOn(makeValidatedTodoMod, 'makeValidatedTodo');

  // });

  // test('deve chamar makeNewTodo se validatedDescription se retornou sucesso', () => {});

  // test('deve chamar retornar validatedDescription.errors se a validação falhou', () => {});
});