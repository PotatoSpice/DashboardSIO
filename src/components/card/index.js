import React from "react";

import "./style.css";

function card() {
  return (
    <div className="card">
      <div className="row">
        <p className="icon">
          <img src="https://img.icons8.com/ios-filled/50/000000/price-tag-euro.png" />
        </p>
        <p className="price">125€</p>
      </div>
      <hr />
      <p className="card-text">Price:</p>
    </div>
  );
}

export default card;
