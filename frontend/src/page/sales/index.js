import React, { useState, useEffect } from "react";
import Header from "../../components/header/index";
// import { Container } from './styles';
import Table from "../../components/tableVenda";

export default function Sales() {
  return (
    <div>
      <Header />
      <Table />
    </div>
  );
}
