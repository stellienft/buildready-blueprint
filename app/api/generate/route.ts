import { generateBlueprint } from '@/lib/ai/generateBlueprint'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { QuestionnaireData } from '@/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { projectId, data } = body as { projectId?: string; data?: QuestionnaireData }

    const questionnaireData: QuestionnaireData = data || {
      business_name: 'Demo Business',
      business_type: 'Professional services',
      main_offer: 'Consulting and strategy',
      target_audience: 'Small business owners',
      website_goal: 'Generate leads',
      brand_style: 'Minimal',
      tone_of_voice: 'Professional',
      preferred_builder: 'Bolt',
    }

    const blueprint = await generateBlueprint(questionnaireData)

    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (session && projectId) {
      await supabase.from('blueprints').insert({
        project_id: projectId,
        preview_json: {
          business_summary: blueprint.business_summary,
          strategic_direction: blueprint.strategic_direction,
          brand_direction: {
            personality: blueprint.brand_direction.personality,
            visual_style: blueprint.brand_direction.visual_style,
            colour_palette: blueprint.brand_direction.colour_palette,
          },
          copy: {
            hero_headline: blueprint.copy.hero_headline,
            hero_subheadline: blueprint.copy.hero_subheadline,
          },
          website_structure: {
            homepage_sections: blueprint.website_structure.homepage_sections,
          },
        },
        full_blueprint_json: blueprint,
        master_prompt: blueprint.master_prompt,
        bolt_prompt: blueprint.builder_prompts.bolt,
        lovable_prompt: blueprint.builder_prompts.lovable,
        framer_prompt: blueprint.builder_prompts.framer,
        webflow_prompt: blueprint.builder_prompts.webflow,
        cursor_prompt: blueprint.builder_prompts.cursor,
      })

      return NextResponse.json({ projectId })
    }

    return NextResponse.json({ projectId: null, blueprint })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
