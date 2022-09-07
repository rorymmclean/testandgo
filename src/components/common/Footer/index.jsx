import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
const Footer = () => {
  return (
    <footer
      style={{
        textAlign: 'center',
        paddingBottom: '10px',
      }}
    >
      <a
        className="regiserLink-1 "
        href="https://www.radeas.com/"
        rel="noopener noreferrer"
        target="_blank"
        style={{
          marginTop: '40px',
          fontSize: '0.8rem',
          fontWeight: '400',
          textAlign: 'center',
          textDecoration: 'none',
          color: '#A6A7AA',
        }}
      >
        © Test and Go by Radeas Labs 2022 Wake Forest, NC USA
      </a>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Link
          className="regiserLink-1 footerSpan "
          to="/terms-of-use"
          target="_blank"
          style={{
            fontSize: '0.8rem',
            fontWeight: '400',
            textAlign: 'center',
            textDecoration: 'none',
            color: '#A6A7AA',
            marginRight: '2px',
          }}
        >
          Terms of Service
        </Link>
        <Link
          className="regiserLink-1 footerSpan"
          to="/privacy"
          target="_blank"
          style={{
            fontSize: '0.8rem',
            fontWeight: '400',
            textAlign: 'center',
            textDecoration: 'none',
            color: '#A6A7AA',
            marginRight: '2px',
          }}
        >
          <span style={{ color: 'red' }}>|</span> Privacy Policy
        </Link>
        <Link
          className="regiserLink-1 footerSpan"
          to="/conditions-of-sale"
          target="_blank"
          style={{
            fontSize: '0.8rem',
            fontWeight: '400',
            textAlign: 'center',
            textDecoration: 'none',
            color: '#A6A7AA',
          }}
        >
          <span style={{ color: 'red' }}>|</span> Conditions of Sale
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
