import { Button, OverlayTrigger, Popover, Stack } from "react-bootstrap";
import { useCallback, useContext, useState } from "react";
import { OverlaySortProps, SortType } from "../type";
import { TableContext } from "../constructor";

import cn from "../../../utils/cn";

export default function Sort({
    trigger,
    placement,
    rootClose,
    onToggle,
    show,
    overlay,
    children,
    sortKey,
    ...props
}: OverlaySortProps) {
    const { onSortModeColumn, sortModeColumn } = useContext(TableContext);

    const [internalShowPopover, setInternalShowPopover] = useState(false);

    const iconNoOrderType = "bi-dash-lg";
    const iconByOrderType: Record<SortType, string> = {
        asc: "bi-arrow-up",
        desc: "bi-arrow-down",
    };

    const columnIsSorted = sortModeColumn && sortModeColumn.by === sortKey;

    const handleOnChangeSortMode = useCallback(
        (sortMode: SortType | null) => {
            if (!sortKey) return;
            setInternalShowPopover(false);
            if (sortModeColumn?.by === sortKey && !sortMode) return onSortModeColumn(null);
            if (sortMode) return onSortModeColumn({ type: sortMode, by: sortKey });
        },
        [onSortModeColumn, sortKey, sortModeColumn]
    );

    const handleOnToggle = useCallback(
        (show: boolean) => {
            if (onToggle) onToggle(show);
            setInternalShowPopover(show);
        },
        [onToggle]
    );

    return (
        <OverlayTrigger
            {...props}
            trigger={trigger ?? "click"}
            placement={placement ?? "bottom-end"}
            rootClose={rootClose ?? true}
            onToggle={handleOnToggle}
            show={show !== undefined ? show : internalShowPopover}
            overlay={
                overlay ?? (
                    <Popover className="shadow-sm">
                        <Popover.Header>Modo de ordenação</Popover.Header>
                        <Popover.Body className="p-0">
                            <Stack>
                                <Button
                                    aria-label="Ascendente"
                                    className="table-action-button order-mode"
                                    onClick={() => handleOnChangeSortMode("asc")}
                                >
                                    <i className={iconByOrderType["asc"]} /> Modo crescente
                                </Button>
                                <Button
                                    aria-label="Descendente"
                                    className="table-action-button order-mode"
                                    onClick={() => handleOnChangeSortMode("desc")}
                                >
                                    <i className={iconByOrderType["desc"]} /> Modo decrescente
                                </Button>
                                <Button
                                    aria-label="Não ordenar"
                                    className="table-action-button order-mode"
                                    onClick={() => handleOnChangeSortMode(null)}
                                >
                                    <i className={iconNoOrderType} /> Não ordenar
                                </Button>
                            </Stack>
                        </Popover.Body>
                    </Popover>
                )
            }
        >
            <Button className="table-action-button order" disabled={!sortKey}>
                <span className={cn(["d-flex align-items-center gap-2", columnIsSorted && "text-primary"])}>
                    {children}
                    {sortKey && (
                        <i className={columnIsSorted ? iconByOrderType[sortModeColumn.type] : iconNoOrderType} />
                    )}
                </span>
            </Button>
        </OverlayTrigger>
    );
}
