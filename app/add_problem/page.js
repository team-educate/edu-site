"use client";
import React, { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebaseConfig";
import { doc, getDoc, addDoc, collection, updateDoc, increment } from "firebase/firestore";
import { getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import { Hind_Siliguri } from "next/font/google";

const hind = Hind_Siliguri({
  subsets: ["bengali"],
  display: "swap",
  variable: "--font-hind",
  weight: ["300", "400", "500", "600", "700"],
});

function AddProblem() {
  const [userDoc, setUserDoc] = useState();
  const [open, setOpen] = useState("Loading...");
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await getIdTokenResult(user);
      const snapshot = await getDoc(doc(db, "users", user.uid));
      if (token.claims.admin || snapshot.data().roles?.includes("problem")) {
        setUserDoc(snapshot.data());
      } else {
        setOpen("You don't have access to this page.");
      }
    } else {
      setOpen("You don't have access to this page.");
    }
  });
  const [values, setValues] = useState({
    name: "",
    answer: "",
    point: "",
  });
  const [submitting, setSubmit] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState({});
  const [sub, setSub] = useState();
  const [stmt, setStmt] = useState();
  const [stmtBn, setStmtBn] = useState();
  const [editorial, setEdit] = useState('');
  const getValues = (e) => {
    setValues((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
    setError({})
  };
  const validated = () => {
    let err = 0;
    if (values.name === "") {
      setError((prev) => {
        return { ...prev, name: "Problem name is required." };
      });
      err++;
    }
    if (values.answer == "") {
      setError((prev) => {
        return { ...prev, answer: "Provide the answer of the problem." };
      });
      err++;
    }
    if (!stmt) {
      setError((prev) => {
        return { ...prev, stmt: "Provide the problem statement in English." };
      });
      err++;
    }
    if (!stmtBn) {
      setError((prev) => {
        return { ...prev, stmtn: "Provide the problem statement in Bangla." };
      });
      err++;
    }
    if (!["math", "physics", "chemistry"].includes(sub)) {
      setError((prev) => {
        return { ...prev, sub: "Please select the subject." };
      });
      err++;
    }
    if (values.point === "") {
      setError((prev) => {
        return {
          ...prev,
          point: "Enter the point of this problem based on difficulty level.",
        };
      });
      err++;
    } else if (values.point > 5 || values.point < 1) {
      setError((prev) => {
        return { ...prev, point: "Point must be within the range 1-5" };
      });
      err++;
    }
    if (err === 0) return true;
    else return false;
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [msg]);
  const handleSubmit = async e => {
    e.preventDefault();
    if(validated()) {
      setSubmit(true)
      const lastID = await getDoc(doc(db, sub, `${sub.toUpperCase()}_TOTAL`));
      const id = parseInt(lastID.data().count) + 1;
      const allData = {
        id: id,
        name: values.name,
        author: userDoc.username,
        point: values.point,
        answer: values.answer,
        complain: [],
        editorial: editorial,
        firstSolved: '',
        tried: 0,
        solved: 0,
        statementBn: stmtBn,
        statement: stmt,
      }
      try {
        await addDoc(collection(db, sub), allData);
        await updateDoc(doc(db, sub, `${sub.toUpperCase()}_TOTAL`), {count: increment(1)});
        setMsg("Successfully added problem!!")
      } catch {err => {
        alert(err)
      }}
      finally {
        setSubmit(false)
      }
    }
  }
  useEffect(() => {
    render();
  }, [stmt, stmtBn, editorial])
  const render = () => {
    if ((stmt || stmtBn || editorial) && typeof window?.MathJax !== undefined) {
      mathTypeset();
    } else {
      setTimeout(render, 200);
    }
  };
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

  return (
    <>
      {userDoc ? (
        <>
          <div className="container">
            <h2 className="text-success text-center">{msg}</h2>
            <br />
            <form action="" method="post" onSubmit={handleSubmit}>
              <div className="card">
                <div className="card-header problem-header ">Problem Info</div>
                <div className="card-body ">
                  <div className="mb-3">
                    <label htmlFor="name">
                      Problem Name (English)<span className="red">*</span>:
                    </label>
                    <input autoComplete='off'
                      type="text"
                      onChange={getValues}
                      className={`form-control ${
                        error.name
                          ? "border border-2 border-danger shadow-none rounded-3"
                          : ""
                      }`}
                      name="name"
                      id="name"
                      placeholder="Problem name..."
                    />
                    <small className="text-danger fs-6">{error.name}</small>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="mark">
                      Points <span className="red">*</span>:
                    </label>
                    <input autoComplete='off'
                      onChange={getValues}
                      type="number"
                      className={`form-control ${
                        error.point
                          ? "border border-2 border-danger shadow-none rounded-3"
                          : ""
                      }`}
                      id="mark"
                      name="point"
                      placeholder="1 - 5"
                    />
                    <small className="text-danger fs-6">{error.point}</small>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="ans">
                      Answer <span className="red">*</span>:
                    </label>
                    <input autoComplete='off'
                      type="number"
                      id="ans"
                      className={`form-control ${
                        error.answer
                          ? "border border-2 border-danger shadow-none rounded-3"
                          : ""
                      }`}
                      name="answer"
                      onChange={getValues}
                    />
                    <small className="text-danger fs-6">{error.answer}</small>
                  </div>
                  <label htmlFor="sub">
                    Subject <span className="red">*</span>:
                  </label>
                  <select
                    id="sub"
                    defaultValue="default"
                    className={`form-select ${
                      error.password
                        ? "border border-2 border-danger shadow-none rounded-3"
                        : ""
                    }`}
                    onChange={(e) => {
                      setSub(e.target.value);
                      setError({});
                    }}
                    aria-label="Default select example"
                  >
                    <option value="default" disabled>
                      Select Subject
                    </option>
                    <option value="math">Math</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                  </select>
                  <small className="text-danger fs-6">{error.sub}</small>
                </div>
              </div>

              <br />

              <div className="card ">
                <div className="card-header problem-header">
                  Problem Statement (Bangla)
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="input" className="form-label">
                      Write Here <span className="red">*</span>
                    </label>
                    <textarea
                      value={stmtBn}
                      className={`form-control ${
                        error.stmtBn
                          ? "border border-2 border-danger shadow-none rounded-3"
                          : ""
                      } ${hind.className}`}
                      id="input"
                      onChange={(e) => {
                        setStmtBn(e.target.value);
                        setError({});
                      }}
                    ></textarea>
                    <small className="text-danger fs-6">{error.stmtBn}</small>
                  </div>
                  <label htmlFor="output">Output</label>
                  <div className="card">
                    <div className="card-body">
                      <span id="output" className={hind.className}>{stmtBn}</span>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="card ">
                <div className="card-header problem-header">
                  Problem Statement (English)
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="input" className="form-label">
                      Write Here <span className="red">*</span>
                    </label>
                    <textarea
                      className={`form-control ${
                        error.stmt
                          ? "border border-2 border-danger shadow-none rounded-3"
                          : ""
                      }`}
                      value={stmt}
                      id="input"
                      onChange={(e) => {
                        setStmt(e.target.value);
                        setError({});
                      }}
                    ></textarea>
                    <small className="text-danger fs-6">{error.stmt}</small>
                  </div>
                  <label htmlFor="output">Output</label>
                  <div className="card">
                    <div className="card-body">
                      <span id="output">{stmt}</span>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="card ">
                <div className="card-header problem-header">
                  Editorial (Optional)
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="input" className="form-label">
                      Write Here :
                    </label>
                    <textarea
                      className="form-control"
                      value={editorial}
                      id="input"
                      onChange={(e) => {
                        setEdit(e.target.value);
                        setError({});
                      }}
                    ></textarea>
                  </div>
                  <label htmlFor="output">Output</label>
                  <div className="card">
                    <div className="card-body">
                      <span id="output">{editorial}</span>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="center text-center">
                <button disabled={submitting} type="submit" className="sub me-2">
                  <i className="bi bi-send-fill"></i> {submitting ? 'Submitting...' : "Submit"}
                </button>
                <button type="reset" className="reset ms-2" onClick={() => {
                  setError({});
                  setStmt();
                  setStmtBn();
                  setEdit('');
                  setValues({
                    name: '',
                    point: '',
                    answer: ''
                  })
                }}>
                  <i className="bi bi-x"></i> Reset
                </button>
              </div>
            </form>
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

export default AddProblem;
