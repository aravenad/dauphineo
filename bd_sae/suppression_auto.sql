
/* exécute automatiquement la suppression des données à supprimer pour les FACTURES*/
CREATE OR REPLACE FUNCTION delete_inactive_users()
RETURNS VOID AS $$
BEGIN
    DELETE FROM UTILISATEUR
    WHERE derniere_activite < NOW() - INTERVAL '3 years';
END;
$$ LANGUAGE plpgsql;