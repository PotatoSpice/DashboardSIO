import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./styles.css";

function Header() {
  const [year, setYear] = useState(0);

  useEffect(() => {
    let ano = localStorage.getItem("year");
    setYear(+ano);
    console.log(+ano);
  }, [year]);
  return (
    <header>
      <div className="container">
        <img
          src="https://img.icons8.com/cotton/64/000000/card-wallet.png"
          alt="logo"
        />
        <h1 class="year">Fiscal Year:{year}</h1>
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

export default Header;
