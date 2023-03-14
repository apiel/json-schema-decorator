import { generateJsonSchema, schema } from '../src';

class Person {
  @schema({ maximum: 40, optional: true })
  age: number = 20;

  @schema({ maximum: 200 })
  height!: number;
}

const p = new Person();
console.log('This is the generated JSON schema', generateJsonSchema(p));
