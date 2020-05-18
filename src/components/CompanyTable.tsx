import React, { useEffect, useState } from "react";
import { CompanyResponse, CompanyIncomeResponse, Company } from "../Model";
import { CompanyInfo } from "./CompanyInfo";
import { getFromUrl, fetchIncomes } from "../services/ApiClient";

export function CompanyTable(props: { companies: Company[] | undefined}): JSX.Element {
  const [companyIncome, setCompanyIncome] = useState<CompanyIncomeResponse>();
  const [companyFull, setCompanyFull] = useState<any>([]);

  useEffect(() => {
    getIncomes();
  }, [props.companies]);

  function getIncomes() {
    if (props.companies === []) {
      return;
    }
    props.companies?.map(function (item) {
      fetchIncomes(item.id).then(setCompanyIncome);
      //).then(response => setCompanyIncome(response));
    });
  }

  
  return (
    <div className="table__container">
      <table className="table">
        <thead className="table__head">
          <tr className="table__head__row">
            <th className="table__item">ID</th>
            <th className="table__item">Name</th>
            <th className="table__item">City</th>
            <th className="table__item"> Total income</th>
            <th className="table__item"> Average income</th>
            <th className="table__item"> Last month income </th>
          </tr>
        </thead>
        <tbody>
          {props.companies?.map((item, index) => {
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
          <CompanyInfo />
        </tbody>
      </table>
    </div>
  );
}
