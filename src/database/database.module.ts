import { Module } from '@nestjs/common';
import { UnauthedDBConnectionService } from 'src/database/unauth-repository';
import { AuthedDBConnectionService } from './auth-repository';

@Module({
  providers: [AuthedDBConnectionService, UnauthedDBConnectionService],
  exports: [AuthedDBConnectionService, UnauthedDBConnectionService]
})
export default class DatabaseModule {}
