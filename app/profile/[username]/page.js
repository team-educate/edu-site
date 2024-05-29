import React from 'react'
import Profile from './profile.js'

export function generateMetadata({params}) {
    return {
        title: '@' + params.username + ' | Educate Association'
    }
}

function UserProfile({params}) {

  return (
    <>
        <Profile username={params.username}/>
    </>
  )
}

export default UserProfile
