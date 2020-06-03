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
  const [year, setYear] = useState(2017);
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
    console.log(months)

  }

  useEffect(() => {
    test();
    kpis();
    invoices();
  }, [status]);

  return (
    <div>
      <Header />
      <h1>Dasboard</h1>
      <div className="kpis">
        <Cardtext
          icon={"https://img.icons8.com/ios/64/000000/list.png"}
          text={"Total Entries:"}
          resolte={TotalEntries}
        />
        <Cardtext
          icon={
            "https://img.icons8.com/android/24/000000/bank-card-back-side.png"
          }
          text={"Total Credit:"}
          resolte={TotalCredit}
        />
        <Cardtext
          icon={"https://img.icons8.com/wired/64/000000/sales-performance.png"}
          text={"Number Of Sales:"}
          resolte={NumberOfSales}
        />
        <Cardtext
          icon={"https://img.icons8.com/wired/64/000000/sales-performance.png"}
          text={"Sales Value:"}
          resolte={SalesValue}
        />
        <Cardtext
          icon={"https://img.icons8.com/carbon-copy/100/000000/total-sales.png"}
          text={"Total Sales:"}
          resolte={totalVendas}
        />
        <Cardtext
          icon={"https://img.icons8.com/wired/64/000000/shop.png"}
          text={"Total Compras:"}
          resolte={totalCompras}
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
      </div>
      <Pie
        labels={`["January", "February", "March"]`}
        data={`[50, 60, 70]`}
        alt={"Pie Chart"}
      />
      <Bar
        labels={`["January", "February", "March"]`}
        data={`[50, 60, 70]`}
        set={"Users"}
      />

      <TableTest />

      <Line
        labels={`["January", "February", "March"]`}
        data={`[50, 60, 70]`}
        name={"User"}
        alt={"User"}
      />

      <DoubleLine
        labels={`["January", "February", "March"]`}
        data1={`[50, 60, 70]`}
        name1={"User"}
        data2={`[25, 80, 5]`}
        name2={"Test"}
        alt={"User"}
      />
    </div>
  );
}
