import { Stack } from "react-bootstrap";

import cn from "../../utils/cn";
import React from "react";

export type LayoutTableRootProps = React.HTMLAttributes<HTMLDivElement> & {};

export default function Root({ className, ...props }: LayoutTableRootProps) {
    return <Stack {...props} className={cn(["d-flex w-100 h-100", className])} />;
}
