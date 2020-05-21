import React, { useState, useEffect, ChangeEvent } from "react";
import "./styles/App.scss";
import { fetchCompaniesAll } from "./services/ApiClient";
import { Company} from "./Model";
import {TableBody} from "./components/TableBody";
import {Filter} from "./components/Filter";
import {TableHeader} from "./components/TableHeader";
import {Pagination} from "./components/Pagination";
import {Loading} from "./components/Loading";

enum SortDirection {
  ASCENDING,
  DESCENDING,
}
export enum Paginate {
  NEXT,
  PREVIOUS,
}

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
    getCompanies();
  }, []);

  function getCompanies() {
    fetchCompaniesAll().then((response) => {
      setState((s) => ({
        ...s,
        companies: response,
        offset: 0,
        visibleCompanies: response,
        isLoaded: true
      }));
    });
  }

  function filterInput(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (value === "") {
      setState((s) => ({
        ...s,
        search: value,
        offset: 0,
        visibleCompanies: s.companies,
      }));
    } else {
      setState((s) => ({
        ...s,
        search: value,
        offset: 0,
        visibleCompanies: s.companies.filter(filterValue(value)),
      }));
    }
  }
  function filterValue(search: string) {
    return (company: Company) => {
      return (
        company.id.toString().indexOf(search) !== -1 ||
        company.name.toLowerCase().indexOf(search) !== -1 ||
        company.city.toLowerCase().indexOf(search) !== -1 ||
        company.totalIncome.toString().indexOf(search) !== -1 ||
        company.averageIncome.toString().indexOf(search) !== -1 ||
        company.lastMonthIncome.toString().indexOf(search) !== -1
      );
    };
  }

  function oppositeDirection(direction: SortDirection) {
    return direction === SortDirection.ASCENDING
      ? SortDirection.DESCENDING
      : SortDirection.ASCENDING;
  }

  function getSortFunction(field: keyof Company) {
    switch (state.sort.t) {
      case "UNSORTED":
        setState((s) => ({
          ...s,
          sort: {
            t: "SORTED",
            field: field,
            direction: SortDirection.ASCENDING,
          },
        }));
        return sortByField(field, SortDirection.ASCENDING);
      case "SORTED":
        const newDirection =
          state.sort.field !== field
            ? SortDirection.ASCENDING
            : oppositeDirection(state.sort.direction);
        setState((s) => ({
          ...s,
          sort: {
            t: "SORTED",
            field: field,
            direction: newDirection,
          },
        }));
        return sortByField(field, newDirection);
    }
  }
  function sortTable(field: keyof Company): void {
    const comparator = getSortFunction(field);
    let sortedData = mergeSort(state.visibleCompanies, comparator);
    setState((s) => ({ ...s, visibleCompanies: sortedData, offset: 0 }));
  }
  function sortByField(
    field: keyof Company,
    direction: SortDirection
  ): (fist: Company, second: Company) => number {
    const directionModifier = direction === SortDirection.ASCENDING ? 1 : -1;
    return (fist, second) => {
      if ((fist[field] as any) < (second[field] as any))
        return -1 * directionModifier;
      if ((fist[field] as any) > (second[field] as any))
        return 1 * directionModifier;
      return 0;
    };
  }

  function mergeSort(
    visibleCompanies: Company[],
    comparator: (fist: Company, second: Company) => number
  ): Company[] {
    if (visibleCompanies.length <= 1) {
      return visibleCompanies;
    }
    const middle = Math.floor(visibleCompanies.length / 2);
    const left = visibleCompanies.slice(0, middle);
    const right = visibleCompanies.slice(middle);
    return merge(
      mergeSort(left, comparator),
      mergeSort(right, comparator),
      comparator
    );
  }
  function merge(
    left: Company[],
    right: Company[],
    comparator: (fist: Company, second: Company) => number
  ) {
    let resultArray = [],
      leftIndex = 0,
      rightIndex = 0;
    while (leftIndex < left.length && rightIndex < right.length) {
      if (comparator(left[leftIndex], right[rightIndex]) === -1) {
        resultArray.push(left[leftIndex]);
        leftIndex++;
      } else {
        resultArray.push(right[rightIndex]);
        rightIndex++;
      }
    }
    return resultArray
      .concat(left.slice(leftIndex))
      .concat(right.slice(rightIndex));
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

  return (
    <div className="app">

      <Loading
          loading={state.isLoaded}
      />

      <Filter
          search={state.search}
          filterInput={(event ) => filterInput(event)}
      />
      <table className="table">
        <TableHeader
            sortTable={sortTable}
        />
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
