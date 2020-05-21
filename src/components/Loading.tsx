import React from "react";

export  function Loading(props: {loading: boolean}) : JSX.Element {
return (
    <div className={ props.loading ? "load" : "load--active"}>
        <div className="load__wrap">
                <p className="load__text">Loading...</p>
                    <div className="square"></div>

        </div>
    </div>
)
}