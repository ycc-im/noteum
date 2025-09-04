export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  displayName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserService {
  createUser(userData: {
    username: string;
    email: string;
    password: string;
    displayName?: string;
  }): Promise<User>;
  
  getUserById(id: string): Promise<User | null>;
  
  getUserByUsername(username: string): Promise<User | null>;
  
  getUserByEmail(email: string): Promise<User | null>;
  
  updateUser(id: string, updateData: {
    username?: string;
    email?: string;
    displayName?: string;
  }): Promise<User | null>;
  
  deleteUser(id: string): Promise<boolean>;
}