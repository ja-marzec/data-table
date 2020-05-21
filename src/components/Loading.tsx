import React from "react";

export function Loading(): JSX.Element {
  return (
    <div className="load">
      <div className="load__wrap">
        <p className="load__text">Loading...</p>
        <div className="square"></div>
      </div>
    </div>
  );
}
