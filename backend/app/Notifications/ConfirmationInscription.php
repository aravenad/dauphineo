<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Lien d'activation envoyé à une adresse encore inconnue : le compte n'est créé qu'à son ouverture.
 */
class ConfirmationInscription extends Notification
{
    public function __construct(public readonly string $lien) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Activez votre compte Dauphinéo')
            ->greeting('Bonjour,')
            ->line('Vous avez demandé la création d\'un compte Dauphinéo avec cette adresse e-mail.')
            ->action('Activer mon compte', $this->lien)
            ->line('Ce lien reste valable 24 heures.')
            ->line('Si vous n\'êtes pas à l\'origine de cette demande, ignorez ce message : aucun compte ne sera créé.')
            ->salutation('L\'équipe Dauphinéo');
    }
}
