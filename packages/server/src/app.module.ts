import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './modules/user.module';
import { NoteModule } from './modules/note.module';

@Module({
  imports: [ConfigModule, HealthModule, UserModule, NoteModule],
  controllers: [],
  providers: [],
})
export class AppModule {}