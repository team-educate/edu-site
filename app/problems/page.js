import Image from 'next/image'
import React from 'react'
import math from '@/public/img/math.png'
import physics from '@/public/img/physics.png'
import chemistry from '@/public/img/chemistry.png'
import Link from 'next/link'

function Problems() {
  return (
    <>
        <div className="container mt-5">
            <Link className='text-decoration-none text-dark' href="/problems/math">
                <div className="card text-center card-dark">
                <div className="card-body">
                <Image src={math} alt="" width={50}/>
                <br/>
                <span className="big">Math</span>
                </div>
                </div>
            </Link>
            <br/>
            <Link className='text-decoration-none text-dark' href="/problems/physics">
                <div className="card text-center card-dark">
                <div className="card-body">
                    <Image src={physics} alt="" width={50}/>
                <br/>
                <span className="big">Physics</span>
                </div>
                </div>
            </Link>
            <br/>
            <Link className='text-decoration-none text-dark' href="/problems/chemistry">
                <div className="card text-center card-dark">
                <div className="card-body">
                    <Image src={chemistry} alt="" width={50}/>
                <br/>
                <span className="big">Chemistry</span>
                </div>
                </div>
            </Link>

        </div>
    </>
  )
}

export default Problems
