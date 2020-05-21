import React, { useState, useEffect, ChangeEvent } from "react";
import "./styles/App.scss";
import { fetchCompaniesAll } from "./services/ApiClient";
import { Company, Paginate, SortDirection } from "./Model";
import { TableBody } from "./components/TableBody";
import { Filter } from "./components/Filter";
import { TableHeader } from "./components/TableHeader";
import { Pagination } from "./components/Pagination";
import { Loading } from "./components/Loading";
import {
  mergeSort,
  oppositeDirection,
  filterValue,
  sortByField,
} from "./utilities";

interface State {
  companies: Company[];
  search: string;
  offset: number;
  isLoaded: boolean;
  sort: Sort;
  visibleCompanies: Company[];
}

interface Sorted {
  t: "SORTED";
  field: keyof Company;
  direction: SortDirection;
}
interface Unsorted {
  t: "UNSORTED";
}
type Sort = Sorted | Unsorted;

function App() {
  const [state, setState] = useState<State>({
    companies: [],
    search: "",
    offset: 0,
    isLoaded: false,
    sort: { t: "UNSORTED" },
    visibleCompanies: [],
  });
  const LIMIT = 20;

  useEffect(() => {
    fetchCompaniesAll().then((response) => {
      setState((s) => ({
        ...s,
        companies: response,
        offset: 0,
        visibleCompanies: response,
        isLoaded: true,
      }));
    });
  }, []);


  function filterInput(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
      setState((s) => {
        const newCompanies = value === "" ? s.companies : s.companies.filter(filterValue(value)) 
        return {
        ...s,
        search: value,
        offset: 0,
        visibleCompanies: newCompanies,
      }});
  }

  function getSort(field: keyof Company): Sorted {
    switch (state.sort.t) {
      case "UNSORTED":
        return {
          t: "SORTED",
          field: field,
          direction: SortDirection.ASCENDING,
        };
      case "SORTED":
        const newDirection =
          state.sort.field !== field
            ? SortDirection.ASCENDING
            : oppositeDirection(state.sort.direction);
        return {
          t: "SORTED",
          field: field,
          direction: newDirection,
        };
    }
  }

  function sortTable(field: keyof Company): void {
    const sort = getSort(field);
    let sortedData = mergeSort(
      state.visibleCompanies,
      sortByField(sort.field, sort.direction)
    );
    setState((s) => ({
      ...s,
      sort: sort,
      visibleCompanies: sortedData,
      offset: 0,
    }));
  }

  function pagination(action: Paginate): void {
    if (
      action === Paginate.NEXT &&
      state.offset + LIMIT < state.visibleCompanies.length
    ) {
      let newOffset = state.offset + LIMIT;
      setState((s) => ({ ...s, offset: newOffset }));
    } else if (action === Paginate.PREVIOUS && state.offset !== 0) {
      let newOffset = state.offset - LIMIT;
      setState((s) => ({ ...s, offset: newOffset }));
    }
  }

  function loadingOverlay() {
    if (!state.isLoaded) {
      return <Loading />;
    } else {
      return;
    }
  }

  return (
    <div className="app">
      {loadingOverlay()}

      <Filter
        search={state.search}
        filterInput={(event) => filterInput(event)}
      />
      <table className="table">
        <TableHeader sortTable={sortTable} />
        <TableBody
          visibleCompanies={state.visibleCompanies}
          offset={state.offset}
          limit={LIMIT}
        />
      </table>

      <Pagination
        pagination={pagination}
        offset={state.offset}
        LIMIT={LIMIT}
        visibleCompanies={state.visibleCompanies}
      />
    </div>
  );
}

export default App;
