import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import errorImg from '@/public/img/error1.png'

function NotFound() {
  return (
    <>
        <br/>
        <div className="container">
            <div className="card">
                <div className="card-body text-center">
                    <Image src={errorImg} alt="" width={500}/>
                    <br/>
                    <Link href="/">
                        <button className="view-all-blog">Go to Home <i className="bi bi-house-fill"></i></button>
                    </Link>
                </div>
            </div>
        </div>
    </>
  )
}

export default NotFound
