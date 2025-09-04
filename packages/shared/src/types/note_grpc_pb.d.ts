// package: noteum.note
// file: note.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as note_pb from "./note_pb";
import * as common_pb from "./common_pb";

interface INoteServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    createNote: INoteServiceService_ICreateNote;
    getNote: INoteServiceService_IGetNote;
    updateNote: INoteServiceService_IUpdateNote;
    deleteNote: INoteServiceService_IDeleteNote;
    listNotes: INoteServiceService_IListNotes;
    searchNotes: INoteServiceService_ISearchNotes;
    listTags: INoteServiceService_IListTags;
    listCategories: INoteServiceService_IListCategories;
}

interface INoteServiceService_ICreateNote extends grpc.MethodDefinition<note_pb.CreateNoteRequest, note_pb.CreateNoteResponse> {
    path: "/noteum.note.NoteService/CreateNote";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<note_pb.CreateNoteRequest>;
    requestDeserialize: grpc.deserialize<note_pb.CreateNoteRequest>;
    responseSerialize: grpc.serialize<note_pb.CreateNoteResponse>;
    responseDeserialize: grpc.deserialize<note_pb.CreateNoteResponse>;
}
interface INoteServiceService_IGetNote extends grpc.MethodDefinition<note_pb.GetNoteRequest, note_pb.GetNoteResponse> {
    path: "/noteum.note.NoteService/GetNote";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<note_pb.GetNoteRequest>;
    requestDeserialize: grpc.deserialize<note_pb.GetNoteRequest>;
    responseSerialize: grpc.serialize<note_pb.GetNoteResponse>;
    responseDeserialize: grpc.deserialize<note_pb.GetNoteResponse>;
}
interface INoteServiceService_IUpdateNote extends grpc.MethodDefinition<note_pb.UpdateNoteRequest, note_pb.UpdateNoteResponse> {
    path: "/noteum.note.NoteService/UpdateNote";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<note_pb.UpdateNoteRequest>;
    requestDeserialize: grpc.deserialize<note_pb.UpdateNoteRequest>;
    responseSerialize: grpc.serialize<note_pb.UpdateNoteResponse>;
    responseDeserialize: grpc.deserialize<note_pb.UpdateNoteResponse>;
}
interface INoteServiceService_IDeleteNote extends grpc.MethodDefinition<note_pb.DeleteNoteRequest, note_pb.DeleteNoteResponse> {
    path: "/noteum.note.NoteService/DeleteNote";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<note_pb.DeleteNoteRequest>;
    requestDeserialize: grpc.deserialize<note_pb.DeleteNoteRequest>;
    responseSerialize: grpc.serialize<note_pb.DeleteNoteResponse>;
    responseDeserialize: grpc.deserialize<note_pb.DeleteNoteResponse>;
}
interface INoteServiceService_IListNotes extends grpc.MethodDefinition<note_pb.ListNotesRequest, note_pb.ListNotesResponse> {
    path: "/noteum.note.NoteService/ListNotes";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<note_pb.ListNotesRequest>;
    requestDeserialize: grpc.deserialize<note_pb.ListNotesRequest>;
    responseSerialize: grpc.serialize<note_pb.ListNotesResponse>;
    responseDeserialize: grpc.deserialize<note_pb.ListNotesResponse>;
}
interface INoteServiceService_ISearchNotes extends grpc.MethodDefinition<note_pb.SearchNotesRequest, note_pb.SearchNotesResponse> {
    path: "/noteum.note.NoteService/SearchNotes";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<note_pb.SearchNotesRequest>;
    requestDeserialize: grpc.deserialize<note_pb.SearchNotesRequest>;
    responseSerialize: grpc.serialize<note_pb.SearchNotesResponse>;
    responseDeserialize: grpc.deserialize<note_pb.SearchNotesResponse>;
}
interface INoteServiceService_IListTags extends grpc.MethodDefinition<note_pb.ListTagsRequest, note_pb.ListTagsResponse> {
    path: "/noteum.note.NoteService/ListTags";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<note_pb.ListTagsRequest>;
    requestDeserialize: grpc.deserialize<note_pb.ListTagsRequest>;
    responseSerialize: grpc.serialize<note_pb.ListTagsResponse>;
    responseDeserialize: grpc.deserialize<note_pb.ListTagsResponse>;
}
interface INoteServiceService_IListCategories extends grpc.MethodDefinition<note_pb.ListCategoriesRequest, note_pb.ListCategoriesResponse> {
    path: "/noteum.note.NoteService/ListCategories";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<note_pb.ListCategoriesRequest>;
    requestDeserialize: grpc.deserialize<note_pb.ListCategoriesRequest>;
    responseSerialize: grpc.serialize<note_pb.ListCategoriesResponse>;
    responseDeserialize: grpc.deserialize<note_pb.ListCategoriesResponse>;
}

