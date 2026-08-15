import CommissionInfoPerUser from "./commission-info-per-user";
import VisitExpenseInfo from "./visit-expenses-info-per-role";
import SaleClientReports from "./sale-client-reports";
import SaleUserReports from "./sale-user-reports";
import CommissionReports from "./commission-reports";
import VisitReports from "./visit-reports";
import UserReports from "./user-reports";

export const Dropdown = {
    VisitPendingPayments: VisitExpenseInfo,
    VisitReports,
    CommissionInfoPerRoles: CommissionInfoPerUser,
    CommissionReports,
    SaleClientReports,
    SaleUserReports,
    UserReports,
};
