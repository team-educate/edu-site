import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
    <>
        <footer className='mt-5'>
            <div className="container">
                <div className="footer-links">
                    <ul className='w-100 d-flex flex-row align-items-center justify-content-center'>
                        <li className=' d-block text-end m-0' style={{width: '48%'}}><Link className='me-3' href="/privacy_policy">Privacy Policy</Link></li>
                        <li className='text-center m-0'>||</li>
                        <li className='d-block text-start m-0' style={{width: '48%'}}><Link className='ms-3 w-100' href="terms_and_conditions">Terms and Conditions</Link></li>
                    </ul>
                </div>
                <div className="social-links">
                    <a className='me-2' href="https://www.facebook.com/bd.educate.association/" target="_blank"><i className="bi bi-facebook"></i></a>
                    <a className='ms-2 me-0' href="mailto:educate.with.us.today@gmail.com" target="_blank"><i className="bi bi-envelope"></i></a>

                </div>
                <div className="newsletter">
                    <h5>Subscribe to our Newsletter</h5>
                    <input type="email" name='email' autoComplete='off' placeholder="Your Email" className='rounded-start'/>
                    <button type="button" className='rounded-end'>Subscribe</button>
                </div>
                <br />
                <p className="copyright">&copy; 2024 Bangladesh Educate Association</p>
            </div>
        </footer>
    </>
  )
}

export default Footer
