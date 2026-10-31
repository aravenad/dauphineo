const CLE = "dauphineo.token";

export function lireToken(): string | null {
    try {
        return localStorage.getItem(CLE);
    } catch {
        return null;
    }
}

export function enregistrerToken(token: string | null): void {
    try {
        if (token) {
            localStorage.setItem(CLE, token);
        } else {
            localStorage.removeItem(CLE);
        }
    } catch {
        // Stockage indisponible (navigation privée) : la session ne survivra pas au rechargement
    }
}
