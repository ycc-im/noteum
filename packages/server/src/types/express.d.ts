declare global {
  namespace Express {
    interface Request {
      user?: import('../auth/jwt-validator').AuthInfo;
    }
  }
}

export {};