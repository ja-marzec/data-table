import React from "react";
import {Company} from "../Model";

export function TableBody  (props: {visibleCompanies : Company[], offset : number, limit : number}) :JSX.Element  {

    const itemList = props.visibleCompanies.slice(props.offset, props.offset + props.limit)
        .map((item:Company, index: number) => {
            return (
                <tr className="table__row" key={index}>
                    <th className="table__column">{item.id}</th>
                    <th className="table__column">{item.name}</th>
                    <th className="table__column">{item.city}</th>
                    <th className="table__column">{item.totalIncome}</th>
                    <th className="table__column">{item.averageIncome}</th>
                    <th className="table__column">{item.lastMonthIncome}</th>
                </tr>
            )
        })

return (
    <tbody>


    <>{itemList}</>
    </tbody>
)
 }

