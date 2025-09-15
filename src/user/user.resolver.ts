import { Resolver, Query } from '@nestjs/graphql';
import User from './entities/user.entity';
import UserService from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String)
  sayHi(){
    return "hi"
  }

  // @Query(() => User)
  // currentUser() {
  //   return this.userService.findCurrent();
  // }
}
