// package: noteum.note
// file: note.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as common_pb from "./common_pb";

export class Note extends jspb.Message { 
    getId(): string;
    setId(value: string): Note;
    getTitle(): string;
    setTitle(value: string): Note;
    getContent(): string;
    setContent(value: string): Note;
    getAuthorId(): string;
    setAuthorId(value: string): Note;
    getStatus(): NoteStatus;
    setStatus(value: NoteStatus): Note;
    clearTagsList(): void;
    getTagsList(): Array<string>;
    setTagsList(value: Array<string>): Note;
    addTags(value: string, index?: number): string;
    getCategory(): string;
    setCategory(value: string): Note;
    getIsPublic(): boolean;
    setIsPublic(value: boolean): Note;

    hasCreatedAt(): boolean;
    clearCreatedAt(): void;
    getCreatedAt(): common_pb.Timestamp | undefined;
    setCreatedAt(value?: common_pb.Timestamp): Note;

    hasUpdatedAt(): boolean;
    clearUpdatedAt(): void;
    getUpdatedAt(): common_pb.Timestamp | undefined;
    setUpdatedAt(value?: common_pb.Timestamp): Note;
    getViewCount(): number;
    setViewCount(value: number): Note;
    getContentType(): string;
    setContentType(value: string): Note;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Note.AsObject;
    static toObject(includeInstance: boolean, msg: Note): Note.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Note, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Note;
    static deserializeBinaryFromReader(message: Note, reader: jspb.BinaryReader): Note;
}

export namespace Note {
    export type AsObject = {
        id: string,
        title: string,
        content: string,
        authorId: string,
        status: NoteStatus,
        tagsList: Array<string>,
        category: string,
        isPublic: boolean,
        createdAt?: common_pb.Timestamp.AsObject,
        updatedAt?: common_pb.Timestamp.AsObject,
        viewCount: number,
        contentType: string,
    }
}

export class Tag extends jspb.Message { 
    getId(): string;
    setId(value: string): Tag;
    getName(): string;
    setName(value: string): Tag;
    getColor(): string;
    setColor(value: string): Tag;
    getUsageCount(): number;
    setUsageCount(value: number): Tag;

    hasCreatedAt(): boolean;
    clearCreatedAt(): void;
    getCreatedAt(): common_pb.Timestamp | undefined;
    setCreatedAt(value?: common_pb.Timestamp): Tag;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Tag.AsObject;
    static toObject(includeInstance: boolean, msg: Tag): Tag.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Tag, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Tag;
    static deserializeBinaryFromReader(message: Tag, reader: jspb.BinaryReader): Tag;
}

export namespace Tag {
    export type AsObject = {
        id: string,
        name: string,
        color: string,
        usageCount: number,
        createdAt?: common_pb.Timestamp.AsObject,
    }
}

export class Category extends jspb.Message { 
    getId(): string;
    setId(value: string): Category;
    getName(): string;
    setName(value: string): Category;
    getDescription(): string;
    setDescription(value: string): Category;
    getNoteCount(): number;
    setNoteCount(value: number): Category;

    hasCreatedAt(): boolean;
    clearCreatedAt(): void;
    getCreatedAt(): common_pb.Timestamp | undefined;
    setCreatedAt(value?: common_pb.Timestamp): Category;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Category.AsObject;
    static toObject(includeInstance: boolean, msg: Category): Category.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Category, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Category;
    static deserializeBinaryFromReader(message: Category, reader: jspb.BinaryReader): Category;
}

export namespace Category {
    export type AsObject = {
        id: string,
        name: string,
        description: string,
        noteCount: number,
        createdAt?: common_pb.Timestamp.AsObject,
    }
}

export class CreateNoteRequest extends jspb.Message { 
    getTitle(): string;
    setTitle(value: string): CreateNoteRequest;
    getContent(): string;
    setContent(value: string): CreateNoteRequest;
    getAuthorId(): string;
    setAuthorId(value: string): CreateNoteRequest;
    clearTagsList(): void;
    getTagsList(): Array<string>;
    setTagsList(value: Array<string>): CreateNoteRequest;
    addTags(value: string, index?: number): string;
    getCategory(): string;
    setCategory(value: string): CreateNoteRequest;
    getIsPublic(): boolean;
    setIsPublic(value: boolean): CreateNoteRequest;
    getContentType(): string;
    setContentType(value: string): CreateNoteRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateNoteRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CreateNoteRequest): CreateNoteRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateNoteRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateNoteRequest;
    static deserializeBinaryFromReader(message: CreateNoteRequest, reader: jspb.BinaryReader): CreateNoteRequest;
}

