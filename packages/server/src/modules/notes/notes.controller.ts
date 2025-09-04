import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NotesService } from './notes.service';
import { 
  CreateNoteRequest, 
  CreateNoteResponse, 
  GetNoteRequest, 
  GetNoteResponse,
  UpdateNoteRequest,
  UpdateNoteResponse,
  DeleteNoteRequest,
  DeleteNoteResponse 
} from '@noteum/shared';

@Controller()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @GrpcMethod('NotesService', 'CreateNote')
  async createNote(data: CreateNoteRequest): Promise<CreateNoteResponse> {
    return this.notesService.createNote(data);
  }

  @GrpcMethod('NotesService', 'GetNote')
  async getNote(data: GetNoteRequest): Promise<GetNoteResponse> {
    return this.notesService.getNote(data);
  }

  @GrpcMethod('NotesService', 'UpdateNote')
  async updateNote(data: UpdateNoteRequest): Promise<UpdateNoteResponse> {
    return this.notesService.updateNote(data);
  }

  @GrpcMethod('NotesService', 'DeleteNote')
  async deleteNote(data: DeleteNoteRequest): Promise<DeleteNoteResponse> {
    return this.notesService.deleteNote(data);
  }
}