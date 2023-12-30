import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default async function AuthButton() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()


  const goProfile= async () => {
    'use server'
    return redirect('/account')
  }

  return user ? (
   
    <div className="flex items-center gap-4">
      
      <form action={goProfile}>
      <Button>
          Profile
          </Button>
      </form>
      
    </div>
   
  ) : (
    <div className="flex items-center gap-4">
    <Link
      href="/login"
     >
        <Button>
        Login/Sign Up
        </Button>
    </Link>
    </div>
  )

}