export namespace CreateNoteRequest {
    export type AsObject = {
        title: string,
        content: string,
        authorId: string,
        tagsList: Array<string>,
        category: string,
        isPublic: boolean,
        contentType: string,
    }
}

export class CreateNoteResponse extends jspb.Message { 

    hasMetadata(): boolean;
    clearMetadata(): void;
    getMetadata(): common_pb.ResponseMetadata | undefined;
    setMetadata(value?: common_pb.ResponseMetadata): CreateNoteResponse;

    hasNote(): boolean;
    clearNote(): void;
    getNote(): Note | undefined;
    setNote(value?: Note): CreateNoteResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateNoteResponse.AsObject;
    static toObject(includeInstance: boolean, msg: CreateNoteResponse): CreateNoteResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateNoteResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateNoteResponse;
    static deserializeBinaryFromReader(message: CreateNoteResponse, reader: jspb.BinaryReader): CreateNoteResponse;
}

export namespace CreateNoteResponse {
    export type AsObject = {
        metadata?: common_pb.ResponseMetadata.AsObject,
        note?: Note.AsObject,
    }
}

export class GetNoteRequest extends jspb.Message { 
    getId(): string;
    setId(value: string): GetNoteRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetNoteRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetNoteRequest): GetNoteRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetNoteRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetNoteRequest;
    static deserializeBinaryFromReader(message: GetNoteRequest, reader: jspb.BinaryReader): GetNoteRequest;
}

export namespace GetNoteRequest {
    export type AsObject = {
        id: string,
    }
}

export class GetNoteResponse extends jspb.Message { 

    hasMetadata(): boolean;
    clearMetadata(): void;
    getMetadata(): common_pb.ResponseMetadata | undefined;
    setMetadata(value?: common_pb.ResponseMetadata): GetNoteResponse;

    hasNote(): boolean;
    clearNote(): void;
    getNote(): Note | undefined;
    setNote(value?: Note): GetNoteResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetNoteResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetNoteResponse): GetNoteResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetNoteResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetNoteResponse;
    static deserializeBinaryFromReader(message: GetNoteResponse, reader: jspb.BinaryReader): GetNoteResponse;
}

export namespace GetNoteResponse {
    export type AsObject = {
        metadata?: common_pb.ResponseMetadata.AsObject,
        note?: Note.AsObject,
    }
}

export class UpdateNoteRequest extends jspb.Message { 
    getId(): string;
    setId(value: string): UpdateNoteRequest;
    getTitle(): string;
    setTitle(value: string): UpdateNoteRequest;
    getContent(): string;
    setContent(value: string): UpdateNoteRequest;
    clearTagsList(): void;
    getTagsList(): Array<string>;
    setTagsList(value: Array<string>): UpdateNoteRequest;
    addTags(value: string, index?: number): string;
    getCategory(): string;
    setCategory(value: string): UpdateNoteRequest;
    getIsPublic(): boolean;
    setIsPublic(value: boolean): UpdateNoteRequest;
    getStatus(): NoteStatus;
    setStatus(value: NoteStatus): UpdateNoteRequest;
    getContentType(): string;
    setContentType(value: string): UpdateNoteRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UpdateNoteRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UpdateNoteRequest): UpdateNoteRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UpdateNoteRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UpdateNoteRequest;
    static deserializeBinaryFromReader(message: UpdateNoteRequest, reader: jspb.BinaryReader): UpdateNoteRequest;
}

export namespace UpdateNoteRequest {
    export type AsObject = {
        id: string,
        title: string,
        content: string,
        tagsList: Array<string>,
        category: string,
        isPublic: boolean,
        status: NoteStatus,
        contentType: string,
    }
}

export class UpdateNoteResponse extends jspb.Message { 

    hasMetadata(): boolean;
    clearMetadata(): void;
    getMetadata(): common_pb.ResponseMetadata | undefined;
    setMetadata(value?: common_pb.ResponseMetadata): UpdateNoteResponse;

    hasNote(): boolean;
    clearNote(): void;
    getNote(): Note | undefined;
    setNote(value?: Note): UpdateNoteResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UpdateNoteResponse.AsObject;
    static toObject(includeInstance: boolean, msg: UpdateNoteResponse): UpdateNoteResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UpdateNoteResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UpdateNoteResponse;
    static deserializeBinaryFromReader(message: UpdateNoteResponse, reader: jspb.BinaryReader): UpdateNoteResponse;
}

