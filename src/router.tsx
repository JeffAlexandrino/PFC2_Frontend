import LayoutLogin from "./layouts/LayoutLogin/LayoutLogin";
import ProviderUser from "./contexts/ContextUser";
import FrontRoutes from "./lib/front-routes";
import Dashboard from "./views/dashboard";
import ApiRoutes from "./lib/api-routes";

import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { LayoutPrincipal } from "./layouts";
import { useContext, useEffect } from "react";
import {
    Clientes,
    Fornecedores,
    Vendedores,
    Produtos,
    Sales,
    Vendedor,
    Servicos,
    ErrorInfoUser,
    RecuperarSenha,
    CriarNovaSenha,
    Comissoes,
    Visits,
    Distribuicoes,
    Metas,
} from "./views";
import { ContextAlerta } from "./contexts/ContextAlert";

export default function Router() {
    const { refreshVersion } = useContext(ContextAlerta);

    useEffect(() => {
        refreshVersion();
    }, [refreshVersion]);

    //VARIAVEIS
    const router = createBrowserRouter([
        { path: "/", element: <Navigate to={FrontRoutes.getLogged()} /> },
        { path: FrontRoutes.getLogin(), element: <LayoutLogin /> },
        { path: FrontRoutes.getRecuperarSenha(), element: <RecuperarSenha /> },
        {
            path: FrontRoutes.getLogged(),
            element: (
                <ProviderUser>
                    <LayoutPrincipal />
                </ProviderUser>
            ),
            children: [
                { index: true, element: <Navigate to={FrontRoutes.getDashboard()} /> },
                { path: FrontRoutes.getDashboard(), element: <Dashboard /> },
                { path: FrontRoutes.getCustomers(), element: <Clientes /> },
                { path: FrontRoutes.getSuppliers(), element: <Fornecedores /> },
                { path: FrontRoutes.getUsers(), element: <Vendedores /> },
                { path: FrontRoutes.getTargetsUser(":id"), element: <Vendedor /> },
                { path: FrontRoutes.getProducts(), element: <Produtos /> },
                { path: FrontRoutes.getServices(), element: <Servicos /> },
                { path: FrontRoutes.getSales(), element: <Sales /> },
                { path: FrontRoutes.getCommissions(), element: <Comissoes /> },
                { path: FrontRoutes.getVisits(), element: <Visits /> },
                { path: FrontRoutes.getDistributions(), element: <Distribuicoes /> },
                { path: FrontRoutes.getMetas(), element: <Metas /> },
            ],
        },
        { path: FrontRoutes.getErrorInfoUser(), element: <ErrorInfoUser /> },
        { path: FrontRoutes.getCriarSenha(), element: <CriarNovaSenha /> },
    ]);

    return (
        <>
            <RouterProvider router={router} />
            <code className="position-fixed bottom-0 end-0 me-3 text-white">
                v{FrontRoutes.getVersion()} <i className="bi bi-lightning-charge-fill" /> {ApiRoutes.getVersion}
            </code>
        </>
    );
}
