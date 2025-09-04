// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var note_pb = require('./note_pb.js');
var common_pb = require('./common_pb.js');

function serialize_noteum_note_CreateNoteRequest(arg) {
  if (!(arg instanceof note_pb.CreateNoteRequest)) {
    throw new Error('Expected argument of type noteum.note.CreateNoteRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_note_CreateNoteRequest(buffer_arg) {
  return note_pb.CreateNoteRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_note_CreateNoteResponse(arg) {
  if (!(arg instanceof note_pb.CreateNoteResponse)) {
    throw new Error('Expected argument of type noteum.note.CreateNoteResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_note_CreateNoteResponse(buffer_arg) {
  return note_pb.CreateNoteResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_note_DeleteNoteRequest(arg) {
  if (!(arg instanceof note_pb.DeleteNoteRequest)) {
    throw new Error('Expected argument of type noteum.note.DeleteNoteRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_note_DeleteNoteRequest(buffer_arg) {
  return note_pb.DeleteNoteRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_note_DeleteNoteResponse(arg) {
  if (!(arg instanceof note_pb.DeleteNoteResponse)) {
    throw new Error('Expected argument of type noteum.note.DeleteNoteResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_note_DeleteNoteResponse(buffer_arg) {
  return note_pb.DeleteNoteResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_note_GetNoteRequest(arg) {
  if (!(arg instanceof note_pb.GetNoteRequest)) {
    throw new Error('Expected argument of type noteum.note.GetNoteRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_note_GetNoteRequest(buffer_arg) {
  return note_pb.GetNoteRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_note_GetNoteResponse(arg) {
  if (!(arg instanceof note_pb.GetNoteResponse)) {
    throw new Error('Expected argument of type noteum.note.GetNoteResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_note_GetNoteResponse(buffer_arg) {
  return note_pb.GetNoteResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_note_ListCategoriesRequest(arg) {
  if (!(arg instanceof note_pb.ListCategoriesRequest)) {
    throw new Error('Expected argument of type noteum.note.ListCategoriesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_note_ListCategoriesRequest(buffer_arg) {
  return note_pb.ListCategoriesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_note_ListCategoriesResponse(arg) {
  if (!(arg instanceof note_pb.ListCategoriesResponse)) {
    throw new Error('Expected argument of type noteum.note.ListCategoriesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_note_ListCategoriesResponse(buffer_arg) {
  return note_pb.ListCategoriesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_note_ListNotesRequest(arg) {
  if (!(arg instanceof note_pb.ListNotesRequest)) {
    throw new Error('Expected argument of type noteum.note.ListNotesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_note_ListNotesRequest(buffer_arg) {
  return note_pb.ListNotesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_note_ListNotesResponse(arg) {
  if (!(arg instanceof note_pb.ListNotesResponse)) {
    throw new Error('Expected argument of type noteum.note.ListNotesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_note_ListNotesResponse(buffer_arg) {
  return note_pb.ListNotesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_note_ListTagsRequest(arg) {
  if (!(arg instanceof note_pb.ListTagsRequest)) {
    throw new Error('Expected argument of type noteum.note.ListTagsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_note_ListTagsRequest(buffer_arg) {
  return note_pb.ListTagsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_note_ListTagsResponse(arg) {
  if (!(arg instanceof note_pb.ListTagsResponse)) {
    throw new Error('Expected argument of type noteum.note.ListTagsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_note_ListTagsResponse(buffer_arg) {
  return note_pb.ListTagsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_note_SearchNotesRequest(arg) {
  if (!(arg instanceof note_pb.SearchNotesRequest)) {
    throw new Error('Expected argument of type noteum.note.SearchNotesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_note_SearchNotesRequest(buffer_arg) {
  return note_pb.SearchNotesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_note_SearchNotesResponse(arg) {
  if (!(arg instanceof note_pb.SearchNotesResponse)) {
    throw new Error('Expected argument of type noteum.note.SearchNotesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_note_SearchNotesResponse(buffer_arg) {
  return note_pb.SearchNotesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_note_UpdateNoteRequest(arg) {
  if (!(arg instanceof note_pb.UpdateNoteRequest)) {
    throw new Error('Expected argument of type noteum.note.UpdateNoteRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_note_UpdateNoteRequest(buffer_arg) {
  return note_pb.UpdateNoteRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_note_UpdateNoteResponse(arg) {
  if (!(arg instanceof note_pb.UpdateNoteResponse)) {
    throw new Error('Expected argument of type noteum.note.UpdateNoteResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_note_UpdateNoteResponse(buffer_arg) {
  return note_pb.UpdateNoteResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// 笔记服务
var NoteServiceService = exports.NoteServiceService = {
  // 创建笔记
createNote: {
    path: '/noteum.note.NoteService/CreateNote',
    requestStream: false,
    responseStream: false,
    requestType: note_pb.CreateNoteRequest,
    responseType: note_pb.CreateNoteResponse,
    requestSerialize: serialize_noteum_note_CreateNoteRequest,
    requestDeserialize: deserialize_noteum_note_CreateNoteRequest,
    responseSerialize: serialize_noteum_note_CreateNoteResponse,
    responseDeserialize: deserialize_noteum_note_CreateNoteResponse,
  },
  // 获取笔记
getNote: {
    path: '/noteum.note.NoteService/GetNote',
    requestStream: false,
    responseStream: false,
    requestType: note_pb.GetNoteRequest,
    responseType: note_pb.GetNoteResponse,
    requestSerialize: serialize_noteum_note_GetNoteRequest,
    requestDeserialize: deserialize_noteum_note_GetNoteRequest,
    responseSerialize: serialize_noteum_note_GetNoteResponse,
    responseDeserialize: deserialize_noteum_note_GetNoteResponse,
  },
  // 更新笔记
updateNote: {
    path: '/noteum.note.NoteService/UpdateNote',
    requestStream: false,
    responseStream: false,
    requestType: note_pb.UpdateNoteRequest,
    responseType: note_pb.UpdateNoteResponse,
    requestSerialize: serialize_noteum_note_UpdateNoteRequest,
    requestDeserialize: deserialize_noteum_note_UpdateNoteRequest,
    responseSerialize: serialize_noteum_note_UpdateNoteResponse,
    responseDeserialize: deserialize_noteum_note_UpdateNoteResponse,
  },
  // 删除笔记
deleteNote: {
    path: '/noteum.note.NoteService/DeleteNote',
    requestStream: false,
    responseStream: false,
    requestType: note_pb.DeleteNoteRequest,
    responseType: note_pb.DeleteNoteResponse,
    requestSerialize: serialize_noteum_note_DeleteNoteRequest,
    requestDeserialize: deserialize_noteum_note_DeleteNoteRequest,
    responseSerialize: serialize_noteum_note_DeleteNoteResponse,
    responseDeserialize: deserialize_noteum_note_DeleteNoteResponse,
  },
  // 获取笔记列表
listNotes: {
    path: '/noteum.note.NoteService/ListNotes',
    requestStream: false,
    responseStream: false,
    requestType: note_pb.ListNotesRequest,
    responseType: note_pb.ListNotesResponse,
    requestSerialize: serialize_noteum_note_ListNotesRequest,
    requestDeserialize: deserialize_noteum_note_ListNotesRequest,
    responseSerialize: serialize_noteum_note_ListNotesResponse,
    responseDeserialize: deserialize_noteum_note_ListNotesResponse,
  },
  // 搜索笔记
searchNotes: {
    path: '/noteum.note.NoteService/SearchNotes',
    requestStream: false,
    responseStream: false,
    requestType: note_pb.SearchNotesRequest,
    responseType: note_pb.SearchNotesResponse,
    requestSerialize: serialize_noteum_note_SearchNotesRequest,
    requestDeserialize: deserialize_noteum_note_SearchNotesRequest,
    responseSerialize: serialize_noteum_note_SearchNotesResponse,
    responseDeserialize: deserialize_noteum_note_SearchNotesResponse,
  },
  // 获取标签列表
listTags: {
    path: '/noteum.note.NoteService/ListTags',
    requestStream: false,
    responseStream: false,
    requestType: note_pb.ListTagsRequest,
    responseType: note_pb.ListTagsResponse,
    requestSerialize: serialize_noteum_note_ListTagsRequest,
    requestDeserialize: deserialize_noteum_note_ListTagsRequest,
    responseSerialize: serialize_noteum_note_ListTagsResponse,
    responseDeserialize: deserialize_noteum_note_ListTagsResponse,
  },
  // 获取分类列表
listCategories: {
    path: '/noteum.note.NoteService/ListCategories',
    requestStream: false,
    responseStream: false,
    requestType: note_pb.ListCategoriesRequest,
    responseType: note_pb.ListCategoriesResponse,
    requestSerialize: serialize_noteum_note_ListCategoriesRequest,
    requestDeserialize: deserialize_noteum_note_ListCategoriesRequest,
    responseSerialize: serialize_noteum_note_ListCategoriesResponse,
    responseDeserialize: deserialize_noteum_note_ListCategoriesResponse,
  },
};

exports.NoteServiceClient = grpc.makeGenericClientConstructor(NoteServiceService, 'NoteService');
