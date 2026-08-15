import FormServico, { tNovoServico } from "../forms/FormServico";
import { OffcanvasEditarDado } from "./OffcanvasEditarDado";
import { PartialEntity, tServico } from "../../interfaces";
import { OffcanvasNovoDado } from "./OffcanvasNovoDado";
import { CurrencyType } from "../../types/commom";
import { Service } from "../../types/service";
import { useCallback } from "react";

import OffcanvasDelete from "./OffcanvasDelete";
import useServico from "../../hooks/useServico";

export type IOffcanvasServicoProps = {
    mostrarForm: boolean;
    onTerminou?: () => void;
    onCancel?: () => void;
} & (
    | { tipo: "criar"; dados?: null }
    | { tipo: "editar"; dados: null | (tNovoServico & PartialEntity<tServico, "id">) }
    | { tipo: "deletar"; dados: null | Service }
);

const FORM = "form-servico";

export default function OffcanvasServico(props: IOffcanvasServicoProps) {
    //HOOKS
    const { criar, editar, deletar, cancelar, estaCriando, estaEditando, estaDeletando } = useServico();

    //VARAIVEIS
    const { onTerminou, onCancel, dados, tipo } = props;

    //EVENTS
    const handleOnCancel = useCallback(() => {
        cancelar();
        if (onCancel) onCancel();
    }, [onCancel, cancelar]);

    const handleOnCriar = useCallback(
        async (servico: tNovoServico) => {
            try {
                await criar([servico]);
                if (onTerminou) onTerminou();
            } catch (err) {
                throw err;
            }
        },
        [criar, onTerminou]
    );

    const handleOnEditar = useCallback(
        async (servico: tNovoServico & PartialEntity<tServico, "id">) => {
            try {
                await editar(servico);
                if (onTerminou) onTerminou();
            } catch (err) {
                throw err;
            }
        },
        [editar, onTerminou]
    );

    const handleOnDeletar = useCallback(
        async (id: string) => {
            try {
                await deletar(id);
                if (onTerminou) onTerminou();
            } catch (err) {
                throw err;
            }
        },
        [deletar, onTerminou]
    );

    return props.tipo === "criar" ? (
        <OffcanvasNovoDado.Root show={props.mostrarForm}>
            <OffcanvasNovoDado.Header>
                <h4>Novo Serviço</h4>
            </OffcanvasNovoDado.Header>
            <OffcanvasNovoDado.Body
                cancelButtonProps={{ onClick: handleOnCancel }}
                acceptButtonProps={{ carregando: estaCriando, type: "submit", form: FORM }}
            >
                <FormServico
                    formId={FORM}
                    valoresIniciais={{
                        name: "",
                        tipoProdutoServicoId: "",
                        observacoes: "",
                        tipoMoeda: CurrencyType.BRL,
                        valorCustoHora: 0,
                    }}
                    onSubmit={handleOnCriar}
                />
            </OffcanvasNovoDado.Body>
        </OffcanvasNovoDado.Root>
    ) : tipo === "editar" ? (
        <OffcanvasEditarDado.Root show={props.mostrarForm}>
            <OffcanvasEditarDado.Header>
                <h4>Editar Serviço</h4>
            </OffcanvasEditarDado.Header>
            <OffcanvasEditarDado.Body
                cancelButtonProps={{ onClick: handleOnCancel }}
                acceptButtonProps={{ form: FORM, carregando: estaEditando, type: "submit" }}
            >
                {dados && (
                    <FormServico
                        formId={FORM}
                        valoresIniciais={{
                            name: dados.name,
                            tipoProdutoServicoId: dados.tipoProdutoServicoId,
                            observacoes: dados.observacoes,
                            tipoMoeda: dados.tipoMoeda,
                            valorCustoHora: dados.valorCustoHora,
                        }}
                        onSubmit={(servico) => handleOnEditar({ id: dados.id, ...servico })}
                    />
                )}
            </OffcanvasEditarDado.Body>
        </OffcanvasEditarDado.Root>
    ) : tipo === "deletar" ? (
        <OffcanvasDelete
            show={props.mostrarForm}
            title="Deletar Serviço"
            introText="o serviço"
            details={
                <ul className="mb-2" style={{ lineHeight: "1.6" }}>
                    <li>
                        <strong>Serviço:</strong> {dados?.name}
                    </li>
                    <li>
                        <strong>Moeda:</strong> {dados?.tipoMoeda}
                    </li>
                    <li>
                        <strong>Custo da hora: </strong>
                        {dados?.valorCustoHora.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: dados?.tipoMoeda,
                        })}
                    </li>
                </ul>
            }
            onHide={handleOnCancel}
            onConfirm={async () => {
                if (dados) await handleOnDeletar(dados.id);
            }}
            pending={estaDeletando}
        />
    ) : undefined;
}
