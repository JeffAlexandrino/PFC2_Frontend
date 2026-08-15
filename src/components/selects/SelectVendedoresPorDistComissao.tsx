import useCommissionDistribution from "../../hooks/use-commission-distribution";
import SelectMenu from "./SelectMenu";

import { CommissionDistribution } from "../../types/commission-distribution";
import { useCallback, useContext, useEffect, useState } from "react";
import { ContextUser } from "../../contexts/ContextUser";
import { OffcanvasForm } from "../offcanvas-form";
import { Role } from "../../types/commom";

export interface ISelectVendedoresPorDistComissaoProps {
    idsVendedores?: string[];
    setIdsVendedores?: (ids: string[] | null) => void;
}

export default function SelectVendedoresPorDistComissao(props: ISelectVendedoresPorDistComissaoProps) {
    const { findManyDistributions, cancelFindManyDistributions, findingManyDistributions } =
        useCommissionDistribution();

    const {
        canReadCommissionDistribution,
        canAddCommissionDistribution,
        canDeleteCommissionDistribution,
        canEditCommissionDistribution,
        currentUserRole,
    } = useContext(ContextUser);

    const [distribuicoes, setDistribuicoes] = useState<CommissionDistribution[]>([]);
    const [pesquisa, setPesquisa] = useState("");
    const [mostrarAdicionar, setMostrarAdicionar] = useState(false);

    const [distribuicaoEditando, setDistribuicaoEditando] = useState<CommissionDistribution | null>(null);
    const [distribuicaoDeletando, setDistribuicaoDeletando] = useState<CommissionDistribution | null>(null);

    const { setIdsVendedores, idsVendedores } = props;

    const idDistSelecionada = distribuicoes.find((dist) => {
        const contemVendedores = dist.roleCommissions.every((vc) => idsVendedores?.includes(vc.userRoleId));
        const contemExactNumVendedores = dist.roleCommissions.length === idsVendedores?.length;
        return contemVendedores && contemExactNumVendedores;
    })?.id;

    const distribuicoesFiltradas = distribuicoes.filter((distribuicao) =>
        distribuicao.roleCommissions.some(({ userRole: vendedorRole }) =>
            vendedorRole.user.name.toLowerCase().includes(pesquisa.toLowerCase())
        )
    );

    const valoresFormatados = distribuicoesFiltradas.map((distribuicao) => ({
        ...distribuicao,
        texto: distribuicao.roleCommissions.map(({ userRole: vendedorRole }) => vendedorRole.user.name).join(", "),
        selecionado: idDistSelecionada === distribuicao.id,
    }));

    const buscarDistribuicoes = useCallback(() => {
        if (canReadCommissionDistribution({ role: Role.VENDEDOR }))
            findManyDistributions({ where: { role: Role.VENDEDOR } })
                .then((distribuicoes) => setDistribuicoes(distribuicoes))
                .catch((err) => console.error(err));
        else
            findManyDistributions({ where: { userRoleId: currentUserRole?.id, role: Role.VENDEDOR } })
                .then((distribuicoes) => setDistribuicoes(distribuicoes))
                .catch((err) => console.error(err));
    }, [findManyDistributions, canReadCommissionDistribution, currentUserRole]);

    useEffect(() => {
        buscarDistribuicoes();
        return () => cancelFindManyDistributions();
    }, [cancelFindManyDistributions, buscarDistribuicoes]);

    const handleOnClickAdicionar = useCallback(() => setMostrarAdicionar(true), []);
    const handleOnClickEditar = useCallback(
        (id: string) => {
            const distribuicaoEditando = distribuicoes.find((distribuicao) => distribuicao.id === id);
            if (distribuicaoEditando) setDistribuicaoEditando(distribuicaoEditando);
        },
        [distribuicoes]
    );
    const handleOnClickDeletar = useCallback(
        (id: string) => {
            const distribuicaoDeletando = distribuicoes.find((distribuicao) => distribuicao.id === id);
            if (distribuicaoDeletando) setDistribuicaoDeletando(distribuicaoDeletando);
        },
        [distribuicoes]
    );
    const handleOnClickDistribuicao = useCallback(
        (id: string) => {
            if (!setIdsVendedores) return;

            //Encontrando a nova distribuicao a selecionar
            const distribuicaoNova = distribuicoes.find((distribuicao) => distribuicao.id === id);
            if (!distribuicaoNova) return;

            if (distribuicaoNova.id === idDistSelecionada) return setIdsVendedores([]);
            setIdsVendedores(distribuicaoNova.roleCommissions.map((vc) => vc.userRoleId));
        },
        [distribuicoes, idDistSelecionada, setIdsVendedores]
    );

    const returnLabelDistribuicaoSelecionada = useCallback((): string => {
        if (!idDistSelecionada) return "--- Nenhum ---";

        const distribuicaoSelecionada = distribuicoes.find(({ id }) => id === idDistSelecionada);
        if (!distribuicaoSelecionada) return "--- Nenhum ---";
        return distribuicaoSelecionada.roleCommissions
            .map(({ userRole: vendedorRole }) => vendedorRole.user.name)
            .join(", ");
    }, [idDistSelecionada, distribuicoes]);

    return (
        <>
            <SelectMenu
                setPesquisa={setPesquisa}
                valores={valoresFormatados}
                texto={returnLabelDistribuicaoSelecionada()}
                onOpenMenu={buscarDistribuicoes}
                onClickAdicionar={canAddCommissionDistribution({}) ? handleOnClickAdicionar : undefined}
                onClickItem={handleOnClickDistribuicao}
                onClickDeletar={canDeleteCommissionDistribution({}) ? handleOnClickDeletar : undefined}
                onClickEditar={canEditCommissionDistribution({}) ? handleOnClickEditar : undefined}
                closeOnSelect
                carregando={findingManyDistributions}
            />

            <OffcanvasForm.CommissionDistribution.Manage
                role={Role.VENDEDOR}
                show={mostrarAdicionar || !!distribuicaoEditando}
                distributionToUpdate={distribuicaoEditando}
                onDone={() => {
                    setMostrarAdicionar(false);
                    setDistribuicaoEditando(null);
                    buscarDistribuicoes();
                }}
                onHide={() => {
                    setMostrarAdicionar(false);
                    setDistribuicaoEditando(null);
                }}
            />

            <OffcanvasForm.CommissionDistribution.Delete
                distributionToDelete={distribuicaoDeletando}
                onDone={() => {
                    setDistribuicaoDeletando(null);
                    buscarDistribuicoes();
                }}
                onHide={() => setDistribuicaoDeletando(null)}
            />
        </>
    );
}
