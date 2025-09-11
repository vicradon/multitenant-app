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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcryptjs_1 = require("bcryptjs");
const user_entity_1 = require("../user/entities/user.entity");
const user_service_1 = require("../user/user.service");
let AuthService = class AuthService {
    userService;
    configService;
    jwtService;
    constructor(userService, configService, jwtService) {
        this.userService = userService;
        this.configService = configService;
        this.jwtService = jwtService;
    }
    async login(input) {
        const { email, password } = input;
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException('User email or password incorrect');
        }
        return this.generateAuthToken(user);
    }
    async register(input) {
        const { email, password, name, adminKey } = input;
        if (adminKey !== this.configService.get('admin.key')) {
            throw new common_1.NotFoundException('404');
        }
        const user = await this.userService.create({
            displayName: name,
            email,
            password,
            roles: [user_entity_1.UserRoleEnum.STAFF_USER],
            isSuperAdmin: true,
        });
        return this.generateAuthToken(user);
    }
    async generateAuthToken(user, extendPayload = true) {
        const payload = {
            sub: user.id,
            email: user.email,
        };
        if (extendPayload) {
            payload.roles = user.roles;
            payload.displayName = user.displayName;
            payload.isSuperAdmin = user.isSuperAdmin;
        }
        const options = !extendPayload ? { expiresIn: '20m' } : undefined;
        return {
            message: 'Logged in successfully',
            userName: user.displayName,
            email: user.email,
            accessToken: this.jwtService.sign(payload, options),
        };
    }
    async validateUser(email, password) {
        const user = await this.userService.findPasswordByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('User Not found');
        }
        const valid = await (0, bcryptjs_1.compare)(password, user.password);
        if (!valid) {
            throw new common_1.UnauthorizedException('Invalid username or password');
        }
        return user;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_service_1.default))),
    __metadata("design:paramtypes", [user_service_1.default,
        config_1.ConfigService,
        jwt_1.JwtService])
], AuthService);
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map