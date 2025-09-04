import { Module } from '@nestjs/common';
import { NoteService } from '../services/note.service';
import { NoteController } from '../services/note.controller';
import { UserModule } from './user.module';

@Module({
  imports: [UserModule],
  providers: [NoteService],
  controllers: [NoteController],
  exports: [NoteService],
})
export class NoteModule {}