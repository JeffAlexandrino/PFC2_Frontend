import FiltroSelect from "../../ui/filter/Filter";
import SaleUtil from "../../utils/sale.util";
import utils from "../../utils";

import useFiltros, { FilterKey } from "../../hooks/useFiltros";
import { useCallback, useState } from "react";
import { SaleStatus } from "../../types/sale";
import { ListGroup } from "react-bootstrap";

const TODOS_ESTADOS = "Nenhum estado";

export type FiltroEstadosVendasProps = { notActive?: boolean };
export default function FiltroEstadosVenda(props: FiltroEstadosVendasProps) {
    const { setFilter, removeFilter, estadoVendaSelecionado } = useFiltros();

    const [pesquisa] = useState<string | undefined>(undefined);

    const estados = utils.returnEstadosVenda();
    const estadosBuscados =
        pesquisa === undefined
            ? estados
            : estados.filter((estado) =>
                  SaleUtil.getStatusDescriptionBy(estado).toLowerCase().includes(pesquisa.toLowerCase())
              );

    const retornaTextoFiltro = useCallback(() => {
        if (!estadoVendaSelecionado) return TODOS_ESTADOS;
        else return utils.returnTextoEstadoVenda(estadoVendaSelecionado);
    }, [estadoVendaSelecionado]);

    //EVENTOS
    const handleOnSelecionarSegmento = useCallback(
        (estado: SaleStatus | null) => {
            if (estado === null) return removeFilter(FilterKey.SALE_STATUS);
            setFilter(FilterKey.SALE_STATUS, estado);
        },
        [setFilter, removeFilter]
    );

    return (
        <FiltroSelect
            texto={retornaTextoFiltro()}
            titulo="Estado da Venda:"
            active={!!estadoVendaSelecionado && !props.notActive}
            customButtonClass="my-saleStatus-select"
        >
            <ListGroup className="small">
                <ListGroup.Item
                    className={`my-item-filtro ${!estadoVendaSelecionado ? "bg-light fw-bold text-primary" : ""}`}
                    onClick={() => handleOnSelecionarSegmento(null)}
                >
                    {TODOS_ESTADOS}
                </ListGroup.Item>
                {estadosBuscados.map((estado) => (
                    <ListGroup.Item
                        className={`my-item-filtro ${estadoVendaSelecionado === estado ? "bg-light fw-bold text-primary" : ""}`}
                        key={estado}
                        onClick={() => handleOnSelecionarSegmento(estado)}
                    >
                        <div className="d-flex justify-content-center align-items-center gap-2 text-center">
                            {utils.returnTextoEstadoVenda(estado)}
                            <div className="p-2" />
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </FiltroSelect>
    );
}
