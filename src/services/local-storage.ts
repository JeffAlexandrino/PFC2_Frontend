const ACCESS_TOKEN_KEY = "_ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "_REFRESH_TOKEN";

export default class LocalStorage {
    public static getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
    public static setAccessToken = (newAccessToken: string) => localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);

    public static getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
    public static setRefreshToken = (newRefreshToken: string) =>
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
    public static cleanRefreshToken = () => localStorage.removeItem(REFRESH_TOKEN_KEY);
}
