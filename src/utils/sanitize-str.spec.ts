import { sanitizeStr } from './sanitize-str';

describe('sanitizeStr (unit)', () => {
  test('retorna uma string vazia quando recebe um valor false', () => {
    // @ts-expect-error testando uma função sem parâmetros
    expect(sanitizeStr()).toBe('');
  });

  test('retorna uma string vazia quando recebe um valor que não é uma string', () => {
    // @ts-expect-error testando uma função com tipagem incorreta
    expect(sanitizeStr(123)).toBe('');
  });

  test('garante o trim da string enviada', () => {
    expect(sanitizeStr('    a    ')).toBe('a');
  });

  test('garante que a string é normalizada com NFC', () => {
    const original = 'e\u0301';
    const expected = 'é';
    // console.log(original, expected);
    expect(sanitizeStr(original)).toBe(expected);
  });
});