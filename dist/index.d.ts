import 'reflect-metadata';
import { JSONSchemaType } from 'ajv';
export type ObjectTarget = (() => Object) | [() => Object, string];
export interface JsonSchema extends Omit<JSONSchemaType<any>, 'type'> {
    optional?: boolean;
    target?: ObjectTarget;
}
export declare function schema(schema: JsonSchema): (target: any, propertyKey: string) => void;
export declare class Schema {
    protected _getSchema(name: string, target?: Object): any;
    protected _getTargetSchema(targetObj: ObjectTarget, name: string): any;
    validate(throwOnError?: boolean): import("ajv").ValidateFunction<any>;
}
