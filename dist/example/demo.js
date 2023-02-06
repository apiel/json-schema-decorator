"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class Person extends __1.Schema {
    constructor() {
        super(...arguments);
        this.age = 20;
        this.height = 223;
    }
}
__decorate([
    (0, __1.schema)({ maximum: 40 }),
    __metadata("design:type", Number)
], Person.prototype, "age", void 0);
__decorate([
    (0, __1.schema)({ maximum: 200 }),
    __metadata("design:type", Number)
], Person.prototype, "height", void 0);
__decorate([
    (0, __1.schema)({ minimum: 10, optional: false }),
    __metadata("design:type", Number)
], Person.prototype, "example", void 0);
const p = new Person();
if (p.validate().errors) {
    console.log('With missing example value', p.validate().errors);
    p.example = 20;
    console.log('after setting example value', p.validate().errors);
}
// Another example using schema from another class
class Address extends __1.Schema {
}
__decorate([
    (0, __1.schema)({ type: 'string', minLength: 3, maxLength: 10, description: 'Street name' }),
    __metadata("design:type", String)
], Address.prototype, "street", void 0);
class Person2 extends __1.Schema {
    constructor() {
        super(...arguments);
        this.age = 20;
        this.street = 'streetgasse';
    }
}
__decorate([
    (0, __1.schema)({ maximum: 40 }),
    __metadata("design:type", Number)
], Person2.prototype, "age", void 0);
__decorate([
    (0, __1.schema)({ target: () => Address }),
    __metadata("design:type", String)
], Person2.prototype, "street", void 0);
const p2 = new Person2();
if (p2.validate().errors) {
    console.log('Another example using schema from another class', p2.validate().errors);
}
//# sourceMappingURL=demo.js.map