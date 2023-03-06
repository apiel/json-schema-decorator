import 'reflect-metadata';

import Ajv, { JSONSchemaType, ErrorObject } from 'ajv';

const schemaMetadataKey = Symbol('schema');
// Used to keep a list of all the @decorated props of a class
const propsMetadataKey = Symbol('props');

function getPropsMetadata(target: any) {
    return Reflect.getMetadata(propsMetadataKey, target) || [];
}

function propMetadata(metadataKey: any, metadataValue: any) {
    return function (target: any, propertyKey: string) {
        const props = getPropsMetadata(target);
        props.push(propertyKey);
        Reflect.defineMetadata(propsMetadataKey, [...new Set(props)], target);
        Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
    };
}

export type ObjectTarget = (() => Object) | [() => Object, string];

export interface JsonSchema extends Omit<JSONSchemaType<any>, 'type'> {
    optional?: boolean;
    target?: ObjectTarget;
}

export function schema(schema: JsonSchema) {
    return propMetadata(schemaMetadataKey, schema);
}

class JsonError extends Error {
    constructor(message: string, public errors: ErrorObject[]) {
        super(message);
    }
}

export class Schema {
    public jsonSchema: JSONSchemaType<any> = {
        type: 'object',
        properties: {},
        required: [],
    };

    protected _getSchema(name: string, target: Object) {
        const schemaMeta = Reflect.getMetadata(schemaMetadataKey, target, name);
        if (!schemaMeta) {
            throw new Error(`No schema defined for ${name}, use @schema({})`);
        }

        if (!schemaMeta.type) {
            schemaMeta.type = Reflect.getMetadata('design:type', target, name).name.toLowerCase();
        }

        return schemaMeta;
    }

    // targetObj must use a function to return the target class in order
    // to avoid circular dependency
    // https://stackoverflow.com/questions/39334698/typescript-decorators-and-circular-dependencies
    protected _getTargetSchema(targetObj: ObjectTarget, name: string): any {
        if (Array.isArray(targetObj)) {
            name = targetObj[1];
            if (!name) {
                throw new Error('Missing name of target decorator');
            }
            targetObj = targetObj[0];
        }
        return this._getSchema(name, new ((targetObj as any)() as any)() || {});
    }

    constructor(obj?: Object) {
        if (!obj) {
            obj = this;
        }

        for (const name of getPropsMetadata(obj)) {
            let { target, optional, ...schemaMeta } = this._getSchema(name, obj!);
            if (target) {
                schemaMeta = { ...this._getTargetSchema(target, name), ...schemaMeta };
            }
            if (!optional) {
                (this.jsonSchema.required as any).push(name);
            }
            this.jsonSchema.properties![name] = schemaMeta;
        }
    }

    public validate(throwOnError = false) {
        const ajv = new Ajv();
        const validate = ajv.compile(this.jsonSchema);
        if (!validate(this) && throwOnError) {
            throw new JsonError(`Data does not match JSON schema definition.`, validate.errors!);
        }

        return validate;
    }
}
