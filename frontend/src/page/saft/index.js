import React, { useState } from "react";
import Header from "../../components/header/index";

import api from "../../services/api";

// import { Container } from './styles';

export default function Saft() {
  const [saft, setSaft] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData();

    data.append("saft", saft);

    await api.post("/upload", data);
  }
  return (
    <div>
      <Header />
      <h1>saft</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(event) => setSaft(event.target.files[0])}
        />

        <button type="submit" className="btn">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
