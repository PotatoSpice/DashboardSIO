import React from "react";
import { Link } from "react-router-dom";

import "./styles.css";

function header() {
  return (
    <header>
      <div className="container">
        <img
          src="https://img.icons8.com/cotton/64/000000/card-wallet.png"
          alt="logo"
        />
        <div className="menu-section">
          <nav>
            <ul>
              <li>
                <Link className="back-link" to="/test">
                  Home
                </Link>
              </li>
              <li>
                <Link className="back-link" to="/test">
                  Opçao1
                </Link>
              </li>
              <li>
                <Link className="back-link" to="/test">
                  Opçao2
                </Link>
              </li>
              <li>
                <Link className="back-link" to="/test">
                  Opçao3
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default header;