export const NoteServiceService: INoteServiceService;

export interface INoteServiceServer {
    createNote: grpc.handleUnaryCall<note_pb.CreateNoteRequest, note_pb.CreateNoteResponse>;
    getNote: grpc.handleUnaryCall<note_pb.GetNoteRequest, note_pb.GetNoteResponse>;
    updateNote: grpc.handleUnaryCall<note_pb.UpdateNoteRequest, note_pb.UpdateNoteResponse>;
    deleteNote: grpc.handleUnaryCall<note_pb.DeleteNoteRequest, note_pb.DeleteNoteResponse>;
    listNotes: grpc.handleUnaryCall<note_pb.ListNotesRequest, note_pb.ListNotesResponse>;
    searchNotes: grpc.handleUnaryCall<note_pb.SearchNotesRequest, note_pb.SearchNotesResponse>;
    listTags: grpc.handleUnaryCall<note_pb.ListTagsRequest, note_pb.ListTagsResponse>;
    listCategories: grpc.handleUnaryCall<note_pb.ListCategoriesRequest, note_pb.ListCategoriesResponse>;
}

export interface INoteServiceClient {
    createNote(request: note_pb.CreateNoteRequest, callback: (error: grpc.ServiceError | null, response: note_pb.CreateNoteResponse) => void): grpc.ClientUnaryCall;
    createNote(request: note_pb.CreateNoteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: note_pb.CreateNoteResponse) => void): grpc.ClientUnaryCall;
    createNote(request: note_pb.CreateNoteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: note_pb.CreateNoteResponse) => void): grpc.ClientUnaryCall;
    getNote(request: note_pb.GetNoteRequest, callback: (error: grpc.ServiceError | null, response: note_pb.GetNoteResponse) => void): grpc.ClientUnaryCall;
    getNote(request: note_pb.GetNoteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: note_pb.GetNoteResponse) => void): grpc.ClientUnaryCall;
    getNote(request: note_pb.GetNoteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: note_pb.GetNoteResponse) => void): grpc.ClientUnaryCall;
    updateNote(request: note_pb.UpdateNoteRequest, callback: (error: grpc.ServiceError | null, response: note_pb.UpdateNoteResponse) => void): grpc.ClientUnaryCall;
    updateNote(request: note_pb.UpdateNoteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: note_pb.UpdateNoteResponse) => void): grpc.ClientUnaryCall;
    updateNote(request: note_pb.UpdateNoteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: note_pb.UpdateNoteResponse) => void): grpc.ClientUnaryCall;
    deleteNote(request: note_pb.DeleteNoteRequest, callback: (error: grpc.ServiceError | null, response: note_pb.DeleteNoteResponse) => void): grpc.ClientUnaryCall;
    deleteNote(request: note_pb.DeleteNoteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: note_pb.DeleteNoteResponse) => void): grpc.ClientUnaryCall;
    deleteNote(request: note_pb.DeleteNoteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: note_pb.DeleteNoteResponse) => void): grpc.ClientUnaryCall;
    listNotes(request: note_pb.ListNotesRequest, callback: (error: grpc.ServiceError | null, response: note_pb.ListNotesResponse) => void): grpc.ClientUnaryCall;
    listNotes(request: note_pb.ListNotesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: note_pb.ListNotesResponse) => void): grpc.ClientUnaryCall;
    listNotes(request: note_pb.ListNotesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: note_pb.ListNotesResponse) => void): grpc.ClientUnaryCall;
    searchNotes(request: note_pb.SearchNotesRequest, callback: (error: grpc.ServiceError | null, response: note_pb.SearchNotesResponse) => void): grpc.ClientUnaryCall;
    searchNotes(request: note_pb.SearchNotesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: note_pb.SearchNotesResponse) => void): grpc.ClientUnaryCall;
    searchNotes(request: note_pb.SearchNotesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: note_pb.SearchNotesResponse) => void): grpc.ClientUnaryCall;
    listTags(request: note_pb.ListTagsRequest, callback: (error: grpc.ServiceError | null, response: note_pb.ListTagsResponse) => void): grpc.ClientUnaryCall;
    listTags(request: note_pb.ListTagsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: note_pb.ListTagsResponse) => void): grpc.ClientUnaryCall;
    listTags(request: note_pb.ListTagsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: note_pb.ListTagsResponse) => void): grpc.ClientUnaryCall;
    listCategories(request: note_pb.ListCategoriesRequest, callback: (error: grpc.ServiceError | null, response: note_pb.ListCategoriesResponse) => void): grpc.ClientUnaryCall;
    listCategories(request: note_pb.ListCategoriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: note_pb.ListCategoriesResponse) => void): grpc.ClientUnaryCall;
    listCategories(request: note_pb.ListCategoriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: note_pb.ListCategoriesResponse) => void): grpc.ClientUnaryCall;
}

