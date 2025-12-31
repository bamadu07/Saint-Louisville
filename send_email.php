<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Vérification honeypot
    if (!empty($_POST['website'])) {
        echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès !']);
        exit;
    }
    
    // Nettoyage des données
    $nom = htmlspecialchars(strip_tags(trim($_POST['nom'])));
    $prenom = htmlspecialchars(strip_tags(trim($_POST['prenom'])));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $telephone = htmlspecialchars(strip_tags(trim($_POST['telephone'] ?? 'Non spécifié')));
    $adresse = htmlspecialchars(strip_tags(trim($_POST['adresse'] ?? 'Non spécifiée')));
    $service = htmlspecialchars(strip_tags(trim($_POST['service'])));
    $sujet = htmlspecialchars(strip_tags(trim($_POST['sujet'])));
    $message = htmlspecialchars(strip_tags(trim($_POST['message'])));
    $newsletter = isset($_POST['newsletter']) ? 'Oui' : 'Non';
    
    // Validation
    $errors = [];
    if (empty($nom)) $errors[] = "Le nom est obligatoire";
    if (empty($prenom)) $errors[] = "Le prénom est obligatoire";
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "L'email est invalide";
    if (empty($service)) $errors[] = "Le service est obligatoire";
    if (empty($sujet)) $errors[] = "Le sujet est obligatoire";
    if (empty($message)) $errors[] = "Le message est obligatoire";
    
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'message' => implode("<br>", $errors)]);
        exit;
    }
    
    // Destinataire principal
    $destinataire = "o.ndiaye@bcmgroupe.com";
    $sujet_email = "[Mairie Saint-Louis] $sujet - Service: $service";
    
    // Construction du message HTML
    $corps_html = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0a3d62; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .section { margin-bottom: 25px; padding-bottom: 25px; border-bottom: 1px solid #eee; }
            .section:last-child { border-bottom: none; }
            .section-title { color: #0a3d62; font-weight: 600; margin-bottom: 15px; font-size: 1.2rem; }
            .info-item { margin-bottom: 10px; }
            .label { font-weight: 600; color: #333; }
            .value { color: #555; }
            .message-box { background-color: white; padding: 15px; border-left: 4px solid #f6b93b; margin: 15px 0; border-radius: 4px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Nouveau message - Mairie de Saint-Louis</h1>
            </div>
            <div class='content'>
                <div class='section'>
                    <h2 class='section-title'>Informations du citoyen</h2>
                    <div class='info-item'><span class='label'>Nom :</span> <span class='value'>$nom $prenom</span></div>
                    <div class='info-item'><span class='label'>Email :</span> <span class='value'><a href='mailto:$email'>$email</a></span></div>
                    <div class='info-item'><span class='label'>Téléphone :</span> <span class='value'><a href='tel:$telephone'>$telephone</a></span></div>
                    <div class='info-item'><span class='label'>Adresse :</span> <span class='value'>$adresse</span></div>
                </div>
                
                <div class='section'>
                    <h2 class='section-title'>Détails de la demande</h2>
                    <div class='info-item'><span class='label'>Service concerné :</span> <span class='value'>$service</span></div>
                    <div class='info-item'><span class='label'>Sujet :</span> <span class='value'>$sujet</span></div>
                    <div class='info-item'><span class='label'>Inscription newsletter :</span> <span class='value'>$newsletter</span></div>
                </div>
                
                <div class='section'>
                    <h2 class='section-title'>Message</h2>
                    <div class='message-box'>
                        " . nl2br($message) . "
                    </div>
                </div>
            </div>
            <div class='footer'>
                <p>Message envoyé depuis le formulaire de contact du site Mairie de Saint-Louis</p>
                <p>Date : " . date('d/m/Y H:i') . " | IP : " . $_SERVER['REMOTE_ADDR'] . "</p>
                <p>⚠️ Réponse requise dans les 48h</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Version texte
    $corps_text = "
    NOUVEAU MESSAGE DU SITE MAIRIE DE SAINT-LOUIS
    
    INFORMATIONS DU CITOYEN
    -----------------------
    Nom: $nom $prenom
    Email: $email
    Téléphone: $telephone
    Adresse: $adresse
    
    DÉTAILS DE LA DEMANDE
    ---------------------
    Service concerné: $service
    Sujet: $sujet
    Newsletter: $newsletter
    
    MESSAGE
    -------
    $message
    
    ---
    Date: " . date('d/m/Y H:i') . "
    IP: " . $_SERVER['REMOTE_ADDR'] . "
    Page: Formulaire de contact
    ";
    
    // En-têtes pour email multipart
    $boundary = uniqid('np');
    $headers = "From: $nom $prenom <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/alternative; boundary=\"$boundary\"\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Corps du message multipart
    $message_body = "--$boundary\r\n";
    $message_body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $message_body .= "Content-Transfer-Encoding: quoted-printable\r\n\r\n";
    $message_body .= quoted_printable_encode($corps_text) . "\r\n";
    
    $message_body .= "--$boundary\r\n";
    $message_body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $message_body .= "Content-Transfer-Encoding: quoted-printable\r\n\r\n";
    $message_body .= quoted_printable_encode($corps_html) . "\r\n";
    
    $message_body .= "--$boundary--";
    
    // Envoi de l'email principal
    $email_sent = mail($destinataire, $sujet_email, $message_body, $headers);
    
    if ($email_sent) {
        // Accusé de réception
        $accuse_sujet = "Accusé de réception - Mairie de Saint-Louis";
        $accuse_corps = "
        Bonjour $prenom $nom,
        
        Nous accusons réception de votre message concernant : $sujet
        
        Votre demande a été transmise au service $service qui la traitera dans les meilleurs délais.
        
        Nous vous répondrons à l'adresse email : $email
        
        Récapitulatif de votre message :
        --------------------------------
        Service: $service
        Sujet: $sujet
        
        Message:
        $message
        
        Nous vous remercions pour votre confiance et nous vous contacterons très prochainement.
        
        Cordialement,
        L'équipe de la Mairie de Saint-Louis
        
        📞 Téléphone : +221 33 961 10 10
        📧 Email : o.ndiaye@bcmgroupe.com
        📍 Adresse : Place Faidherbe, Île de Saint-Louis
        
        ---
        Ceci est un message automatique, merci de ne pas y répondre.
        Date : " . date('d/m/Y H:i') . "
        ";
        
        $accuse_headers = "From: Mairie de Saint-Louis <noreply@mairie-saintlouis.sn>\r\n";
        $accuse_headers .= "Content-Type: text/plain; charset=utf-8\r\n";
        
        // Envoyer l'accusé de réception
        mail($email, $accuse_sujet, $accuse_corps, $accuse_headers);
        
        // Sauvegarde dans un fichier log
        $log_entry = date('Y-m-d H:i:s') . " | Nom: $nom $prenom | Email: $email | Service: $service | Sujet: $sujet\n";
        @file_put_contents('messages_log.txt', $log_entry, FILE_APPEND);
        
        echo json_encode(['success' => true, 'message' => 'Votre message a bien été envoyé ! Un accusé de réception vous a été envoyé par email.']);
    } else {
        echo json_encode(['success' => false, 'message' => "Erreur d'envoi. Veuillez réessayer ou nous contacter directement."]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
}
?>