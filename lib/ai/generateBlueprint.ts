import OpenAI from 'openai'
import type {
  BlueprintJSON,
  BrandDirection,
  BuilderPrompts,
  Copy,
  HomepageSection,
  QuestionnaireData,
  RecommendedPage,
  SectionCopy,
  SEO,
  WebsiteStructure,
} from '@/types'

/**
 * Generate a build-ready blueprint from questionnaire answers.
 * Calls OpenAI to produce structured JSON. Falls back to mock when no key.
 */
export async function generateBlueprint(
  data: QuestionnaireData
): Promise<BlueprintJSON> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return mockBlueprint(data)
  }

  try {
    return await generateWithOpenAI(data, apiKey)
  } catch (err) {
    console.error('[generateBlueprint] OpenAI call failed, using mock:', err)
    return mockBlueprint(data)
  }
}

/* ------------------------------------------------------------------ *
 * OpenAI generation
 * ------------------------------------------------------------------ */

const SYSTEM_PROMPT = `You are BuildReady Blueprint's senior brand strategist and website architect. You turn a founder's short questionnaire answers into a complete, build-ready website blueprint that an AI website builder (Bolt, Lovable, Framer, Webflow, Cursor) can act on immediately.

HARD RULES:
1. Be ruthlessly specific to THIS business. Never use generic filler like "welcome to our website", "we are passionate", "quality you can trust". Every line must reference the actual business name, industry, audience, offer, or differentiation given.
2. Write confident, on-brand, conversion-focused copy — not marketing fluff. Headlines must be sharp and concrete. CTAs must be action verbs tied to the offer.
3. The blueprint must be BUILD-READY: include site structure, page-by-page layout guidance, content, visual direction (colour, type, imagery), and UX notes. No vague "TBD" placeholders.
4. Colours: return 4-5 swatches as hex codes with a clear role each (e.g. primary, accent, neutral). Choose a palette that fits the brand vibe given.
5. Typography: name a concrete Google Fonts pairing (one heading + one body font) and the rationale.
6. Master prompt and each builder prompt must be a single detailed, copy-pasteable instruction block (200-400 words) that tells the builder exactly what to build for THIS business — pages, layout, sections, copy direction, visual style, and UX behaviour.
7. SEO: a specific homepage title (<=60 chars), meta description (<=155 chars), and 8-12 concrete keywords for this business.
8. Return ONLY valid JSON matching the provided schema. No markdown, no commentary, no code fences.

Return this exact JSON shape:
{
  "business_summary": string,
  "strategic_direction": string,
  "brand_direction": {
    "personality": string,
    "visual_style": string,
    "colour_palette": [{ "name": string, "hex": string, "role": string }],
    "typography": string,
    "image_direction": string
  },
  "website_structure": {
    "recommended_pages": [{ "name": string, "purpose": string, "key_sections": [string] }],
    "homepage_sections": [{ "name": string, "purpose": string, "layout": string }]
  },
  "copy": {
    "hero_headline": string,
    "hero_subheadline": string,
    "primary_cta": string,
    "secondary_cta": string,
    "section_copy": [{ "page": string, "heading": string, "body": string }]
  },
  "seo": {
    "homepage_title": string,
    "homepage_meta_description": string,
    "keywords": [string]
  },
  "master_prompt": string,
  "builder_prompts": {
    "bolt": string,
    "lovable": string,
    "framer": string,
    "webflow": string,
    "cursor": string
  }
}`

async function generateWithOpenAI(
  data: QuestionnaireData,
  apiKey: string
): Promise<BlueprintJSON> {
  const client = new OpenAI({ apiKey })

  const userPrompt = buildUserPrompt(data)

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.8,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
  })

  const raw = completion.choices[0]?.message?.content
  if (!raw) throw new Error('Empty OpenAI response')

  const parsed = JSON.parse(raw)
  return normaliseBlueprint(parsed)
}

