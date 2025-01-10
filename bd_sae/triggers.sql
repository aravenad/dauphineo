-- il faut un trigger qui crée une visite lorsque qu'un guide est diponible 
-- un qui gere la capacité de visite
-- peut etre dans le fichier suppression auto il faudrait un trigger qui supprime qd derniere activité est supprieure a 3 ans ?
-- un qui supprime le commentaire si son status est supprimé
-- un qui supprime la reservation si le status est annulée
-- un trigger qui genere les crénaux en fonctions du temps de visite et dens horaire de travail (exemple 9h-17h 2h de visite donc 3 crénaux dans la journée donc 21 dans la semaine et chaque semaine sont les meme dc les crénaux sont les meme)
-- un trigger qui supprime les donnees de l'utilisateur si verif age et false 



--trigger qui crée une visite lorsque qu'un guide est diponible  (vérifié par axel)

CREATE OR REPLACE FUNCTION create_visit_on_guide_availability()
RETURNS TRIGGER AS $$
BEGIN
    -- Vérifier si une visite existe déjà pour cette disponibilité
    IF NOT EXISTS (
        SELECT 1 FROM VISITE WHERE id_disponibilite = NEW.id
    ) THEN
        INSERT INTO VISITE (capacite_actuelle, capacite_max, date_visite, id_spr, id_disponibilite)
        VALUES (0, (SELECT capacite_de_visite FROM SPR WHERE id = NEW.id_spr), 
                NEW.date_jour, NEW.id_spr, NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_create_visit_on_availability
AFTER INSERT ON DISPONIBILITE
FOR EACH ROW
EXECUTE FUNCTION create_visit_on_guide_availability();



--gere la capacité de visite (vérifié)
--gere la capacité de visite (vérifié)
CREATE OR REPLACE FUNCTION manage_visit_capacity()
RETURNS TRIGGER AS $$
BEGIN
-- Mettre à jour la capacité actuelle de la visite
IF TG_OP = 'INSERT' THEN

    -- Vérifier si la capacité est dépassée
    IF (SELECT capacite_actuelle FROM VISITE WHERE id = NEW.id_visite) <
        new.taille THEN
        --levée de l'exception qui annule l'opération qui a trigger le trigger
        RAISE EXCEPTION 'Capacité dépassée pour la visite.';
    ELSE UPDATE VISITE
    SET capacite_actuelle = capacite_actuelle - NEW.taille
    WHERE id = NEW.id_visite;
    END IF;
ELSIF TG_OP = 'DELETE' THEN
    UPDATE VISITE
    SET capacite_actuelle = capacite_actuelle + OLD.taille
    WHERE id = OLD.id_visite;
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_manage_visit_capacity
AFTER INSERT OR DELETE ON RESERVATION
FOR EACH ROW
EXECUTE FUNCTION manage_visit_capacity();



-- Supprimer un commentaire si son statut est "supprimé" (vérifié)
-- CREATE OR REPLACE FUNCTION delete_comment_on_status()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     IF NEW.status_avis = 'supprime' THEN
--         DELETE FROM AVIS WHERE id = NEW.id;
--     END IF;
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE OR REPLACE TRIGGER trg_delete_comment_on_status
-- AFTER UPDATE ON AVIS
-- FOR EACH ROW
-- EXECUTE FUNCTION delete_comment_on_status();


-- Supprimer une réservation si son statut est "annulée" (vérifié)
CREATE OR REPLACE FUNCTION delete_reservation_on_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.statut_reservation = 'annulee' THEN
        DELETE FROM RESERVATION WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_delete_reservation_on_status
AFTER UPDATE ON RESERVATION
FOR EACH ROW
EXECUTE FUNCTION delete_reservation_on_status();



