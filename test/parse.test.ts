import { describe, test, expect } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseSpec } from '../src/parse.js';
import { validate } from '../src/validate.js';

const fixture = (name: string) =>
  readFileSync(join(__dirname, 'fixtures', name), 'utf-8');

describe('parseSpec', () => {
  test('parses YAML with nodes and edges', () => {
    const spec = parseSpec(fixture('linear-flow.yaml'));
    expect(spec.nodes).toHaveLength(4);
    expect(spec.edges).toHaveLength(3);
    expect(spec.title).toBe('Deploy Pipeline');
    expect(spec.direction).toBe('TB');
  });

  test('parses groups', () => {
    const spec = parseSpec(fixture('groups.yaml'));
    expect(spec.groups).toBeDefined();
    expect(spec.groups!.length).toBeGreaterThan(0);
  });
});

describe('validate', () => {
  test('valid spec returns no errors', () => {
    const spec = parseSpec(fixture('linear-flow.yaml'));
    expect(validate(spec)).toEqual([]);
  });

  test('rejects edge referencing missing node', () => {
    const spec = parseSpec(fixture('linear-flow.yaml'));
    spec.edges.push({ from: 'build', to: 'nonexistent' });
    const errors = validate(spec);
    expect(errors.length).toBeGreaterThan(0);
  });
});
