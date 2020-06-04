import React from "react";

import "./styles.css";

export default function pie({ labels, data, alt }) {
  let graft = `https://quickchart.io/chart?c={type:'pie',data:{labels:["${labels}"], datasets:[{data:[${data}]}]}}`;
  return (
    <div>
      <img src={graft} alt={alt} />
    </div>
  );
}
