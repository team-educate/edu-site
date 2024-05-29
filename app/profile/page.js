'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebaseConfig.js'
import Link from 'next/link'
import { onAuthStateChanged } from 'firebase/auth'
import React from 'react'

function ProfileRedirect() {
    const router = useRouter()
    onAuthStateChanged(auth, user=>{
        if(user) router.replace('/profile/' + user.uid);
        else router.replace('/login');
    })
  return (
    <>
        <br/>
        <div className="container">
        <br/>
            <div className="card">
                <div className="card-body text-center justify-content-center">
                    <div className="book">
                        <div className="book__pg-shadow"></div>
                        <div className="book__pg"></div>
                        <div className="book__pg book__pg--2"></div>
                        <div className="book__pg book__pg--3"></div>
                        <div className="book__pg book__pg--4"></div>
                        <div className="book__pg book__pg--5"></div>
                    </div>
                    <br/>
                    <div className="load fs-1">
                        <span className="color1">Redirecting...</span>
                        <span>Please</span> <span className="color2">Wait</span> <span>Sometimes</span>
                    </div>
                    <br/>
                    <br/>
                    <div className="row">
                        <div className="mb-3 mb-sm-0">
                            <Link href="/">
                                <button className="view-all-blog">Go to Home <i className="bi bi-house-fill"></i></button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div><br/>
    </>
  )
}

export default ProfileRedirect