export class NoteServiceClient extends grpc.Client implements INoteServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public createNote(request: note_pb.CreateNoteRequest, callback: (error: grpc.ServiceError | null, response: note_pb.CreateNoteResponse) => void): grpc.ClientUnaryCall;
    public createNote(request: note_pb.CreateNoteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: note_pb.CreateNoteResponse) => void): grpc.ClientUnaryCall;
    public createNote(request: note_pb.CreateNoteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: note_pb.CreateNoteResponse) => void): grpc.ClientUnaryCall;
    public getNote(request: note_pb.GetNoteRequest, callback: (error: grpc.ServiceError | null, response: note_pb.GetNoteResponse) => void): grpc.ClientUnaryCall;
    public getNote(request: note_pb.GetNoteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: note_pb.GetNoteResponse) => void): grpc.ClientUnaryCall;
    public getNote(request: note_pb.GetNoteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: note_pb.GetNoteResponse) => void): grpc.ClientUnaryCall;
    public updateNote(request: note_pb.UpdateNoteRequest, callback: (error: grpc.ServiceError | null, response: note_pb.UpdateNoteResponse) => void): grpc.ClientUnaryCall;
    public updateNote(request: note_pb.UpdateNoteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: note_pb.UpdateNoteResponse) => void): grpc.ClientUnaryCall;
    public updateNote(request: note_pb.UpdateNoteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: note_pb.UpdateNoteResponse) => void): grpc.ClientUnaryCall;
    public deleteNote(request: note_pb.DeleteNoteRequest, callback: (error: grpc.ServiceError | null, response: note_pb.DeleteNoteResponse) => void): grpc.ClientUnaryCall;
    public deleteNote(request: note_pb.DeleteNoteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: note_pb.DeleteNoteResponse) => void): grpc.ClientUnaryCall;
    public deleteNote(request: note_pb.DeleteNoteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: note_pb.DeleteNoteResponse) => void): grpc.ClientUnaryCall;
    public listNotes(request: note_pb.ListNotesRequest, callback: (error: grpc.ServiceError | null, response: note_pb.ListNotesResponse) => void): grpc.ClientUnaryCall;
    public listNotes(request: note_pb.ListNotesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: note_pb.ListNotesResponse) => void): grpc.ClientUnaryCall;
    public listNotes(request: note_pb.ListNotesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: note_pb.ListNotesResponse) => void): grpc.ClientUnaryCall;
    public searchNotes(request: note_pb.SearchNotesRequest, callback: (error: grpc.ServiceError | null, response: note_pb.SearchNotesResponse) => void): grpc.ClientUnaryCall;
    public searchNotes(request: note_pb.SearchNotesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: note_pb.SearchNotesResponse) => void): grpc.ClientUnaryCall;
    public searchNotes(request: note_pb.SearchNotesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: note_pb.SearchNotesResponse) => void): grpc.ClientUnaryCall;
    public listTags(request: note_pb.ListTagsRequest, callback: (error: grpc.ServiceError | null, response: note_pb.ListTagsResponse) => void): grpc.ClientUnaryCall;
    public listTags(request: note_pb.ListTagsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: note_pb.ListTagsResponse) => void): grpc.ClientUnaryCall;
    public listTags(request: note_pb.ListTagsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: note_pb.ListTagsResponse) => void): grpc.ClientUnaryCall;
    public listCategories(request: note_pb.ListCategoriesRequest, callback: (error: grpc.ServiceError | null, response: note_pb.ListCategoriesResponse) => void): grpc.ClientUnaryCall;
    public listCategories(request: note_pb.ListCategoriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: note_pb.ListCategoriesResponse) => void): grpc.ClientUnaryCall;
    public listCategories(request: note_pb.ListCategoriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: note_pb.ListCategoriesResponse) => void): grpc.ClientUnaryCall;
}
