'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { db } from '@/lib/firebaseConfig.js'
import { collection, where, orderBy, query, getDocs, getDoc, doc } from 'firebase/firestore';
import Image from 'next/image';

const range = (a,b) => {
  const l = []
  for (let i = a; i <= b; i++) {
    l.push(i)
  }
  return l;
}

function LeaderboardPhysics() {
    const params = {
        page: 1
    }
    const [pages, setPages] = useState([1]);
    const [users, setUsers] = useState([]);
    const getTotal = async () => {
        const a = await getDoc(doc(db, 'users', 'ALL-USERS'))
        const b = a.data().email.length;
        return b;
    }
    const getUsers = async () => {
        const q1 = query(collection(db, 'users'), orderBy('physicsRank'), where('physicsRank', '>', (parseInt(params.page) - 1) * 100), where('physicsRank', '<=', parseInt(params.page) * 100))
        const docs = await getDocs(q1);
        const users = [];
        docs.forEach(doc => {
          users.push(doc.data())
        })
        return users
      }
    useEffect(() => {
        async function setup () {
            const b = await getTotal();
            const c = parseInt(b / 100) + 1;
            setPages(range(1, c));
            const something = await getUsers();
            setUsers(something);
        }
        setup();
    }, [])
  return (
    <>
      <div className="container mt-5">
        <div className="card">
          <div className="card-header problem-header">Physics Leaderboard</div>
        </div>
        <br />

        <div className="card">
          <div className="card-body">
            <div className="leaderboard">
              <h5 className="text-center">
                <b>Rankings</b>
              </h5>
            </div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col" className='fs-4'>#</th>
                  <th scope='col' className='fs-4'>Profile</th>
                  <th scope="col" className='fs-4'>Username</th>
                  <th scope="col" className='fs-4'>Scores</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                    return (
                        <tr key={user.username}>
                            <th scope="row" className='fs-4'>{user.physicsRank}</th>
                            <td className='fs-4'><Image src={user.photoURL} alt='' width={40} height={40} className='rounded-circle' /></td>
                            <td className='fs-4'>{user.username}</td>
                            <td className='fs-4'>{user.physicsScore}</td>
                        </tr>
                    )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <br />
        <nav aria-label="..." className="center">
        <ul className="pagination justify-content-center">
          <li className={`page-item `}>
            <Link href='' className={`page-link ${parseInt(params.page) == 1 ? 'disabled' : ''}`}>Previous</Link>
          </li>
          {pages.map(i => {
            return (
              <>
                <li key={i} className={`page-item ${i == params.page ? 'active' : ''} ${i < params.page - 2 || i > params.page + 2 ? 'd-none' : ''}`}><Link className="page-link" href={`/problems/physics/leaderboard/${i}`}>{i}</Link></li>
              </>
            )
          })}
          <li className="page-item">
            <Link href='' className={`page-link ${parseInt(params.page) == pages.length ? 'disabled' : ''}`}>Next</Link>
          </li>
        </ul>
      </nav>
      </div>
    </>
  );
}

export default LeaderboardPhysics;
