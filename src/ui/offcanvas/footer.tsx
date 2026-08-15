import { OffcanvasFooterProps } from "./types";

import cn from "../../utils/cn";

export default function Footer({ className, ...props }: OffcanvasFooterProps) {
    return (
        <footer
            data-test="offcanvas-footer"
            {...props}
            className={cn(["d-flex w-100 justify-content-end gap-3 border-top p-3", className])}
        />
    );
}
