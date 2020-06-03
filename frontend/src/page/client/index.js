import React, { useState, useEffect } from "react";
import api from "../../services/api";

import Header from "../../components/header/index";
import Table from "../../components/tableClient/index";

// import { Container } from './styles';

function Client() {
  return (
    <div>
      <Header />
      <h1>Client</h1>
      <Table />
    </div>
  );
}

export default Client;
