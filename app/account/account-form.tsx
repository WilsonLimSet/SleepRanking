'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Avatar from './avatar'
import { Database } from '../database.types'
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import CountrySelector from "../components/selector";
import { COUNTRIES } from "../lib/countries";
import { SelectMenuOption } from "../lib/types";
export default function AccountForm({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false);
  // Default this to a country's code to preselect it
  const [country, setCountry] = useState<SelectMenuOption["value"]>("BE");
  const user = session?.user

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id ?? '')
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null
    fullname: string | null
    website: string | null
    avatar_url: string | null
  }) {
    try {
      setLoading(true)

      let { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-8 mb-4 max-w-2xl mx-auto">
        <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>
      <div className="flex flex-col items-center space-y-4">
      <Avatar
        uid={user!.id}
        url={avatar_url}
        size={100}
        onUpload={(url) => {
          setAvatarUrl(url);
          // updateProfile({ fullname, username, website, avatar_url: url });
        }}
      />
    
    </div>
    <div className="space-y-1 py-2">
    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
    <input
      id="email"
      type="text"
      value={session?.user.email}
      disabled
      className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
    <div className="space-y-2 py-2">
        <label className="block text-sm font-medium text-gray-700">
          Select a country
        </label>
        <CountrySelector
          id={"country-selector"}
          open={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          onChange={setCountry}
          selectedValue={COUNTRIES.find((option) => option.value === country) || { title: 'United States', value: 'US' }}
        />
      </div>
     
       <div className="space-y-2 py-2">
    <label htmlFor="fullName" className="text-sm font-semibold text-gray-700">Full Name</label>
    <input
      id="fullName"
      type="text"
      placeholder="Enter your full name"
      value={fullname || ''}
      onChange={(e) => setFullname(e.target.value)}
      className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    />
  </div>
   
      <div className="space-y-1 py-2">
    <label htmlFor="website" className="text-sm font-semibold text-gray-700">Website</label>
    <input
      id="website"
      type="url"
      placeholder="https://yourwebsite.com"
      value={website || ''}
      onChange={(e) => setWebsite(e.target.value)}
      className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    />
  </div>
      <div className="space-y-1 py-2">
    <button
      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm text-sm font-medium"
      onClick={() => updateProfile({ fullname, username, website, avatar_url })}
      disabled={loading}
    >
      {loading ? 'Loading ...' : 'Update'}
    </button>
  </div>

  <div className="space-y-1 py-2">
    <form action="/auth/signout" method="post">
      <button
        type="submit"
        className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm text-sm font-medium"
      >
        Sign out
      </button>
    </form>
  </div>
</div>

  )
}
