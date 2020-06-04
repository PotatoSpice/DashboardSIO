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

export default function TableTest() {
  const [year, setYear] = useState(0);
  const [rows, setRows] = useState([]);

  async function invoices() {
    const response = await api.post("/saft/invoices", {
      FiscalYear: year,
    });

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
              <TableCell>Invoice</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Customer</TableCell>
              <TableCell align="right">Gross Total</TableCell>
              <TableCell align="right">Net Total</TableCell>
              <TableCell align="right">Tax Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.InvoiceNo}>
                <TableCell component="th" scope="row">
                  {row.InvoiceNo}
                </TableCell>
                <TableCell align="right">{row.InvoiceDate}</TableCell>
                <TableCell align="right">{row.CustomerID}</TableCell>
                <TableCell align="right">{row.GrossTotal}</TableCell>
                <TableCell align="right">{row.NetTotal}</TableCell>
                <TableCell align="right">{row.TaxTotal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
