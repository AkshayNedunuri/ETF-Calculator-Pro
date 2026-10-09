export interface User {
  _id?: any;
  name?: string;
  email: string;
  password?: string;
  image?: string;
  createdAt: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
}

export interface Calculation {
  _id?: any;
  userEmail: string;
  label: string;
  config: any;
  color?: string;
  createdAt: Date;
}

export interface JWTPayload {
  userId?: string;
  id?: string;
  email: string;
  name?: string;
}
