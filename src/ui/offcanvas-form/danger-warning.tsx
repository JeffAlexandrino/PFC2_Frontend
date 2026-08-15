import { OffcanvasFormWarningMessageProps } from "./types";

import cn from "../../utils/cn";

export default function WarningMessage({ children, className, ...props }: OffcanvasFormWarningMessageProps) {
    return (
        <div className="d-flex flex-column h-100 p-3">
            <div
                {...props}
                className={cn(["border border-danger rounded pt-3 position-relative p-3 h-auto", className])}
            >
                <span className="p-2 fw-bold text-danger bg-white position-absolute top-0 start-50 translate-middle">
                    AVISO
                </span>
                {children}
            </div>
        </div>
    );
}
