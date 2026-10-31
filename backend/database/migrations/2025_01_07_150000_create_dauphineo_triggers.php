<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Triggers PL/pgSQL écrits pendant la SAÉ (anciennement bd_sae/triggers.sql),
 * repris dans une migration pour que `php artisan migrate` suffise.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Génère les créneaux d'un SPR selon son temps de visite :
        // journée de 8 h à 18 h, 15 min entre deux visites, une pause d'une heure à partir de 11 h.
        // Les calculs se font en INTERVAL pour éviter le passage de minuit des valeurs TIME.
        DB::unprepared(<<<'SQL'
            CREATE OR REPLACE FUNCTION generate_creneaux()
            RETURNS TRIGGER AS $$
            DECLARE
                debut CONSTANT INTERVAL := INTERVAL '08:00';
                fin CONSTANT INTERVAL := INTERVAL '18:00';
                pause_min CONSTANT INTERVAL := INTERVAL '11:00';
                duree INTERVAL := NEW.temps_de_visite::INTERVAL;
                horaire INTERVAL := debut;
                pause_prise BOOLEAN := FALSE;
            BEGIN
                IF duree <= INTERVAL '0' THEN
                    RETURN NEW;
                END IF;

                LOOP
                    IF NOT pause_prise AND horaire >= pause_min THEN
                        -- Le quart d'heure entre deux visites compte dans la pause
                        horaire := horaire + CASE WHEN horaire = debut THEN INTERVAL '01:00' ELSE INTERVAL '00:45' END;
                        pause_prise := TRUE;
                    END IF;

                    EXIT WHEN horaire + duree > fin;

                    INSERT INTO creneaux (heure_debut, heure_fin, id_spr)
                    VALUES (TIME '00:00' + horaire, TIME '00:00' + horaire + duree, NEW.id);

                    horaire := horaire + duree + INTERVAL '00:15';
                END LOOP;

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER trg_generate_creneaux
            AFTER INSERT ON spr
            FOR EACH ROW
            EXECUTE FUNCTION generate_creneaux();
        SQL);

        // Crée une visite dès qu'un guide se déclare disponible sur un créneau.
        // capacite_actuelle compte les places restantes : elle part donc de la capacité du SPR.
        DB::unprepared(<<<'SQL'
            CREATE OR REPLACE FUNCTION create_visit_on_guide_availability()
            RETURNS TRIGGER AS $$
            DECLARE
                spr_id BIGINT;
                capacite INTEGER;
            BEGIN
                SELECT c.id_spr, s.capacite_de_visite INTO spr_id, capacite
                FROM creneaux c
                JOIN spr s ON s.id = c.id_spr
                WHERE c.id = NEW.id_creneaux;

                INSERT INTO visite (capacite_actuelle, capacite_max, date_visite, id_spr, id_disponibilite)
                VALUES (capacite, capacite, NEW.date_jour, spr_id, NEW.id);

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER create_visit_trigger
            AFTER INSERT ON disponibilite
            FOR EACH ROW
            EXECUTE FUNCTION create_visit_on_guide_availability();
        SQL);

        // Réserve les places avant l'insertion. La mise à jour conditionnelle verrouille la ligne de
        // la visite, donc deux réservations simultanées ne peuvent pas dépasser la capacité.
        DB::unprepared(<<<'SQL'
            CREATE OR REPLACE FUNCTION manage_visit_capacity()
            RETURNS TRIGGER AS $$
            BEGIN
                IF TG_OP = 'INSERT' THEN
                    UPDATE visite
                    SET capacite_actuelle = capacite_actuelle - NEW.taille
                    WHERE id = NEW.id_visite AND capacite_actuelle >= NEW.taille;

                    IF NOT FOUND THEN
                        RAISE EXCEPTION 'Capacité dépassée pour la visite.' USING ERRCODE = 'P0001';
                    END IF;

                    RETURN NEW;
                END IF;

                UPDATE visite
                SET capacite_actuelle = capacite_actuelle + OLD.taille
                WHERE id = OLD.id_visite;

                RETURN OLD;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER trigger_reserve_visit_capacity
            BEFORE INSERT ON reservation
            FOR EACH ROW
            EXECUTE FUNCTION manage_visit_capacity();

            CREATE TRIGGER trigger_release_visit_capacity
            AFTER DELETE ON reservation
            FOR EACH ROW
            EXECUTE FUNCTION manage_visit_capacity();
        SQL);

        // Une réservation annulée est supprimée, ce qui libère ses places.
        DB::unprepared(<<<'SQL'
            CREATE OR REPLACE FUNCTION delete_reservation_on_status()
            RETURNS TRIGGER AS $$
            BEGIN
                IF NEW.statut_reservation = 'annulee' THEN
                    DELETE FROM reservation WHERE id = NEW.id;
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER trg_delete_reservation_on_status
            AFTER UPDATE OF statut_reservation ON reservation
            FOR EACH ROW
            EXECUTE FUNCTION delete_reservation_on_status();
        SQL);
    }

    public function down(): void
    {
        DB::unprepared(<<<'SQL'
            DROP TRIGGER IF EXISTS trg_delete_reservation_on_status ON reservation;
            DROP TRIGGER IF EXISTS trigger_release_visit_capacity ON reservation;
            DROP TRIGGER IF EXISTS trigger_reserve_visit_capacity ON reservation;
            DROP TRIGGER IF EXISTS create_visit_trigger ON disponibilite;
            DROP TRIGGER IF EXISTS trg_generate_creneaux ON spr;
            DROP FUNCTION IF EXISTS delete_reservation_on_status();
            DROP FUNCTION IF EXISTS manage_visit_capacity();
            DROP FUNCTION IF EXISTS create_visit_on_guide_availability();
            DROP FUNCTION IF EXISTS generate_creneaux();
        SQL);
    }
};
