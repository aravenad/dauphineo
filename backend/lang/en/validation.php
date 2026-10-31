<?php

// Les messages anglais viennent de Laravel ; ce fichier ne fait que nommer les champs de l'API
// et reprendre les messages propres au site.

return [

    'custom' => [
        'nom' => [
            'regex' => 'The last name may only contain letters, spaces, apostrophes and hyphens.',
        ],
        'prenom' => [
            'regex' => 'The first name may only contain letters, spaces, apostrophes and hyphens.',
        ],
        'email' => [
            'unique' => 'This email address is already used by another account.',
        ],
    ],

    'attributes' => [
        'cadre' => 'setting',
        'commentaire' => 'comment',
        'duree' => 'duration',
        'email' => 'email address',
        'id_spr' => 'site',
        'id_visite' => 'tour',
        'interets' => 'themes',
        'interets.*' => 'theme',
        'jeton' => 'activation link',
        'langue' => 'language',
        'mot_de_passe' => 'password',
        'mot_de_passe_actuel' => 'current password',
        'nom' => 'last name',
        'note' => 'rating',
        'password' => 'password',
        'pmr' => 'wheelchair access',
        'prenom' => 'first name',
        'taille' => 'number of people',
        'taille_groupe' => 'group size',
        'titre' => 'title',
        'verif_age' => 'age confirmation',
    ],

];
