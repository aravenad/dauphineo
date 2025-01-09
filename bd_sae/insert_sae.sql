
-- SITES_PATRIMONIAUX_REMARQUABLES
--COPY SITE_PATRIMONIAUX_REMARQUABLE(id,code_departement,nom_du_departement,nom_commune,capacite_de_visite,mot_cle,is_pmr,temps_de_visite,image)
--FROM 'C:/Users/ferya/Documents/SAE/sites_patrimoniaux_remarquables.csv'
--DELIMITER ';' CSV HEADER;

-- IMAGES
--COPY IMAGES(id,image_url,id_spr)
--FROM 'C:/Users/ferya/Documents/SAE/images.csv'
--DELIMITER ';' CSV HEADER;


\copy SPR (id, code_departement, nom_du_departement, nom_commune, capacite_de_visite, mot_cle, is_pmr, temps_de_visite, image) FROM 'C:/Users/Utilisateur/Desktop/Sarah/rendus-1/bd_sae/sites_patrimoniaux_remarquables.csv' DELIMITER ';' CSV HEADER;
\copy IMAGES(id,image_url,id_spr) FROM 'C:/Users/Utilisateur/Desktop/Sarah/rendus-1/bd_sae/images.csv' DELIMITER ';' CSV HEADER;

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

INSERT INTO RESERVATION (date, heure, prix, statut_reservation, statut_paiement, taille, id_utilisateur, id_visite, id_spr, id_guide)
VALUES 
('2024-03-01', '09:00:00', 15.5, 'confirmee', 'payee', 3, 1, 1, 1, 1),
('2024-03-02', '14:00:00', 12.0, 'confirmee', 'non reglee', 2, 2, 2, 2, 2);

INSERT INTO AVIS (titre, commentaire, note, date_de_publication, status_avis, id_utilisateur, id_spr)
VALUES 
('Super visite', 'Très belle expérience, guide au top !', 5, '2024-03-02 18:00:00', 'publie', 1, 1),
('Moyen', 'Beaucoup de monde, difficile à apprécier.', 3, '2024-03-03 10:00:00', 'publie', 2, 2);



