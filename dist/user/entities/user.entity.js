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
exports.UserRoleEnum = void 0;
const graphql_1 = require("@nestjs/graphql");
const base_entity_shared_1 = require("../../infra/base-classes/base.entity.shared");
const typeorm_1 = require("typeorm");
var UserRoleEnum;
(function (UserRoleEnum) {
    UserRoleEnum["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRoleEnum["STAFF_USER"] = "STAFF_USER";
})(UserRoleEnum || (exports.UserRoleEnum = UserRoleEnum = {}));
(0, graphql_1.registerEnumType)(UserRoleEnum, {
    name: 'UserRoles',
    description: 'The Type of roles a user can have',
});
let User = class User extends base_entity_shared_1.default {
    displayName;
    email;
    password;
    isSuperAdmin;
    roles;
    resetPasswordToken;
    resetPasswordTokenExpiry;
    forgetPasswordToken;
};
__decorate([
    (0, graphql_1.Field)({ nullable: false }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "displayName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isSuperAdmin", void 0);
__decorate([
    (0, graphql_1.Field)(() => [UserRoleEnum], { nullable: true }),
    (0, typeorm_1.Column)({ type: 'enum', enum: UserRoleEnum, array: true, nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "resetPasswordToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "resetPasswordTokenExpiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "forgetPasswordToken", void 0);
User = __decorate([
    (0, graphql_1.ObjectType)('User'),
    (0, typeorm_1.Entity)('users')
], User);
exports.default = User;
//# sourceMappingURL=user.entity.js.map