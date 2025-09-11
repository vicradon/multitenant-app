import { Resolver, Mutation, Args } from '@nestjs/graphql';
import User from './entities/user.entity';
import CreateUserInput from './dto/create-user.input';
import UserService from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }
}
