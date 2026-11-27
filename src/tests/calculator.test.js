const { spawnSync } = require('child_process');
const path = require('path');
const { addition, subtraction, multiplication, division, modulo, power, squareRoot } = require('../calculator');

const cli = path.join(__dirname, '..', 'calculator.js');
const run = (...args) => spawnSync('node', [cli, ...args], { encoding: 'utf8' });

describe('addition', () => {
  test('2 + 3 = 5', () => expect(addition(2, 3)).toBe(5));
  test('números negativos', () => expect(addition(-2, -3)).toBe(-5));
  test('com zero', () => expect(addition(7, 0)).toBe(7));
  test('decimais', () => expect(addition(0.5, 0.25)).toBe(0.75));
});

describe('subtraction', () => {
  test('10 - 4 = 6', () => expect(subtraction(10, 4)).toBe(6));
  test('resultado negativo', () => expect(subtraction(4, 10)).toBe(-6));
  test('com zero', () => expect(subtraction(5, 0)).toBe(5));
  test('números negativos', () => expect(subtraction(-5, -3)).toBe(-2));
});

describe('multiplication', () => {
  test('45 * 2 = 90', () => expect(multiplication(45, 2)).toBe(90));
  test('por zero', () => expect(multiplication(9, 0)).toBe(0));
  test('sinais diferentes', () => expect(multiplication(-3, 4)).toBe(-12));
  test('decimais', () => expect(multiplication(1.5, 2)).toBe(3));
});

describe('division', () => {
  test('20 / 5 = 4', () => expect(division(20, 5)).toBe(4));
  test('resultado decimal', () => expect(division(1, 4)).toBe(0.25));
  test('numerador zero', () => expect(division(0, 5)).toBe(0));
  test('números negativos', () => expect(division(-10, 2)).toBe(-5));
  test('divisão por zero lança erro', () => {
    expect(() => division(10, 0)).toThrow('Divisão por zero não é permitida.');
  });
});

describe('modulo', () => {
  test('5 % 2 = 1', () => expect(modulo(5, 2)).toBe(1));
  test('divisível retorna 0', () => expect(modulo(10, 5)).toBe(0));
  test('dividendo menor que divisor', () => expect(modulo(2, 5)).toBe(2));
  test('dividendo negativo', () => expect(modulo(-5, 2)).toBe(-1));
  test('decimais', () => expect(modulo(5.5, 2)).toBe(1.5));
  test('módulo por zero lança erro', () => {
    expect(() => modulo(5, 0)).toThrow('Módulo por zero não é permitido.');
  });
});

describe('power', () => {
  test('2 ^ 3 = 8', () => expect(power(2, 3)).toBe(8));
  test('expoente zero', () => expect(power(5, 0)).toBe(1));
  test('expoente negativo', () => expect(power(2, -2)).toBe(0.25));
  test('base negativa', () => expect(power(-2, 3)).toBe(-8));
  test('expoente fracionário', () => expect(power(9, 0.5)).toBe(3));
  test('zero elevado a zero', () => expect(power(0, 0)).toBe(1));
});

describe('squareRoot', () => {
  test('√16 = 4', () => expect(squareRoot(16)).toBe(4));
  test('√0 = 0', () => expect(squareRoot(0)).toBe(0));
  test('não quadrado perfeito', () => expect(squareRoot(2)).toBeCloseTo(1.41421356, 6));
  test('decimal', () => expect(squareRoot(0.25)).toBe(0.5));
  test('número negativo lança erro', () => {
    expect(() => squareRoot(-1)).toThrow('Não é possível calcular a raiz quadrada de um número negativo.');
  });
});

describe('CLI', () => {
  test.each([
    [['add', '2', '3'], '5'],
    [['subtract', '10', '4'], '6'],
    [['multiply', '45', '2'], '90'],
    [['divide', '20', '5'], '4'],
  ])('%j', (args, expected) => {
    const r = run(...args);
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toBe(expected);
  });

  test('divisão por zero retorna erro', () => {
    const r = run('divide', '1', '0');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/Divisão por zero/);
  });

  test('operando inválido', () => {
    const r = run('add', 'x', '1');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/números válidos/);
  });

  test('operação desconhecida', () => {
    expect(run('pow', '2', '3').status).toBe(1);
  });

  test('argumentos ausentes', () => {
    expect(run('add', '1').status).toBe(1);
  });
});
