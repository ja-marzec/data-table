import React from "react";
import { Company, Paginate } from "../Model";

export function Pagination(props: {
  pagination: (action: Paginate) => void;
  offset: number;
  LIMIT: number;
  visibleCompanies: Company[];
}): JSX.Element {
  return (
    <div className="pagination">
      <button
        className="pagination__button "
        onClick={() => props.pagination(Paginate.PREVIOUS)}
      >
        Previous
      </button>
      <span className="pagination__info">
        {props.offset / props.LIMIT + 1} /
        {Math.ceil(props.visibleCompanies.length / props.LIMIT)}
      </span>
      <button
        className="pagination__button"
        onClick={() => props.pagination(Paginate.NEXT)}
      >
        Next
      </button>
    </div>
  );
}
