import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Note, INoteService } from '../common/interfaces/note.interface';
import { CreateNoteDto, UpdateNoteDto, NoteResponseDto } from '../common/dto/note.dto';
import { UserService } from './user.service';

@Injectable()
export class NoteService implements INoteService {
  // In-memory storage for demonstration
  // In a real application, this would be replaced with database integration
  private notes: Map<string, Note> = new Map();
  private noteCounter = 1;

  constructor(private readonly userService: UserService) {}

  async createNote(noteData: {
    title: string;
    content: string;
    userId: string;
    tags?: string;
  }): Promise<Note> {
    // Verify user exists
    const user = await this.userService.getUserById(noteData.userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${noteData.userId} not found`);
    }

    const noteId = this.noteCounter.toString();
    this.noteCounter++;

    const note: Note = {
      id: noteId,
      title: noteData.title,
      content: noteData.content,
      userId: noteData.userId,
      tags: noteData.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.notes.set(noteId, note);
    return note;
  }

  async getNoteById(id: string): Promise<Note | null> {
    return this.notes.get(id) || null;
  }

  async getNotesByUserId(userId: string): Promise<Note[]> {
    const userNotes: Note[] = [];
    
    for (const note of this.notes.values()) {
      if (note.userId === userId) {
        userNotes.push(note);
      }
    }
    
    // Sort by creation date, newest first
    return userNotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateNote(id: string, updateData: {
    title?: string;
    content?: string;
    tags?: string;
  }): Promise<Note | null> {
    const note = this.notes.get(id);
    if (!note) {
      return null;
    }

    const updatedNote: Note = {
      ...note,
      ...updateData,
      updatedAt: new Date(),
    };

    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: string): Promise<boolean> {
    return this.notes.delete(id);
  }

  // Helper method to verify note ownership
  async verifyNoteOwnership(noteId: string, userId: string): Promise<boolean> {
    const note = await this.getNoteById(noteId);
    return note ? note.userId === userId : false;
  }

  // Helper method to convert Note to NoteResponseDto
  toResponseDto(note: Note): NoteResponseDto {
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      userId: note.userId,
      tags: note.tags,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  }
}