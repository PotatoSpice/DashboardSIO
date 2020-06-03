import React from "react";

//import "./styles.css";

export default function line({ labels, data, name, alt }) {
  let graft = `https://quickchart.io/chart?c={type:'line',data:{labels:${labels}, datasets:[{label:"${name}", data: ${data}, fill:false,borderColor:'blue'}]}}`;
  return (
    <div>
      <img src={graft} alt={alt} />
    </div>
  );
}
