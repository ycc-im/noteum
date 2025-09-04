import { Module } from '@nestjs/common';
import { UserModule } from './modules/user.module';
import { NoteModule } from './modules/note.module';

@Module({
  imports: [UserModule, NoteModule],
  controllers: [],
  providers: [],
})
export class AppModule {}