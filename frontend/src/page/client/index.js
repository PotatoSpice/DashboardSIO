import React, { useState, useEffect } from "react";
import api from "../../services/api";

import Header from "../../components/header/index";
import Table from "../../components/tableClient/index";
import TableSale from "../../components/tableSale/index";
import Pie from "../../components/pie/index";

// import { Container } from './styles';

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
      <h1>Client</h1>
      <Table />
      <Pie labels={cities} data={count} alt={"Pie"} />
    </div>
  );
}

export default Client;
