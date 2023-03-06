import { schema, Schema } from '..';

class Person {
    @schema({ maximum: 40 })
    age: number = 20;

    @schema({ maximum: 200 })
    height: number = 223;

    @schema({ minimum: 10, optional: false })
    example!: number;
}

// Another example where Person is not extending Schema
// Can be useful when decorator are only used to generate schema
// and decorator would be removed from the final code
const p = new Person();
const shemaGenerator = new Schema(p);

console.log('This is the generated JSON schema', shemaGenerator.jsonSchema);
