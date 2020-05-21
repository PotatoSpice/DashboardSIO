import React from "react";

import "./style.css";

export default function Cardtext({ icon, text, resolte, alt }) {
  return (
    <div className="card">
      <div className="row">
        <p className="icon">
          <img src={icon} alt={alt} />
        </p>
        <p className="price">{resolte}</p>
      </div>
      <hr />
      <p className="card-text">{text}</p>
    </div>
  );
}
