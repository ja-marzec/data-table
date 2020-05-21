import React from "react";

export function Filter(props: {search : string, filterInput : (event :  React.ChangeEvent<HTMLInputElement>) => void}) : JSX.Element {

    return (
        <div>
            <label className="label">
                Filter
                <input
                    className="input"
                    type="text"
                    value={props.search}
                    onChange={(event) => props.filterInput(event)}
                />
            </label>
        </div>
    )
}