import FormGroupInput, { FormGroupInputType } from "../formGroups/FormGroupInput";
import FormGroupSelect from "../formGroups/FormGroupSelect";
import BotaoAssincrono from "../botoes/BotaoAssincrono";
import UserRoleUtil from "../../utils/user-role.util";
import UserUtil from "../../utils/user.util";
import SaleUtil from "../../utils/sale.util";
import useUser from "../../hooks/use-user";
import Dropdown from "../../ui/dropdown";
import utils from "../../utils";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Role } from "../../types/commom";
import { User } from "../../types/user";

const defaultStartDate = utils.retornaDataAtual({ hora: 0, minutos: 0, segundos: 0, millisegundos: 0 });
const defaultEndDate = utils.retornaDataAtual({ hora: 23, minutos: 59, segundos: 59, millisegundos: 999 });

export type UserReportsProps = { selectedUsersIds: string[]; users: User[] };

export default function UserReports({ selectedUsersIds, users }: UserReportsProps) {
    const { getUserReports } = useUser();

    const [searchParams] = useSearchParams();
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [role, setRole] = useState<string | undefined>(undefined);

    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const filterValues = UserUtil.getFilterValuesBy(searchParams);
        const filterDateValues = SaleUtil.getFilterValuesBy(searchParams).filterSaleDate;
        setUserId(filterValues.email);
        setRole(filterValues.role);

        if (filterDateValues) {
            setStartDate(new Date(filterDateValues.gte));
            setEndDate(new Date(filterDateValues.lte));
        }
    }, [searchParams]);

    const downloadReports = useCallback(async () => {
        let titleReport = "";

        if (selectedUsersIds.length > 0)
            titleReport = `Participações_Vendas - ${selectedUsersIds.length}_selecionados.pdf`;
        else {
            const startDateStr = startDate.toLocaleDateString("pt-Br", { month: "2-digit", year: "numeric" });
            const endDateStr = endDate.toLocaleDateString("pt-Br", { month: "2-digit", year: "numeric" });
            titleReport = `Participações_Vendas - de ${startDateStr} a ${endDateStr}.pdf`;
        }
        try {
            const usersIds =
                userId === undefined ? selectedUsersIds : selectedUsersIds.length > 0 ? selectedUsersIds : [userId];
            const relatorio = await getUserReports(usersIds, {
                where: {
                    role: role,
                    gte_dataVenda: startDate.toISOString(),
                    lte_dataVenda: endDate.toISOString(),
                },
            });

            const a = document.createElement("a");

            const blobFile = new Blob([relatorio], { type: "pdf" });
            const url = window.URL.createObjectURL(blobFile);
            a.href = url;
            a.download = titleReport;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        }
    }, [endDate, startDate, userId, getUserReports, selectedUsersIds, role]);

    return (
        <>
            <Dropdown.Root>
                <Dropdown.Item ref={divRef} className="text-primary">
                    <span>Relatório por Usuário</span>
                </Dropdown.Item>
                <Dropdown.Menu rootClose target={divRef.current} placement="bottom-start">
                    <div className="p-1">
                        <Row>
                            {selectedUsersIds.length > 0 && (
                                <>
                                    <Col sm="12" className="mb-3">
                                        <span className="text-info">
                                            Usuários selecionados: {selectedUsersIds.length}.
                                        </span>
                                    </Col>
                                    <Col sm="12">
                                        <BotaoAssincrono className="w-100" onClick={downloadReports}>
                                            Baixar relatórios por Usuário
                                        </BotaoAssincrono>
                                    </Col>
                                </>
                            )}
                            {selectedUsersIds.length < 1 && (
                                <>
                                    <div className="border-bottom border-top text-center mb-2 text-secondary-dark">
                                        Busca as participações do usuário nas vendas relacionadas aos seus papéis
                                        comerciais.
                                    </div>
                                    <Col sm="6" className="mb-2">
                                        <FormGroupInput
                                            label="Data Venda: inicial"
                                            type={FormGroupInputType.DATE}
                                            value={startDate}
                                            setValue={setStartDate}
                                        />
                                    </Col>
                                    <Col sm="6" className="mb-2">
                                        <FormGroupInput
                                            label="Data Venda: final"
                                            type={FormGroupInputType.DATE}
                                            value={endDate}
                                            setValue={setEndDate}
                                            useLastTime
                                        />
                                    </Col>
                                    <Col sm="6" className="mb-2">
                                        <FormGroupSelect
                                            label="Usuário"
                                            value={userId ?? ""}
                                            setValue={(v) => setUserId(v === "" ? undefined : v)}
                                            options={[
                                                "",
                                                ...users
                                                    .map((u) => u.id)
                                                    .filter((id, idx, arr) => arr.indexOf(id) === idx),
                                            ]}
                                            optionTextFn={(id) => {
                                                if (id === "") return "Todos";
                                                const vendedor = users.find(({ id: uid }) => uid === id);
                                                return vendedor?.name ?? "";
                                            }}
                                        />
                                    </Col>
                                    <Col sm="6" className="mb-2">
                                        <FormGroupSelect
                                            label="Papéis"
                                            value={role ?? ""}
                                            setValue={(v) => setRole(v === "" ? undefined : v)}
                                            options={["", ...UserRoleUtil.COMERCIAL_ROLES]}
                                            optionTextFn={(value) => {
                                                if (value === "") return "Todos";
                                                return UserRoleUtil.getRoleDescription(value as Role) ?? "";
                                            }}
                                        />
                                    </Col>
                                    <Col sm="12" className="mt-1">
                                        <BotaoAssincrono onClick={downloadReports} className="w-100">
                                            Baixar relatório por Usuário
                                        </BotaoAssincrono>
                                    </Col>
                                </>
                            )}
                        </Row>
                    </div>
                </Dropdown.Menu>
            </Dropdown.Root>
        </>
    );
}
