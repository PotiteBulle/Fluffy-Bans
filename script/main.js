// Attend que le DOM soit complètement chargé avant d'exécuter le code
document.addEventListener('DOMContentLoaded', () => {
    // Récupère les éléments HTML nécessaires
    const fileInput = document.getElementById('fileInput'); // Input pour sélectionner le fichier
    const readButton = document.getElementById('readButton'); // Bouton pour lire le fichier
    const downloadButton = document.getElementById('downloadButton'); // Bouton pour télécharger la liste
    const banList = document.getElementById('banList'); // Liste des Utilisateurices Banni.e.s

    let utilisateursBannis = []; // Tableau pour stocker les Utilisateurices Banni.e.s

    // Ajoute un écouteur d'événement au bouton "Lire le fichier"
    readButton.addEventListener('click', lireFichier);

    // Ajoute un écouteur d'événement au bouton "Télécharger la liste"
    downloadButton.addEventListener('click', telechargerListe);

    // Fonction pour lire le fichier CSV sélectionné
    function lireFichier() {
        const fichier = fileInput.files[0]; // Récupère le fichier sélectionné dans l'input
        // Vérifie si un fichier a été sélectionné
        if (!fichier) {
            alert("Veuillez sélectionner un fichier CSV.");
            return;
        }

        const reader = new FileReader(); // Crée un objet FileReader pour lire le contenu du fichier
        // Fonction exécutée lorsque le fichier est chargé
        reader.onload = e => analyserCSV(e.target.result);
        // Fonction exécutée en cas d'erreur de lecture du fichier
        reader.onerror = () => alert("Erreur lors de la lecture du fichier.");
        reader.readAsText(fichier); // Lit le contenu du fichier en tant que texte
    }

    // Fonction pour analyser le contenu CSV
    function analyserCSV(contenu) {
        Papa.parse(contenu, {
            header: true, // Indique que la première ligne contient les noms de colonnes
            complete: resultats => {
                // Mappe les données pour récupérer les usernames et filtre les valeurs non définies
                utilisateursBannis = resultats.data.map(row => row['userName']).filter(Boolean);
                afficherUtilisateurs(utilisateursBannis); // Affiche les Utilisateurices Banni.e.s dans l'interface
                downloadButton.classList.remove('hidden'); // Affiche le bouton de téléchargement
                banList.classList.remove('hidden'); // Affiche la liste des Utilisateurices Banni.e.s
            },
            error: error => alert("Erreur lors de l'analyse du fichier CSV: " + error.message)
        });
    }

    // Fonction pour afficher les Utilisateurices Banni.e.s dans la liste
    function afficherUtilisateurs(utilisateurs) {
        banList.innerHTML = ''; // Efface la liste précédente des Utilisateurices Banni.e.s
        utilisateurs.forEach(utilisateur => {
            const li = document.createElement('li'); // Crée un élément <li> pour chaque Utilisateurices
            li.textContent = utilisateur; // Ajoute le nom d'Utilisateurices au texte de l'élément <li>
            banList.appendChild(li); // Ajoute l'élément <li> à la liste des Utilisateurices Banni.e.s
        });
    }

    // Fonction pour télécharger la liste des Utilisateurices Banni.e.s au format texte
    function telechargerListe() {
        const contenuTexte = utilisateursBannis.join('\n'); // Convertit le tableau en texte avec un.e Utilisateurices par ligne
        const blob = new Blob([contenuTexte], { type: 'text/plain' }); // Crée un Blob à partir du texte
        const url = URL.createObjectURL(blob); // Crée une URL pour le Blob
        const a = document.createElement('a'); // Crée un élément <a> pour le téléchargement
        a.href = url; // Spécifie l'URL du lien
        a.download = 'ban_list.txt'; // Nom du fichier à télécharger
        document.body.appendChild(a); // Ajoute le lien au corps du document
        a.click(); // Déclenche le téléchargement en simulant un clic sur le lien
        document.body.removeChild(a); // Supprime le lien du document après le téléchargement
        URL.revokeObjectURL(url); // Libère les ressources de l'URL créée
    }
});
