import { SupabaseClient, Session } from '@supabase/supabase-js'

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient
      safeGetSession: () => Promise<{ session: Session | null; user: Session['user'] | null }>
      session: Session | null
      user: Session['user'] | null
    }
    interface PageData {
      session: Session | null
    }
  }
}

export {}