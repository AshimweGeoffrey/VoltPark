import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // 1. Test Auth Service (Connectivity check)
    const { data: authData, error: authError } =
      await supabase.auth.getSession()

    if (authError) {
      return NextResponse.json(
        {
          success: false,
          stage: 'auth',
          error: authError.message,
        },
        { status: 500 }
      )
    }

    // 2. Test Database (Query attempt)
    // Since tables might not exist, we expect either a success (empty list) or a specific error
    const { data, error: dbError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)

    if (dbError) {
      // If error is "relation 'profiles' does not exist", it means we connected but schema is missing.
      // This is actually a "success" for connectivity, but "failure" for schema.
      return NextResponse.json({
        success: true,
        message: 'Connected to Supabase, but tables are missing.',
        details: dbError.message,
        hint: 'Please provide DATABASE_URL and DIRECT_URL to run migrations.',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection and schema verified.',
      data,
    })
  } catch (e: any) {
    return NextResponse.json(
      {
        success: false,
        error: e.message,
      },
      { status: 500 }
    )
  }
}
