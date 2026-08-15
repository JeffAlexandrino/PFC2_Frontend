import { ContextUser } from "../../contexts/ContextUser";
import { useContext, useEffect, useState } from "react";

import UserRoleUtil from "../../utils/user-role.util";

function montarAvisos(nomeUsuario: string | undefined, agora: Date, ehComercial: boolean): string[] {
    const avisos: string[] = [];

    const diaSemana = agora.getDay();
    const diaMes = agora.getDate();
    const hora = agora.getHours();
    const minuto = agora.getMinutes();
    const minutosDoDia = hora * 60 + minuto;

    const foraDoHorario = minutosDoDia >= 20 * 60 || minutosDoDia < 6 * 60;

    if (ehComercial && foraDoHorario) {
        avisos.push(
            `Boa noite, ${nomeUsuario ?? "usuário"}! Por norma da empresa, não é possível efetuar alterações no sistema fora do horário comercial 20:00h e 06:00h.`
        );
    }

    const segundaOuTerca = diaSemana === 1 || diaSemana === 2;

    const primeiraSprint = diaMes >= 5 && diaMes <= 15;
    const segundaSprint = diaMes >= 16 && diaMes <= 27;

    const semanaDeAtualizacao = primeiraSprint || segundaSprint;

    if (segundaOuTerca && semanaDeAtualizacao) {
        let mostrarAviso = false;

        if (diaSemana === 1) {
            mostrarAviso = true;
        } else {
            mostrarAviso = hora < 13 || (hora === 13 && minuto <= 5);
        }

        if (mostrarAviso) {
            avisos.push("O sistema ficará indisponível entre 12h e 13h para realização de atualização.");
        }
    }

    return avisos;
}

export default function AvisosSistema() {
    const { currentUserRole, usuario } = useContext(ContextUser);
    const [agora, setAgora] = useState(new Date());
    const ehComercial = currentUserRole?.role ? UserRoleUtil.isComercialRole(currentUserRole.role) : false;
    const avisos = montarAvisos(usuario?.name, agora, ehComercial);

    useEffect(() => {
        const intervalo = setInterval(() => {
            setAgora(new Date());
        }, 60000);

        return () => clearInterval(intervalo);
    }, []);

    if (avisos.length === 0) {
        return null;
    }

    return (
        <div className="d-flex flex-column w-100 flex-shrink-0">
            {avisos.map((aviso, index) => (
                <div key={index} className="d-flex align-items-center aviso-sistema-barra">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <span>{aviso}</span>
                </div>
            ))}
        </div>
    );
}
