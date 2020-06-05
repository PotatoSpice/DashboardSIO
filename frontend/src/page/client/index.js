import React, { useState, useEffect } from "react";
import api from "../../services/api";

import Header from "../../components/header/index";
import Table from "../../components/tableClient/index";
import TableSale from "../../components/tableSale/index";
import Pie from "../../components/pie/index";

import "./styles.css";

function Client() {
  const [year, setYear] = useState(0);
  const [cities, setCities] = useState("");
  const [count, setCount] = useState("");

  async function pieProduct() {
    const response = await api.post("/saft/locations", {
      FiscalYear: year,
    });

    const { cities, count } = response.data;
    console.log(cities, count);
    setCities(cities);
    setCount(count);
  }
  useEffect(() => {
    let ano = localStorage.getItem("year");
    setYear(+ano);
    console.log(+ano);
    pieProduct();
  }, [year]);

  return (
    <div>
      <Header />
      <h1 className="title">
        Client
        <img
          className="iconD"
          src="https://img.icons8.com/pastel-glyph/64/000000/business-group.png"
        />
      </h1>
      <Table />
      <h1 className="title">
        Location
        <img
          className="iconD"
          src="https://img.icons8.com/carbon-copy/100/000000/worldwide-location.png"
        />
      </h1>
      <Pie labels={cities} data={count} alt={"Pie"} />
    </div>
  );
}

export default Client;
