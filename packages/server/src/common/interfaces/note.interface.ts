export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  tags?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INoteService {
  createNote(noteData: {
    title: string;
    content: string;
    userId: string;
    tags?: string;
  }): Promise<Note>;
  
  getNoteById(id: string): Promise<Note | null>;
  
  getNotesByUserId(userId: string): Promise<Note[]>;
  
  updateNote(id: string, updateData: {
    title?: string;
    content?: string;
    tags?: string;
  }): Promise<Note | null>;
  
  deleteNote(id: string): Promise<boolean>;
}