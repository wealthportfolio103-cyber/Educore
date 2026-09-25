import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ROLE_DEFAULT_PATHS } from '@/lib/supabase/middleware';
import type { UserRole } from '@/types/database.types';

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch assigned role from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  let role: UserRole = (user.user_metadata?.role as UserRole) || 'student';

  if (profile) {
    const typed = profile as unknown as { role: UserRole };
    role = typed.role;
  }

  const destination = ROLE_DEFAULT_PATHS[role] || '/admin';
  redirect(destination);
}
