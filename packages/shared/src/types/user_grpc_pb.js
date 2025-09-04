// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var user_pb = require('./user_pb.js');
var common_pb = require('./common_pb.js');

function serialize_noteum_user_AuthenticateUserRequest(arg) {
  if (!(arg instanceof user_pb.AuthenticateUserRequest)) {
    throw new Error('Expected argument of type noteum.user.AuthenticateUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_user_AuthenticateUserRequest(buffer_arg) {
  return user_pb.AuthenticateUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_user_AuthenticateUserResponse(arg) {
  if (!(arg instanceof user_pb.AuthenticateUserResponse)) {
    throw new Error('Expected argument of type noteum.user.AuthenticateUserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_user_AuthenticateUserResponse(buffer_arg) {
  return user_pb.AuthenticateUserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_user_CreateUserRequest(arg) {
  if (!(arg instanceof user_pb.CreateUserRequest)) {
    throw new Error('Expected argument of type noteum.user.CreateUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_user_CreateUserRequest(buffer_arg) {
  return user_pb.CreateUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_user_CreateUserResponse(arg) {
  if (!(arg instanceof user_pb.CreateUserResponse)) {
    throw new Error('Expected argument of type noteum.user.CreateUserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_user_CreateUserResponse(buffer_arg) {
  return user_pb.CreateUserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_user_DeleteUserRequest(arg) {
  if (!(arg instanceof user_pb.DeleteUserRequest)) {
    throw new Error('Expected argument of type noteum.user.DeleteUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_user_DeleteUserRequest(buffer_arg) {
  return user_pb.DeleteUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_user_DeleteUserResponse(arg) {
  if (!(arg instanceof user_pb.DeleteUserResponse)) {
    throw new Error('Expected argument of type noteum.user.DeleteUserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_user_DeleteUserResponse(buffer_arg) {
  return user_pb.DeleteUserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_user_GetUserRequest(arg) {
  if (!(arg instanceof user_pb.GetUserRequest)) {
    throw new Error('Expected argument of type noteum.user.GetUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_user_GetUserRequest(buffer_arg) {
  return user_pb.GetUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_user_GetUserResponse(arg) {
  if (!(arg instanceof user_pb.GetUserResponse)) {
    throw new Error('Expected argument of type noteum.user.GetUserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_user_GetUserResponse(buffer_arg) {
  return user_pb.GetUserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_user_ListUsersRequest(arg) {
  if (!(arg instanceof user_pb.ListUsersRequest)) {
    throw new Error('Expected argument of type noteum.user.ListUsersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_user_ListUsersRequest(buffer_arg) {
  return user_pb.ListUsersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_user_ListUsersResponse(arg) {
  if (!(arg instanceof user_pb.ListUsersResponse)) {
    throw new Error('Expected argument of type noteum.user.ListUsersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_user_ListUsersResponse(buffer_arg) {
  return user_pb.ListUsersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_user_UpdateUserRequest(arg) {
  if (!(arg instanceof user_pb.UpdateUserRequest)) {
    throw new Error('Expected argument of type noteum.user.UpdateUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_user_UpdateUserRequest(buffer_arg) {
  return user_pb.UpdateUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_noteum_user_UpdateUserResponse(arg) {
  if (!(arg instanceof user_pb.UpdateUserResponse)) {
    throw new Error('Expected argument of type noteum.user.UpdateUserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_noteum_user_UpdateUserResponse(buffer_arg) {
  return user_pb.UpdateUserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// 用户服务
var UserServiceService = exports.UserServiceService = {
  // 创建用户
createUser: {
    path: '/noteum.user.UserService/CreateUser',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.CreateUserRequest,
    responseType: user_pb.CreateUserResponse,
    requestSerialize: serialize_noteum_user_CreateUserRequest,
    requestDeserialize: deserialize_noteum_user_CreateUserRequest,
    responseSerialize: serialize_noteum_user_CreateUserResponse,
    responseDeserialize: deserialize_noteum_user_CreateUserResponse,
  },
  // 获取用户
getUser: {
    path: '/noteum.user.UserService/GetUser',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.GetUserRequest,
    responseType: user_pb.GetUserResponse,
    requestSerialize: serialize_noteum_user_GetUserRequest,
    requestDeserialize: deserialize_noteum_user_GetUserRequest,
    responseSerialize: serialize_noteum_user_GetUserResponse,
    responseDeserialize: deserialize_noteum_user_GetUserResponse,
  },
  // 更新用户
updateUser: {
    path: '/noteum.user.UserService/UpdateUser',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.UpdateUserRequest,
    responseType: user_pb.UpdateUserResponse,
    requestSerialize: serialize_noteum_user_UpdateUserRequest,
    requestDeserialize: deserialize_noteum_user_UpdateUserRequest,
    responseSerialize: serialize_noteum_user_UpdateUserResponse,
    responseDeserialize: deserialize_noteum_user_UpdateUserResponse,
  },
  // 删除用户
deleteUser: {
    path: '/noteum.user.UserService/DeleteUser',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.DeleteUserRequest,
    responseType: user_pb.DeleteUserResponse,
    requestSerialize: serialize_noteum_user_DeleteUserRequest,
    requestDeserialize: deserialize_noteum_user_DeleteUserRequest,
    responseSerialize: serialize_noteum_user_DeleteUserResponse,
    responseDeserialize: deserialize_noteum_user_DeleteUserResponse,
  },
  // 获取用户列表
listUsers: {
    path: '/noteum.user.UserService/ListUsers',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.ListUsersRequest,
    responseType: user_pb.ListUsersResponse,
    requestSerialize: serialize_noteum_user_ListUsersRequest,
    requestDeserialize: deserialize_noteum_user_ListUsersRequest,
    responseSerialize: serialize_noteum_user_ListUsersResponse,
    responseDeserialize: deserialize_noteum_user_ListUsersResponse,
  },
  // 用户认证
authenticateUser: {
    path: '/noteum.user.UserService/AuthenticateUser',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.AuthenticateUserRequest,
    responseType: user_pb.AuthenticateUserResponse,
    requestSerialize: serialize_noteum_user_AuthenticateUserRequest,
    requestDeserialize: deserialize_noteum_user_AuthenticateUserRequest,
    responseSerialize: serialize_noteum_user_AuthenticateUserResponse,
    responseDeserialize: deserialize_noteum_user_AuthenticateUserResponse,
  },
};

exports.UserServiceClient = grpc.makeGenericClientConstructor(UserServiceService, 'UserService');
