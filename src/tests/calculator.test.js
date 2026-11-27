const { spawnSync } = require('child_process');
const path = require('path');
const { add, subtract, multiply, divide } = require('../calculator');

const cli = path.join(__dirname, '..', 'calculator.js');
const run = (...args) => spawnSync('node', [cli, ...args], { encoding: 'utf8' });

describe('add', () => {
  test('2 + 3 = 5', () => expect(add(2, 3)).toBe(5));
  test('números negativos', () => expect(add(-2, -3)).toBe(-5));
  test('com zero', () => expect(add(7, 0)).toBe(7));
  test('decimais', () => expect(add(0.5, 0.25)).toBe(0.75));
});

describe('subtract', () => {
  test('10 - 4 = 6', () => expect(subtract(10, 4)).toBe(6));
  test('resultado negativo', () => expect(subtract(4, 10)).toBe(-6));
  test('com zero', () => expect(subtract(5, 0)).toBe(5));
  test('números negativos', () => expect(subtract(-5, -3)).toBe(-2));
});

describe('multiply', () => {
  test('45 * 2 = 90', () => expect(multiply(45, 2)).toBe(90));
  test('por zero', () => expect(multiply(9, 0)).toBe(0));
  test('sinais diferentes', () => expect(multiply(-3, 4)).toBe(-12));
  test('decimais', () => expect(multiply(1.5, 2)).toBe(3));
});

describe('divide', () => {
  test('20 / 5 = 4', () => expect(divide(20, 5)).toBe(4));
  test('resultado decimal', () => expect(divide(1, 4)).toBe(0.25));
  test('numerador zero', () => expect(divide(0, 5)).toBe(0));
  test('números negativos', () => expect(divide(-10, 2)).toBe(-5));
  test('divisão por zero lança erro', () => {
    expect(() => divide(10, 0)).toThrow('Divisão por zero não é permitida.');
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
