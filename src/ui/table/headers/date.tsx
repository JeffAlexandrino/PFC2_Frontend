import { FormGroupInputType } from "../../../components/formGroups/FormGroupInput";
import { useCallback, useMemo, useState } from "react";
import { FilterDates, HeaderDateProps } from "../type";
import { FormGroupInput } from "../../../components";
import { Filter } from "../filter-primitives";
import { Stack } from "react-bootstrap";
import { Overlay } from "../overlays";
import { Popover } from "../popover";
import { Th } from "./th";

import utils from "../../../utils";

const initGte = utils.retornaDataAtual({ hora: 0, minutos: 0, segundos: 0, millisegundos: 0 });
const initLte = utils.retornaDataAtual({ hora: 23, minutos: 59, segundos: 59, millisegundos: 999 });
const defaultFilterDates = { lte: initLte, gte: initGte };

export default function HeaderDate({ sortKey, onChange, filterDatesStr, title }: HeaderDateProps) {
    const [showPopover, setShowPopover] = useState(false);

    const filterDates = useMemo((): FilterDates => {
        if (!filterDatesStr) return defaultFilterDates;

        const gte = new Date(filterDatesStr.gte);
        const lte = new Date(filterDatesStr.lte);
        return { gte, lte };
    }, [filterDatesStr]);

    const [internalFilterDates, setInternalFilterDates] = useState<FilterDates>(filterDates ?? defaultFilterDates);

    const filterDescription = useMemo(() => {
        if (!filterDatesStr) return "";

        const gteStr = filterDates.gte.toLocaleDateString("pt-Br", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        const lteStr = filterDates.lte.toLocaleDateString("pt-Br", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        return `${gteStr} até ${lteStr}`;
    }, [filterDatesStr, filterDates]);

    const getFilterDatesStrBy = useCallback((filterDates: FilterDates) => {
        return {
            gte: filterDates.gte.toISOString(),
            lte: filterDates.lte.toISOString(),
        };
    }, []);

    const handleOnChangeGte = useCallback((newGte: Date) => {
        setInternalFilterDates((prev) => ({ ...prev, gte: newGte }));
    }, []);

    const handleOnChangeLte = useCallback((newLte: Date) => {
        setInternalFilterDates((prev) => ({ ...prev, lte: newLte }));
    }, []);

    const applyChanges = useCallback(() => {
        if (!onChange) return;
        onChange(getFilterDatesStrBy(internalFilterDates));
    }, [internalFilterDates, getFilterDatesStrBy, onChange]);

    const resetChanges = useCallback(() => {
        if (onChange) onChange(undefined);
        setInternalFilterDates(defaultFilterDates);
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
                    isFiltered={!!filterDatesStr}
                    overlay={
                        <Popover.Root data-test="table-filter-popover">
                            <Popover.Header>Filtrar entre datas</Popover.Header>
                            <Popover.Body className="p-0">
                                <Stack className="gap-0">
                                    <Popover.Content className="gap-1 border-bottom px-2 py-2">
                                        <FormGroupInput
                                            label="Data inicial"
                                            type={FormGroupInputType.DATE}
                                            value={internalFilterDates.gte}
                                            setValue={handleOnChangeGte}
                                        />
                                        <FormGroupInput
                                            label="Data final"
                                            useLastTime
                                            type={FormGroupInputType.DATE}
                                            value={internalFilterDates.lte}
                                            setValue={handleOnChangeLte}
                                        />
                                    </Popover.Content>
                                    <div className="d-flex w-100">
                                        <Popover.ResetButton onClick={resetChanges} />
                                        <Popover.ApplyButton onClick={applyChanges} />
                                    </div>
                                </Stack>
                            </Popover.Body>
                        </Popover.Root>
                    }
                />
            </Th.FilterSection>
        </Th.Root>
    );
}
