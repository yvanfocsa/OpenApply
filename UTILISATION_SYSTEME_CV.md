# Utiliser OpenApply

## 1. Créer le profil

Ouvre les réglages du profil, indique un nom, les domaines recherchés et les faits vérifiés : expériences, études, compétences, langues et contraintes utiles. N’ajoute pas de secret ni de donnée sans rapport avec une candidature.

Importe ensuite les modèles DOCX du profil. OpenApply travaille sur des copies et ne modifie jamais ces sources.

## 2. Connecter un moteur

Choisis un moteur dans les réglages. L’assistant visuel indique si une installation, une connexion de compte ou une clé API est nécessaire. Un moteur local est préférable lorsque les données ne doivent pas quitter l’appareil.

## 3. Ajouter les cibles

Colle jusqu’à 10 liens, une colonne de tableur, le texte d’une offre ou une candidature spontanée. Le contrat et la langue peuvent rester en mode automatique ou être imposés manuellement.

## 4. Confirmer les écarts

OpenApply compare les exigences de l’offre aux faits du profil. Confirme le niveau réel pour chaque compétence importante. Une réponse ne doit jamais exagérer l’expérience.

## 5. Générer et contrôler

Le moteur adapte les copies du CV et de la lettre. LibreOffice vérifie ensuite le rendu PDF et la limite d’une page. Les résultats se trouvent sous `generated/<profil>/` et peuvent être téléchargés depuis l’interface.

## 6. Protéger les données

Ne place jamais `.openapply/`, `generated/`, un CV, une lettre, une clé ou un export de candidature dans Git. Exécute `npm run privacy:check` avant toute publication.