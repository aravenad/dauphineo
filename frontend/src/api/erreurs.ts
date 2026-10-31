/** Erreur renvoyée par l'API, avec un message déjà lisible par l'utilisateur. */
export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}

export function messageErreur(erreur: unknown, defaut = "Une erreur est survenue. Veuillez réessayer."): string {
    return erreur instanceof ApiError ? erreur.message : defaut;
}
