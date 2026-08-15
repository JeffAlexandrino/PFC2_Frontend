import { OffcanvasFormFooterProps } from "./types";

import cn from "../../utils/cn";

export default function Footer({ className, ...props }: OffcanvasFormFooterProps) {
    return (
        <footer
            {...props}
            data-test="offcanvas-footer"
            className={cn(["d-flex w-100 justify-content-end gap-3 border-top p-3", className])}
        />
    );
}
