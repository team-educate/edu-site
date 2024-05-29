"use client";
import React, { useState } from "react";
import { auth, db, functions } from "@/lib/firebaseConfig.js";
import { httpsCallable } from "firebase/functions";
import {
  getDoc,
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteField,
} from "firebase/firestore";
import { getIdTokenResult } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

function AssignRole() {
  const [show, changeShow] = useState(false);
  const [open, setOpen] = useState("Loading...Please wait a few seconds.");
  onAuthStateChanged(auth, async (user) => {
    if (user !== null) {
      const token = await getIdTokenResult(user);
      if (token.claims.admin) {
        changeShow(true);
      } else setOpen("You don't have access to this page");
    } else setOpen("You don't have access to this page");
  });
  const [Switch, clickSwitch] = useState(false);
  const switchShift = () => {
    if (Switch) clickSwitch(false);
    else clickSwitch(true);
  };
  const [Email, setEmail] = useState("");
  const getEmail = (e) => {
    setError();
    setMsg("");
    setEmail(e.target.value.trim().toLowerCase());
  };
  const [values, setValues] = useState({
    admin: false,
    problem: false,
    blog: false,
  });
  const getValues = (e) => {
    setMsg("");
    setMsg1("");
    if (e.target.id === "admin") {
      if (values[e.target.id]) {
        setValues((prev) => {
          return { ...prev, [e.target.id]: false };
        });
      } else {
        setValues((prev) => {
          return { ...prev, [e.target.id]: true, blog: false, problem: false };
        });
      }
    } else {
      if (!values.admin) {
        if (values[e.target.id]) {
          setValues((prev) => {
            return { ...prev, [e.target.id]: false };
          });
        } else {
          setValues((prev) => {
            return { ...prev, [e.target.id]: true };
          });
        }
      }
    }
  };
  const [error, setError] = useState();
  const emailRegEx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const validated = () => {
    if (Email === "") {
      setError("Email is required.");
    } else if (!emailRegEx.test(Email)) {
      setError("Invalid email address.");
    } else return true;
  };
  const [msg, setMsg] = useState("");
  const [msg1, setMsg1] = useState("");
  const [disSub, misSub] = useState(false);

  const addAdminRole = httpsCallable(functions, "addAdminRole");

  const listRoles = () => {
    const roles = [];
    if (values.problem) roles.push("problem");
    if (values.blog) roles.push("blog");
    return roles;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validated()) {
      misSub(true);
      const dataAll = await getDoc(doc(db, "users", "ALL-USERS"));
      const data = dataAll.data().email;
      if (data.includes(Email)) {
        if (values.admin) {
          addAdminRole({ email: Email })
            .then((result) => {
              setMsg1(result.data);
            })
            .catch((error) => {
              console.log(error);
              setMsg("Something went wrong");
            });
          const doc1 = await getDocs(
            query(collection(db, "users"), where("email", "==", Email))
          );
          doc1.forEach(async (doc1) => {
            await updateDoc(doc(db, "users", doc1.id), {
              roles: deleteField(),
            });
          });
          misSub(false);
        } else {
          const roles = listRoles();
          if (roles.length === 0) {
            setMsg("Select at least one role.");
          } else {
            const doc1 = await getDocs(
              query(collection(db, "users"), where("email", "==", Email))
            );
            doc1.forEach(async (doc1) => {
              await updateDoc(doc(db, "users", doc1.id), {
                roles: roles,
              });
              setMsg1("Successfully updated user role(s)!!");
              misSub(false);
            });
          }
        }
      } else {
        setMsg(`User with email '${Email}' doesn't exists.`);
        misSub(false);
      }
    }
  };

  return (
    <>
      {show ? (
        <div class="card container mt-5">
          <div class="card-header mt-3 problem-header">Assign Roles</div>
          <div class="card-body">
            <p className="text-center text-danger fs-4">{msg}</p>
            <p className="text-center text-success fs-4">{msg1}</p>
            <form action="" method="post" onSubmit={handleSubmit}>
              <div class="form-floating mb-3">
                <input
                  type="text"
                  autoComplete='off'
                  value={Email}
                  onChange={getEmail}
                  class="form-control"
                  id="floatingInput"
                  placeholder="yourname@example.com"
                />
                <label htmlFor="floatingInput">Email address</label>
                {error ? <small className="text-danger">{error}</small> : null}
              </div>
              <h3>Select Roles</h3>
              <br />
              <div className=" parentOfDivCheckBox ">
                <div
                  id="admin"
                  onClick={getValues}
                  className={`text-center divCheckBox ${
                    values.admin ? "checked" : "unchecked"
                  } pe-2 ps-2`}
                >
                  <h4 className="pe-none">Administrator</h4>
                  <hr className="hr-eqn pe-none" />
                  <small className="text-justify mb-5 fs-6 pe-none">
                    All admin privileges like Add problems, Add Blogs, Assign
                    roles, etc. will be available.
                  </small>
                </div>
                <div
                  id="problem"
                  onClick={getValues}
                  className={`text-center divCheckBox ${
                    values.admin
                      ? "unchecked"
                      : values.problem
                      ? "checked"
                      : "unchecked"
                  } pe-2 ps-2`}
                >
                  <h4 className="pe-none">Problem Maker</h4>
                  <hr className="hr-eqn pe-none" />
                  <small className="text-justify mb-5 fs-6 pe-none">
                    User can only add problems about Physics, Chemistry and
                    Mathematics.
                  </small>
                </div>
                <div
                  id="blog"
                  onClick={getValues}
                  className={`text-center divCheckBox ${
                    values.admin
                      ? "unchecked"
                      : values.blog
                      ? "checked"
                      : "unchecked"
                  } pe-2 ps-2`}
                >
                  <h4 className="pe-none">Blogger</h4>
                  <hr className="hr-eqn pe-none" />
                  <small className="text-justify mb-5 fs-6 pe-none">
                    User can only add blogs about various topics. He/She can't
                    add problems or assign roles.
                  </small>
                </div>
              </div>
              <br />
              <br />
              <div class="form-check">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={Switch}
                    onChange={switchShift}
                    id="flexSwitchCheckDefault"
                  />
                  <label class="form-check-label">
                    Are You Sure? This can't be undone.
                  </label>
                </div>
              </div>
              <br />
              <button
                disabled={!Switch || disSub}
                class="btn sub"
                type="submit"
              >
                <i class="bi bi-person-fill-add"></i> Give Role(s)
              </button>
            </form>
          </div>
        </div>
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

export default AssignRole;
