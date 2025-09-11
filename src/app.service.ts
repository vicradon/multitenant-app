import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  applicationRoot(): string {
    return '<h1>Multitenancy App!</h1>';
  }
}
