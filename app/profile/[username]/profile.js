"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebaseConfig.js";
import {
  onAuthStateChanged,
  sendEmailVerification,
  getIdTokenResult,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function Profile({ username }) {
  const [admin, setAdmin] = useState();
  const [open, setOpen] = useState("Loading...Please wait.");
  const router = useRouter();
  const [user, setUser] = useState({ emailVerified: true });
  const [userDoc, setUserDoc] = useState({
    username: username,
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/educateassociation.appspot.com/o/users%2Fno-profile.png?alt=media&token=cdea15f4-3706-4812-96c9-8467bb802d31",
  });
  const load = async () => {
    const docSnap = await getDoc(doc(db, "users", username));
    if (docSnap.exists() && username != "ALL-USERS") {
      setUserDoc(docSnap.data());
    } else {
      setOpen("User not found");
    }
  };
  useEffect(() => {
    load();
  }, []);
  const verifyEmail = () => {
    if (!user.emailVerified) {
      dText(true);
      sendEmailVerification(user).then(() => {
        alert("Verification email sent.");
      });
    }
  };
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      setUser(user);
      const token = await getIdTokenResult(user);
      if (token.claims.admin) setAdmin(true);
      user.emailVerified && user.uid == username
        ? toggleVer(true)
        : toggleVer(false);
    }
  });
  const [showVer, toggleVer] = useState(false);
  const [disableText, dText] = useState(false);
  return (
    <>
      {userDoc.email ? (
        <>
          <div
            className={`container confirm-email bg-warning rounded-bottom text-dark pt-3 pb-1 pe-5 ps-5 ${
              user.emailVerified ? "d-none" : ""
            } ${disableText ? "disable-text" : ""}`}
          >
            <p className="fs-5">
              {" "}
              Your email is not verified. Click here to{" "}
              <Link onClick={verifyEmail} href="" className=" text-dark">
                Send verification email
              </Link>
              .
            </p>
          </div>
          <div className="container">
            <br />
            <span className="text-center">
              <h2>Profile</h2>

              <div
                className="progress pg1"
                role="progressbar"
                aria-label="Basic example"
                aria-valuenow="50"
                aria-valuemin="0"
                aria-valuemax="50"
              >
                <div className="progress-bar pb1"></div>
              </div>
              <br />
            </span>
            <div className="row">
              <div className="col-sm-6 mb-3 mb-sm-0">
                <div className="card">
                  <div className="card-header problem-header">
                    <b>Picture</b>
                  </div>
                  <div className="card-body">
                    <Image
                      src={userDoc.photoURL}
                      alt="Profile picture"
                      width={180}
                      height={180}
                      className="mem-pic rounded-circle border border-dark border-2"
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="card">
                  <div className="card-header problem-header">
                    <b>Informations</b>
                  </div>
                  <div className="card-body">
                    <p className=" bigg" style={{ lineHeight: "35px" }}>
                      {`Username : @${username}`}
                      <br />
                      {`Name : ${userDoc.name}`}
                      <br />
                      {`School : ${userDoc.institute}`}
                      <br />
                      {`Class : ${userDoc.class}`}
                      <br />
                      {`E-mail : ${userDoc.email}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <Link href="/edit_profile" className={user.uid ? "" : "d-none"}>
              <button className="view-all-blog">
                Edit Profile <i className="bi bi-vector-pen"></i>
              </button>
            </Link>
            <br />
            {admin ? (
              <>
                <br />
                <div className="card">
                  <div className="card-header problem-header">
                    Admin Control
                  </div>
                  <div className="card-body text-center gr-4">
                    <button
                      className="view-all-blog"
                      onClick={() => {
                        router.push("/assign_role");
                      }}
                    >
                      <i className="bi bi-person-gear"></i> Assign Role
                    </button>
                    <button
                      className="view-all-blog"
                      onClick={() => router.push("/add_blog")}
                    >
                      <i className="bi bi-plus-circle"></i> Add Blog
                    </button>
                    <button
                      className="view-all-blog"
                      onClick={() => router.push("/add_problem")}
                    >
                      <i className="bi bi-plus-circle"></i> Add Problem
                    </button>
                    <button
                      className="view-all-blog"
                      onClick={() => router.push("/add_member")}
                    >
                      <i className="bi bi-plus-circle"></i> Add Member
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
            <br />
            <div className="card">
              <div className="card-header problem-header">Stats</div>
              <div className="card-body text-center">
                <div className="row">
                  <div className="col">
                    <b>Math</b>
                  </div>
                  <div className="col">
                    <b>Physics</b>
                  </div>
                  <div className="col">
                    <b>Chemistry</b>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <b>{`${userDoc.mathScore} Points`}</b>
                  </div>
                  <div className="col">
                    <b>{`${userDoc.physicsScore} Points`}</b>
                  </div>
                  <div className="col">
                    <b>{`${userDoc.chemistryScore} Points`}</b>
                  </div>
                </div>
                <div
                  className={`row ${userDoc.submission > 0 ? "" : "d-none"}`}
                >
                  <div className="col">
                    <b>{`#${userDoc.mathRank}`}</b>
                  </div>
                  <div className="col">
                    <b>{`#${userDoc.physicsRank}`}</b>
                  </div>
                  <div className="col">
                    <b>{`#${userDoc.chemistryRank}`}</b>
                  </div>
                </div>
              </div>
            </div>
            <br />

            {/*<div className={`card ${showVer ? "" : "d-none"}`}>
              <div className={`card-header problem-header `}>Notifications</div>
              <div className="card-body">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Messeges</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">1</th>
                      <td>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ratione, quisquam animi voluptate, rerum ipsa suscipit
                        dignissimos pariatur assumenda delectus tempora numquam
                        exercitationem, rem a ad culpa recusandae minus dolor
                        ipsum?
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">2</th>
                      <td>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Rerum animi distinctio quibusdam tempore modi sunt
                        fuga eligendi doloribus, cupiditate rem, architecto
                        facere debitis sed. Deleniti hic quae velit
                        reprehenderit obcaecati!
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">3</th>
                      <td>
                        Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Tenetur, nihil corporis architecto esse a quas
                        minus ipsam ullam quibusdam atque ipsum explicabo
                        suscipit modi non cumque dolores, voluptatum ea vel.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>*/}
          </div>
        </>
      ) : (
        <div
          className="bg-color2 d-flex align-items-center justify-content-center text-light"
          style={{ minHeight: "70dvh", marginBottom: "-3rem" }}
        >
          <h1 className="text-center">{open}</h1>
        </div>
      )}
    </>
  );
}

export default Profile;
