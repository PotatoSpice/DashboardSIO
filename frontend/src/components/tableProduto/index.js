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

export default function TableProduct() {
  const [year, setYear] = useState(0);
  const [rows, setRows] = useState([]);

  async function test() {
    console.log("invoice1");
    const response = await api.post("/saft/productlisting", {
      FiscalYear: year,
    });
    console.log("invoice2");
    console.log("aqui" + response.data);
    setRows(response.data);
    //console.log(rows);
  }

  useEffect(() => {
    let ano = localStorage.getItem("year");
    setYear(+ano);
    console.log(+ano);
    console.log("africa");
    test();
  }, [year]);

  const classes = useStyles();
  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product Code</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Group</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.ProductCode}>
                <TableCell component="th" scope="row">
                  {row.ProductCode}
                </TableCell>
                <TableCell align="right">{row.ProductDescription}</TableCell>
                <TableCell align="right">{row.ProductGroup}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
