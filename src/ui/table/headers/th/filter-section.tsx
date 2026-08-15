import React from "react";
import "./styles.css"

export default function FilterSection({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div {...props} className={"div-header-filter position-relative " + className} />;
}
