import { supabase } from '../supabase';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

export interface IAuthService {
  signUp(email: string, password: string): Promise<User | null>;
  signIn(email: string, password: string): Promise<Session | null>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void): any;
}

export class SupabaseAuthService implements IAuthService {
  async signUp(email: string, password: string): Promise<User | null> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      throw new Error(error.message);
    }
    return data.user;
  }

  async signIn(email: string, password: string): Promise<Session | null> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(error.message);
    }
    return data.session;
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      throw new Error(error.message);
    }
  }

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void): any {
    return supabase.auth.onAuthStateChange(callback);
  }
}
