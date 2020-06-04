import React, { useState, useEffect } from "react";
import Header from "../../components/header/index";

import Pie from "../../components/pie/index";
import api from "../../services/api";

// import { Container } from './styles';

export default function Product() {
  const [year, setYear] = useState(0);
  const [name, setName] = useState("");
  const [total, setTotal] = useState("");
  const [count, setCount] = useState("");

  async function pieProduct() {
    const response = await api.post("/saft/productgroups", {
      FiscalYear: year,
    });

    const { groupName, groupTotal, groupCount } = response.data;
    console.log(groupName, groupTotal, groupCount);
    setName(groupName);
    setTotal(groupTotal);
    setCount(groupCount);
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
      <h1>Product</h1>
      <h2>Valor Total por grupo</h2>
      <Pie labels={name} data={total} alt={"Pie"} />
      <h2>Numero Total por grupo</h2>
      <Pie labels={name} data={count} alt={"Pie"} />
    </div>
  );
}
