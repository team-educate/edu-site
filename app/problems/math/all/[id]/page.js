"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import correct from "@/public/img/correct.gif"
import wrong from "@/public/img/wrong.gif"
import first from "@/public/img/first-solve.gif"
import Link from "next/link";
import { db, auth } from "@/lib/firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import {
  getDoc,
  doc,
  onSnapshot,
  query,
  collection,
  where,
  updateDoc,
  arrayUnion,
  increment,
  arrayRemove,
} from "firebase/firestore";
import { Hind_Siliguri } from "next/font/google";
import { useRouter } from "next/navigation";

const hind = Hind_Siliguri({
  subsets: ["bengali"],
  display: "swap",
  variable: "--font-hind",
  weight: ["300", "400", "500", "600", "700"],
});

export default function Problem1({ params }) {
  const [open, setOpen] = useState('Loading...Please wait.')
  const router = useRouter();
  const [showRes, toggleRes] = useState(false)
  const [resImg, setRes] = useState()
  const [resText, setResText] = useState('Checking...')
  const [time, setTime] = useState("Just now")
  const updateTime = () => {
    let m = 0;
    let h = 0;
      if (m < 60) {
      setInterval(()=>{
        m++;
        setTime(m + " minutes ago")
      }, 60000)
      } else {
        setInterval(()=>{
          h++;
          setTime(h + " hours ago")
        }, 3600000)
      }
  }
  const mathTypeset = () => {
    //A function that renders math using MathJax
    if (typeof window?.MathJax !== "undefined") {
      window.MathJax.typeset();
    }
  };
  useEffect(() => {
    window.MathJax = {
      tex: {
        inlineMath: [
          ["$", "$"],
          ["\\(", "\\)"],
        ],
      },
      svg: {
        fontCache: "global",
      },
    };
    var script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser('');
    }
  });
  const q = query(
    collection(db, "math"),
    where("id", "==", parseInt(params.id))
  );

  const unsub = onSnapshot(q, async (querySnapshot) => {
    if (querySnapshot.docs.length === 0) {
      setOpen("Problem doesn't exists. Try again")
    }
    querySnapshot.forEach(async (docSnap) => {
      setDocID(docSnap.id);
      setProblem(docSnap.data());
      const data = await getDoc(doc(db, "users", docSnap.data().author));
      await setAuthPic(data.data().photoURL);
      render();
    });
  });

  useEffect(() => {
    render()
  } , [problem.statement, problem.statementBn])

  const [user, setUser] = useState({});
  const [authPic, setAuthPic] = useState(
    "https://firebasestorage.googleapis.com/v0/b/educateassociation.appspot.com/o/users%2Fno-profile.png?alt=media&token=cdea15f4-3706-4812-96c9-8467bb802d31"
  );
  const [docID, setDocID] = useState("");
  const [problem, setProblem] = useState({
    name: "Problem",
    author: "",
    tried: "",
    point: "",
    solved: "",
    statementBn: "",
    statement: "",
    complain: [],
    editorial: "",
    id: parseInt(params.id),
    firstSolved: "",
  });

  const [answer, setAnswer] = useState("");
  const [error, setError] = useState({});
  const [complain, setComplain] = useState("");

  const [btn1, setBtn1] = useState(false);
  const [btn2, setBtn2] = useState(false);

  const getComplain = (e) => {
    setComplain(e.target.value);
    setError({});
  };
  const getAnswer = (e) => {
    setAnswer(e.target.value.trim());
    setError({});
  };

  const render = () => {
    if ((problem.statement || problem.statementBn) && typeof window?.MathJax !== undefined) {
      mathTypeset();
    } else {
      setTimeout(render, 200);
    }
  };

  const handleAnswer = async (e) => {
    e.preventDefault();
    if (answer === "") {
      setError((prev) => {
        return { ...prev, answer: "Provide your answer" };
      });
    } else {
      updateTime()
      const dt = await getDoc(doc(db, "users", user.uid));
      setBtn1(true);
      if (answer == problem.answer) {
        setResText('Correct ✓')
        toggleRes(true)
        console.log("Correct answer");
        if (dt.data().mathSolved.includes(problem.id)) {
          await updateDoc(doc(db, 'users', user.uid), {
            submission: increment(1)
          })
          setRes(correct)
        } else {
          await updateDoc(doc(db, "users", user.uid), {
            submission: increment(1),
            mathSolved: arrayUnion(problem.id),
            mathUnsolved: arrayRemove(problem.id),
            mathScore: increment(problem.point),
          });
          if (problem.solved == 0) {
            setRes(first)
            await updateDoc(doc(db, "math", docID), {
              firstSolved: user.uid,
              tried: increment(1),
              solved: increment(1),
            });
          } else {
            setRes(correct)
            await updateDoc(doc(db, "math", docID), {
              tried: increment(1),
              solved: increment(1),
            });
          }
        }
      } else {
        setResText('Wrong ✘')
        setRes(wrong)
        toggleRes(true)
        if (dt.data().mathSolved.includes(problem.id)) {
          await updateDoc(doc(db, "math", docID), {
            tried: increment(1),
          });
        } else {
          await updateDoc(doc(db, "users", user.uid), {
            submission: increment(1),
            mathUnsolved: arrayUnion(problem.id),
          });
          await updateDoc(doc(db, "math", docID), {
            tried: increment(1),
          });
        }
      }
      setBtn1(false);
    }
  };

  const handleComplain = async (e) => {
    e.preventDefault();
    if (complain === "") {
      setError((prev) => {
        return { ...prev, complain: "Enter your complain." };
      });
    } else {
      setBtn2(true);
      await updateDoc(doc(db, "math", docID), {
        complain: arrayUnion({
          username: user.uid,
          msg: complain,
        }),
      });
      setBtn2(false);
    }
  };

  const [editorialStatus, setEditorialStatus] = useState(false);

  const toggleEditorial = () => {
    if (editorialStatus) setEditorialStatus(false);
    else setEditorialStatus(true);
  };

  return (
    <>
      {problem.answer ? (
        <>
          <div className={showRes ? 'position-fixed resDiag w-100 dark-overlay' : 'd-none'} >
            <div className='w-100 mt-4'>
              <div className="modal-dialog modal-xl ">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{problem.name}</h5>
                    <button
                      className="btn-close"
                      onClick={()=>{toggleRes(false); setRes()}}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <table className="table-bordered table m-0">
                      <tbody>
                        <tr>
                          <th scope="row">
                            <b>Username</b>
                          </th>
                          <td>
                            <b>Time</b>
                          </td>
                          <td>
                            <b>Result</b>
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">{user.uid}</td>
                          <td>{time}</td>
                          <td >
                            <b className={resText === 'Wrong ✘' ? "text-danger" : "text-success"}>{resText}</b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="card">
                    <div className="d-flex justify-content-center align-items-center card-body">
                      {resImg ? (<Image src={resImg} width={250} alt="" className=" result" />) : null}
                    </div>
                    <h4 className={` ${resText === 'Wrong ✘' ? "text-danger" : "text-success"} text-center m-0`}>
                      <b>{resImg === correct ? "Your answer is Correct!" : resImg === wrong ? "Your answer is wrong." : resImg === first ? "Yay! you're the first one to solve this" : 'Submitting...'}</b>
                    </h4>
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`d-flex justify-content-center align-items-baseline dark-overlay w-100 ${
              editorialStatus ? "" : "d-none"
            }`}
            style={{ height: "100dvh" }}
          >
            <div className="bg-light mt-5 rounded-5 top-msg w-75 h-75">
              <div className="container">
                <div className="card bg-transparent border-0">
                  <br />
                  <div className="card-body text-center">
                    <h4 className="me-3 ms-3">
                      Here's the <span className="color1">Editorial</span>!{" "}
                      <button
                        onClick={toggleEditorial}
                        className="fs-4 p-0 border-0 float-end cursor-pointer"
                      >
                        <i className="bi bi-x-circle"></i>
                      </button>
                    </h4>
                    <hr />
                    <p className="text-justify fs-5 pe-none">{problem.editorial}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container mt-5">
            <div className="card">
              <div className="card-header">
                <h4 className="padding2">{problem.name}</h4>
                <p className="padding3">{`Points: ${problem.point}`}</p>
              </div>
              <div className="card-body me-3 ms-3">
                <br />
                <p
                  className={`${hind.className} text-justify hind-siliguri-regular fs-5 pe-none`}
                >
                  {problem.statementBn}
                </p>
                <hr />
                <p className="text-justify fs-5 pe-none">{problem.statement}</p>
                {problem.editorial !== '' ? (
                  <button
                    onClick={toggleEditorial}
                    className={`but ${problem.editorial === "" ? "d-none" : ""}`}
                  >
                    View Editorial
                  </button>
                ) : (<></>)}
              </div>
            </div>
            <br />
            {user.email && user.emailVerified ? (
              <>
                <div className={`card `}>
                  <div className="card-body">
                    <h5>Submit Your Answer</h5>
                    <div className="mb-3">
                      <input
                        type="number"
                        className={`form-control ${
                          error.answer
                            ? "border border-2 border-danger rounded shadow-none"
                            : ""
                        }`}
                        id="ans"
                        value={answer}
                        onChange={getAnswer}
                        placeholder="Your Answer (In Numbers)"
                      />
                      <small className="text-danger fs-6">{error.answer}</small>
                    </div>
                    <button
                      disabled={btn1}
                      onClick={handleAnswer}
                      type="submit"
                      className={`sub ${btn1 ? "disabled" : ""}`}
                    >
                      <i className="bi bi-send-fill"></i> Submit
                    </button>
                  </div>
                </div>
                <br />
                <div className={`card `}>
                  <div className="card-body">
                    <h5>Submit Your Complain (If You Have)</h5>
                    <div className="mb-3">
                      <br />
                      <textarea
                        type="text"
                        value={complain}
                        onChange={getComplain}
                        className={`form-control ${
                          error.complain
                            ? "border border-2 border-danger rounded shadow-none"
                            : ""
                        }`}
                        id="complain"
                        placeholder="Your Complain"
                      ></textarea>
                      <small className="text-danger fs-6">{error.complain}</small>
                    </div>
                    <button
                      disabled={btn2}
                      onClick={handleComplain}
                      type="submit"
                      className={`reset ${btn2 ? "disabled" : ""}`}
                    >
                      <i className="bi bi-send-fill"></i> Submit
                    </button>
                  </div>
                </div>
                <br />
              </>
            ) : (
              <div>{!user.email ? (<h2 className='text-center text-danger'>Login to submit</h2>) : !user.emailVerified ? (<h2 className='text-center text-danger'>Verify your email to submit</h2>) : (<h2 className='text-center text-dark'>Wait...</h2>)}</div>
            )}
            <div className="row">
              <div className="col-sm-6 mb-3 mb-sm-0">
                <div className="card">
                  <div className="card-body">
                    <h5>Statistics</h5>
                    <hr />
                    <div className="row pt-3">
                      <div className="col">
                        <p>Tried</p>
                        <p>Solved</p>
                        <p>First Solve</p>
                      </div>
                      <div className="col">
                        <p>{problem.tried}</p>
                        <p>{problem.solved}</p>
                        <p>{"@" + problem.firstSolved}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="card d-flex justify-content-center flex-column align-items-center">
                  <h5 className="mt-3">Author</h5>
                  <Image
                    className="auth-pic p-0"
                    src={authPic}
                    alt=""
                    priority={true}
                    width={113}
                    height={113}
                  />
                  <div className="card-body">
                    <h5 className=" fs-5">{"@" + problem.author}</h5>
                  </div>
                </div>
              </div>
            </div>
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
