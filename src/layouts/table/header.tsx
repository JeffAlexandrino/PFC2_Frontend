import cn from "../../utils/cn";
import React from "react";

import "./styles.css";

export type LayoutTableHeaderProps = React.HTMLAttributes<HTMLDivElement> & {};

export default function Header({ className, ...props }: LayoutTableHeaderProps) {
    return (
        <div
            {...props}
            className={cn([
                "layout-table-header d-flex flex-shrink-0 border-bottom z-1 w-100 px-2 bg-light align-items-center justify-content-end",
                className,
            ])}
        />
    );
}
