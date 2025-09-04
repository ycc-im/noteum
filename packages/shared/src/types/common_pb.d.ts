// package: noteum.common
// file: common.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class Timestamp extends jspb.Message { 
    getSeconds(): number;
    setSeconds(value: number): Timestamp;
    getNanos(): number;
    setNanos(value: number): Timestamp;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Timestamp.AsObject;
    static toObject(includeInstance: boolean, msg: Timestamp): Timestamp.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Timestamp, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Timestamp;
    static deserializeBinaryFromReader(message: Timestamp, reader: jspb.BinaryReader): Timestamp;
}

export namespace Timestamp {
    export type AsObject = {
        seconds: number,
        nanos: number,
    }
}

export class ResponseMetadata extends jspb.Message { 
    getStatus(): ResponseStatus;
    setStatus(value: ResponseStatus): ResponseMetadata;
    getMessage(): string;
    setMessage(value: string): ResponseMetadata;
    getRequestId(): string;
    setRequestId(value: string): ResponseMetadata;

    hasTimestamp(): boolean;
    clearTimestamp(): void;
    getTimestamp(): Timestamp | undefined;
    setTimestamp(value?: Timestamp): ResponseMetadata;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ResponseMetadata.AsObject;
    static toObject(includeInstance: boolean, msg: ResponseMetadata): ResponseMetadata.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ResponseMetadata, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ResponseMetadata;
    static deserializeBinaryFromReader(message: ResponseMetadata, reader: jspb.BinaryReader): ResponseMetadata;
}

export namespace ResponseMetadata {
    export type AsObject = {
        status: ResponseStatus,
        message: string,
        requestId: string,
        timestamp?: Timestamp.AsObject,
    }
}

export class PaginationRequest extends jspb.Message { 
    getPage(): number;
    setPage(value: number): PaginationRequest;
    getSize(): number;
    setSize(value: number): PaginationRequest;
    getSortBy(): string;
    setSortBy(value: string): PaginationRequest;
    getAscending(): boolean;
    setAscending(value: boolean): PaginationRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PaginationRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PaginationRequest): PaginationRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PaginationRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PaginationRequest;
    static deserializeBinaryFromReader(message: PaginationRequest, reader: jspb.BinaryReader): PaginationRequest;
}

export namespace PaginationRequest {
    export type AsObject = {
        page: number,
        size: number,
        sortBy: string,
        ascending: boolean,
    }
}

export class PaginationResponse extends jspb.Message { 
    getCurrentPage(): number;
    setCurrentPage(value: number): PaginationResponse;
    getPageSize(): number;
    setPageSize(value: number): PaginationResponse;
    getTotalPages(): number;
    setTotalPages(value: number): PaginationResponse;
    getTotalItems(): number;
    setTotalItems(value: number): PaginationResponse;
    getHasNext(): boolean;
    setHasNext(value: boolean): PaginationResponse;
    getHasPrevious(): boolean;
    setHasPrevious(value: boolean): PaginationResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PaginationResponse.AsObject;
    static toObject(includeInstance: boolean, msg: PaginationResponse): PaginationResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PaginationResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PaginationResponse;
    static deserializeBinaryFromReader(message: PaginationResponse, reader: jspb.BinaryReader): PaginationResponse;
}

export namespace PaginationResponse {
    export type AsObject = {
        currentPage: number,
        pageSize: number,
        totalPages: number,
        totalItems: number,
        hasNext: boolean,
        hasPrevious: boolean,
    }
}

export class Id extends jspb.Message { 
    getValue(): string;
    setValue(value: string): Id;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Id.AsObject;
    static toObject(includeInstance: boolean, msg: Id): Id.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Id, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Id;
    static deserializeBinaryFromReader(message: Id, reader: jspb.BinaryReader): Id;
}

export namespace Id {
    export type AsObject = {
        value: string,
    }
}

export class Empty extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Empty.AsObject;
    static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Empty, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Empty;
    static deserializeBinaryFromReader(message: Empty, reader: jspb.BinaryReader): Empty;
}

export namespace Empty {
    export type AsObject = {
    }
}

export enum ResponseStatus {
    SUCCESS = 0,
    ERROR = 1,
    NOT_FOUND = 2,
    UNAUTHORIZED = 3,
    FORBIDDEN = 4,
    INVALID_REQUEST = 5,
}
