import React from "react";

import Cardtext from "../../components/card/index";
import "./styles.css";

function dasboard() {
  return (
    <div>
      <h1>Dasboard</h1>
      <Cardtext
        icon={"https://img.icons8.com/ios-filled/50/000000/price-tag-euro.png"}
        text={"Price:"}
        resolte={"125€"}
        alt={"Price"}
      />
    </div>
  );
}

export default dasboard;
