import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
// import { Container } from './styles';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(
  number,
  date,
  customer,
  totalTax,
  totalWithoutTax,
  totalWithTax
) {
  return { number, date, customer, totalTax, totalWithoutTax, totalWithTax };
}

const rows = [
  createData("1234", "12/5/1800", "eu", 24, 4.0, 4547),
  createData("5678", "12/5/1800", "tu", 37, 4.3, 2365),
];

export default function TableTest() {
  const classes = useStyles();
  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Number</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Customer</TableCell>
              <TableCell align="right">Total Tax</TableCell>
              <TableCell align="right">Total without tax</TableCell>
              <TableCell align="right">Total with tax</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.number}>
                <TableCell component="th" scope="row">
                  {row.number}
                </TableCell>
                <TableCell align="right">{row.date}</TableCell>
                <TableCell align="right">{row.customer}</TableCell>
                <TableCell align="right">{row.totalTax}</TableCell>
                <TableCell align="right">{row.totalWithoutTax}</TableCell>
                <TableCell align="right">{row.totalWithTax}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
