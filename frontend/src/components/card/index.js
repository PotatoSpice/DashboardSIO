import React from "react";

import "./style.css";

export default function Cardtext({ icon, text, resolte }) {
  return (
    <div className="card">
      <div className="row">
        <p className="icon">
          <img src={icon} alt={text} />
        </p>
        <p className="price">{resolte}</p>
      </div>
      <hr />
      <p className="card-text">{text}</p>
    </div>
  );
}
