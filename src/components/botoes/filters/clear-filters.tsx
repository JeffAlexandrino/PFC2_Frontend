import { Button, ButtonProps } from "react-bootstrap";

import cn from "../../../utils/cn";

export type ButtonClearFiltersProps = Omit<ButtonProps, "children"> & { activedFilters: number };

export default function ClearFilters({ className, title, activedFilters, ...props }: ButtonClearFiltersProps) {
    return (
        <Button
            {...props}
            className={cn([
                "d-flex align-items-center gap-1 rounded-pill",
                activedFilters < 1 && "opacity-0",
                className,
            ])}
            variant="outline-primary"
            title={title ?? "Remover filtros"}
            aria-label={props["aria-label"] ?? "Remover filtros"}
        >
            <i className="bi bi-trash" />
            Remover {activedFilters} filtros
        </Button>
    );
}
