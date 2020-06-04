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
                <Link className="back-link" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="back-link" to="/client">
                  Client
                </Link>
              </li>
              <li>
                <Link className="back-link" to="/product">
                  Product
                </Link>
              </li>
              <li>
                <Link className="back-link" to="/sales">
                  Sales
                </Link>
              </li>
              <li>
                <Link className="back-link" to="/saft">
                  Saft
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
