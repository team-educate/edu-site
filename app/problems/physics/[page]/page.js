'use client';

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { db, auth } from '@/lib/firebaseConfig.js'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, limit, orderBy, startAfter, query, getDocs, getDoc, doc } from 'firebase/firestore';

const range = (a,b) => {
  const l = []
  for (let i = a; i <= b; i++) {
    l.push(i)
  }
  return l;
}
const getProblems = async (start) => {
  const q1 = query(collection(db, 'physics'), orderBy('id'), limit(50), startAfter(start))
  const docs = await getDocs(q1);
  const problems = [];
  docs.forEach(doc => {
    problems.push(doc.data())
  })
  return problems
}
const getUsers = async () => {
  const q1 = query(collection(db, 'users'), orderBy('physicsRank'), limit(10))
  const docs = await getDocs(q1);
  const users = [];
  docs.forEach(doc => {
    users.push(doc.data())
  })
  return users
}
function Physics({params}) {
  const [pages, setPages] = useState([1])
  const start = (parseInt(params.page) - 1) * 50;
  const [userDoc, setUserDoc] = useState({
    physicsSolved: [],
    physicsUnsolved: []
  })
  const [problems, setProblems] = useState([]);
  const [leaders, setLeaders] = useState([])
  useEffect(()=>{
    async function getProbs (p) {
      const data = await getProblems(p)
      setProblems(data)
      setPages(range(1, data.length))
    }
    getProbs(start)
    async function getUser (p) {
      const data2 = await getUsers(p)
      setLeaders(data2)
    }
    getUser(start)
  },[])
  onAuthStateChanged(auth, async user => {
    if(user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      setUserDoc(userDoc.data())
    }
  })
  return (
    <>
      <div className="container mt-5">
        <div className="card">
          <div className="card-header problem-header">
            Physics
          </div>
        </div>
        <br/>
        <div className="row">
          <div className="col-sm-6 mb-3 mb-sm-0">
              {problems.map(problem => {
                return(
                  <>
                    <Link key={problem.id} href={`/problems/physics/all/${problem.id}`} className="decno text-decoration-none text-dark">
                      <div className={`card ${userDoc.physicsSolved.includes(problem.id) ? 'solved' : userDoc.physicsUnsolved.includes(problem.id) ? 'unsolved' : 'notry'} card-dark`}>
                        <div className="card-body">
                            <b><h4>{problem.name}</h4></b>
                            <p>Points : {problem.point}</p>
                        </div>
                    </div>
                    </Link>
                    <br/>
                  </>
                )
              })}
          </div>
          <div className="col-sm-6">
          <div className="card top-5 position-sticky">
            <div className="card-body">
              <div className="leaderboard">
                <h5 className="text-center"><b >Rankings</b></h5>
              </div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Username</th>

                    <th scope="col">Scores</th>
                  </tr>
                </thead>
                <tbody>
                  {leaders.map(user => {
                    return (
                      <tr>
                        <th scope="row">{user.physicsRank}</th>
                        <td>{'@' + user.username}</td>

                        <td>{user.physicsScore}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <p className="text-center">
                <Link href="/problems/physics/leaderboard" className=' text-decoration-none'>
                  <span className="lead text-bold">
                    View All
                  </span>
                </Link>
              </p>
            </div>
          </div>
          </div>
      </div>
      <br/>
      <nav aria-label="..." className="center">
        <ul className="pagination justify-content-center">
          <li className={`page-item `}>
            <Link href='' className={`page-link ${params.page === '1' ? 'disabled' : ''}`}>Previous</Link>
          </li>
          {pages.map(i => {
            return (
              <>
                <li key={i} className={`page-item ${i == params.page ? 'active' : ''} ${i < params.page - 2 || i > params.page + 2 ? 'd-none' : ''}`}><Link className="page-link" href={`/problems/physics/${i}`}>{i}</Link></li>
              </>
            )
          })}
          <li className="page-item">
            <Link href='' className={`page-link ${parseInt(params.page) === pages.length ? 'disabled' : ''}`}>Next</Link>
          </li>
        </ul>
      </nav>

      </div>
    </>
  )
}

export default Physics
