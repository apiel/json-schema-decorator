import 'reflect-metadata';

import { JSONSchemaType } from 'ajv';

const schemaMetadataKey = Symbol('schema');
// Used to keep a list of all the @decorated props of a class
const propsMetadataKey = Symbol('props');

function getPropsMetadata(target: Object) {
  return Reflect.getMetadata(propsMetadataKey, target) || [];
}

function propMetadata(metadataKey: Symbol, metadataValue: unknown) {
  return function (target: any, propertyKey: string) {
    const props = getPropsMetadata(target);
    props.push(propertyKey);
    Reflect.defineMetadata(propsMetadataKey, [...new Set(props)], target);
    Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
  };
}

export interface JsonSchema extends Omit<JSONSchemaType<unknown>, 'type'> {
  optional?: boolean;
}

export function schema(schema: JsonSchema) {
  return propMetadata(schemaMetadataKey, schema);
}

function getSchema(name: string, target: Object): JsonSchema {
  const schemaMeta = Reflect.getMetadata(schemaMetadataKey, target, name);
  if (!schemaMeta) {
    throw new Error(`No schema defined for ${name}, use @schema({})`);
  }

  // If no type is defined, try to infer it from the type of the property
  if (!schemaMeta.type) {
    schemaMeta.type = Reflect.getMetadata(
      'design:type',
      target,
      name,
    ).name.toLowerCase();
  }

  return schemaMeta;
}

export function generateJsonSchema(target: Object) {
  const jsonSchema = {
    type: 'object',
  };
  const required: string[] = [];
  const properties: Record<string, unknown> = {};

  for (const name of getPropsMetadata(target)) {
    let { optional, ...schemaMeta } = getSchema(name, target);
    if (!optional) {
      required.push(name);
    }
    properties[name as string] = schemaMeta;
  }

  return { ...jsonSchema, required, properties };
}
