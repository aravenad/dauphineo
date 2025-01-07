--Générer des créneaux en fonction des horaires et du temps de visite
CREATE OR REPLACE FUNCTION generate_creneaux()
RETURNS TRIGGER AS $$
DECLARE
    debut TIME := '08:00:00'; -- Heure de début de la journée
    fin TIME := '18:00:00'; -- Heure de fin de la journée
    pause_min TIME := '11:00:00'; -- Début possible de la pause
    pause_max TIME := '14:00:00'; -- Fin possible de la pause
    temps_visite INTERVAL := NEW.temps_de_visite; -- Durée de la visite pour le SPR
    horaire TIME; -- Heure courante pour les créneaux
    pause_duree INTERVAL := INTERVAL '01:00:00'; -- Durée de la pause déjeuner
    pause_debut TIME := NULL; -- Heure réelle du début de la pause de midi
    horaire_fin_visite TIME; -- Heure de fin du créneau
    visite_precedente TIME := NULL; -- Heure de fin de la dernière visite
BEGIN
    horaire := debut;

    WHILE horaire < fin LOOP
    --si une visite a eu lieu juste avant
        IF visite_precedente IS NOT NULL THEN
            horaire := horaire+INTERVAL '00:15:00';
        END IF;

        -- Calcule l'heure de fin de la visite courante
        horaire_fin_visite := horaire + temps_visite;

        -- Vérifie si la visite courante peut se terminer
        IF horaire_fin_visite <= fin THEN
            --cas où il est l'heure de prendre la pause (l'heure courante est comprise dans l'interval 11h -> 14h)
            IF horaire>=pause_min AND pause_debut IS NULL THEN
                pause_debut := horaire;
                IF visite_precedente IS NOT NULL THEN
                    horaire := horaire+ INTERVAL '00:45:00';
                ELSE
                    horaire := horaire+ INTERVAL '01:00:00';
                END IF;
                CONTINUE;

            ELSE
                INSERT INTO CRENEAUX (heure_debut, heure_fin, id_spr)   VALUES (horaire, horaire_fin_visite, NEW.id);
                horaire := horaire_fin_visite;
                visite_precedente := horaire_fin_visite;
                CONTINUE;
            END IF;

        visite_precedente := NULL;
        END IF;
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Trigger associé à la fonction
CREATE OR REPLACE TRIGGER trg_generate_creneaux
AFTER INSERT ON SPR
FOR EACH ROW
EXECUTE FUNCTION generate_creneaux();