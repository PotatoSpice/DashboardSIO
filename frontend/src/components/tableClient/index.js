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
  const [year, setYear] = useState(2020);
  const [rows, setRows] = useState([]);

  async function invoices() {
    const response = await api.post("/saft/sales", {
      FiscalYear: year,
    });

    setRows(response.data);
    console.log(rows);
  }

  useEffect(() => {
    invoices();
  }, []);

  const classes = useStyles();
  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Client Tax Id</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Average</TableCell>
              <TableCell align="right">Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.clientTaxID}>
                <TableCell component="th" scope="row">
                  {row.clientTaxID}
                </TableCell>
                <TableCell align="right">{row.clientName}</TableCell>
                <TableCell align="right">{row.clientTotal}</TableCell>
                <TableCell align="right">{row.clientAverage}</TableCell>
                <TableCell align="right">{row.clientCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
