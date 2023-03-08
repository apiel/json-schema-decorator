import { generateJsonSchema, schema } from '../src';

class Person {
  @schema({ maximum: 40 })
  age: number = 20;

  @schema({ maximum: 200 })
  height: number = 120;

  @schema({ minimum: 10, optional: false })
  example!: number;
}

const p = new Person();
console.log('This is the generated JSON schema', generateJsonSchema(p));

