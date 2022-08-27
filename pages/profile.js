import Link from 'next/link'
import { Card, Typography, Space } from '@supabase/ui'
import { supabase } from '../lib/initSupabase'

export default function Profile({ user }) {
  return (
    <div style={{ maxWidth: '420px', margin: '96px auto' }}>
     test
    </div>
  )
}

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req)

  if (!user) {
    // If no user, redirect to index.
    return { props: {}, redirect: { destination: '/', permanent: false } }
  }

  // If there is a user, return it.
  return { props: { user } }
}
