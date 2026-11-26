import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularTarifa } from '../src/services/logistica.service.js';

test('calcula la tarifa base para hasta cinco toneladas', () => {
  assert.equal(calcularTarifa(5, false), 450);
});

test('agrega el exceso por tonelaje y el recargo MATPEL', () => {
  assert.equal(calcularTarifa(8, false), 690);
  assert.equal(calcularTarifa(8, true), 828);
});

test('rechaza tonelaje no positivo o no numérico', () => {
  for (const toneladas of [0, -1, 'no es número']) {
    assert.throws(
      () => calcularTarifa(toneladas, false),
      (error) => error.status === 400
    );
  }
});
