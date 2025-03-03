import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import Logo from "../Logo";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-10 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Logo & About */}
          <div className="flex flex-col">
            <Logo width="120px" />
            <p className="text-gray-400 mt-3 text-sm">
              Empowering developers with modern UI solutions.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-gray-300 font-semibold uppercase mb-3">
              Company
            </h3>
            <ul>
              <li>
                <Link className="footer-link" to="/">
                  Features
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/">
                  Pricing
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/">
                  Affiliate Program
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/">
                  Press Kit
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-gray-300 font-semibold uppercase mb-3">
              Support
            </h3>
            <ul>
              <li>
                <Link className="footer-link" to="/">
                  Account
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/">
                  Help
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/">
                  Customer Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-gray-300 font-semibold uppercase mb-3">
              Follow Me
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/ALITAYYAB2K1"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaFacebook />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 mt-8 border-t border-gray-700 pt-4">
          &copy; {currentYear} ALI TAYYAB. All rights reserved.
        </div>
      </div>

      {/* Tailwind CSS Enhancements */}
      <style>{`
        .footer-link {
          display: block;
          color: #bbb;
          font-size: 14px;
          margin-bottom: 6px;
          transition: color 0.3s ease-in-out;
        }
        .footer-link:hover {
          color: #fff;
        }
        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: white;
          transition: background 0.3s ease-in-out;
        }
        .social-icon:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </footer>
  );
}

export default Footer;
