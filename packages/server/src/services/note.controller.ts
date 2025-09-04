import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NoteService } from './note.service';
import { CreateNoteDto, UpdateNoteDto, GetNoteDto, GetUserNotesDto, NoteResponseDto } from '../common/dto/note.dto';
import { NotFoundException } from '@nestjs/common';

interface NoteServiceGrpc {
  createNote(data: CreateNoteDto): Promise<NoteResponseDto>;
  getNote(data: GetNoteDto): Promise<NoteResponseDto>;
  getUserNotes(data: GetUserNotesDto): Promise<{ notes: NoteResponseDto[] }>;
  updateNote(data: { id: string } & UpdateNoteDto): Promise<NoteResponseDto>;
  deleteNote(data: GetNoteDto): Promise<{ success: boolean }>;
}

@Controller()
export class NoteController implements NoteServiceGrpc {
  constructor(private readonly noteService: NoteService) {}

  @GrpcMethod('NoteService', 'CreateNote')
  async createNote(data: CreateNoteDto): Promise<NoteResponseDto> {
    const note = await this.noteService.createNote({
      title: data.title,
      content: data.content,
      userId: data.userId,
      tags: data.tags,
    });

    return this.noteService.toResponseDto(note);
  }

  @GrpcMethod('NoteService', 'GetNote')
  async getNote(data: GetNoteDto): Promise<NoteResponseDto> {
    const note = await this.noteService.getNoteById(data.id);
    
    if (!note) {
      throw new NotFoundException(`Note with ID ${data.id} not found`);
    }

    return this.noteService.toResponseDto(note);
  }

  @GrpcMethod('NoteService', 'GetUserNotes')
  async getUserNotes(data: GetUserNotesDto): Promise<{ notes: NoteResponseDto[] }> {
    const notes = await this.noteService.getNotesByUserId(data.userId);
    
    return {
      notes: notes.map(note => this.noteService.toResponseDto(note))
    };
  }

  @GrpcMethod('NoteService', 'UpdateNote')
  async updateNote(data: { id: string } & UpdateNoteDto): Promise<NoteResponseDto> {
    const note = await this.noteService.updateNote(data.id, {
      title: data.title,
      content: data.content,
      tags: data.tags,
    });

    if (!note) {
      throw new NotFoundException(`Note with ID ${data.id} not found`);
    }

    return this.noteService.toResponseDto(note);
  }

  @GrpcMethod('NoteService', 'DeleteNote')
  async deleteNote(data: GetNoteDto): Promise<{ success: boolean }> {
    const success = await this.noteService.deleteNote(data.id);
    return { success };
  }
}