export namespace UpdateNoteResponse {
    export type AsObject = {
        metadata?: common_pb.ResponseMetadata.AsObject,
        note?: Note.AsObject,
    }
}

export class DeleteNoteRequest extends jspb.Message { 
    getId(): string;
    setId(value: string): DeleteNoteRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteNoteRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteNoteRequest): DeleteNoteRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteNoteRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteNoteRequest;
    static deserializeBinaryFromReader(message: DeleteNoteRequest, reader: jspb.BinaryReader): DeleteNoteRequest;
}

export namespace DeleteNoteRequest {
    export type AsObject = {
        id: string,
    }
}

export class DeleteNoteResponse extends jspb.Message { 

    hasMetadata(): boolean;
    clearMetadata(): void;
    getMetadata(): common_pb.ResponseMetadata | undefined;
    setMetadata(value?: common_pb.ResponseMetadata): DeleteNoteResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteNoteResponse.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteNoteResponse): DeleteNoteResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteNoteResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteNoteResponse;
    static deserializeBinaryFromReader(message: DeleteNoteResponse, reader: jspb.BinaryReader): DeleteNoteResponse;
}

export namespace DeleteNoteResponse {
    export type AsObject = {
        metadata?: common_pb.ResponseMetadata.AsObject,
    }
}

export class ListNotesRequest extends jspb.Message { 

    hasPagination(): boolean;
    clearPagination(): void;
    getPagination(): common_pb.PaginationRequest | undefined;
    setPagination(value?: common_pb.PaginationRequest): ListNotesRequest;
    getAuthorId(): string;
    setAuthorId(value: string): ListNotesRequest;
    getStatus(): NoteStatus;
    setStatus(value: NoteStatus): ListNotesRequest;
    getCategory(): string;
    setCategory(value: string): ListNotesRequest;
    clearTagsList(): void;
    getTagsList(): Array<string>;
    setTagsList(value: Array<string>): ListNotesRequest;
    addTags(value: string, index?: number): string;
    getSearchQuery(): string;
    setSearchQuery(value: string): ListNotesRequest;
    getPublicOnly(): boolean;
    setPublicOnly(value: boolean): ListNotesRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListNotesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListNotesRequest): ListNotesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListNotesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListNotesRequest;
    static deserializeBinaryFromReader(message: ListNotesRequest, reader: jspb.BinaryReader): ListNotesRequest;
}

export namespace ListNotesRequest {
    export type AsObject = {
        pagination?: common_pb.PaginationRequest.AsObject,
        authorId: string,
        status: NoteStatus,
        category: string,
        tagsList: Array<string>,
        searchQuery: string,
        publicOnly: boolean,
    }
}

export class ListNotesResponse extends jspb.Message { 

    hasMetadata(): boolean;
    clearMetadata(): void;
    getMetadata(): common_pb.ResponseMetadata | undefined;
    setMetadata(value?: common_pb.ResponseMetadata): ListNotesResponse;
    clearNotesList(): void;
    getNotesList(): Array<Note>;
    setNotesList(value: Array<Note>): ListNotesResponse;
    addNotes(value?: Note, index?: number): Note;

    hasPagination(): boolean;
    clearPagination(): void;
    getPagination(): common_pb.PaginationResponse | undefined;
    setPagination(value?: common_pb.PaginationResponse): ListNotesResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListNotesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListNotesResponse): ListNotesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListNotesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListNotesResponse;
    static deserializeBinaryFromReader(message: ListNotesResponse, reader: jspb.BinaryReader): ListNotesResponse;
}

export namespace ListNotesResponse {
    export type AsObject = {
        metadata?: common_pb.ResponseMetadata.AsObject,
        notesList: Array<Note.AsObject>,
        pagination?: common_pb.PaginationResponse.AsObject,
    }
}

export class SearchNotesRequest extends jspb.Message { 
    getQuery(): string;
    setQuery(value: string): SearchNotesRequest;

    hasPagination(): boolean;
    clearPagination(): void;
    getPagination(): common_pb.PaginationRequest | undefined;
    setPagination(value?: common_pb.PaginationRequest): SearchNotesRequest;
    getAuthorId(): string;
    setAuthorId(value: string): SearchNotesRequest;
    clearTagsList(): void;
    getTagsList(): Array<string>;
    setTagsList(value: Array<string>): SearchNotesRequest;
    addTags(value: string, index?: number): string;
    getCategory(): string;
    setCategory(value: string): SearchNotesRequest;
    getPublicOnly(): boolean;
    setPublicOnly(value: boolean): SearchNotesRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SearchNotesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SearchNotesRequest): SearchNotesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SearchNotesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SearchNotesRequest;
    static deserializeBinaryFromReader(message: SearchNotesRequest, reader: jspb.BinaryReader): SearchNotesRequest;
}