function buildUserPrompt(data: QuestionnaireData): string {
  const lines: string[] = []
  lines.push('Generate a build-ready website blueprint for the following business.')
  lines.push('')
  lines.push(`Business name: ${data.business_name}`)
  lines.push(`Business type: ${data.business_type}`)
  lines.push(`Main offer: ${data.main_offer}`)
  lines.push(`Target audience: ${data.target_audience}`)
  lines.push(`Website goal: ${data.website_goal}`)
  lines.push(`Brand style: ${data.brand_style}`)
  lines.push(`Tone of voice: ${data.tone_of_voice}`)
  if (data.colour_preferences) lines.push(`Colour preferences: ${data.colour_preferences}`)
  if (data.existing_branding) lines.push(`Existing branding: ${data.existing_branding}`)
  if (data.pages_needed?.length) lines.push(`Pages needed: ${data.pages_needed.join(', ')}`)
  if (data.preferred_builder) lines.push(`Preferred AI builder: ${data.preferred_builder}`)
  lines.push('')
  lines.push(`Produce the complete blueprint JSON now. Make it specific to ${data.business_name}.`)
  return lines.join('\n')
}

/* ------------------------------------------------------------------ *
 * Normalisation
 * ------------------------------------------------------------------ */

function normaliseBlueprint(b: Partial<BlueprintJSON> & Record<string, unknown>): BlueprintJSON {
  const brand = (b.brand_direction ?? {}) as Partial<BrandDirection>
  const structure = (b.website_structure ?? {}) as Partial<WebsiteStructure>
  const copy = (b.copy ?? {}) as Partial<Copy>
  const seo = (b.seo ?? {}) as Partial<SEO>
  const prompts = (b.builder_prompts ?? {}) as Partial<BuilderPrompts>

  return {
    business_summary: str(b.business_summary),
    strategic_direction: str(b.strategic_direction),
    brand_direction: {
      personality: str(brand.personality),
      visual_style: str(brand.visual_style),
      colour_palette: arr(brand.colour_palette).map(normaliseColour),
      typography: str(brand.typography),
      image_direction: str(brand.image_direction),
    },
    website_structure: {
      recommended_pages: arr(structure.recommended_pages).map(normalisePage),
      homepage_sections: arr(structure.homepage_sections).map(normaliseSection),
    },
    copy: {
      hero_headline: str(copy.hero_headline),
      hero_subheadline: str(copy.hero_subheadline),
      primary_cta: str(copy.primary_cta),
      secondary_cta: str(copy.secondary_cta),
      section_copy: arr(copy.section_copy).map(normaliseSectionCopy),
    },
    seo: {
      homepage_title: str(seo.homepage_title),
      homepage_meta_description: str(seo.homepage_meta_description),
      keywords: arr(seo.keywords).map(String),
    },
    master_prompt: str(b.master_prompt),
    builder_prompts: {
      bolt: str(prompts.bolt),
      lovable: str(prompts.lovable),
      framer: str(prompts.framer),
      webflow: str(prompts.webflow),
      cursor: str(prompts.cursor),
    },
  }
}

function str(v: unknown): string {
  return typeof v === 'string' ? v : v == null ? '' : String(v)
}

function arr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : []
}

function normaliseColour(c: unknown): { name: string; hex: string; role: string } {
  const o = (c ?? {}) as Record<string, unknown>
  return { name: str(o.name) || 'Colour', hex: str(o.hex) || '#8b5cf6', role: str(o.role) || 'accent' }
}

function normalisePage(p: unknown): RecommendedPage {
  const o = (p ?? {}) as Record<string, unknown>
  return { name: str(o.name), purpose: str(o.purpose), key_sections: arr(o.key_sections).map(String) }
}

function normaliseSection(s: unknown): HomepageSection {
  const o = (s ?? {}) as Record<string, unknown>
  return { name: str(o.name), purpose: str(o.purpose), layout: str(o.layout) }
}

function normaliseSectionCopy(s: unknown): SectionCopy {
  const o = (s ?? {}) as Record<string, unknown>
  return { page: str(o.page), heading: str(o.heading), body: str(o.body) }
}

/* ------------------------------------------------------------------ *
 * Mock fallback (no OPENAI_API_KEY)
 * ------------------------------------------------------------------ */

