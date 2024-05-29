'use client';

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { auth, db } from '@/lib/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore'
import { signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';

function Login() {
    const [open, setOpen] = useState("Loading...")
    const [user, set] = useState()
    const router = useRouter();
    onAuthStateChanged(auth, user => {
        if(user) {
            set("User")
            setOpen("You're already logged in. Logout first.")
        } else setTimeout(()=>set(null), 100)
    })
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState({});
    const reset = () => {
        setError({});
        setValues({
            email: '',
            password: ''
        });
        setMsg('')
    }
    const getValues = (e) => {
        setValues(prev => {
            return {...prev, [e.target.name]: e.target.value.trim()};
        })
        setError({})
        setMsg('');
    }
    const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validated = (value) => {
        let err = 0;
        if(values.email === ''){
            setError(prev => {
                return {...prev, email: 'Email is required.'}
            })
            err++;
        } else if(!emailRegEx.test(values.email)){
            setError(prev => {
                return {...prev, email: 'Invalid email address.'}
            })
            err++;
        }
        if(value.password === ''){
            setError(prev => {
                return {...prev, password: 'Password is required.'}
            })
            err++;
        }
        if(err === 0) return true;
        return false;
    }
    const [disableSubmit, setDisableSubmit] = useState(false)
    const [resetState, setResetState] = useState(false)
    const [msg, setMsg] = useState('')
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(!resetState){
            if(validated(values)){
                setDisableSubmit(true)
                const docSnap = await getDoc(doc(db, 'users', 'ALL-USERS'));
                if(!docSnap.data().email.includes(values.email.trim().toLowerCase())){
                    setMsg("No account found for " + values.email.trim().toLowerCase())
                    setDisableSubmit(false)
                } else {
                    signInWithEmailAndPassword(auth, values.email.toLowerCase(), values.password)
                    .then(userCredential => {
                        setDisableSubmit(false)
                        console.log("Logged in");
                        router.replace('/')
                    }).catch(error => {
                        setDisableSubmit(false)
                        switch (error.code) {
                            case 'auth/email-already-in-use':
                            console.log(`Email address ${values.email} already in use.`);
                            break;
                            case 'auth/invalid-email':
                            setError(prev => {return {...prev, email: 'Invalid Email address.'}})
                            break;
                            case 'auth/invalid-credential':
                            setMsg('Incorrect Password.');
                            break;
                            case 'auth/operation-not-allowed':
                            alert(`Error during sign up. Try again.`);
                            break;
                            case 'auth/weak-password':
                            alert('Password is not strong enough. Add additional characters including special characters and numbers.');
                            break;
                            default:
                            alert(error.message);
                            break;
                        }
                    })
                }
            }
        } else {
            if(values.email === ''){
                setError(prev => {
                    return {...prev, email: 'Enter your email address.'}
                })
            } else if(!emailRegEx.test(values.email)){
                setError(prev => {
                    return {...prev, email: 'Invalid email address.'}
                })
            } else {
                setDisableSubmit(true)
                const docSnap = await getDoc(doc(db, 'users', 'ALL-USERS'));
                if(!docSnap.data().email.includes(values.email.trim().toLowerCase())){
                    setMsg("No account found for " + values.email.trim().toLowerCase())
                    setDisableSubmit(false)
                } else {
                    sendPasswordResetEmail(auth, values.email.trim().toLowerCase())
                    .then(()=>{
                        setMsg("Password reset link sent to your email.")
                        setDisableSubmit(false)
                    }).catch((error)=>{
                        setDisableSubmit(false)
                        switch (error.code){
                            case 'auth/invalid-email':
                                setError(prev => {return {...prev, email: 'Invalid Email address'}});
                                break;
                            case 'auth/invalid-credential':
                                setMsg('Email is not registered');
                                break;
                            case 'auth/operation-not-allowed':
                                alert(`Error during sign up. Try again.`);
                                break;
                            default:
                                alert(error.message);
                                break;
                        }
                    })
                }
            }
        }
    }
    const [showPass, togglePass] = useState(false)
    const togglePassword = () => {
        if(showPass) togglePass(false)
        else togglePass(true)
    }
  return (
    <>
        {user === null ? (
            <>
                <div className="container">
                <br/>
                    <div className="card">
                        <div className="card-header problem-header">
                            Log In
                        </div>
                        <div className="card-body">
                            <p className='text-danger'>{msg}</p>
                            <form method='post' onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Email <span className="red">*</span></label>
                                    <input value={values.email} onChange={getValues} type="text" name='email' className={`form-control ${error.email ? 'border border-danger border-2 shadow-none' : ''}`} id="username" placeholder="yourname@example.com" autoComplete='off' />
                                    <small className='text-danger fs-6'>{error.email}</small>
                                </div>

                                <div className={`mb-3 ${resetState ? 'd-none' : ''}`}>
                                    <label htmlFor="pass" className="form-label">Password <span className="red">*</span></label>
                                    <div className='input-group'>
                                        <input  autoComplete='off' onChange={getValues} name='password' type={showPass ? 'text' : "password"} value={values.password} className={`form-control ${error.password ? 'border border-2 border-danger shadow-none' : ''}`} id="pass" placeholder="Your Password"/>
                                        <span onClick={togglePassword} className='input-group-text'><i className={showPass ? "bi bi-eye-slash" : "bi bi-eye"}></i></span>
                                    </div>
                                    <small className='text-danger fs-6'>{error.password}</small>
                                </div>

                                <br/>

                            <button disabled={disableSubmit} type="submit" className={`sub me-2 ${disableSubmit ? 'disabled' : ''}`}><i className="bi bi-box-arrow-right"></i> {resetState ? 'Send link' : 'Login'}</button>
                            <button type="reset" onClick={reset} className="reset"><i className="bi bi-x"></i> Reset</button>
                            <br/>
                            <br/>
                            <p >
                                <b>Don't You Have an Account? <Link href="/register" className="color1 text-decoration-none">Sign Up</Link> Now!</b>
                                <br/>
                                <b className={resetState ? '' : 'd-none'}>Go back to <Link onClick={()=> {setResetState(false); reset() }} href='' className={`color1 text-decoration-none`}>Login</Link> page.</b>
                                <b className={resetState ? 'd-none' : ''}>Forgot Password? <Link type='reset' onClick={()=> {setResetState(true); reset()}} href="" className={`red text-decoration-none`}>Reset</Link> Now!</b>
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
  )
}

export default Login
