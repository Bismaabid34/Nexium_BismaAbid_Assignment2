import { NextResponse } from 'next/server';
import { translateSummaryToUrdu } from '../../../lib/translation-service';

// ✅ Handle POST requests
export async function POST(req: Request) {
  try {
    console.log('🔵 Translation API called');
    
    const body = await req.json();
    console.log('📥 Request body:', body);

    const summary = body?.summary;
    if (!summary || typeof summary !== 'string') {
      console.log('❌ Invalid summary:', summary);
      return NextResponse.json({ success: false, error: 'Summary is required' }, { status: 400 });
    }

    console.log('🔄 Calling translateSummaryToUrdu...');
    const result = await translateSummaryToUrdu(summary);
    console.log('📤 Translation result:', result);

    if (!result.success) {
      console.log('❌ Translation failed:', result.error);
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    console.log('✅ Translation successful');
    return NextResponse.json({
      success: true,
      urduTranslation: result.urduTranslation,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    console.error('💥 Translate API error:', msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// ✅ OPTIONAL: Add OPTIONS method for CORS/preflight safety
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
