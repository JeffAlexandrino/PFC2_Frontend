import cn from "../../utils/cn";
import React from "react";

import "./styles.css";

export type LayoutTableBodyProps = React.HTMLAttributes<HTMLDivElement> & {};

export default function Body({ className, ...props }: LayoutTableBodyProps) {
    return (
        <div
            {...props}
            className={cn([
                "d-flex flex-column h-100 position-relative bg-white z-0 p-2 gap-2 overflow-auto",
                className,
            ])}
        />
    );
}
