import React, { useState } from "react";
import Header from "../../components/header/index";

import api from "../../services/api";

import "./styles.css";

export default function Saft() {
  const [saft, setSaft] = useState(null);
  const [year, setYear] = useState();

  async function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData();

    data.append("saft", saft);

    await api.post("/upload", data);
  }

  async function handleSubmitNot(event) {
    event.preventDefault();

    const data = new FormData();

    data.append("saft", saft);

    await api.post("/uploadNoValidation", data);
  }

  function setAno(event) {
    event.preventDefault();

    localStorage.setItem("year", year);
  }

  return (
    <div>
      <Header />
      <div className="saft">
        <h1 className="title">Import SAFT</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="inp"
            type="file"
            onChange={(event) => setSaft(event.target.files[0])}
          />

          <button type="submit" className="btn1">
            Import
          </button>
        </form>
      </div>
      <div className="saft">
        <h1 className="title">Import SAFT without validation</h1>
        <form onSubmit={handleSubmitNot}>
          <input
            className="inp"
            type="file"
            onChange={(event) => setSaft(event.target.files[0])}
          />

          <button type="submit" className="btn1">
            Import
          </button>
        </form>
      </div>

      <div className="year">
        <h1 className="titleYear">Year</h1>
        <form onSubmit={setAno}>
          <input
            className="in"
            type="number"
            value={year}
            placeholder="Ano do saft?"
            onChange={(event) => setYear(event.target.value)}
          />
          <button type="submit" className="btn1">
            OK
          </button>
        </form>
      </div>
    </div>
  );
}
