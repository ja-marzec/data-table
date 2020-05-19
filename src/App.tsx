import React, {useState, useEffect, ChangeEvent} from "react";
import ReactDOM from "react-dom";

import "./styles/App.scss";
import {
  getFromUrl,
  fetchCompanies,
  fetchCompaniesAll,
} from "./services/ApiClient";

import { CompanyResponse, CompanyIncomeResponse, Company } from "./Model";
import { CompanyTable } from "./components/CompanyTable";
import userEvent from "@testing-library/user-event";

function App() {
  const [companies, setCompanies] = useState<Array<Company>>();
  let [visibleCompanies, setVisibleCompanies] = useState<
    Array<Company>
  >([]);
  const [search, setSearch] = useState<any>("");
  const [offset, setOffset] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const LIMIT = 20;

  useEffect(() => {
    getCompanies();
  }, []);

  function getCompanies() {
    fetchCompaniesAll().then(response => {setCompanies(response);  setVisibleCompanies(response.slice(offset,LIMIT)); setIsLoaded(true)} ) ;
  }

  function filterTable(event : ChangeEvent<HTMLInputElement >) {
    setSearch(event.target.value)
  }

function filterData(search :any) {
  return (company: Company) => {
    return (
        company.id.toString().indexOf(search) !== -1 ||
        company.name.toLowerCase().indexOf(search) !== -1 ||
        company.city.toLowerCase().indexOf(search) !== -1 ||
        company.totalIncome.toString().toLowerCase().indexOf(search) !== -1 ||
        company.averageIncome.toString().indexOf(search) !== -1 ||
        company.lastMonthIncome.toString().indexOf(search) !== -1
    )
  }
}


  return (
    <div className="app">

      <form>
        <label>
          Filter
          <input
            type="text"
            value={search}
            onChange={(event) => filterTable(event)}
          />
        </label>
      </form>

      <div className="table__container">
        <table className="table">
          <thead className="table__head">
          <tr className="table__head__row">
            <th className="table__head__item"> <div className="table__head__item__button">ID </div> </th>
            <th className="table__head__item"> <div className="table__head__item__button">Name </div></th>
            <th className="table__head__item"> <div className="table__head__item__button">City </div></th>
            <th className="table__head__ item">  <div className="table__head__item__button">Total income </div></th>
            <th className="table__head__item">  <div className="table__head__item__button">Average income </div></th>
            <th className="table__head__item">  <div className="table__head__item__button">Last month income</div></th>
          </tr>
          </thead>


          <tbody>
          {companies?.filter(filterData(search))?.map((item, index) => {
            return [
              <tr className="table__row" key={index}>
                <th className="table__column">{item.id}</th>
                <th className="table__column">{item.name}</th>
                <th className="table__column">{item.city}</th>
                <th className="table__column">{item.totalIncome}</th>
                <th className="table__column">{item.averageIncome}</th>
                <th className="table__column">{item.lastMonthIncome}</th>
              </tr>,
            ];
          })}
          </tbody>


        </table>
      </div>
    </div>
  );
}

export default App;
