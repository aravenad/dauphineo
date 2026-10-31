import { traduire } from "../i18n";

/** Erreur renvoyée par l'API, avec un message déjà lisible par l'utilisateur. */
export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}

export function messageErreur(erreur: unknown, defaut?: string): string {
    if (erreur instanceof ApiError) return erreur.message;
    return defaut ?? traduire({ fr: "Une erreur est survenue. Veuillez réessayer.", en: "Something went wrong. Please try again." });
}
