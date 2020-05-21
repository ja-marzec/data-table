import React from "react";
import {Company} from "../Model";

export function TableHeader(props:{ sortTable: (field:keyof Company) => void }) : JSX.Element {

    function tableHeader(companyKey: keyof Company, companyDisplay: string) {
        return (
            <th className="table__head__item">
                <div
                    className="table__head__item__button"
                    onClick={() => props.sortTable(companyKey)}
                >
                    {companyDisplay}
                </div>
            </th>
        );
    }

    return (
        <thead className="table__head">
        <tr className="table__head__row">
            {tableHeader("id", "ID")}
            {tableHeader("name", "NAME")}
            {tableHeader("city", "CITY")}
            {tableHeader("totalIncome", "TOTAL INCOME")}
            {tableHeader("averageIncome", "AVERAGE INCOME")}
            {tableHeader("lastMonthIncome", "LAST MONTH INCOME")}
        </tr>
        </thead>
    )
}