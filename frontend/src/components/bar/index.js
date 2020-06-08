import React from "react";

// import { Container } from './styles';

function bar({ labels, data, set }) {
  let bar = `https://quickchart.io/chart?c={type:'bar',data:{labels:[${labels}],datasets:[{label:'${set}',data:[${data}]}]}}`;
  return <img src={bar} alt="Bar" />;
}

export default bar;
