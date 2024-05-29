"use client";
import React, { useState } from "react";
import { auth, functions } from "@/lib/firebaseConfig.js";
import { updatePassword, onAuthStateChanged } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import svg from "@/public/img/reset_pass.svg";
import Image from "next/image";
import jpg from "@/public/img/club logo/one.jpg";
import png from "@/public/img/club logo/four.png";

function PasswordReset({ params }) {
  const [open, setOpen] = useState("Loading...");
  const [state, setState] = useState(0);
  const [going, go] = useState(false);
  onAuthStateChanged(auth, (user) => {
    if (user) setOpen("User is already logged in. Logout to continue.");
    else go(true);
  });
  const findUserByEmail = httpsCallable(functions, "findUserByEmail");
  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
    otp: "",
    email: "",
  });
  const [error, setError] = useState({});
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
  const getValues = (e) => {
    setValues((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
    setError({});
  };
  const validated = () => {
    let err = 0;
    if (state === 0) {
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
    }
    if (state === 1) {
      if (values.otp === "") {
        setError((prev) => {
          return { ...prev, otp: "Enter your OTP." };
        });
        err++;
      } else if (values.otp === otp) {
        setMsg({ class: "danger", mesg: `The OTP you provided didn't match` });
      }
    }
    if (state === 2) {
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
    }
    if (err === 0) return true;
    return false;
  };
  function generateOTP() {
    let digits = "0123456789QWERTYUIOPASDFGHJKLZXCVBNM";
    let OTP = "";
    let len = digits.length;
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * len)];
    }
    return OTP;
  }
  const otp = generateOTP();

  const body = `<!DOCTYPE html>
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="x-apple-disable-message-reformatting">
          <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">

          <meta name="color-scheme" content="light">
          <meta name="supported-color-schemes" content="light">


          <!--[if !mso]><!-->

            <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Ubuntu:ital,wght@0,400;0,700;1,400;1,700&family=Ubuntu:ital,wght@0,400;0,700;1,400;1,700&family=Ubuntu:ital,wght@0,400;0,700;1,400;1,700&family=Ubuntu:ital,wght@0,400;0,700;1,400;1,700&display=swap">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Ubuntu:ital,wght@0,400;0,700;1,400;1,700&family=Ubuntu:ital,wght@0,400;0,700;1,400;1,700&family=Ubuntu:ital,wght@0,400;0,700;1,400;1,700&family=Ubuntu:ital,wght@0,400;0,700;1,400;1,700&display=swap">

            <style type="text/css">
              @import url(https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Ubuntu:ital,wght@0,400;0,700;1,400;1,700&family=Ubuntu:ital,wght@0,400;0,700;1,400;1,700&family=Ubuntu:ital,wght@0,400;0,700;1,400;1,700&family=Ubuntu:ital,wght@0,400;0,700;1,400;1,700&display=swap);
          </style>

          <!--<![endif]-->

          <!--[if mso]>
            <style>
                * {
                    font-family: sans-serif !important;
                }
            </style>
          <![endif]-->


          <!-- NOTE: the title is processed in the backend during the campaign dispatch -->
          <title></title>

          <!--[if gte mso 9]>
          <xml>
              <o:OfficeDocumentSettings>
                  <o:AllowPNG/>
                  <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->

      <style>
          :root {
              color-scheme: light;
              supported-color-schemes: light;
          }

          html,
          body {
              margin: 0 auto !important;
              padding: 0 !important;
              height: 100% !important;
              width: 100% !important;

              overflow-wrap: break-word;
              -ms-word-break: break-all;
              -ms-word-break: break-word;
              word-break: break-all;
              word-break: break-word;
          }



    direction: undefined;
    center,
    #body_table {

    }

    ul, ol {
      padding: 0;
      margin-top: 0;
      margin-bottom: 0;
    }

    li {
      margin-bottom: 0;
    }



    .list-block-list-outside-left li {
      margin-left: 20px !important;
    }

    .list-block-list-outside-right li {
      margin-right: 20px !important;
    }


      .paragraph {
        font-size: 15px;
        font-family: Open Sans, sans-serif;
        font-weight: normal;
        font-style: normal;
        text-align: start;
        line-height: 1;
        text-decoration: none;
        color: #5f5f5f;

      }


      .heading1 {
        font-size: 32px;
        font-family: Open Sans, sans-serif;
        font-weight: normal;
        font-style: normal;
        text-align: start;
        line-height: 1;
        text-decoration: none;
        color: #000000;

      }


      .heading2 {
        font-size: 26px;
        font-family: Open Sans, sans-serif;
        font-weight: normal;
        font-style: normal;
        text-align: start;
        line-height: 1;
        text-decoration: none;
        color: #000000;

      }


      .heading3 {
        font-size: 19px;
        font-family: Open Sans, sans-serif;
        font-weight: normal;
        font-style: normal;
        text-align: start;
        line-height: 1;
        text-decoration: none;
        color: #000000;

      }


      .list {
        font-size: 15px;
        font-family: Open Sans, sans-serif;
        font-weight: normal;
        font-style: normal;
        text-align: start;
        line-height: 1;
        text-decoration: none;
        color: #5f5f5f;

      }


    p a,
    li a {

    display: inline-block;
      color: #5457FF;
      text-decoration: none;
      font-style: normal;
      font-weight: normal;

    }

    .button-table a {
      text-decoration: none;
      font-style: normal;
      font-weight: normal;
    }

    .paragraph > span {text-decoration: none;}.heading1 > span {text-decoration: none;}.heading2 > span {text-decoration: none;}.heading3 > span {text-decoration: none;}.list > span {text-decoration: none;}


          * {
              -ms-text-size-adjust: 100%;
              -webkit-text-size-adjust: 100%;
          }

          div[style*="margin: 16px 0"] {
              margin: 0 !important;
          }

          #MessageViewBody,
          #MessageWebViewDiv {
              width: 100% !important;
          }

          table {
              border-collapse: collapse;
              border-spacing: 0;
              mso-table-lspace: 0pt !important;
              mso-table-rspace: 0pt !important;
          }
          table:not(.button-table) {
              border-spacing: 0 !important;
              border-collapse: collapse !important;
              table-layout: fixed !important;
              margin: 0 auto !important;
          }

          th {
              font-weight: normal;
          }

          tr td p {
              margin: 0;
          }

          img {
              -ms-interpolation-mode: bicubic;
          }

          a[x-apple-data-detectors],

          .unstyle-auto-detected-links a,
          .aBn {
              border-bottom: 0 !important;
              cursor: default !important;
              color: inherit !important;
              text-decoration: none !important;
              font-size: inherit !important;
              font-family: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
          }

          .im {
              color: inherit !important;
          }

          .a6S {
              display: none !important;
              opacity: 0.01 !important;
          }

          img.g-img+div {
              display: none !important;
          }

          @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
              u~div .contentMainTable {
                  min-width: 320px !important;
              }
          }

          @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
              u~div .contentMainTable {
                  min-width: 375px !important;
              }
          }

          @media only screen and (min-device-width: 414px) {
              u~div .contentMainTable {
                  min-width: 414px !important;
              }
          }
      </style>

      <style>
          @media only screen and (max-device-width: 720px) {
              .contentMainTable {
                  width: 100% !important;
                  margin: auto !important;
              }
              .single-column {
                  width: 100% !important;
                  margin: auto !important;
              }
              .multi-column {
                  width: 100% !important;
                  margin: auto !important;
              }
              .imageBlockWrapper {
                  width: 100% !important;
                  margin: auto !important;
              }
          }
          @media only screen and (max-width: 720px) {
              .contentMainTable {
                  width: 100% !important;
                  margin: auto !important;
              }
              .single-column {
                  width: 100% !important;
                  margin: auto !important;
              }
              .multi-column {
                  width: 100% !important;
                  margin: auto !important;
              }
              .imageBlockWrapper {
                  width: 100% !important;
                  margin: auto !important;
              }
          }
      </style>
      <!--[if mso | IE]>
  <style>
  .button-r7p1TYRKE4ZnOrq_hyMx4 { padding: 16px 200px; };
  .button-r7p1TYRKE4ZnOrq_hyMx4 a { margin: -16px -200px; }; </style>
  <![endif]-->

  <!--[if mso | IE]>
      <style>
          .list-block-outlook-outside-left {
              margin-left: -18px;
          }

          .list-block-outlook-outside-right {
              margin-right: -18px;
          }

          a:link, span.MsoHyperlink {
              mso-style-priority:99;

    display: inline-block;
      color: #5457FF;
      text-decoration: none;
      font-style: normal;
      font-weight: normal;

          }
      </style>
  <![endif]-->


      </head>

      <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #F5F6F8;">
          <center role="article" aria-roledescription="email" lang="en" style="width: 100%; background-color: #F5F6F8;">
              <!--[if mso | IE]>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" id="body_table" style="background-color: #F5F6F8;">
              <tbody>
                  <tr>
                      <td>
                      <![endif]-->
                          <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="720" style="margin: auto;" class="contentMainTable">
                              <tr class="wp-block-editor-spacerblock-v1"><td style="background-color:#F5F6F8;line-height:29px;font-size:29px;width:100%;min-width:100%">&nbsp;</td></tr><tr class="wp-block-editor-headingblock-v1"><td valign="top" style="background-color:#ffffff;display:block;padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px;text-align:center"><p style="font-family:Ubuntu, sans-serif;text-align:center;line-height:NaNpx;letter-spacing:0;font-size:32px;background-color:#ffffff;color:#000000;margin:0;word-break:normal" class="heading1"><span style="color:#004566"><span style="font-weight: bold" class="bold">Bangladesh Educate Association</span></span></p></td></tr><tr class="wp-block-editor-imageblock-v1"><td style="background-color:#ffffff;padding-top:0;padding-bottom:0;padding-left:0;padding-right:0" align="center"><table align="center" width="352.8" class="imageBlockWrapper" style="width:352.8px" role="presentation"><tbody><tr><td style="padding:0"><img src="https://api.smtprelay.co/userfile/a3c8c24f-075d-4e05-9d7d-77a374303060/seven.jpg" width="352.8" height="" alt="" style="border-radius:0px;display:block;height:auto;width:100%;max-width:100%;border:0" class="g-img"></td></tr></tbody></table></td></tr><tr class="wp-block-editor-headingblock-v1"><td valign="top" style="background-color:#ffffff;display:block;padding-top:5px;padding-right:32px;padding-bottom:14px;padding-left:32px;text-align:center"><p style="font-family:Ubuntu, sans-serif;text-align:center;line-height:36.80px;font-size:32px;background-color:#ffffff;color:#000000;margin:0;word-break:normal" class="heading1"><span style="font-weight: bold" class="bold">Reset your Password</span></p></td></tr><tr class="wp-block-editor-paragraphblock-v1"><td valign="top" style="padding:20px 20px 20px 20px;background-color:#ffffff"><p class="paragraph" style="font-family:Ubuntu, sans-serif;line-height:30.00px;font-size:20px;margin:0;color:#5f5f5f;letter-spacing:0;word-break:normal">This email is to reset your password for <span style="font-weight: bold" class="bold">Bangladesh Educate Association</span>. The OTP to reset your password is given below. Don't share this OTP with anyone else to keep your account safe.</p></td></tr><tr class="wp-block-editor-buttonblock-v1" align="center"><td style="background-color:#ffffff;padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px;width:100%" valign="top"><table role="presentation" cellspacing="0" cellpadding="0" class="button-table"><tbody><tr><td valign="top" class="button-r7p1TYRKE4ZnOrq_hyMx4 button-td button-td-primary" style="cursor:pointer;border:none;border-radius:50px;background-color:#0699DF;font-size:35px;font-family:Impact, sans-serif;width:fit-content;text-decoration:none;letter-spacing:4px;color:#000000;overflow:hidden"><a style="color:#000000;display:block;padding:16px 200px 16px 200px">${otp}</a></td></tr></tbody></table></td></tr>
                          </table>
                      <!--[if mso | IE]>
                      </td>
                  </tr>
              </tbody>
              </table>
              <![endif]-->
          </center>
      </body>
  </html>`;
  const [msg, setMsg] = useState({ class: "", mesg: "" });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validated()) {
      if (state === 0) {
        const send = await Email.send({
          Host: "smtp.elasticemail.com",
          Username: "wikah33493@avastu.com",
          Password: "166472B4BBF170B287E39ADBC91B1C9AE9B9",
          To: values.email,
          From: "wikah33493@avastu.com",
          Subject: "Reset you Password for Bangladesh Educate Association",
          Body: "And this is the body",
        });
        if (send == 'OK') setState(state + 1);
        else alert(send)
      } else if (state === 1) {
        setState(state + 1);
      } else if (state === 2) {
        console.log("Password changed");
      }
    }
  };
  return (
    <>
      {going ? (
        <>
          <div className="container">
            <h2 className={`text-${msg.class} text-center mt-2 mb-2`}>
              {msg.mesg}
            </h2>
            <div className="card pade-middle">
              <div className="card-header problem-header">Reset Password</div>
              <div className="card-body">
                <div className="row d-grid grid-1-1-parent">
                    <Image src={svg} alt="" className='grid-1-1' style={{width: '100%', height: '100%', position: 'relative'}} />
                  <div className="grid-1-1">
                    <form action="" method="post" onSubmit={handleSubmit}>
                      {state === 1 ? (
                        <>
                          <div className="mb-3">
                            <label htmlFor="otp" className=" form-label">
                              Enter the OTP sent to your Email
                            </label>
                            <div className="input-group">
                              <input
                                autoComplete="off"
                                name="otp"
                                onChange={getValues}
                                value={values.otp}
                                type="text"
                                className={`form-control ${
                                  error.otp
                                    ? "border border-2 border-danger shadow-none rounded-3"
                                    : ""
                                }`}
                                id="otp"
                                placeholder="XXXXXX"
                              />
                            </div>
                            <small className="text-danger fs-6">
                              {error.otp}
                            </small>
                          </div>
                        </>
                      ) : state === 2 ? (
                        <>
                          <div className="mb-3">
                            <label htmlFor="pass" className=" form-label">
                              New Password
                            </label>
                            <div className="input-group">
                              <input
                                autoComplete="off"
                                name="password"
                                onChange={getValues}
                                value={values.password}
                                type={showPass.passT ? "text" : "password"}
                                className={`form-control ${
                                  error.password ? (
                                    "border border-2 border-danger shadow-none rounded-3"
                                  ) : (
                                    ""
                                  )
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
                                    showPass.passT
                                      ? "bi bi-eye-slash"
                                      : "bi bi-eye"
                                  }
                                ></i>
                              </span>
                            </div>
                            <small className="text-danger fs-6">
                              {error.password}
                            </small>
                          </div>
                          <div className="mb-3">
                            <label htmlFor="cpass" className=" form-label">
                              Confirm New Password
                            </label>
                            <div className="input-group">
                              <input
                                autoComplete="off"
                                onChange={getValues}
                                value={values.confirmPassword}
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
                                    showPass.cpassT
                                      ? "bi bi-eye-slash"
                                      : "bi bi-eye"
                                  }
                                ></i>
                              </span>
                            </div>
                            <small className="text-danger fs-6">
                              {error.confirmPassword}
                            </small>
                          </div>
                        </>
                      ) : state === 0 ? (
                        <>
                          <div className="mb-3">
                            <label
                              htmlFor="email"
                              className=" form-label"
                            >
                              Your Email
                            </label>
                            <div className="input-group">
                              <input
                                autoComplete="off"
                                name="email"
                                onChange={getValues}
                                value={values.email}
                                type="text"
                                className={`form-control ${
                                  error.email
                                    ? "border border-2 border-danger shadow-none rounded-3"
                                    : ""
                                }`}
                                id="email"
                                placeholder="yourname@example.com"
                              />
                            </div>
                            <small className="text-danger fs-6">
                              {error.email}
                            </small>
                          </div>
                        </>
                      ) : (
                        "Reload the page..."
                      )}
                      <button
                        type={
                          state === 0 || state === 1 || state === 2
                            ? "submit"
                            : "button"
                        }
                        className="btn btn-outline-success "
                        onClick={() => {
                          if (state !== 1 && state !== 2 && state !== 0)
                            location.reload();
                        }}
                      >
                        <b>
                          {state === 1
                            ? "Reset Password"
                            : state === 2
                            ? "Change Password"
                            : state === 0
                            ? "Send code"
                            : "Reload"}
                        </b>
                      </button>
                    </form>
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

export default PasswordReset;
