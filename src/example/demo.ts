import { schema, Schema } from '..';

class Person extends Schema {
    @schema({ maximum: 40 })
    age: number = 20;

    @schema({ maximum: 200 })
    height: number = 223;

    @schema({ minimum: 10, optional: false })
    example!: number;
}

const p = new Person();

console.log('This is the generated JSON schema', p.jsonSchema);

if (p.validate().errors) {
    console.log('With missing example value', p.validate().errors);
    
    p.example = 20;
    console.log('after setting example value', p.validate().errors);
}

// Another example using schema from another class

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

const p2 = new Person2();
if (p2.validate().errors) {  
    console.log('Another example using schema from another class', p2.validate().errors);
}
