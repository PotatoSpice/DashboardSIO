import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import api from "../../services/api";
// import { Container } from './styles';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function TableClient() {
  const [year, setYear] = useState(0);
  const [rows, setRows] = useState([]);

  async function invoices() {
    const response = await api.post("/saft/salesproduct", {
      FiscalYear: year,
    });
    console.log(response.data);
    setRows(response.data);
    console.log(rows);
  }

  useEffect(() => {
    let ano = localStorage.getItem("year");
    setYear(+ano);
    console.log(+ano);

    invoices();
  }, [year]);

  const classes = useStyles();
  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Total sold value (€)</TableCell>
              <TableCell align="right">Average sold value (€)</TableCell>
              <TableCell align="right">Total Amount Sold</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.productDesc}>
                <TableCell component="th" scope="row">
                  {row.productDesc}
                </TableCell>
                <TableCell align="right">{row.productTotal}</TableCell>
                <TableCell align="right">{row.productAverage}</TableCell>
                <TableCell align="right">{row.productCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
