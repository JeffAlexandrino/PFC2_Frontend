import { useCallback, useContext, useEffect, useState } from "react";
import { ContextUser } from "../../contexts/ContextUser";
import { OffcanvasForm } from "../offcanvas-form";
import { UserRole } from "../../types/user-role";
import { Role } from "../../types/commom";

import useUserRole from "../../hooks/use-user-role";
import SelectMenu from "./SelectMenu";

export interface ISelectVendedorProps {
    idSelecionado?: string | null;
    setIdSelecionado?: (id: string | null) => void;
    size?: "sm";
}

export default function SelectVendedor(props: ISelectVendedorProps) {
    //HOOKS
    const {
        findUsersRole: findManyUsersRole,
        cancelFindUsersRole: cancelFindManyUsersRole,
        findingUsersRole,
    } = useUserRole();

    //CONTEXTOS
    const {
        canEditUserByUserRole,
        canDeleteUserRole,
        canAddUserRole: podeAdicionarUserRole,
        canReadUserRoles: podeVisualizarUserRole,
        currentUserRole,
    } = useContext(ContextUser);

    //ESTADOS
    const [findUserRoleWithError, setFindUserRoleWithError] = useState(false);
    const [vendedores, setVendedores] = useState<UserRole[]>([]);
    const [pesquisa, setPesquisa] = useState("");
    const [mostrarAdicionar, setMostrarAdicionar] = useState(false);
    const [vendedorDeletando, setVendedorDeletando] = useState<UserRole | null>(null);
    const [vendedorEditando, setVendedorEditando] = useState<UserRole | null>(null);

    //VARIAVEIS
    const { setIdSelecionado, idSelecionado } = props;

    const vendedoresFiltrados = vendedores.filter((vendedor) =>
        vendedor.user.name.toLowerCase().includes(pesquisa.toLowerCase())
    );

    const valoresFormatados = vendedoresFiltrados.map((vendedor) => ({
        ...vendedor,
        texto: vendedor.user.name,
        selecionado: idSelecionado === vendedor.id,
    }));

    //EVENTOS
    const buscarVendedores = useCallback(() => {
        if (podeVisualizarUserRole({}))
            findManyUsersRole({ where: { role: Role.VENDEDOR } })
                .then((vendedores) => {
                    setVendedores(vendedores);
                    setFindUserRoleWithError(false);
                })
                .catch((err) => {
                    console.error(err);
                    setFindUserRoleWithError(true);
                });
        else if (podeVisualizarUserRole({ id: currentUserRole?.id }))
            findManyUsersRole({ where: { id: currentUserRole?.id, role: Role.VENDEDOR } })
                .then((vendedores) => {
                    setVendedores(vendedores);
                    setFindUserRoleWithError(false);
                })
                .catch((err) => {
                    console.error(err);
                    setFindUserRoleWithError(true);
                });
    }, [findManyUsersRole, podeVisualizarUserRole, currentUserRole]);

    useEffect(() => {
        buscarVendedores();
        return () => cancelFindManyUsersRole();
    }, [buscarVendedores, cancelFindManyUsersRole]);

    const handleOnClickAdicionar = useCallback(() => setMostrarAdicionar(true), []);

    const handleOnClickEditar = useCallback(
        (id: string) => {
            const vendedorEditando = vendedores.find((vendedor) => vendedor.id === id);
            setVendedorEditando(vendedorEditando ?? null);
        },
        [vendedores]
    );
    const handleOnClickDeletar = useCallback(
        (id: string) => {
            const vendedorDeletando = vendedores.find((vendedor) => vendedor.id === id);
            if (vendedorDeletando) setVendedorDeletando(vendedorDeletando);
        },
        [vendedores]
    );
    const handleOnClickVendedor = useCallback(
        (id: string) => {
            if (!setIdSelecionado) return;

            //Encontrando o novo vendedor a selecionar
            const vendedorNovo = vendedores.find((vendedor) => vendedor.id === id);
            if (!vendedorNovo) return;

            if (vendedorNovo.id === idSelecionado) return setIdSelecionado(null);
            setIdSelecionado(vendedorNovo.id);
        },
        [setIdSelecionado, vendedores, idSelecionado]
    );

    const returnLabelClienteSelecionado = useCallback((): string => {
        if (!idSelecionado) return "--- Nenhum ---";

        const vendedorSelecionado = vendedores.find(({ id }) => id === idSelecionado);
        if (!vendedorSelecionado) return "--- Nenhum ---";
        return vendedorSelecionado.user.name;
    }, [idSelecionado, vendedores]);

    return (
        <>
            <SelectMenu
                setPesquisa={setPesquisa}
                valores={valoresFormatados}
                texto={returnLabelClienteSelecionado()}
                onOpenMenu={findUserRoleWithError ? buscarVendedores : undefined}
                onClickAdicionar={podeAdicionarUserRole({}) ? handleOnClickAdicionar : undefined}
                onClickItem={handleOnClickVendedor}
                onClickDeletar={canDeleteUserRole({}) ? handleOnClickDeletar : undefined}
                onClickEditar={canEditUserByUserRole({}) ? handleOnClickEditar : undefined}
                carregando={findingUsersRole}
                closeOnSelect
            />

            <OffcanvasForm.User.Add
                show={mostrarAdicionar}
                onHide={() => setMostrarAdicionar(false)}
                onDone={buscarVendedores}
            />

            <OffcanvasForm.User.Edit
                userToEdit={vendedorEditando ? { ...vendedorEditando.user, userRoles: [vendedorEditando] } : null}
                onHide={() => setVendedorEditando(null)}
                onDone={() => {
                    setVendedorEditando(null);
                    buscarVendedores();
                }}
            />

            <OffcanvasForm.User.Delete
                userToDelete={
                    vendedorDeletando ? { ...vendedorDeletando.user, userRoles: [vendedorDeletando] } : undefined
                }
                onHide={() => setVendedorDeletando(null)}
                onDone={() => {
                    setVendedorDeletando(null);
                    buscarVendedores();
                }}
            />
        </>
    );
}
