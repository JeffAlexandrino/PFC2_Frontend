import { useCallback, useEffect, useState } from "react";
import { Filter } from "../filter-primitives";
import { HeaderTextProps } from "../type";
import { Overlay } from "../overlays";
import { Th } from "./th";

export const DEBOUNCE_DELAY = 700;

export default function Text({ sortKey, title, filterText, placeholder, onChange }: HeaderTextProps) {
    const [internalFilterText, setInternalFilterText] = useState(filterText ?? "");

    useEffect(() => {
        if (!onChange) return;

        const timeoutId = setTimeout(() => {
            if (!internalFilterText) return onChange(undefined);
            onChange(internalFilterText);
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(timeoutId);
    }, [onChange, internalFilterText]);

    useEffect(() => {
        setInternalFilterText(filterText ?? "");
    }, [filterText]);

    const handleOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInternalFilterText(value);
    }, []);

    return (
        <Th.Root>
            <Th.SortSection>
                <Overlay.Sort sortKey={sortKey}>{title}</Overlay.Sort>
            </Th.SortSection>
            <Th.FilterSection>
                <Filter.Control placeholder={placeholder} value={internalFilterText} onChange={handleOnChange} />
            </Th.FilterSection>
        </Th.Root>
    );
}
