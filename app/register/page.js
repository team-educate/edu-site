"use client";

import Link from "next/link";
import React, { useState, useRef } from "react";
import { db, auth, storage, functions } from "@/lib/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { getDoc, setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

function Register() {
  const createCustomUser = httpsCallable(functions, "createCustomUser");
  const [user, set] = useState();
  const [open, setOpen] = useState("Loading...");
  const imgRef = useRef(null);
  const router = useRouter();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      set("User");
      setOpen("Logout to continue.");
    } else set(null);
  });
  const [showPass, togglePass] = useState({
    passT: false,
    cpassT: false,
  });
  const togglePassword1 = () => {
    if (showPass.passT)
      togglePass((prev) => {
        return { ...prev, passT: false };
      });
    else
      togglePass((prev) => {
        return { ...prev, passT: true };
      });
  };
  const togglePassword2 = () => {
    if (showPass.cpassT)
      togglePass((prev) => {
        return { ...prev, cpassT: false };
      });
    else
      togglePass((prev) => {
        return { ...prev, cpassT: true };
      });
  };
  const [values, setValues] = useState({
    username: "",
    name: "",
    email: "",
    institute: "",
    class: "",
    img: "",
    password: "",
    confirmPassword: "",
  });
  const [checkBoxStatus, check] = useState(false);
  const checkBoxChange = () => {
    if (checkBoxStatus) {
      check(false);
    } else {
      check(true);
    }
  };
  const [error, setError] = useState({});
  const getValues = (e) => {
    setValues((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
    setError({});
    togglePass({
      passT: false,
      cpassT: false,
    });
  };
  function renameFile(originalFile, newName) {
    return new File([originalFile], newName, {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });
  }
  function updateFile(file, name) {
    const ext = file.name.split(".").pop();
    const newFile = renameFile(file, `${name}.${ext}`);
    setValues((prev) => {
      return { ...prev, img: newFile };
    });
  }
  const delImg = () => {
    imgRef.current.value = "";
    imgRef.current.type = "text";
    imgRef.current.type = "file";
  };
  const getFile = (e) => {
    if (e.target.files[0]) {
      const img = new Image();
      img.src = URL.createObjectURL(e.target.files[0]);
      img.onload = function () {
        if (this.width !== this.height) {
          setError((prev) => {
            return { ...prev, img: "Image ratio must be 1:1." };
          });
          delImg();
        } else if (e.target.files[0].size > 524288) {
          setError((prev) => {
            return {
              ...prev,
              img: "Image size must be less than or equal to 512 KiB.",
            };
          });
          delImg();
        } else {
          setValues((prev) => {
            return { ...prev, [e.target.name]: e.target.files[0] };
          });
        }
      };
    }
    setError({});
    togglePass({
      passT: false,
      cpassT: false,
    });
  };
  const validated = () => {
    let err = 0;
    // Only contains alphanumeric characters, underscore and dot.
    // Underscore and dot can't be at the end or start of a username (e.g _username / username_ / .username / username.).
    // Underscore and dot can't be next to each other (e.g user_.name).
    // Underscore or dot can't be used multiple times in a row (e.g user__name / user..name).
    // Number of characters must be between 8 to 20 .
    const usernameRegEx = /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    if (values.username === "") {
      setError((prev) => {
        return { ...prev, username: "Username is required" };
      });
      err++;
    } else if (!usernameRegEx.test(values.username)) {
      setError((prev) => {
        return { ...prev, username: "Invalid username" };
      });
      err++;
    }
    const nameRegEx =
      /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/;
    if (values.name === "") {
      setError((prev) => {
        return { ...prev, name: "Name is required." };
      });
      err++;
    } else if (!nameRegEx.test(values.name)) {
      setError((prev) => {
        return {
          ...prev,
          name: "Invalid name. Please enter your full name in English.",
        };
      });
      err++;
    }
    const emailRegEx =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (values.email === "") {
      setError((prev) => {
        return { ...prev, email: "Email is required." };
      });
      err++;
    } else if (!emailRegEx.test(values.email)) {
      setError((prev) => {
        return { ...prev, email: "Invalid email address." };
      });
      err++;
    }
    if (values.institute === "") {
      setError((prev) => {
        return { ...prev, institute: "Institute name is required." };
      });
      err++;
    }
    if (values.class === "") {
      setError((prev) => {
        return { ...prev, class: "Class/Level is required." };
      });
      err++;
    }
    const passwordRegEx =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (values.password === "") {
      setError((prev) => {
        return { ...prev, password: "Enter your password." };
      });
      err++;
    } else if (!passwordRegEx.test(values.password)) {
      setError((prev) => {
        return {
          ...prev,
          password:
            "Password must be at least 8 characters, with at least 1 uppercase, lowercase, number and special character.",
        };
      });
      err++;
    } else if (values.confirmPassword !== values.password) {
      setError((prev) => {
        return {
          ...prev,
          confirmPassword: "Password and confirm password didn't match.",
        };
      });
      err++;
    }
    if (err === 0) {
      if (values.img !== "") updateFile(values.img, values.username);
      return true;
    } else return false;
  };
  const reset = () => {
    setValues({
      username: "",
      name: "",
      email: "",
      institute: "",
      class: "",
      img: "",
      password: "",
      confirmPassword: "",
    });
    setError({});
    check(false);
    togglePass({
      passT: false,
      cpassT: false,
    });
  };
  const [status, setStatus] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkBoxStatus) {
      if (validated()) {
        setStatus(true);
        console.log("Submitted");
        const docRef = doc(db, "users", "ALL-USERS");
        const docSnap = await getDoc(docRef);
        if (
          docSnap.data().username.includes(values.username.trim().toLowerCase())
        ) {
          setError((prev) => {
            return { ...prev, username: "Username already exists." };
          });
          setStatus(false);
        } else {
          const docSnap = await getDoc(doc(db, "users", "ALL-USERS"));
          if (
            docSnap.data().email.includes(values.email.trim().toLowerCase())
          ) {
            setError((prev) => {
              return {
                ...prev,
                email: "Email already registered with another account.",
              };
            });
            setStatus(false);
          } else {
            if (values.img === "") {
              createCustomUser({
                email: values.email.trim().toLowerCase(),
                password: values.password,
                photoURL:
                  "https://firebasestorage.googleapis.com/v0/b/educateassociation.appspot.com/o/users%2Fno-profile.png?alt=media&token=cdea15f4-3706-4812-96c9-8467bb802d31",
                displayName: values.name,
                uid: values.username.trim().toLowerCase(),
              })
                .then(async (res) => {
                  console.log(res.data);
                  await setDoc(
                    doc(db, "users", values.username.trim().toLowerCase()),
                    {
                      name: values.name.trim(),
                      institute: values.institute.trim(),
                      class: values.class.trim(),
                      email: values.email.trim().toLowerCase(),
                      mathScore: 0,
                      username: values.username.trim().toLowerCase(),
                      photoURL:
                        "https://firebasestorage.googleapis.com/v0/b/educateassociation.appspot.com/o/users%2Fno-profile.png?alt=media&token=cdea15f4-3706-4812-96c9-8467bb802d31",
                      physicsScore: 0,
                      chemistryScore: 0,
                      mathSolved: [],
                      mathUnsolved: [],
                      physicsSolved: [],
                      physicsUnsolved: [],
                      chemistrySolved: [],
                      chemistryUnsolved: [],
                      mathRank: 0,
                      physicsRank: 0,
                      chemistryRank: 0,
                      submission: 0,
                      mathProblems: [],
                      physicsProblems: [],
                      chemistryProblems: [],
                    }
                  );
                  await updateDoc(doc(db, "users", "ALL-USERS"), {
                    email: arrayUnion(values.email.trim().toLowerCase()),
                    username: arrayUnion(values.username.trim().toLowerCase()),
                  });
                  console.log("Account Created successfully!");
                  router.replace("/login");
                })
                .catch((err) => console.log(err));
            } else {
              const storageRef = ref(
                storage,
                `users/${values.username.trim().toLowerCase()}`
              );
              const uploadTask = uploadBytesResumable(storageRef, values.img);
              uploadTask.on(
                "state_changed",
                () => {
                  console.log("Uploading");
                },
                (err) => {
                  setStatus(false);
                  console.log(err);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref)
                    .then(async (url) => {
                      createCustomUser({
                        email: values.email.trim().toLowerCase(),
                        password: values.password,
                        photoURL: url,
                        displayName: values.name,
                        uid: values.username.trim().toLowerCase(),
                      }).then(async (res) => {
                        console.log(res.data);
                        await setDoc(
                          doc(
                            db,
                            "users",
                            values.username.trim().toLowerCase()
                          ),
                          {
                            name: values.name.trim(),
                            institute: values.institute.trim(),
                            class: values.class.trim(),
                            email: values.email.trim().toLowerCase(),
                            mathScore: 0,
                            username: values.username.trim().toLowerCase(),
                            photoURL: url,
                            physicsScore: 0,
                            chemistryScore: 0,
                            mathSolved: [],
                            mathUnsolved: [],
                            physicsSolved: [],
                            physicsUnsolved: [],
                            chemistrySolved: [],
                            chemistryUnsolved: [],
                            mathRank: 0,
                            physicsRank: 0,
                            chemistryRank: 0,
                            submission: 0,
                            mathProblems: [],
                            physicsProblems: [],
                            chemistryProblems: [],
                          }
                        );
                        await updateDoc(doc(db, "users", "ALL-USERS"), {
                          email: arrayUnion(values.email.trim().toLowerCase()),
                          username: arrayUnion(
                            values.username.trim().toLowerCase()
                          ),
                        });
                      });
                    })
                    .then(() => {
                      console.log("Account Created successfully!");
                      router.replace("/login");
                    });
                }
              );
            }
          }
        }
      }
    }
  };
  let [i, cI] = useState(0);
  if (status) {
    setInterval(() => {
      i = i + 1;
      cI(i % 4);
    }, 1500);
  }

  return (
    <>
      {user === null ? (
        <>
          <br />
          <div className="container" style={{ minHeight: "72dvh" }}>
            <div className={`card `}>
              <div className="card-header problem-header">Sign Up</div>
              <div className="card-body">
                <form onSubmit={handleSubmit} method="post">
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username <span className="red">*</span>:
                    </label>
                    <div className="input-group ">
                      <span className="input-group-text">@</span>
                      <input
                        autoComplete="off"
                        onChange={getValues}
                        name="username"
                        type="text"
                        className={`form-control ${
                          error.username
                            ? "border border-2 border-danger shadow-none rounded-end"
                            : ""
                        }`}
                        id="username"
                        placeholder="e.g: the_unstoppable"
                      />
                    </div>
                    <small className="text-danger fs-6">{error.username}</small>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name <span className="red">*</span>:
                    </label>
                    <input
                      autoComplete="off"
                      onChange={getValues}
                      name="name"
                      type="text"
                      className={`form-control ${
                        error.name
                          ? "border border-2 border-danger shadow-none rounded-3"
                          : ""
                      }`}
                      id="name"
                      placeholder="e.g: Mohammed Jawad"
                    />
                    <small className="text-danger fs-6">{error.name}</small>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="mail" className="form-label">
                      Email <span className="red">*</span>:
                    </label>
                    <input
                      autoComplete="off"
                      onChange={getValues}
                      name="email"
                      type="text"
                      className={`form-control ${
                        error.email
                          ? "border border-2 border-danger shadow-none rounded-3"
                          : ""
                      }`}
                      id="mail"
                      placeholder="e.g: yourname@example.com"
                    />
                    <small className="text-danger fs-6">{error.email}</small>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="school" className="form-label">
                      Institution <span className="red">*</span>:
                    </label>
                    <input
                      autoComplete="off"
                      onChange={getValues}
                      name="institute"
                      type="text"
                      className={`form-control ${
                        error.institute
                          ? "border border-2 border-danger shadow-none rounded-3"
                          : ""
                      }`}
                      id="school"
                      placeholder="e.g: Harvard University"
                    />
                    <small className="text-danger fs-6">
                      {error.institute}
                    </small>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="class" className="form-label">
                      Class / Level <span className="red">*</span>:
                    </label>
                    <input
                      autoComplete="off"
                      onChange={getValues}
                      name="class"
                      type="text"
                      className={`form-control ${
                        error.class
                          ? "border border-2 border-danger shadow-none rounded-3"
                          : ""
                      }`}
                      id="class"
                      placeholder="e.g: Nine"
                    />
                    <small className="text-danger fs-6">{error.class}</small>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Profile Photo :
                    </label>
                    <input
                      accept="image/*"
                      ref={imgRef}
                      onChange={getFile}
                      name="img"
                      type="file"
                      className={`form-control ${
                        error.img
                          ? "border border-2 border-danger shadow-none rounded-3"
                          : ""
                      }`}
                      id="file"
                    />
                    <small className="text-danger fs-6">{error.img}</small>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="pass" className="form-label">
                      Password <span className="red">*</span>:
                    </label>
                    <div className="input-group">
                      <input
                        autoComplete="off"
                        onChange={getValues}
                        name="password"
                        type={showPass.passT ? "text" : "password"}
                        className={`form-control ${
                          error.password
                            ? "border border-2 border-danger shadow-none rounded-3"
                            : ""
                        }`}
                        id="pass"
                        placeholder="Your Password"
                      />
                      <span
                        onClick={togglePassword1}
                        className="input-group-text"
                      >
                        <i
                          className={
                            showPass.passT ? "bi bi-eye-slash" : "bi bi-eye"
                          }
                        ></i>
                      </span>
                    </div>
                    <small className="text-danger fs-6">{error.password}</small>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cpass" className="form-label">
                      Confirm Password <span className="red">*</span>:
                    </label>
                    <div className="input-group">
                      <input
                        autoComplete="off"
                        onChange={getValues}
                        name="confirmPassword"
                        type={showPass.cpassT ? "text" : "password"}
                        className={`form-control ${
                          error.confirmPassword
                            ? "border border-2 border-danger shadow-none rounded-3"
                            : ""
                        }`}
                        id="cpass"
                        placeholder="Your Password again"
                      />
                      <span
                        onClick={togglePassword2}
                        className="input-group-text"
                      >
                        <i
                          className={
                            showPass.cpassT ? "bi bi-eye-slash" : "bi bi-eye"
                          }
                        ></i>
                      </span>
                    </div>
                    <small className="text-danger fs-6">
                      {error.confirmPassword}
                    </small>
                  </div>
                  <div className="form-check">
                    <input
                      name="terms"
                      className={`form-check-input`}
                      onChange={checkBoxChange}
                      type="checkbox"
                      checked={checkBoxStatus}
                      id="flexCheckDefault"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      By Clicking, You Agree Our{" "}
                      <Link href="/terms_and_conditions" className="color1">
                        Terms & Conditions
                      </Link>
                      .
                    </label>
                  </div>
                  <br />
                  <button
                    disabled={!checkBoxStatus && status}
                    type="submit"
                    className={`sub me-2 ${!checkBoxStatus ? "disabled" : ""}`}
                  >
                    <i className="bi bi-box-arrow-right"></i>{" "}
                    {status ? "Creating" + ".".repeat(i) : "Sign Up"}
                  </button>
                  <button onClick={reset} type="reset" className="reset">
                    <i className="bi bi-x"></i> Reset
                  </button>
                  <br />
                  <br />
                  <p>
                    <b>
                      Already Have an Account?{" "}
                      <Link href="/login" className="color1">
                        Log In
                      </Link>{" "}
                      Now!
                    </b>
                  </p>
                </form>
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

export default Register;
