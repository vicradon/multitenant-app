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
const typeorm_1 = require("@nestjs/typeorm");
const bcryptjs_1 = require("bcryptjs");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
let UserService = class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findByToken(resetPasswordToken) {
        return this.userRepository.findOne({ where: { resetPasswordToken } });
    }
    async findPasswordByEmail(email) {
        return this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email: email.toLowerCase() })
            .getOne();
    }
    async findByEmail(email) {
        return this.userRepository
            .createQueryBuilder('user')
            .withDeleted()
            .where('user.email = :email', { email: email.toLowerCase() })
            .getOne();
    }
    async findById(id, throwException = true) {
        const user = await this.userRepository.findOne({
            where: { id },
        });
        if (!user && throwException) {
            throw new common_1.NotFoundException('User not found aginst given ID');
        }
        return user;
    }
    async create(createUserInput, userCtx) {
        const { email, password } = createUserInput;
        const existingRecord = email && (await this.findByEmail(email));
        if (existingRecord && !existingRecord.deletedAt) {
            throw new common_1.ConflictException('Please use different email');
        }
        if (existingRecord && existingRecord.deletedAt) {
            await this.userRepository.remove(existingRecord);
        }
        const user = this.userRepository.create({
            ...createUserInput,
            email: email.toLowerCase(),
            password: await (0, bcryptjs_1.hash)(password, 10),
        });
        await this.userRepository.save(user);
        return user;
    }
    async findOneUser(findOptions) {
        const user = await this.userRepository.findOne(findOptions);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async saveUser(user) {
        await this.userRepository.save(user);
        return 'User update successful';
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.default)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
exports.default = UserService;
//# sourceMappingURL=user.service.js.map