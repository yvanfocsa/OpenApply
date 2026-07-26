# Sécurité

## Signaler une vulnérabilité

Ne publie pas de secret, de donnée personnelle ni de détail d’exploitation dans une issue publique. Utilise la fonction privée « Report a vulnerability » de l’onglet Security du dépôt GitHub. Si elle n’est pas disponible sur un fork, contacte son mainteneur par un canal privé.

Indique la version, le système, l’impact, les étapes minimales de reproduction et une proposition de correction si possible. Supprime toute donnée réelle de la démonstration.

## Modèle de sécurité

OpenApply écoute sur `127.0.0.1`, refuse les origines navigateur étrangères et applique une politique de contenu restrictive. Les données privées sont exclues de Git et les secrets sont chiffrés au repos. Le logiciel n’est cependant pas une frontière de sécurité contre un compte système compromis, un moteur IA malveillant ou un fork modifié.

## Bonnes pratiques

- Installe uniquement les moteurs et dépendances depuis leurs sources officielles.
- Utilise des clés dédiées avec les droits minimaux et renouvelle toute clé exposée.
- Ne rends pas le port OpenApply accessible sur Internet.
- Vérifie les changements et exécute `npm run check` avant publication.
- Ne joins jamais un vrai document candidat à un rapport public.