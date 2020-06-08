import React, { useState, useEffect } from "react";
import Header from "../../components/header/index";

import Pie from "../../components/pie/index";
import api from "../../services/api";
import TablePro from "../../components/tableProduto";
import Table from "../../components/tableVenda";
import Bar from "../../components/bar";

import "./styles.css";

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
      <h1 className="title">
        Product
        <img
          className="iconD"
          src="https://img.icons8.com/pastel-glyph/64/000000/product.png"
        />
      </h1>
      <div className="pies">
        <div className="pie">
          <h2>Sales value by Product Group</h2>
          <Pie labels={name} data={total} alt={"Pie"} />
        </div>
        <div className="pie">
          <h2>Total Amount Sold by Product Group</h2>
          <Pie labels={name} data={count} alt={"Pie"} />
        </div>
      </div>
      <Table />
    </div>
  );
}
