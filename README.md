# @apiel/json-schema-decorator

An opiniated library using decorators in order to define JSON schema on a class.
It is using [AJV](https://www.npmjs.com/package/ajv) for the types definition and the validation.

```ts
import { schema, Schema } from '@apiel/json-schema-decorator';

class Person extends Schema {
    @schema({ maximum: 40 })
    age: number = 20;

    @schema({ maximum: 200 })
    height: number = 223;
}

const p = new Person();

console.log('This is the generated JSON schema', p.jsonSchema);

if (p.validate().errors) {
    console.error('Data does not match JSON schema definition.', p.validate().errors);
}
```

Create a class, extending the class Schema in order to generate the JSON schema.
The schema will be available from the property `yourObject.schema`.

To define a property schema, use the decorator `@schema({})`. The type of the property is inferred automatically and can still be overwritten if `type` is defined as parameter, e.g.: `@schema({type: 'number'})`. By default, properties are optional, to make them required, set the parameter `optional` to `false`, e.g.: `@schema({optional: false})`.

Sometime, it can be useful to re-use schema from another class (without extending it). To solve this, use the parameter target:

```ts
class Address extends Schema {
    @schema({ type: 'string', minLength: 3, maxLength: 10, description: 'Street name' })
    street!: string;
}

class Person2 extends Schema {
    @schema({ maximum: 40 })
    age: number = 20;

    @schema({ target: () => Address })
    street: string = 'streetgasse';
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
