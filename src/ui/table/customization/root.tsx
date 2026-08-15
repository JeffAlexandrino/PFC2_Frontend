import cn from "../../../utils/cn";
import React from "react";

import "./styles.css";

export type TableCustomizationRootProps = React.HTMLAttributes<HTMLDivElement> & {};

export default function Root({ className, ...props }: TableCustomizationRootProps) {
    return <div {...props} className={cn(["table-div-customization", className])} />;
}
