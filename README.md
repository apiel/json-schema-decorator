# @apiel/json-schema-decorator

Minimal library to merge JSON schema properties decorator into a JSON schema object.

```ts
import { generateJsonSchema, schema } from '@apiel/json-schema-decorator';

class Person {
  @schema({ maximum: 40, optional: true })
  age: number = 20;

  @schema({ maximum: 200 })
  height!: number;
}

const p = new Person();
console.log('This is the generated JSON schema', generateJsonSchema(p));
```

JSON schema output:

```json
{
  type: 'object',
  required: [ 'height' ],
  properties: {
    age: { maximum: 40, type: 'number' },
    height: { maximum: 200, type: 'number' }
  }
}
```

To define a property schema, use the decorator `@schema({})`. The type of the property is inferred automatically and can still be overwritten if `type` is defined as parameter, e.g.: `@schema({type: 'number'})`. By default, properties are optional, to make them required, set the parameter `optional` to `false`, e.g.: `@schema({optional: false})`.

Generate the json schema by calling `generateJsonSchema(the_target_object)`

## Validation

**Validation is not include in this library**, as the goal is simply to generate JSON schema. It's up to you to use the library of your choice for validation.

In our example, we will use AJV:

```sh
npm install ajv
```

```ts
import { generateJsonSchema, schema } from '@apiel/json-schema-decorator';
import Ajv from 'ajv';

class Person {
  @schema({ maximum: 40 })
  age: number = 20;

  @schema({ maximum: 200 })
  height: number = 223;
}

const p = new Person();
const jsonSchema = generateJsonSchema(p);

const ajv = new Ajv();
const validator = ajv.compile(jsonSchema);
const validation = validator(p);

// It should fail because height is over maximum limit
console.log('AJV validation result:', validation);
if (!validation) {
  console.error('Your object does not respect your JSON schema definition', validator.errors);
}
```

## tsconfig

`experimentalDecorators` and `emitDecoratorMetadata` must be enable in your tsconfig.json.

```json
{
  // ...
  "compilerOptions": {
    // ...
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```
