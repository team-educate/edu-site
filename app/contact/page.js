'use client';

import React, { useEffect, useState } from "react";
import { db } from '@/lib/firebaseConfig.js'
import { useRouter } from 'next/navigation'
import { collection, addDoc } from 'firebase/firestore';

function Contact() {
  const router = useRouter();

  const [values, setValues] = useState({
    name: '',
    email: '',
    msg: ''
  })
  const [error, setError] = useState({})
  const reset = () => {
    setError({});
    console.clear();
    setSubmitting(false)
    tLatex(false);
    setMathValue('')
    setValues({
      name: '',
      email: '',
      msg: ''
    })
  }
  const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const getValues = (e) => {
    setValues(prev => {return {...prev, [e.target.name]: e.target.value.trim()}})
    setSubmitting(false)
    setError({})
  }
  const validated = (values) => {
    let err = 0;
    if(values.name === ''){
      setError(prev => {return {...prev, name: 'Your name is required.'}})
      err++;
    }
    if(values.email === ''){
      setError(prev => {return {...prev, email: 'Your email is required.'}})
      err++;
    } else if (!emailRegEx.test(values.email)) {
      setError(prev => {return {...prev, email: 'Invalid email address.'}})
      err++;
    }
    if(values.msg === ''){
      setError(prev => {return {...prev, msg: 'Enter your message to submit.'}})
      err++;
    }
    if(err === 0){
      return true
    } else return false;
  }
  const [submitting, setSubmitting] = useState(false)
  const handleSubmit = async e => {
    e.preventDefault();
    if(validated(values)) {
      setSubmitting(true);
      console.log("Submitting...");
      try {
        await addDoc(collection(db, 'contact'), values);
        Notification.requestPermission().then(permission => {
          if(permission === 'granted'){
            new Notification("You have successfully submitted the form.")
          }
        })
        await setTimeout(()=>{router.replace('/')},1000)
      } catch {
        alert("An error occured. Check your internet connection and try again.")
      } finally {
        await setTimeout(()=> setSubmitting(false), 500)
      }
    }
  }
  const [showLatex, tLatex] = useState(false);
  const toggleLatex = () => {
    if(showLatex) tLatex(false)
    else tLatex(true)
  }
  const [mathValue,setMathValue] = useState(''); //Storing message Value (includes math) using State hook
  useEffect(()=>{
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']]
      },
      svg: {
        fontCache: 'global'
      }
    };
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
    script.async = true;
    document.head.appendChild(script);
  }, [])
  const mathTypeset = ()=>{ //A function that renders math using MathJax
    if(typeof window?.MathJax !== "undefined"){
      window.MathJax.typeset();
    }
  };
  const renderTex = async () => {
    if(values.msg === ''){
      setError(prev => {return {...prev, msg: "Enter your code first"}})
    } else {
      setMathValue(values.msg)
      await tLatex(true)
      await mathTypeset()
    }
  }
  return (
    <>
      {/* <MathJax/> */}
      <div className="container">
        <br />
        <div className="card ">
          <div className="card-body">
            <form action="" method="post" onSubmit={handleSubmit}>
              <h3 className="con-title">Contact Us</h3>
              <hr className="hr" />
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name <span className="red">*</span>:
                </label>
                <input
                  type="text"
                  onChange={getValues}
                  className={`form-control ${error.name ? 'border border-2 border-danger shadow-none rounded' : ''}`}
                  id="name"
                  autoComplete='off'
                  name="name"
                  placeholder="e.g: Mohammed Nawaz"
                />
                <span className="text-danger fs-6">{error.name}</span>
              </div>
              <div className="mb-3">
                <label htmlFor="exampleFormControlInput1" className="form-label">
                  Email address <span className="red">*</span>:
                </label>
                <input
                  type="text"
                  name="email"
                  autoComplete='off'
                  onChange={getValues}
                  className={`form-control ${error.email ? 'border border-2 border-danger shadow-none rounded' : ''}`}
                  id="exampleFormControlInput1"
                  placeholder="e.g: yourname@example.com"
                />
                <span className="text-danger fs-6">{error.email}</span>
              </div>
              <div className="mb-3">
                <label htmlFor="inputTextArea" className="form-label">
                  Messege <span className="red">*</span>:
                </label>
                <textarea
                  onChange={getValues}
                  className={`form-control ${error.msg ? 'border border-2 border-danger shadow-none rounded' : ''}`}
                  id="inputTextArea"
                  style={{minHeight: '20dvh'}}
                  name="msg"
                  placeholder='You can write LaTeX codes here'
                ></textarea>
                <span className="text-danger fs-6">{error.msg}</span>
              </div>

              <div className='form-btn d-flex justify-content-between'>
                <div>
                  <button type="submit" disabled={submitting} className={`sub me-2 ${submitting ? 'disabled' : ''}`}>
                    <i className="bi bi-send-fill"></i> Submit
                  </button>
                  <button onClick={reset} type="reset" className="reset">
                    <i className="bi bi-x"></i> Reset
                  </button>
                </div>
                <button
                  type="button"
                  onClick={renderTex}
                  className="but right"
                >
                  <i className={showLatex ? "bi bi-arrow-clockwise" : "bi bi-eye"}></i> {!showLatex ? 'LaTeX view' : 'Refresh'}
                </button>
              </div>
              <div>
                <div>
                  <br />

                  <div className={`latex-cont d-flex flex-column align-items-center justify-content-center text-dark ${showLatex ? '' : 'd-none'}`} id="latexCont">
                    <br />
                    <br />

                    <div className="card w-100">
                      <div className="card-header" style={{textAlign: 'center'}}>
                        <b>View with LaTeX</b>
                      </div>
                      <div className="card-body ">
                        <p id="outputText" onChange={mathTypeset}>{mathValue}</p>
                      </div>
                    </div>
                    <br />

                    <button onClick={toggleLatex} type="button" className="btn btn-dark">
                      <i className="bi bi-eye-slash"></i> Hide
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
