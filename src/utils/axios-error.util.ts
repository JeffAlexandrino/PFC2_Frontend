import { AxiosError } from "axios";

const UNKNOWN_ERROR_MESSAGE = "Erro desconhecido";
const UNKNOWN_RESPONSE_STATUS = 500;

export default class AxiosErrorUtil {
    private static parse(unknownError: unknown): AxiosError | undefined {
        if (unknownError instanceof AxiosError) return unknownError;
        return undefined;
    }

    public static isAnAbort(unknownError: unknown): boolean {
        const error = AxiosErrorUtil.parse(unknownError);
        if (!error) return false;

        return error?.code === "ERR_CANCELED" || error?.code === undefined;
    }

    public static getMessageFrom(unknownError: unknown): string {
        const error = AxiosErrorUtil.parse(unknownError);
        if (!error) return UNKNOWN_ERROR_MESSAGE;

        const resStatus = error.response?.status ?? UNKNOWN_RESPONSE_STATUS;
        const message = (error.response?.data as any)?.message ?? error.message ?? UNKNOWN_ERROR_MESSAGE;

        return `${resStatus}: ${message}`;
    }
}
