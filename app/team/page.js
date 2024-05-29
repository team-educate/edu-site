'use client';

import Image from "next/image";
import React, { useEffect, useState } from "react";
import noProfile from '@/public/img/members/nopic.png'
import { db } from '@/lib/firebaseConfig.js'
import { collection, getDocs, orderBy, query } from "firebase/firestore";

async function getFirestoreData(){
    const q = query(collection(db, 'team'), orderBy('id'));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach(snapshot => {
        if(!snapshot) console.error("Something went wrong. Check your internet connection and try again.")
        data.push(snapshot.data())
    })
    return data;
}

export default function Team(){
    const [members, addMember] = useState([]);

    useEffect(()=>{
        async function getData(){
            const data = await getFirestoreData();
            addMember(data);
        }
        getData()
    },[])
    return (
        <><br/>
            <div className="container">
                <div className="card team-card">
                    <div className="card-header">
                        Team members
                    </div>
                </div><br/>
                <div className="d-flex row-type flex-wrap justify-content-center align-items-center">
                {members.map(member => {
                    return(
                    <>
                        <div key={member.id} className="col-sm-6 col-max-2 mb-3 mb-sm-0">
                            <div className="card text-center">
                                <Image priority={true} className="rounded-circle mem-pic" width={180} height={180} src={member.img ? member.img : noProfile} alt=""/>
                                <div className="card-body">
                                    <h5 className="card-title">{member.name}</h5>
                                    <p className="card-text">{member.title}</p>
                                    <div className=" mem-link">
                                        <a href={member.fb} target="_blank"><i className="bi bi-facebook"></i></a>
                                        <a href={`mailto:${member.email}`} target="_blank"><i className="bi bi-envelope"></i></a>

                                    </div>
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