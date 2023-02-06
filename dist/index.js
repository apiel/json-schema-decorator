"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = exports.schema = void 0;
require("reflect-metadata");
const ajv_1 = __importDefault(require("ajv"));
const schemaMetadataKey = Symbol('schema');
// Used to keep a list of all the @decorated props of a class
const propsMetadataKey = Symbol('props');
function getPropsMetadata(target) {
    return Reflect.getMetadata(propsMetadataKey, target) || [];
}
function propMetadata(metadataKey, metadataValue) {
    return function (target, propertyKey) {
        const props = getPropsMetadata(target);
        props.push(propertyKey);
        Reflect.defineMetadata(propsMetadataKey, [...new Set(props)], target);
        Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
    };
}
function schema(schema) {
    return propMetadata(schemaMetadataKey, schema);
}
exports.schema = schema;
class JsonError extends Error {
    constructor(message, errors) {
        super(message);
        this.errors = errors;
    }
}
class Schema {
    _getSchema(name, target = this) {
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
    _getTargetSchema(targetObj, name) {
        if (Array.isArray(targetObj)) {
            name = targetObj[1];
            if (!name) {
                throw new Error('Missing name of Meta decorator');
            }
            targetObj = targetObj[0];
        }
        return this._getSchema(name, new (targetObj())() || {});
    }
    validate(throwOnError = false) {
        const jsonSchema = {
            type: 'object',
            properties: {},
            required: [],
        };
        for (const name of getPropsMetadata(this)) {
            let _a = this._getSchema(name), { target, optional } = _a, schemaMeta = __rest(_a, ["target", "optional"]);
            if (target) {
                schemaMeta = Object.assign(Object.assign({}, this._getTargetSchema(target, name)), schemaMeta);
            }
            if (!optional) {
                jsonSchema.required.push(name);
            }
            jsonSchema.properties[name] = schemaMeta;
        }
        const ajv = new ajv_1.default();
        const validate = ajv.compile(jsonSchema);
        if (!validate(this) && throwOnError) {
            throw new JsonError(`Data does not match JSON schema definition.`, validate.errors);
        }
        return validate;
    }
}
exports.Schema = Schema;
//# sourceMappingURL=index.js.map