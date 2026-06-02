import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


// CMS Helper functions
export async function getSiteContent(key: string) {
  const { data, error } = await supabase
    .from('site_content')
    .select('content')
    .eq('section_key', key)
    .maybeSingle()
  
  if (error || !data) return null
  return data.content
}

export async function updateSiteContent(key: string, content: string) {
  const { error } = await supabase
    .from('site_content')
    .upsert(
      { section_key: key, content, updated_at: new Date().toISOString() },
      { onConflict: 'section_key' }
    )
  
  return { success: !error, error }
}

export async function getActiveAds(location: 'footer' | 'sidebar') {
  const { data, error } = await supabase
    .from('ad_banners')
    .select('*')
    .eq('location', location)
    .eq('active', true)
  
  return { data, error }
}

export async function recordAdClick(adId: string) {
  // Use RPC for atomic increment if available, or fetch and update
  const { error } = await supabase.rpc('increment_ad_clicks', { ad_id: adId })
  return { error }
}

// Types for the database
export type SiteContent = {
  id: string
  section_key: string
  content: string
  updated_at: string
}
// ... [rest of types]

