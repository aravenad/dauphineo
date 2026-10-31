<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Envoyé à la place du lien d'activation quand l'adresse a déjà un compte : l'API répond pareil
 * dans les deux cas, seule la personne qui lit cette boîte apprend que le compte existe.
 */
class CompteExistant extends Notification
{
    public function __construct(public readonly string $lien) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Vous avez déjà un compte Dauphinéo')
            ->greeting('Bonjour,')
            ->line('Quelqu\'un vient de demander la création d\'un compte Dauphinéo avec cette adresse e-mail, mais vous en avez déjà un.')
            ->action('Me connecter', $this->lien)
            ->line('Si vous n\'êtes pas à l\'origine de cette demande, ignorez ce message : votre compte n\'a pas changé.')
            ->salutation('L\'équipe Dauphinéo');
    }
}
