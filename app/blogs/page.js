'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import blog1 from '@/public/img/blogs/blog1.jpg'
import { Hind_Siliguri } from 'next/font/google';
import { getIdTokenResult } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig.js";
import {
    getDoc,
    doc
} from "firebase/firestore";

const hind = Hind_Siliguri({
    subsets: ['bengali'],
    display: 'swap',
    variable: '--font-hind',
    weight: ['300','400','500','600','700']
})

function Blogs() {
    const [access, setAccess] = useState(false);
    onAuthStateChanged(auth, async user => {
        if (user) {
            const adminToken = await getIdTokenResult(user);
            const dbRes = await getDoc(doc(db, 'users', user.uid));
            if (adminToken.claims.admin) setAccess(true);
            else if (dbRes.data().roles?.includes("blog")) setAccess(true);
        }
    })
    const blogs = [{
        id: 1,
        title: 'হাইজেনবার্গের অনিশ্চয়তা নীতি',
        author: 'Ahmmed Al Junaed',
        img: blog1
    }, {
        id: 2,
        title: 'হাইজেনবার্গের অনিশ্চয়তা নীতি',
        author: 'Ahmmed Al Junaed',
        img: blog1
    }]
  return (
    <>
        <br/>
        <div className='container'>
            <div className='card'>
                <div className='card-header problem-header d-flex'>
                    <h2 className='flex-grow-1 m-0'>Blogs</h2>
                    {access ? (<button style={{width: 'auto'}} className='view-all-blog flex-grow-0'><i className="bi bi-plus-circle"></i> Add Blog</button>) : (<></>)}
                </div>
            </div><br/>
            <div  className='d-flex flex-wrap justify-content-center align-items-center row-type'>
                {blogs.map((blog)=>{
                    return(
                        <>
                        <div key={blog.id} className="col-sm-6 col-max-2 mb-3 mb-sm-0">
                            <div className="card">
                                <Image src={blog.img} alt="" className="blog-img"/>

                                <div className="card-body text-center">
                                    <h3 className={hind.className}><b>{blog.title}</b></h3>
                                    <p>{blog.author}</p>
                                    <Link href={`/blogs/${blog.id}`}>
                                        <button className="blogb">Read<i className="bi bi-caret-right"></i></button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        </>
                    )
                })}
            </div>
        </div>
    </>
  )
}

export default Blogs
