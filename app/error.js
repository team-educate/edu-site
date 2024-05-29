'use client' // Error components must be Client Components

import Image from 'next/image'
import Link from 'next/link'
import errorPic from '@/public/img/error3.svg'
import React, { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <>
    <div className="container">
    <br/>
        <div className="card">
            <div className="card-body text-center">
                <h4>Something <span className="color1">Went</span> Wrong!!!</h4>
                <Image src={errorPic} priority={true} alt="" className="error-pic" width={500}/>
                <br/>
                <div className="row">
                    <div className="col-sm-6 mb-3 mb-sm-0">
                        <Link href="/">
                            <button className="view-all-blog">Go to Home <i className="bi bi-house-fill"></i></button>
                        </Link>
                    </div>
                    <div className="col-sm-6">
                        <button onClick={reset} className="view-all-blog">Fix The Issue <i className="bi bi-arrow-clockwise"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div><br/>
    </>
  )
}