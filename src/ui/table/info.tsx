import React, { useCallback, useContext, useState } from "react";
import { TableContext } from "./constructor";
import { Form } from "react-bootstrap";

const MIN_PAGE_NUMBER = 0;
const OFFSET_PAGE_NUMBER = 1;

export type TableInfoProps = React.HTMLAttributes<HTMLDivElement> & {
    onChangeCurrentPage?: (currentPage: number) => void;
};

export default function Info({ onChangeCurrentPage, ...props }: TableInfoProps) {
    const { amountSelectedRows, totalRows } = useContext(TableContext);

    const [currentPage, setCurrentPage] = useState(MIN_PAGE_NUMBER);

    const handleOnChangeCurrentPage = useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
            const newCurrentPage = Number(ev.target.value) - OFFSET_PAGE_NUMBER;
            if (newCurrentPage < MIN_PAGE_NUMBER) return;

            if (onChangeCurrentPage) onChangeCurrentPage(newCurrentPage);
            setCurrentPage(newCurrentPage);
        },
        [onChangeCurrentPage]
    );

    return (
        <div className="table-div-info">
            <span className="selection-info">
                {amountSelectedRows} de {totalRows} selecionados
            </span>
            <div className="pagination-group">
                <span>Página</span>
                <Form.Control
                    className="info-control-page"
                    size="sm"
                    type="number"
                    min={MIN_PAGE_NUMBER}
                    value={currentPage + OFFSET_PAGE_NUMBER}
                    onChange={handleOnChangeCurrentPage}
                />
            </div>
        </div>
    );
}
