import { fetchPost,fetchGet,fetchDel,fetchPut } from '@/lib/fetch';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  accessToken?: string;
  error?: string;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await fetchPost('/api/auth/login', { body: data });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function signup(data: SignupRequest): Promise<AuthResponse> {
  try {
    const response = await fetchPost('/api/auth/signup', { body: data });
    return response;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

export async function reset() {
  try {
    const response = await fetchGet('/api/auth/reset');
    localStorage.setItem('jwt',response.accessToken as string)
  } catch (error) {
    console.error('Reset error:', error);
    throw error;
  }
}
