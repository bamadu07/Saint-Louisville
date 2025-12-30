<?php
// Version simplifiée pour tests
header('Content-Type: application/json');

$data = [
    'success' => true,
    'message' => 'Message reçu! (Mode test - Configurez votre serveur pour les emails réels)',
    'data' => $_POST
];

echo json_encode($data);

// Enregistrer dans un fichier log pour vérification
$log = date('Y-m-d H:i:s') . " - " . json_encode($_POST) . "\n";
file_put_contents('contact_log.txt', $log, FILE_APPEND);
?>
<?php
// Configuration de l'envoi d'email
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupération et sécurisation des données
    $nom = htmlspecialchars(trim($_POST['nom']));
    $prenom = htmlspecialchars(trim($_POST['prenom']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $telephone = htmlspecialchars(trim($_POST['telephone'] ?? 'Non spécifié'));
    $adresse = htmlspecialchars(trim($_POST['adresse'] ?? 'Non spécifiée'));
    $service = htmlspecialchars(trim($_POST['service']));
    $sujet = htmlspecialchars(trim($_POST['sujet']));
    $message = htmlspecialchars(trim($_POST['message']));
    $newsletter = isset($_POST['newsletter']) ? 'Oui' : 'Non';
    
    // Validation
    if (empty($nom) || empty($prenom) || empty($email) || empty($service) || empty($sujet) || empty($message)) {
        echo json_encode(['success' => false, 'message' => 'Tous les champs obligatoires doivent être remplis.']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Adresse email invalide.']);
        exit;
    }
    
    // Destinataire
    $destinataire = "o.ndiaye@bcmgroupe.com";
    $sujet_email = "[Mairie Saint-Louis] $sujet - Service: $service";
    
    // Construction du message
    $corps = "
    NOUVEAU MESSAGE DU SITE MAIRIE DE SAINT-LOUIS
    =============================================
    
    INFORMATIONS DU CONTACT
    -----------------------
    Nom: $nom $prenom
    Email: $email
    Téléphone: $telephone
    Adresse: $adresse
    Service concerné: $service
    
    MESSAGE
    -------
    $message
    
    ---
    INSCRIPTION NEWSLETTER: $newsletter
    DATE D'ENVOI: " . date('d/m/Y à H:i') . "
    ADRESSE IP: " . $_SERVER['REMOTE_ADDR'] . "
    ";
    
    // En-têtes
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    
    // Envoi de l'email
    if (mail($destinataire, $sujet_email, $corps, $headers)) {
        // Envoyer un accusé de réception à l'utilisateur
        $accuse_sujet = "Accusé de réception - Mairie de Saint-Louis";
        $accuse_message = "
        Cher(e) $prenom $nom,
        
        Nous accusons réception de votre message concernant : \"$sujet\"
        
        Notre équipe du service $service traitera votre demande dans les plus brefs délais.
        
        Voici un récapitulatif de votre message :
        ----------------------------------------
        $message
        
        ---
        Cordialement,
        L'équipe municipale de Saint-Louis
        Place Faidherbe, Île de Saint-Louis, Sénégal
        Tél: +221 33 961 10 10
        Email: o.ndiaye@bcmgroupe.com
        ";
        
        $accuse_headers = "From: Mairie de Saint-Louis <o.ndiaye@bcmgroupe.com>\r\n";
        $accuse_headers .= "Reply-To: o.ndiaye@bcmgroupe.com\r\n";
        $accuse_headers .= "Content-Type: text/plain; charset=utf-8\r\n";
        
        mail($email, $accuse_sujet, $accuse_message, $accuse_headers);
        
        echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès ! Vous recevrez un accusé de réception par email.']);
    } else {
        echo json_encode(['success' => false, 'message' => "Erreur lors de l'envoi du message. Veuillez réessayer ou nous contacter directement par téléphone."]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode de requête non autorisée.']);
}
?>