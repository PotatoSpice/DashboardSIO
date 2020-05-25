import React from "react";

import Cardtext from "../../components/card/index";
import Pie from "../../components/pie/index";
import Header from "../../components/header/index";

import "./styles.css";

function dasboard() {
  return (
    <div>
      <Header />
      <h1>Dasboard</h1>
      <Cardtext
        icon={"https://img.icons8.com/ios-filled/50/000000/price-tag-euro.png"}
        text={"Price:"}
        resolte={"125€"}
        alt={"Price"}
      />
      <Pie
        labels={`["January", "February", "March"]`}
        data={`[50, 60, 70]`}
        alt={"Pie Chart"}
      />
    </div>
  );
}

export default dasboard;
