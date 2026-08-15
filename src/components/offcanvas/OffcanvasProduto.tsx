import FormProduto, { tNovoProduto } from "../forms/FormProduto";
import { OffcanvasEditarDado } from "./OffcanvasEditarDado";
import { PartialEntity, tProduto } from "../../interfaces";
import { OffcanvasNovoDado } from "./OffcanvasNovoDado";
import { CurrencyType } from "../../types/commom";
import { useCallback } from "react";

import OffcanvasDelete from "./OffcanvasDelete";
import useProduto from "../../hooks/useProduto";

export type IOffcanvasProdutoProps = {
    mostrarForm: boolean;
    onTerminou?: () => void;
    onCancel?: () => void;
} & (
    | { tipo: "criar"; dados?: null }
    | { tipo: "editar"; dados: null | (tNovoProduto & PartialEntity<tProduto, "id">) }
    | { tipo: "deletar"; dados: null | tProduto }
);

const FORM = "form-produto";

export default function OffcanvasProduto(props: IOffcanvasProdutoProps) {
    //HOOKS
    const { criar, editar, deletar, cancelar, estaCriando, estaEditando, estaDeletando } = useProduto();

    //VARAIVEIS
    const { onTerminou, onCancel, dados, tipo } = props;

    //EVENTS
    const handleOnCancel = useCallback(() => {
        cancelar();
        if (onCancel) onCancel();
    }, [onCancel, cancelar]);

    const handleOnCriar = useCallback(
        async (produto: tNovoProduto) => {
            try {
                await criar([produto]);
                if (onTerminou) onTerminou();
            } catch (err) {
                throw err;
            }
        },
        [criar, onTerminou]
    );

    const handleOnEditar = useCallback(
        async (produto: tNovoProduto & PartialEntity<tProduto, "id">) => {
            try {
                await editar(produto);
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
                <h4>Novo Produto</h4>
            </OffcanvasNovoDado.Header>
            <OffcanvasNovoDado.Body
                cancelButtonProps={{ onClick: handleOnCancel }}
                acceptButtonProps={{ carregando: estaCriando, type: "submit", form: FORM }}
            >
                <FormProduto
                    formId={FORM}
                    valoresIniciais={{
                        name: "",
                        categoriaId: "",
                        fabricanteId: "",
                        partNumber: "",
                        tipoProdutoServicoId: "",
                        custoUnit: 0,
                        tipoMoeda: CurrencyType.BRL,
                    }}
                    onSubmit={handleOnCriar}
                />
            </OffcanvasNovoDado.Body>
        </OffcanvasNovoDado.Root>
    ) : tipo === "editar" ? (
        <OffcanvasEditarDado.Root show={props.mostrarForm}>
            <OffcanvasEditarDado.Header>
                <h4>Editar Produto</h4>
            </OffcanvasEditarDado.Header>
            <OffcanvasEditarDado.Body
                cancelButtonProps={{ onClick: handleOnCancel }}
                acceptButtonProps={{ form: FORM, carregando: estaEditando, type: "submit" }}
            >
                {dados && (
                    <FormProduto
                        formId={FORM}
                        valoresIniciais={{
                            name: dados.name,
                            categoriaId: dados.categoriaId,
                            fabricanteId: dados.fabricanteId,
                            partNumber: dados.partNumber,
                            tipoProdutoServicoId: dados.tipoProdutoServicoId,
                            custoUnit: dados.custoUnit,
                            tipoMoeda: dados.tipoMoeda,
                        }}
                        onSubmit={(produto) => handleOnEditar({ id: dados.id, ...produto })}
                    />
                )}
            </OffcanvasEditarDado.Body>
        </OffcanvasEditarDado.Root>
    ) : tipo === "deletar" ? (
        <OffcanvasDelete
            show={props.mostrarForm}
            title="Deletar Produto"
            introText="o produto"
            details={
                <ul className="mb-2" style={{ lineHeight: "1.6" }}>
                    <li>
                        <strong>Produto:</strong> {dados?.name}
                    </li>
                    <li>
                        <strong>Fabricante:</strong> {dados?.fabricante.name}
                    </li>
                    <li>
                        <strong>Moeda:</strong> {dados?.tipoMoeda}
                    </li>
                    <li>
                        <strong>Custo unitário: </strong>
                        {dados?.custoUnit.toLocaleString("pt-BR", {
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
