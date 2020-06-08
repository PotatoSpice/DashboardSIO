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
  const [customer, setCustomer] = useState("");
  const [percent, setPercent] = useState("");

  async function pieProduct() {
    const response = await api.post("/saft/customers", {
      FiscalYear: year,
    });

    const { cities, count, customer, percent } = response.data;
    console.log(cities, count);
    setCities(cities);
    setCount(count);
    setCustomer(customer);
    setPercent(percent);
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
      <div className="pies">
        <div className="pie">
          <h1 className="title">Customer per Location</h1>
          <Pie labels={cities} data={count} alt={"Pie"} />
        </div>
        <div className="pie">
          <h1 className="title">Customer Relevance (%)</h1>
          <Pie labels={customer} data={percent} alt={"Pie"} />
        </div>
      </div>

      <h1 className="title">
        Client
        <img
          className="iconD"
          src="https://img.icons8.com/pastel-glyph/64/000000/business-group.png"
        />
      </h1>
      <Table />
    </div>
  );
}

export default Client;
