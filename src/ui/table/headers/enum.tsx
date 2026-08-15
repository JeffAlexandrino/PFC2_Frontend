import { useCallback, useMemo, useState } from "react";
import { Filter } from "../filter-primitives";
import { FormControl } from "react-bootstrap";
import { HeaderEnumProps } from "../type";
import { Overlay } from "../overlays";
import { Popover } from "../popover";
import { Th } from "./th";

export default function Enum({ enums, sortKey, title, onChange, filterValue }: HeaderEnumProps) {
    const [showPopover, setShowPopover] = useState(false);
    const [search, setSearch] = useState("");

    const filteredEnums = useMemo(
        () => enums.filter((e) => e.label.toLowerCase().includes(search.toLowerCase())),
        [enums, search]
    );

    const filterDescription = useMemo(() => {
        const enumSelected = enums.find((e) => e.value === filterValue);
        if (!enumSelected) return "";

        return enumSelected.label;
    }, [filterValue, enums]);

    const resetChanges = useCallback(() => {
        if (onChange) onChange(undefined);
    }, [onChange]);

    return (
        <Th.Root>
            <Th.SortSection>
                <Overlay.Sort sortKey={sortKey}>{title}</Overlay.Sort>
            </Th.SortSection>
            <Th.FilterSection>
                <Filter.Control disabled readOnly value={filterDescription} />
                <Overlay.Filter
                    show={showPopover}
                    onToggle={setShowPopover}
                    isFiltered={!!filterValue}
                    overlay={
                        <Popover.Root data-test="table-filter-popover">
                            <Popover.Header>Filtrar por opções</Popover.Header>
                            <Popover.Body className="flex-column p-0">
                                <div className="px-2 py-2">
                                    <FormControl
                                        placeholder="Encontrar opção..."
                                        onChange={(e) => setSearch(e.target.value)}
                                        value={search}
                                    />
                                </div>
                                <Popover.Content className="border-bottom h-100">
                                    {filteredEnums.map(({ label, value }) => {
                                        const isActive = filterValue === value;
                                        return (
                                            <div
                                                key={value}
                                                onClick={onChange ? () => onChange(value) : undefined}
                                                className={`enum-item ${isActive ? "active" : ""}`}
                                            >
                                                {label}
                                            </div>
                                        );
                                    })}
                                </Popover.Content>
                                <Popover.ResetButton onClick={resetChanges} />
                            </Popover.Body>
                        </Popover.Root>
                    }
                />
            </Th.FilterSection>
        </Th.Root>
    );
}
