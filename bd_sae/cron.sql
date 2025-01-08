SELECT cron.schedule(
    'DeleteInactiveUsers', -- Nom de la tâche
    '0 0 * * *',           -- Planification (minuit, tous les jours)
    $$SELECT delete_inactive_users();$$ -- Appel de la fonction
);




select * from cron.job;



