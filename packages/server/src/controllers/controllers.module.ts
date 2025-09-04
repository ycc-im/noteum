import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { NoteController } from './note.controller';

/**
 * Controllers module that exports all gRPC controllers
 * This module will be imported by the main app module
 */
@Module({
  controllers: [
    UserController,
    NoteController,
  ],
  exports: [
    UserController,
    NoteController,
  ],
})
export class ControllersModule {}