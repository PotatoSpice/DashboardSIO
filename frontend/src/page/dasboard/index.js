import React, { useState, useEffect } from "react";
import api from "../../services/api";

import Cardtext from "../../components/card/index";
import Pie from "../../components/pie/index";
import Header from "../../components/header/index";
import Bar from "../../components/bar/index";
import TableTest from "../../components/table/index";
import Line from "../../components/line/index";
import DoubleLine from "../../components/doubleLine/index";

import "./styles.css";

export default function Dasboard() {
  const [status, setStatus] = useState("");
  const [year, setYear] = useState(0);
  const [TotalEntries, setTotalEntries] = useState("");
  const [TotalCredit, setTotalCredit] = useState("");
  const [NumberOfSales, setNumberOfSales] = useState("");
  const [SalesValue, setSalesValue] = useState("");
  const [totalCompras, setTotalCompras] = useState("");
  const [totalVendas, setTotalVendas] = useState("");
  //invoice
  const [monthsInvoice, setMonthsInvoice] = useState([]);
  const [monthTotal, setMonthTotal] = useState([]);
  const [monthNetTotal, setMonthNetTotal] = useState([]);

  async function test() {
    const response = await api.get("/");
    console.log(response);
  }

  async function kpis() {
    const response = await api.post("/saft/kpi", {
      FiscalYear: year,
    });

    const {
      TotalEntries,
      TotalCredit,
      NumberOfSales,
      SalesValue,
      totalCompras,
      totalVendas,
    } = response.data;

    setTotalEntries(TotalEntries);
    setTotalCredit(TotalCredit);
    setNumberOfSales(NumberOfSales);
    setSalesValue(SalesValue);
    setTotalCompras(totalCompras);
    setTotalVendas(totalVendas);
  }

  async function invoices() {
    const response = await api.post("/saft/dashboard", {
      FiscalYear: year,
    });

    const { months, monthTotal, monthNetTotal } = response.data;
    console.log(months, monthTotal, monthNetTotal);
    setMonthsInvoice(months);
    setMonthTotal(monthTotal);
    setMonthNetTotal(monthNetTotal);
    console.log(months);
  }

  useEffect(() => {
    let ano = localStorage.getItem("year");
    setYear(+ano);
    console.log(+ano);

    test();
    kpis();
    invoices();
  }, [status, year]);

  return (
    <div>
      <Header />
      <h1 className="title">
        Dashboard
        <img
          src="https://img.icons8.com/wired/64/000000/dashboard.png"
          className="iconD"
        />
      </h1>
      <div className="kpis">
        <Cardtext
          icon={"https://img.icons8.com/wired/64/000000/sales-performance.png"}
          text={"Number Of Sales"}
          resolte={NumberOfSales}
        />
        <Cardtext
          icon={"https://img.icons8.com/wired/64/000000/sales-performance.png"}
          text={"Net Sales Value:"}
          resolte={SalesValue + "€"}
        />
        <Cardtext
          icon={"https://img.icons8.com/carbon-copy/100/000000/total-sales.png"}
          text={"Total Sales:"}
          resolte={totalVendas + "€"}
        />
        <Cardtext
          icon={"https://img.icons8.com/wired/64/000000/shop.png"}
          text={"Number of purchase: "}
          resolte={TotalEntries - NumberOfSales}
        />
        <Cardtext
          icon={"https://img.icons8.com/wired/64/000000/shop.png"}
          text={"Total of purchase: "}
          resolte={totalCompras + "€"}
        />

        <Cardtext
          icon={"https://img.icons8.com/wired/64/000000/shop.png"}
          text={"Total of profit: "}
          resolte={SalesValue - totalCompras + "€"}
        />
      </div>

      <div className="invoices">
        <DoubleLine
          labels={monthsInvoice}
          data1={monthTotal}
          name1={"Total Invoices"}
          data2={monthNetTotal}
          name2={"Total Average Invoices"}
          alt={"Invoices"}
        />
        <h2>€ per month</h2>
      </div>

      <h1 className="titleI">
        Invoices Table
        <img
          src="https://img.icons8.com/pastel-glyph/64/000000/invoice-1.png"
          className="iconD"
        />
      </h1>
      <TableTest className="tableI" />
    </div>
  );
}
