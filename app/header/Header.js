"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import navLogo from '@/public/img/club logo/nine.png';
import { usePathname } from 'next/navigation';
import { db, auth } from '@/lib/firebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, onSnapshot, orderBy, query, updateDoc, getDoc } from 'firebase/firestore'

export default function Header() {
    const [userImg, setUserImg] = useState()
    const [showUser, toggleUser] = useState(false);
    const toggle = () => {
        if(showUser) {
            toggleUser(false)
        } else {
            toggleUser(true)
        }
    }
    const ref = useRef();
    useEffect(() => {
        const handleOutSideClick = (event) => {
          if (!ref.current?.contains(event.target)) {
            toggleUser(false)
          }
        };
        const unsub = onSnapshot(doc(db, 'users', 'ALL-USERS'), doc => {
            localStorage.setItem('allUsers', JSON.stringify(doc.data().username))
        })
        setTimeout(()=>{
            console.clear();
            console.log('%cStop! Only Authors are allowed here.', "color:red; font-size:4rem; font-family: 'Cambria';")},1000)
        window.addEventListener("mousedown", handleOutSideClick);

        return () => {
          window.removeEventListener("mousedown", handleOutSideClick);
        };
      }, [ref]);
    const userLinks = [{
        title: 'Login',
        icon: "bi bi-person-check-fill",
        path: '/login'
    }, {
        title: 'Register',
        icon: "bi bi-person-fill-add",
        path: '/register'
    }]
    const pathname = usePathname();
    const navLinks = [{
        title: 'Home',
        icon: 'bi bi-house-fill',
        path: '/'
    }, {
        title: "Contests",
        icon:'bi bi-trophy-fill',
        path: '/contest'
    }, {
        title: `Problems`,
        icon:'bi bi-pencil-square',
        path: '/problems'
    }, {
        title: 'Blogs',
        icon: 'bi bi-book-half',
        path: '/blogs'
    }, {
        title: 'Our Team',
        icon: 'bi bi-people-fill',
        path: '/team'
    }, {
        title: 'Contact Us',
        icon: 'bi bi-envelope-at-fill',
        path: '/contact'
    }]
    const [dNone, dShift] = useState()
    onAuthStateChanged(auth, async user => {
        if(user) {
            dShift(false)
            const data = await getDoc(doc(db, 'users', user.uid))
            const mathRanking = [];
            const physicsRanking = [];
            const chemistryRanking = [];
            setUserImg(user.photoURL);
            const q1 = query(collection(db, 'users'), orderBy('mathScore','desc'))
            const unsub1 = onSnapshot(q1, async docs => {
                docs.forEach(doc => {
                    mathRanking.push(doc.id)
                })
            })
            const q2 = query(collection(db, 'users'), orderBy('physicsScore','desc'))
            const unsub2 = onSnapshot(q2, async docs => {
                docs.forEach(doc => {
                    physicsRanking.push(doc.id)
                })
            })
            const q3 = query(collection(db, 'users'), orderBy('chemistryScore','desc'))
            const unsub3 = onSnapshot(q3, async docs => {
                docs.forEach(doc => {
                    chemistryRanking.push(doc.id)
                })
            })
            setTimeout(async ()=>{
                mathRanking.forEach(async user => {
                    await updateDoc(doc(db, 'users', user), {
                        mathRank: mathRanking.indexOf(user) + 1
                    })
                })
                mathRanking.splice(0, mathRanking.length)
            },1000)
            setTimeout(async ()=>{
                physicsRanking.forEach(async user => {
                    await updateDoc(doc(db, 'users', user), {
                        physicsRank: physicsRanking.indexOf(user) + 1
                    })
                })
                physicsRanking.splice(0, physicsRanking.length)
            },1000)
            setTimeout(async ()=>{
                chemistryRanking.forEach(async user => {
                    await updateDoc(doc(db, 'users', user), {
                        chemistryRank: chemistryRanking.indexOf(user) + 1
                    })
                })
                chemistryRanking.splice(0, chemistryRanking.length)
            },1000)
        } else {
            toggleUser(false)
            dShift(true)
        }
    })
  return (
    <>
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
            <Link className="navbar-brand" href="/">
                <Image src={navLogo} priority={true} alt="Educate" width={97}/>
            </Link>
            <button className="custom-toggler navbar-toggler" type="button" onClick={()=>{if(showUser) toggleUser(false)}} data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" style={{color: 'white'}}></span>
            </button>

            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul className="navbar-nav">
                    {navLinks.map((link) => {
                        return (
                            <li key={link.title} className='nav-item d-flex align-items-center '>
                                <Link href={link.path} className={`nav-link ${pathname == link.path ? 'active' : ''} ${link.title == 'Profile' ? 'profile' : ''}`}>
                                    <i className={link.icon}></i> {link.title}
                                </Link>
                            </li>
                        )
                    })}
                    {userLinks.map((link) => {
                        return (
                            <li key={link.title} className={`nav-item d-flex align-items-center ${dNone ? '' : 'd-none'}`}>
                                <Link href={link.path} className={`nav-link ${pathname == link.path ? 'active' : ''} ${link.title == 'Profile' ? 'profile' : ''}`}>
                                    <i className={link.icon}></i> {link.title}
                                </Link>
                            </li>
                        )
                    })}
                    <li className='nav-item d-flex align-items-center '>
                        <Image onClick={toggle} src={userImg ? userImg : 'https://firebasestorage.googleapis.com/v0/b/educateassociation.appspot.com/o/users%2Fno-profile.png?alt=media&token=cdea15f4-3706-4812-96c9-8467bb802d31'} alt='' width={45} height={45} className={`${dNone === false ? '' : 'd-none'} bg-light border-light pp border border-1 rounded-circle`}/>
                    </li>
                </ul>
                <div ref={ref} className={`position-absolute profile-option color2 ${!showUser ? 'd-none' : ''}`} style={{backgroundColor: '#004456', borderRadius: '1rem'}}>
                    <ul className='d-flex flex-column justify-content-center align-items-center p-2 m-0'>
                        <li onClick={()=>toggleUser(false)} className='nav-item d-flex align-items-center '><Link href={'/profile'} className='nav-link profile mb-1'><i className='bi bi-person-circle'></i> Profile</Link></li>
                        <li className='nav-item d-flex align-items-center'><button onClick={() => {
                            signOut(auth);
                            toggleUser(false)
                        }} className='nav-link logout mt-1 btn btn-danger rounded-pill text-light text-bold'><i className="bi bi-box-arrow-right"></i> Logout</button></li>
                    </ul>
                </div>
            </div>
            </div>
        </nav>
    </>
  )
}
