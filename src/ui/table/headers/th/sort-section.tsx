import React from "react";

import "./styles.css";

export default function SortSection({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div {...props} className={"div-header-title " + className} />;
}
