/**
 * BuildReady Blueprint — Core domain types.
 * Mirrors the Supabase schema and AI-generated blueprint JSON structure.
 */

/* Status unions */
export type ProjectStatus = 'preview' | 'unlocked'
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded'

/* Auth / user */
export interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
}

/* Questionnaire data (form answers) */
export interface QuestionnaireData {
  business_name: string
  business_type: string
  main_offer: string
  target_audience: string
  website_goal: string
  brand_style: string
  tone_of_voice: string
  colour_preferences?: string
  existing_branding?: string
  pages_needed?: string[]
  preferred_builder: string
}

/* Project (DB row) */
export interface Project {
  id: string
  user_id: string
  business_name: string
  business_type: string
  main_offer: string
  target_audience: string
  website_goal: string
  brand_style: string
  tone_of_voice: string
  colour_preferences: string
  existing_branding: string
  pages_needed: string[]
  preferred_builder: string
  status: ProjectStatus
  payment_status: PaymentStatus
  created_at: string
  updated_at: string
}

/* Blueprint JSON structure (AI-generated) */
export interface ColourSwatch {
  name: string
  hex: string
  role: string
}

export interface BrandDirection {
  personality: string
  visual_style: string
  colour_palette: ColourSwatch[]
  typography: string
  image_direction: string
}

export interface RecommendedPage {
  name: string
  purpose: string
  key_sections: string[]
}

export interface HomepageSection {
  name: string
  purpose: string
  layout: string
}

export interface WebsiteStructure {
  recommended_pages: RecommendedPage[]
  homepage_sections: HomepageSection[]
}

export interface SectionCopy {
  page: string
  heading: string
  body: string
}

export interface Copy {
  hero_headline: string
  hero_subheadline: string
  primary_cta: string
  secondary_cta: string
  section_copy: SectionCopy[]
}

export interface SEO {
  homepage_title: string
  homepage_meta_description: string
  keywords: string[]
}

export interface BuilderPrompts {
  bolt: string
  lovable: string
  framer: string
  webflow: string
  cursor: string
}

export interface BlueprintJSON {
  business_summary: string
  strategic_direction: string
  brand_direction: BrandDirection
  website_structure: WebsiteStructure
  copy: Copy
  seo: SEO
  master_prompt: string
  builder_prompts: BuilderPrompts
}

/* Blueprint (DB row) */
export interface Blueprint {
  id: string
  project_id: string
  preview_json: Partial<BlueprintJSON>
  full_blueprint_json: BlueprintJSON
  master_prompt: string
  bolt_prompt: string
  lovable_prompt: string
  framer_prompt: string
  webflow_prompt: string
  cursor_prompt: string
  created_at: string
  updated_at: string
}

/* Payment */
export interface Payment {
  id: string
  user_id: string
  project_id: string
  stripe_customer_id: string | null
  stripe_checkout_session_id: string | null
  stripe_payment_intent_id: string | null
  amount: number
  currency: string
  status: string
  created_at: string
}

/* Download */
export interface Download {
  id: string
  user_id: string
  project_id: string
  download_type: string
  created_at: string
}
