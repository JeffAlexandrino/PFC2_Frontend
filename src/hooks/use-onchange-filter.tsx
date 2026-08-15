import { useSearchParams } from "react-router-dom";
import { FilterDatesStr } from "../ui/table/type";
import { useCallback } from "react";

export const LTE_PREFIX = "lte_";
export const GTE_PREFIX = "gte_";

export default function useOnChangeFilter() {
    const [searchParams, setSearchParams] = useSearchParams();

    const onChangeDate = useCallback(
        (keyWithoutPrefix: string, filterDateStr?: FilterDatesStr) => {
            const editableSearchParam = new URLSearchParams(searchParams);

            if (!filterDateStr) {
                editableSearchParam.delete(GTE_PREFIX + keyWithoutPrefix);
                editableSearchParam.delete(LTE_PREFIX + keyWithoutPrefix);
            } else {
                editableSearchParam.set(GTE_PREFIX + keyWithoutPrefix, filterDateStr.gte);
                editableSearchParam.set(LTE_PREFIX + keyWithoutPrefix, filterDateStr.lte);
            }

            setSearchParams(editableSearchParam);
        },
        [searchParams, setSearchParams]
    );

    const onChangeText: (key: string, filterText?: string) => void = useCallback(
        (key, filterText) => {
            const editableSearchParam = new URLSearchParams(searchParams);

            if (!filterText) editableSearchParam.delete(key);
            else editableSearchParam.set(key, filterText);

            setSearchParams(editableSearchParam);
        },
        [searchParams, setSearchParams]
    );

    const onClearFilters = useCallback(() => {
        setSearchParams();
    }, [setSearchParams]);

    return { onChangeDate, onChangeText, onClearFilters };
}