function mockBlueprint(data: QuestionnaireData): BlueprintJSON {
  const name = data.business_name || 'Your Business'
  const type = data.business_type || 'business'
  const offer = data.main_offer || 'quality services'
  const audience = data.target_audience || 'your ideal customers'
  const goal = data.website_goal || 'generate leads'
  const style = data.brand_style || 'modern'
  const tone = data.tone_of_voice || 'confident and friendly'

  const masterPrompt = [
    `Build a complete, production-ready marketing website for ${name}, a ${type} serving ${audience}.`,
    `Their core offer: ${offer}. Their main goal: ${goal}.`,
    `Visual direction: ${style}. Use a refined, generous layout with soft white backgrounds, rounded cards, and subtle shadows. Hero section with a bold value-led headline and a single primary CTA. Below the hero, an alternating feature/benefit section, a "How it works" 3-step section, social proof, an FAQ, and a final conversion band with a contact form.`,
    `Pages: Home, About, Services, Pricing, Contact. Include a sticky header with primary CTA and a simple footer with links, contact details, and newsletter capture.`,
    `Copy should be ${tone}, specific to ${name}, and conversion-focused — no generic filler. Ensure responsive design, accessible colour contrast, and fast LCP. Add subtle entrance animations on scroll.`,
  ].join(' ')

  const builderPromptFor = (b: string, hint: string) =>
    `You are ${b}. ${masterPrompt}\n\n${b}-specific notes: ${hint}. Use ${b}'s native components/styling conventions. Keep the result fully responsive and accessible. Populate every section with the on-brand copy above — do not leave placeholder text.`

  return {
    business_summary: `${name} is a ${type} built for ${audience}. They offer ${offer}, standing apart through ${style} positioning and a ${tone} voice. This blueprint captures their offer, brand direction, and the full website structure needed to launch a build-ready marketing site.`,
    strategic_direction: `Position ${name} as the ${tone} specialist for ${audience}. Lead with the outcome (${offer}) rather than features. The site should convert cold traffic by quickly communicating what ${name} does, who it's for, and why it's better, then ${goal} through a low-friction primary CTA.`,
    brand_direction: {
      personality: `${tone.charAt(0).toUpperCase()}${tone.slice(1)}, expert yet human. ${name} feels like a trusted partner — sharp, warm, and quietly confident.`,
      visual_style: 'Clean and modern with generous whitespace, rounded corners, soft layered shadows, and a restrained colour palette. Editorial typography hierarchy with one strong display face and a readable body face.',
      colour_palette: [
        { name: 'Primary', hex: '#6d28d9', role: 'Brand / buttons / links' },
        { name: 'Accent', hex: '#f59e0b', role: 'Highlights / CTA accents' },
        { name: 'Ink', hex: '#0f172a', role: 'Headings / body text' },
        { name: 'Cloud', hex: '#f8fafc', role: 'Section backgrounds' },
        { name: 'Mist', hex: '#e2e8f0', role: 'Borders / dividers' },
      ],
      typography: 'Headings: Sora (600/700) — geometric, confident, modern. Body: Inter (400/500) — highly legible, neutral, warm. Pair on a 1.25 modular scale with tight heading tracking.',
      image_direction: 'Authentic, candid photography of real people and real work over stock clichés. Soft natural light, negative space, and a consistent warm grade. Avoid busy backgrounds; favour subject-led compositions with depth of field.',
    },
    website_structure: {
      recommended_pages: [
        { name: 'Home', purpose: 'Convert visitors by communicating the offer in seconds and driving the primary CTA.', key_sections: ['Hero with value headline + CTA', 'Problem / solution', 'How it works (3 steps)', 'Benefits / features', 'Social proof / testimonials', 'FAQ', 'Final CTA band'] },
        { name: 'About', purpose: 'Build trust by sharing the story, team, and credibility behind the business.', key_sections: ['Origin story', 'Mission & values', 'Team', 'Credentials'] },
        { name: 'Services', purpose: 'Detail offerings with clear outcomes, process, and proof per service.', key_sections: ['Service overview', 'Process', 'Pricing tiers', 'Case studies'] },
        { name: 'Pricing', purpose: 'Make buying easy with transparent, comparable options and a clear CTA.', key_sections: ['Tier comparison', 'Feature matrix', 'FAQ', 'CTA'] },
        { name: 'Contact', purpose: 'Capture qualified leads with a low-friction form and clear response promise.', key_sections: ['Contact form', 'Contact details', 'Office hours', 'Map'] },
      ],
      homepage_sections: [
        { name: 'Hero', purpose: 'State the value proposition and drive the primary CTA within 3 seconds.', layout: 'Full-width, centred. Bold headline, supporting subheadline, two CTAs, and a hero image on the right.' },
        { name: 'Problem / Solution', purpose: 'Name the pain your audience feels and connect it to your offer.', layout: 'Two-column: pain points list on the left, solution callouts on the right.' },
        { name: 'How It Works', purpose: 'Reduce perceived effort by showing a simple 3-step process.', layout: 'Three equal cards with icon, number, short title, and one-line description.' },
        { name: 'Social Proof', purpose: 'Build trust with testimonials and logos.', layout: 'Logo strip + 2-3 testimonial cards with quote, name, and role.' },
        { name: 'Final CTA', purpose: 'Re-capture visitors ready to act.', layout: 'Full-width brand-coloured band with headline, supporting line, and a single bold CTA button.' },
      ],
    },
    copy: {
      hero_headline: `${name}: ${offer.charAt(0).toUpperCase()}${offer.slice(1)}`,
      hero_subheadline: `The ${tone} ${type} built for ${audience}. Skip the guesswork — get a ${style} experience that actually moves the needle.`,
      primary_cta: 'Start your project',
      secondary_cta: 'See how it works',
      section_copy: [
        { page: 'Home — Problem / Solution', heading: `Stop settling for ${type} that doesn't deliver`, body: `${audience} deserve a ${type} that gets results. ${name} replaces the usual friction with ${offer} — so you can focus on what you do best.` },
        { page: 'Home — How It Works', heading: `Three simple steps to ${offer}`, body: `1. Tell us your goals. 2. We map your ${type} strategy. 3. You get a build-ready plan and a ${style} site that converts.` },
        { page: 'Services', heading: `What ${name} does for you`, body: `From strategy to launch, ${name} delivers a complete ${type} solution tuned for ${audience}. Every service ties back to one goal: ${offer}.` },
        { page: 'Contact', heading: `Let's build something that works`, body: `Tell us a bit about your project and we'll reply within one business day with next steps. No pressure, no jargon — just a clear path forward with ${name}.` },
      ],
    },
    seo: {
      homepage_title: `${name} | ${type} for ${audience}`,
      homepage_meta_description: `${name} helps ${audience} with ${offer}. ${tone}, build-ready ${type} with a ${style} feel. Get started today.`,
      keywords: [name.toLowerCase(), `${type} ${audience}`, `${type} services`, `hire ${type}`, `best ${type}`, `${type} near me`, `${type} expert`, `${name} reviews`, `affordable ${type}`, `${type} consultation`],
    },
    master_prompt: masterPrompt,
    builder_prompts: {
      bolt: builderPromptFor('Bolt', 'use Bolt.new with Vite + React + Tailwind. Scaffold the marketing site as components and ship a working preview'),
      lovable: builderPromptFor('Lovable', "use Lovable's visual builder with React + Tailwind. Generate every section as a real, populated Lovable component"),
      framer: builderPromptFor('Framer', 'build this as a Framer site using Auto Layout, variants, and CMS for the testimonials and services. Export clean responsive breakpoints'),
      webflow: builderPromptFor('Webflow', 'build this in Webflow using a 12-column grid, CMS collections for services/testimonials, and clean classes. Ensure no overflow on mobile'),
      cursor: builderPromptFor('Cursor', 'scaffold a Next.js + Tailwind project in Cursor. Implement each page and section as reusable components with the copy above inlined'),
    },
  }
}
