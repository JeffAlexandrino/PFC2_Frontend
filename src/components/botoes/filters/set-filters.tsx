import { Button, Dropdown } from "react-bootstrap";
import { SaleStatus } from "../../../types/sale";
import { useState } from "react";

import SaleUtil from "../../../utils/sale.util";
import cn from "../../../utils/cn";

export type ButtonSetFiltersProps = {
    className?: string;
    title?: string;
    activedFilters: number;
    onFilterChange: (selected: SaleStatus | undefined) => void;
    selectedFilter?: SaleStatus;
};

export default function SetFilters({
    className,
    title,
    activedFilters,
    selectedFilter,
    onFilterChange,
}: ButtonSetFiltersProps) {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleFilter = (status: SaleStatus) => {
        if (selectedFilter === status) {
            onFilterChange(undefined);
        } else {
            onFilterChange(status);
        }
    };

    return (
        <Dropdown show={showDropdown} onToggle={setShowDropdown}>
            <Dropdown.Toggle
                as={Button}
                className={cn(["d-flex align-items-center gap-1 rounded-pill", className])}
                variant="outline-primary"
                title={title ?? "Definir estado"}
                aria-label="Filtros por estado de venda"
            >
                <i className="bi bi-filter" />
                {activedFilters > 0
                    ? `${SaleUtil.getStatusDescriptionBy(selectedFilter)}`
                    : "Definir filtros por estado de venda"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {Object.values(SaleStatus).map((status) => (
                    <Dropdown.Item key={status} onClick={() => toggleFilter(status)} active={selectedFilter === status}>
                        {SaleUtil.getStatusDescriptionBy(status)}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}
