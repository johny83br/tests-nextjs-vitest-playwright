import * as sanitizeStrMod from '@/utils/sanitize-str';
import { makeValidatedTodo } from './make-validated-todo';
import * as validateTodoDescriptionMod from '../schemas/validate-todo-description';
import * as makeNewTodoMod from './make-new-todo';

describe('makeValidatedTodo (unit)', () => {
  test('deve chamar a função sanitizeStr com o valor correto', () => {
    const {sanitizeStrSpy, description} = makeMocks('abcde');
    makeValidatedTodo(description);
    expect(sanitizeStrSpy).toHaveBeenCalledExactlyOnceWith(description);
  });

  test('deve chamar a função validateTodoDescription com o retorno de sanitizeStr', () => {

    const {sanitizeStrSpy, description, validateTodoDescriptionSpy} = makeMocks('abcde'); // Pegando os spies

    // Variável que será o retorno da sanitizeStr
    const sanitizeStrReturn = 'retorno da sanitizeStr';
    
    // Mock o retorno da sanitizeStr
    sanitizeStrSpy.mockReturnValue(sanitizeStrReturn);

    const result = makeValidatedTodo(description);

    // console.log(result);

    expect(validateTodoDescriptionSpy).toHaveBeenCalledExactlyOnceWith(sanitizeStrReturn);
    // expect(result).toStrictEqual({
    //   success: true,
    //   data: {
    //     id: 'any-id',
    //     description: 'abcde',
    //     createdAt: '2026-02-02T14:36:42.968Z'
    //   }
    // })
    expect(result.success).toBe(true);
    // expect(result.data).toStrictEqual({
    //     id: 'any-id',
    //     description: 'abcde',
    //     createdAt: expect.any(String)
    // });
    expect(result.data.id).toBe('any-id');
    expect(result.data.description).toBe('abcde');
    // expect(result.data.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(result.data.createdAt).toBe('any-date');

  });

  test('deve chamar makeNewTodo se validatedDescription se retornou sucesso', () => {

    // const {sanitizeStrSpy, 
    //   description, 
    //   validateTodoDescriptionSpy, 
    //   makeNewTodoSpy, 
    //   todo} = makeMocks('abcde'); // Pegando os spies

    // // Variável que será o retorno da sanitizeStr
    // const sanitizeStrReturn = 'retorno da sanitizeStr';

    // // Mock o retorno da sanitizeStr
    // sanitizeStrSpy.mockReturnValue(sanitizeStrReturn);

    // const validatedDescription = makeValidatedTodo(description);

    // if(validatedDescription.success) {
    //   makeNewTodoSpy.mockReturnValue(todo);

    //   // expect(makeNewTodoSpy).toBe(validatedDescription);
    // }

  });

  // test('deve chamar retornar validatedDescription.errors se a validação falhou', () => {});
});

const makeMocks = (description = 'abcd') => {

  const todo = {
    id: 'any-id',
    description,
    createdAt: 'any-date'
  };

  const sanitizeStrSpy = vi.spyOn(sanitizeStrMod, 'sanitizeStr')
    .mockReturnValue(description);

  const validateTodoDescriptionSpy = vi.spyOn(validateTodoDescriptionMod, 'validateTodoDescription')
    .mockReturnValue({
      success: true,
      errors: []
    });

  const makeNewTodoSpy = vi.spyOn(makeNewTodoMod, 'makeNewTodo')
    .mockReturnValue(todo);

  return {
    description,
    sanitizeStrSpy,
    validateTodoDescriptionSpy,
    makeNewTodoSpy,
    todo
  }

}