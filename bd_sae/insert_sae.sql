\copy SPR (id, code_departement, nom_du_departement, nom_commune, capacite_de_visite, mot_cle, is_pmr, temps_de_visite, courte_description, longue_description) FROM 'C:/Users/Damien/Desktop/BUT/2A/SAE3.01/Code/rendus/bd_sae/sites_patrimoniaux_remarquables.csv' DELIMITER ';' CSV HEADER  ENCODING 'UTF-8';
\copy IMAGES(id,image_url,id_spr) FROM 'C:/Users/Damien/Desktop/BUT/2A/SAE3.01/Code/rendus/bd_sae/images.csv' DELIMITER ';' CSV HEADER ENCODING 'UTF-8';

INSERT INTO UTILISATEUR (nom, prenom, mot_de_passe, email, pseudo, verif_age, derniere_activite)
VALUES 
('Dupont', 'Jean', 'mdp123', 'jean.dupont@example.com', 'jeandupont', TRUE, '2024-01-01 12:00:00'),
('Durand', 'Claire', 'pass456', 'claire.durand@example.com', 'clairedu', FALSE, '2024-02-01 14:30:00');

INSERT INTO GUIDE (nom, prenom, mot_de_passe, email, pseudo, verif_age, derniere_activite, id_spr)
VALUES 
('Martin', 'Luc', 'guide123', 'luc.martin@example.com', 'lucmartin', TRUE, '2024-01-15 09:00:00', 1),
('Rousseau', 'Marie', 'guide456', 'marie.rousseau@example.com', 'marierousseau', TRUE, '2024-02-10 10:30:00', 2);

INSERT INTO DISPONIBILITE (date_jour, id_guide, id_creneaux)
VALUES 
('2024-03-01', 1, 1),
('2024-03-02', 2, 2);

INSERT INTO VISITE (capacite_actuelle, capacite_max, date_visite, id_spr, id_disponibilite)
VALUES 
(20, 50, '2024-03-01', 1, 1),
(10, 30, '2024-03-02', 2, 2);

INSERT INTO RESERVATION (prix, statut_reservation, statut_paiement, taille, id_utilisateur, id_visite, id_spr, id_guide)
VALUES 
(15.5, 'confirmee', 'payee', 3, 1, 1, 1, 1),
( 12.0, 'confirmee', 'non_reglee', 2, 2, 2, 2, 2),
( 12.0, 'confirmee', 'non_reglee', 2, 1, 2, 2, 2),
( 12.0, 'confirmee', 'non_reglee', 2, 1, 2, 3, 2),
( 12.0, 'confirmee', 'non_reglee', 2, 1, 2, 3, 2),
( 12.0, 'confirmee', 'non_reglee', 2, 1, 2, 3, 2);

INSERT INTO AVIS (titre, commentaire, note, id_utilisateur, id_spr, created_at)
VALUES 
('Super visite', 'Très belle expérience, guide au top !', 5, 1, 1, CURRENT_TIMESTAMP),
('Moyen', 'Beaucoup de monde, difficile à apprécier.', 3, 2, 2, CURRENT_TIMESTAMP),
('Très bien', 'Visite très intéressante, guide très sympa.', 4, 1, 2, CURRENT_TIMESTAMP),
('Avis', 'Avis', 2, 1, 3, CURRENT_TIMESTAMP),
('Avis', 'Avis', 2, 1, 3, CURRENT_TIMESTAMP),
('Avis', 'Avis', 2, 1, 3, CURRENT_TIMESTAMP);
