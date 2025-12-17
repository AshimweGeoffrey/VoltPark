const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Simple .env parser
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local')
    if (!fs.existsSync(envPath)) {
      console.error('❌ .env.local file not found!')
      return {}
    }
    const envContent = fs.readFileSync(envPath, 'utf8')
    const env = {}
    envContent.split('\n').forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        const value = match[2].trim().replace(/^["']|["']$/g, '') // remove quotes
        env[key] = value
      }
    })
    return env
  } catch (e) {
    console.error('Error reading .env.local:', e)
    return {}
  }
}

async function testConnection() {
  console.log('🔄 Loading environment variables...')
  const env = loadEnv()

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (
    !supabaseUrl ||
    !supabaseKey ||
    supabaseUrl.includes('your-project-url')
  ) {
    console.error(
      '❌ Missing or placeholder Supabase credentials in .env.local'
    )
    console.log('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
    console.log(
      '   NEXT_PUBLIC_SUPABASE_ANON_KEY:',
      supabaseKey ? '***' : 'undefined'
    )
    return
  }

  console.log('✅ Credentials found.')
  console.log(`   URL: ${supabaseUrl}`)

  console.log('🔄 Connecting to Supabase...')
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (error) {
      if (
        error.code === 'PGRST204' ||
        error.message.includes('does not exist')
      ) {
        console.log('✅ Connection SUCCESSFUL! (But tables are missing)')
        console.log(
          '   The "profiles" table does not exist yet. You need to run migrations.'
        )
        console.log('   Run: npx prisma db push')
      } else {
        console.error('❌ Connection Failed:', error.message)
      }
    } else {
      console.log('✅ Connection SUCCESSFUL!')
      console.log('   Database is reachable and "profiles" table exists.')
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message)
  }
}

testConnection()