export namespace SearchNotesRequest {
    export type AsObject = {
        query: string,
        pagination?: common_pb.PaginationRequest.AsObject,
        authorId: string,
        tagsList: Array<string>,
        category: string,
        publicOnly: boolean,
    }
}

export class SearchNotesResponse extends jspb.Message { 

    hasMetadata(): boolean;
    clearMetadata(): void;
    getMetadata(): common_pb.ResponseMetadata | undefined;
    setMetadata(value?: common_pb.ResponseMetadata): SearchNotesResponse;
    clearNotesList(): void;
    getNotesList(): Array<Note>;
    setNotesList(value: Array<Note>): SearchNotesResponse;
    addNotes(value?: Note, index?: number): Note;

    hasPagination(): boolean;
    clearPagination(): void;
    getPagination(): common_pb.PaginationResponse | undefined;
    setPagination(value?: common_pb.PaginationResponse): SearchNotesResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SearchNotesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SearchNotesResponse): SearchNotesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SearchNotesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SearchNotesResponse;
    static deserializeBinaryFromReader(message: SearchNotesResponse, reader: jspb.BinaryReader): SearchNotesResponse;
}

export namespace SearchNotesResponse {
    export type AsObject = {
        metadata?: common_pb.ResponseMetadata.AsObject,
        notesList: Array<Note.AsObject>,
        pagination?: common_pb.PaginationResponse.AsObject,
    }
}

export class ListTagsRequest extends jspb.Message { 
    getSearchQuery(): string;
    setSearchQuery(value: string): ListTagsRequest;
    getLimit(): number;
    setLimit(value: number): ListTagsRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListTagsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListTagsRequest): ListTagsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListTagsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListTagsRequest;
    static deserializeBinaryFromReader(message: ListTagsRequest, reader: jspb.BinaryReader): ListTagsRequest;
}

export namespace ListTagsRequest {
    export type AsObject = {
        searchQuery: string,
        limit: number,
    }
}

export class ListTagsResponse extends jspb.Message { 

    hasMetadata(): boolean;
    clearMetadata(): void;
    getMetadata(): common_pb.ResponseMetadata | undefined;
    setMetadata(value?: common_pb.ResponseMetadata): ListTagsResponse;
    clearTagsList(): void;
    getTagsList(): Array<Tag>;
    setTagsList(value: Array<Tag>): ListTagsResponse;
    addTags(value?: Tag, index?: number): Tag;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListTagsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListTagsResponse): ListTagsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListTagsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListTagsResponse;
    static deserializeBinaryFromReader(message: ListTagsResponse, reader: jspb.BinaryReader): ListTagsResponse;
}

export namespace ListTagsResponse {
    export type AsObject = {
        metadata?: common_pb.ResponseMetadata.AsObject,
        tagsList: Array<Tag.AsObject>,
    }
}

export class ListCategoriesRequest extends jspb.Message { 
    getSearchQuery(): string;
    setSearchQuery(value: string): ListCategoriesRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListCategoriesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListCategoriesRequest): ListCategoriesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListCategoriesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListCategoriesRequest;
    static deserializeBinaryFromReader(message: ListCategoriesRequest, reader: jspb.BinaryReader): ListCategoriesRequest;
}

export namespace ListCategoriesRequest {
    export type AsObject = {
        searchQuery: string,
    }
}

export class ListCategoriesResponse extends jspb.Message { 

    hasMetadata(): boolean;
    clearMetadata(): void;
    getMetadata(): common_pb.ResponseMetadata | undefined;
    setMetadata(value?: common_pb.ResponseMetadata): ListCategoriesResponse;
    clearCategoriesList(): void;
    getCategoriesList(): Array<Category>;
    setCategoriesList(value: Array<Category>): ListCategoriesResponse;
    addCategories(value?: Category, index?: number): Category;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListCategoriesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListCategoriesResponse): ListCategoriesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListCategoriesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListCategoriesResponse;
    static deserializeBinaryFromReader(message: ListCategoriesResponse, reader: jspb.BinaryReader): ListCategoriesResponse;
}

export namespace ListCategoriesResponse {
    export type AsObject = {
        metadata?: common_pb.ResponseMetadata.AsObject,
        categoriesList: Array<Category.AsObject>,
    }
}

export enum NoteStatus {
    DRAFT = 0,
    PUBLISHED = 1,
    ARCHIVED = 2,
    DELETED = 3,
}
