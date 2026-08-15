import FiltroSelect from "../../ui/filter/Filter";

import { SEARCH_PARAMS_KEY } from "../../lib/constants";
import { useSearchParams } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { useCallback } from "react";

const INIT_YEAR = 2024;
const CURRENT_YEAR = new Date().getFullYear();
const ALL_YEARS = new Array(CURRENT_YEAR - INIT_YEAR + 2).fill(0).map((_, index) => (INIT_YEAR + index).toString());

export type FilterYearsProps = { notActive?: boolean };

export default function FilterYears(props: FilterYearsProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedYear = searchParams.get(SEARCH_PARAMS_KEY.YEAR);

    const handleOnSelectYear = useCallback(
        (year: string) => {
            searchParams.set(SEARCH_PARAMS_KEY.YEAR, year);
            setSearchParams(searchParams);
        },
        [searchParams, setSearchParams]
    );

    return (
        <FiltroSelect
            titulo="Ano:"
            texto={selectedYear ?? undefined}
            active={!!selectedYear && !props.notActive}
            customButtonClass="my-btn-year-select"
        >
            <ListGroup className="small">
                {ALL_YEARS.map((year) => (
                    <ListGroup.Item
                        className={`text-center my-item-filtro ${selectedYear === year ? "bg-light fw-bold text-primary" : ""}`}
                        key={year}
                        onClick={() => handleOnSelectYear(year)}
                    >
                        {year}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </FiltroSelect>
    );
}
