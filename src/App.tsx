import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./styles/App.scss";
import {
  getFromUrl,
  fetchCompanies,
  fetchCompaniesAll,
} from "./services/ApiClient";

import { CompanyResponse, CompanyIncomeResponse, Company } from "./Model";
import { CompanyTable } from "./components/CompanyTable";

function App() {
  const [companies, setCompanies] = useState<Company[] | undefined>();
  let [visibleCompanies, setVisibleCompanies] = useState<
    Array<CompanyResponse>
  >([]);
  const [offset, setOffset] = useState<number>(0);
  const LIMIT = 5;

  useEffect(() => {
    getCompanies();
  }, []);

  function getCompanies() {

    fetchCompaniesAll().then(setCompanies);
  }

  return (
    <div className="">
      <CompanyTable companies={companies} />
    </div>
  );
}

export default App;
