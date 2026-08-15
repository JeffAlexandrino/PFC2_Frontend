import { useCallback, useContext, useEffect, useState } from "react";
import { ContextUser } from "../../contexts/ContextUser";
import { tServico } from "../../interfaces";

import OffcanvasServico from "../offcanvas/OffcanvasServico";
import useServico from "../../hooks/useServico";
import SelectMenu from "./SelectMenu";

export interface ISelectServicoProps {
    idSelecionado?: string | null;
    setIdSelecionado?: (id: string | null) => void;
    size?: "sm";
    naoMostrarIds?: string[];
}

export default function SelectServico(props: ISelectServicoProps) {
    //HOOKS
    const { cancelar, buscar, estaBuscando, buscaComErro } = useServico();

    //CONTEXTOS
    const { canEditService, canDeleteService, canAddService } = useContext(ContextUser);

    //ESTADOS
    const [servicos, setServicos] = useState<tServico[]>([]);
    const [pesquisa, setPesquisa] = useState("");

    const [mostrarAdicionar, setMostrarAdicionar] = useState(false);
    const [servicoEditando, setServicoEditando] = useState<tServico | null>(null);
    const [servicoDeletando, setServicoDeletando] = useState<tServico | null>(null);

    //VARIAVEIS
    const { setIdSelecionado, idSelecionado, naoMostrarIds } = props;

    const servicosFiltrados = servicos.filter((servico) => !naoMostrarIds?.includes(servico.id));
    const servicosBuscados = servicosFiltrados.filter((servico) =>
        servico.name.toLowerCase().includes(pesquisa.toLowerCase())
    );

    const valoresFormatados = servicosBuscados.map((servico) => ({
        ...servico,
        texto: servico.name,
        selecionado: idSelecionado === servico.id,
    }));

    //EVENTOS
    const buscarServicos = useCallback(() => {
        buscar()
            .then((servicos) => setServicos(servicos))
            .catch((err) => console.error(err));
    }, [buscar]);

    useEffect(() => {
        buscarServicos();
        return () => cancelar();
    }, [cancelar, buscarServicos]);

    const handleOnClickAdicionar = useCallback(() => setMostrarAdicionar(true), []);
    const handleOnClickEditar = useCallback(
        (id: string) => {
            const servicoEditando = servicos.find((servico) => servico.id === id);
            if (servicoEditando) setServicoEditando(servicoEditando);
        },
        [servicos]
    );
    const handleOnClickDeletar = useCallback(
        (id: string) => {
            const servicoDeletando = servicos.find((servico) => servico.id === id);
            if (servicoDeletando) setServicoDeletando(servicoDeletando);
        },
        [servicos]
    );
    const handleOnClickServico = useCallback(
        (id: string) => {
            if (!setIdSelecionado) return;

            //Encontrando o novo servico a selecionar
            const servicoNovo = servicos.find((servico) => servico.id === id);
            if (!servicoNovo) return;

            if (servicoNovo.id === idSelecionado) return setIdSelecionado(null);
            setIdSelecionado(servicoNovo.id);
        },
        [setIdSelecionado, servicos, idSelecionado]
    );

    const returnLabelServicoSelecionado = useCallback((): string => {
        if (!idSelecionado) return "--- Nenhum ---";

        const servicoSelecionado = servicos.find(({ id }) => id === idSelecionado);
        if (!servicoSelecionado) return "--- Nenhum ---";
        return servicoSelecionado.name;
    }, [idSelecionado, servicos]);

    return (
        <>
            <SelectMenu
                setPesquisa={setPesquisa}
                valores={valoresFormatados}
                texto={returnLabelServicoSelecionado()}
                onOpenMenu={buscaComErro ? buscarServicos : undefined}
                onClickAdicionar={canAddService({}) ? handleOnClickAdicionar : undefined}
                onClickItem={handleOnClickServico}
                onClickDeletar={canDeleteService({}) ? handleOnClickDeletar : undefined}
                onClickEditar={canEditService({}) ? handleOnClickEditar : undefined}
                closeOnSelect
                carregando={estaBuscando}
            />

            <OffcanvasServico
                tipo="criar"
                mostrarForm={mostrarAdicionar}
                onCancel={() => setMostrarAdicionar(false)}
                onTerminou={buscarServicos}
            />

            <OffcanvasServico
                tipo="editar"
                mostrarForm={servicoEditando !== null}
                onCancel={() => setServicoEditando(null)}
                onTerminou={() => {
                    setServicoEditando(null);
                    buscarServicos();
                }}
                dados={servicoEditando}
            />

            <OffcanvasServico
                tipo="deletar"
                mostrarForm={servicoDeletando !== null}
                onCancel={() => setServicoDeletando(null)}
                onTerminou={() => {
                    setServicoDeletando(null);
                    buscarServicos();
                }}
                dados={servicoDeletando}
            />
        </>
    );
}
