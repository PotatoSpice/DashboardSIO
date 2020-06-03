import React from "react";

//import "./styles.css";

export default function doubleLine({
  labels,
  data1,
  name1,
  name2,
  data2,
  alt,
}) {
  let graft = `https://quickchart.io/chart?c={type:'line',data:{labels:[${labels}], datasets:[{label:'${name1}', data: [${data1}], fill:false,borderColor:'blue'},{label:'${name2}', data:[${data2}], fill:false,borderColor:'green'}]}}`;
  return (
    <div>
      <img src={graft} alt={alt} />
    </div>
  );
}
