import { ProgressLineRootProps } from "./types";

import cn from "../../utils/cn";

export default function Root({ className, ...props }: ProgressLineRootProps) {
    return (
        <section
            {...props}
            aria-label={props["aria-label"] ?? "Progresso"}
            className={cn(["d-flex w-100", className])}
        />
    );
}
