"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import eight from "@/public/img/club logo/eight.png";
import blog1 from "@/public/img/blogs/blog1.jpg";
import Link from "next/link";
import { Hind_Siliguri } from "next/font/google";
import { getDocs, collection, orderBy, limit, query, getDoc, doc } from "firebase/firestore";
import { db, auth } from "@/lib/firebaseConfig.js";
import { onAuthStateChanged } from 'firebase/auth'

const getProblems = async (sub) => {
  const querySnapshot = await getDocs(
    query(collection(db, sub), orderBy("id", "desc"), limit(2))
  );
  const problems = [];
  querySnapshot.forEach((prob) => {
    problems.push(prob.data());
  });
  return problems;
};

const hind = Hind_Siliguri({
  subsets: ["bengali"],
  display: "swap",
  variable: "--font-hind",
  weight: ["300", "400", "500", "600", "700"],
});
function Home() {
  const [userDoc, setUserDoc] = useState({})
  const [mathProblems, setMath] = useState([]);
  const [physicsProblems, setPhysics] = useState([]);
  const [chemistryProblems, setChemistry] = useState([]);

  useEffect(() => {
    const getP = async () => {
      const a = await getProblems("math");
      const b = await getProblems("physics");
      const c = await getProblems("chemistry");
      setMath(a);
      setChemistry(c);
      setPhysics(b);
    };
    getP();
  });

  onAuthStateChanged(auth, async user => {
    if (user !== null) {
      const dt = await getDoc(doc(db, 'users', user.uid));
      setUserDoc(dt.data());
    }
  })

  const blogs = [
    {
      title: "হাইজেনবার্গের অনিশ্চয়তা নীতি",
      image: blog1,
      author: "Ahmmed Al Junaed",
      id: 1,
    },
    {
      title: "হাইজেনবার্গের অনিশ্চয়তা নীতি",
      image: blog1,
      author: "Ahmmed Al Junaed",
      id: 2,
    },
  ];
  return (
    <>
      <div className="header bg-c1 c1">
        <div className="container">
          <div className="row container">
            <div className="col padding1">
              <h3 className="wel">Welcome! to</h3>
              <div className="h">
                <h2 style={{ fontSize: "50px" }}>
                  Bangladesh <span className="color1">Educate</span>
                </h2>
                <h1 className="color2" style={{ fontSize: "60px" }}>
                  <b>Association</b>
                </h1>
              </div>
              <br />
              <a
                href="https://www.facebook.com/bd.educate.assosiation/"
                target="_blank"
              >
                <button className="button">
                  Visit Our Community <i className="bi bi-arrow-right"></i>
                </button>
              </a>
            </div>
            <div className="col c2 justify-content-center d-flex align-items-center">
              <Image src={eight} priority={true} alt="" width={500} />
            </div>
          </div>
        </div>
      </div>
      <svg
        style={{ filter: "drop-shadow(0 -4px 2px #00000044)", zIndex: -1 }}
        className="rotate"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#d4f4fd"
          fillOpacity="1"
          d="M0,160L26.7,160C53.3,160,107,160,160,170.7C213.3,181,267,203,320,192C373.3,181,427,139,480,149.3C533.3,160,587,224,640,234.7C693.3,245,747,203,800,197.3C853.3,192,907,224,960,245.3C1013.3,267,1067,277,1120,250.7C1173.3,224,1227,160,1280,154.7C1333.3,149,1387,203,1413,229.3L1440,256L1440,320L1413.3,320C1386.7,320,1333,320,1280,320C1226.7,320,1173,320,1120,320C1066.7,320,1013,320,960,320C906.7,320,853,320,800,320C746.7,320,693,320,640,320C586.7,320,533,320,480,320C426.7,320,373,320,320,320C266.7,320,213,320,160,320C106.7,320,53,320,27,320L0,320Z"
        ></path>
      </svg>

      <div className="container">
        <span className="text-center">
          <h2 className="padding7">About Us</h2>
          <div
            className="progress pg1"
            role="progressBar"
            area-label="Basic example"
            aria-valuemax={100}
            aria-valuenow={100}
            aria-valuemin={0}
          >
            <div className="progress-bar pb1"></div>
          </div>
          <br />
        </span>
        <div className="card">
          <div className="card-body">
            <p className="bigg" style={{ textAlign: "justify" }}>
              <q>
                <span className="color1">Bangladesh Educate Association</span>
              </q>{" "}
              is a non-profit educational organization in Bangladesh. It is an
              online organization. There are 40+ volunteers working very hard
              for students. This organization was established on 3rd June 2023.
              We organize various math, science events. We also provide Olympiad
              news and science updates. And this is our official site. There are
              a lot of problems you can solve. Also, there are many blogs which
              you can read. So, Thanks for visiting us.
            </p>
          </div>
        </div>
        <br />
        <span className="text-center">
          <h2>Recent Problems</h2>
          <div
            className="progress pg1"
            role="progressBar"
            area-label="Basic example"
            aria-valuemax={100}
            aria-valuenow={100}
            aria-valuemin={0}
          >
            <div className="progress-bar pb1"></div>
          </div>
          <br />
        </span>
        <br />
        <div className={`row ${mathProblems.length === 0 && physicsProblems.length === 0 ? 'd-none' : ''}`}>
          <div className="col-sm-6 mb-3 mb-sm-0">
            <div className="card">
              <div className="card-header problem-header">Mathematics</div>
            </div>
            <br />
            {mathProblems.map((prob) => {
              return (
                <>
                  <Link
                    key={prob.id}
                    href={`/problems/math/all/${prob.id}`}
                    className="decno text-decoration-none text-dark"
                  >
                    <div className={`card ${userDoc?.mathSolved?.includes(prob.id) ? 'solved' : userDoc?.mathUnsolved?.includes(prob.id) ? 'unsolved' : 'notry'}`}>
                      <div className="card-body card-dark">
                        <b>
                          <h4>{prob.name}</h4>
                        </b>
                        <p>{`Points: ${prob.point}`}</p>
                      </div>
                    </div>
                  </Link>
                  <br />
                </>
              );
            })}
          </div>
          <div className="col-sm-6 mb-3 mb-sm-0">
            <div className="card">
              <div className="card-header problem-header">Physics</div>
            </div>
            <br />
            {physicsProblems.map((prob) => {
              return (
                <>
                  <Link
                    key={prob.id}
                    href={`/problems/physics/all/${prob.id}`}
                    className="decno text-decoration-none text-dark"
                  >
                    <div className={`card ${userDoc?.physicsSolved?.includes(prob.id) ? 'solved' : userDoc?.physicsUnsolved?.includes(prob.id) ? 'unsolved' : 'notry'}`}>
                      <div className="card-body card-dark">
                        <b>
                          <h4>{prob.name}</h4>
                        </b>
                        <p>{`Points: ${prob.point}`}</p>
                      </div>
                    </div>
                  </Link>
                  <br />
                </>
              );
            })}
          </div>
        </div>
        <div className={`row ${chemistryProblems.length === 0 ? 'd-none' : ''}`}>
          <div className="col-sm-6 mb-3  mb-sm-0">
            <div className="card ">
              <div className="card-header problem-header">Chemistry</div>
            </div>
            <br />
            {chemistryProblems.map((prob) => {
              return (
                <>
                  <Link
                    key={prob.id}
                    href={`/problems/chemistry/all/${prob.id}`}
                    className="decno text-decoration-none text-dark"
                  >
                    <div className={`card ${userDoc.chemistrySolved?.includes(prob.id) ? 'solved' : userDoc.chemistryUnsolved?.includes(prob.id) ? 'unsolved' : 'notry'}`}>
                      <div className="card-body card-dark">
                        <b>
                          <h4>{prob.name}</h4>
                        </b>
                        <p>{`Points: ${prob.point}`}</p>
                      </div>
                    </div>
                  </Link>
                  <br />
                </>
              );
            })}
          </div>
        </div>
        <br />
        <span className="text-center">
          <h2>Recent Blogs</h2>
          <div
            className="progress pg1"
            role="progressBar"
            area-label="Basic example"
            aria-valuemax={100}
            aria-valuenow={100}
            aria-valuemin={0}
          >
            <div className="progress-bar pb1"></div>
          </div>
          <br />
        </span>
        <br />
        <div className="row">
          {blogs.map((blog) => {
            return (
              <div
                key={blog.id}
                className="col-sm-6 mb-3 mb-sm-0 rounded-top rounded-5"
              >
                <div className="card">
                  <Image
                    src={blog.image}
                    alt=""
                    className="blog-img rounded-top rounded-5"
                  />
                  <div className="card-body text-center">
                    <h3 className={hind.className}>
                      <b>{blog.title}</b>
                    </h3>
                    <p>{blog.author}</p>
                    <a href={`/blogs/${blog.id}`}>
                      <button className="blogb">
                        Read<i className="bi bi-caret-right"></i>
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <br />
        <Link href={"/blogs"}>
          <button className="view-all-blog">
            View More<i className="bi bi-caret-right"></i>
          </button>
        </Link>
      </div>
    </>
  );
}

export default Home;
