import React, {useState, useEffect, ChangeEvent} from "react";
import arrow from './assets/arrow.png';
import "./styles/App.scss";
import {

  fetchCompaniesAll,
} from "./services/ApiClient";

import { Company } from "./Model";
// merge sort

interface State {
  companies: Company[],
  search: string,
  offset: number,
  isLoaded: boolean,
  // todo nadpisać enum
  sortDirection:  "ascending" | "descending"
  filteredCompanies: Company[]
}

// tagged union
// sorted{field, direction}
// unsorted


function App() {
  const [state, setState] = useState <State> ({
    companies: [],
    search: "",
    offset: 0,
    isLoaded: false,
    sortDirection: "ascending",
    filteredCompanies : [],
  })
  const LIMIT = 20;

  useEffect(() => {
    getCompanies();
  }, []);

  function getCompanies() {
    fetchCompaniesAll().then(response => {
      setState(s => ({...s, companies: response, offset:0, filteredCompanies:response}))
    });
  }

  function filterInput(event : ChangeEvent<HTMLInputElement >) {
    const value = event.target.value
    console.log(value);
    if (value === "") {
      setState(s => ({ ...s, search: value , offset: 0, filteredCompanies: s.companies })) 
    } else {
      setState(s => ({ ...s, search: value , offset: 0, filteredCompanies: s.companies.filter(filterValue(value))})) 
    } 
  }
  
function filterValue(search :string){
  return (company: Company)  => {
    return (
        company.id.toString().indexOf(search) !== -1 ||
        company.name.toLowerCase().indexOf(search) !== -1 ||
        company.city.toLowerCase().indexOf(search) !== -1 ||
        company.totalIncome.toString().indexOf(search) !== -1 ||
        company.averageIncome.toString().indexOf(search) !== -1 ||
        company.lastMonthIncome.toString().indexOf(search) !== -1
    )
  }
}
function sortTable(field: keyof Company) : void {
    if( state.sortDirection === "ascending") {
      let sortedData : any=  state.filteredCompanies.map(item => item).sort((fist, second) => {
            if ( (fist[field] as any) < (second[field] as any )) return  -1
            if ( (fist[field] as any) > (second[field] as any )) return  1
            return 0;
          }
      )

      setState(s => ({...s, filteredCompanies:sortedData, sortDirection:"descending", offset:0}))

    } else {
      let sortedDatas : any =  state.filteredCompanies.map(item => item).sort((fist, second) => {
            if ( (fist[field] as any) < (second[field] as any )) return  1
            if ( (fist[field] as any) > (second[field] as any )) return  -1
            return 0;
          }
      )
      setState(s => ({...s, filteredCompanies:sortedDatas, sortDirection:"ascending", offset:0}))
    }





  }
function pagination(action : string) : void {
  
   if (action === "add" && state.offset + LIMIT < state.filteredCompanies.length ) {
     let newOffset = state.offset + LIMIT
    
     setState(s => ({...s, offset:newOffset}))


   }
  if ( action === "minus" && state.offset != 0) {
  let newOffset = state.offset - LIMIT
  setState(s => ({...s, offset:newOffset}))
  }
}

function tableRows() {
  return state.filteredCompanies.slice(state.offset, state.offset + LIMIT).map((item, index ) => {
    return [
      <tr className="table__row" key={index}>
        <th className="table__column">{item.id}</th>
        <th className="table__column">{item.name}</th>
        <th className="table__column">{item.city}</th>
        <th className="table__column">{item.totalIncome}</th>
        <th className="table__column">{item.averageIncome}</th>
        <th className="table__column">{item.lastMonthIncome}</th>
      </tr>,
    ]
  })
}



function sortStatus () {
  
}


  return (
    <div className="app">
        <label>
          Filter
          <input
            type="text"
            value={state.search}
            onChange={(event) => filterInput(event)}
          />
        </label>

        <table className="table">
          <thead className="table__head">
          <tr className="table__head__row">

            <th className="table__head__item">
              <div className={ state.sortDirection === "ascending" ? "table__head__item__button table__head__item__button--big" : "table__head__item__button "}
                   onClick={() => sortTable("id")}
                    >  ID  <img src={arrow}/>
              </div>
            </th>
            <th className="table__head__item"
                onClick={() => sortTable("name")}> <div
                className={ state.sortDirection === "ascending" ? "table__head__item__button table__head__item__button--big" : "table__head__item__button "}
                  >  Name <img src={arrow}/>
                </div>
            </th>
            <th className="table__head__item"
                onClick={() => sortTable("city")}
            > <div className="table__head__item__button"> City </div></th>
            <th className="table__head__ item"
                onClick={() => sortTable("totalIncome")}
            >  <div className="table__head__item__button">Total income </div></th>
            <th className="table__head__item"
                onClick={() => sortTable("averageIncome")}
            >  <div className="table__head__item__button">Average income </div></th>
            <th className="table__head__item"
                onClick={() => sortTable("lastMonthIncome")}
            >  <div className="table__head__item__button">Last month income</div></th>
          </tr>
          </thead>

          <tbody>
          {tableRows()}
          </tbody>


        </table>
      <div className="pagination">
        <button className="pagination__button "
                onClick={() => pagination("minus")}
        >
          Previous
        </button>
        <span className="pagination__info"> 
        {(state.offset / LIMIT) + 1}
          / 
        {  Math.ceil(state.filteredCompanies.length / LIMIT ) } </span>
        <button className="pagination__button"
                onClick={() =>pagination("add")}>
        Next
        </button>
      </div>


      </div>




  );
}

export default App;


//  lenght < offset + Limit -> 