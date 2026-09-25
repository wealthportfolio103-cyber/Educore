/**
 * Database TypeScript Definitions for Supabase
 * School Management System (EduCore)
 */

export type UserRole = 'admin' | 'teacher' | 'accountant' | 'parent' | 'student';

export interface Profile {
  id: string; // References auth.users.id
  email: string;
  full_name: string;
  avatar_url?: string | null;
  role: UserRole;
  phone_number?: string | null;
  department?: string | null; // e.g., 'Science', 'Administration', 'Finance'
  student_id?: string | null; // Optional school ID badge number
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          role?: UserRole;
          phone_number?: string | null;
          department?: string | null;
          student_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: UserRole;
          phone_number?: string | null;
          department?: string | null;
          student_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedSchema: "auth";
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_role: {
        Args: { user_id: string };
        Returns: UserRole;
      };
    };
    Enums: {
      user_role: UserRole;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
