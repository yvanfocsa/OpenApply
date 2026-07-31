# Utiliser OpenApply

## Avant de commencer

Le premier double-clic sur le lanceur Windows ou macOS prépare automatiquement les modules documentaires. Une installation fonctionnelle doit ensuite afficher uniquement des contrôles obligatoires en vert avec :

```bash
npm run doctor
```

Les moteurs IA absents sont marqués comme optionnels. Un seul moteur prêt suffit.

## 1. Créer un profil

Au premier lancement, ouvre les réglages du profil et renseigne :

- le nom du profil ;
- les domaines et contrats recherchés ;
- les expériences, études, compétences et langues vérifiées ;
- les contraintes utiles aux candidatures.

Importe ensuite les modèles DOCX de ce profil. OpenApply travaille toujours sur des copies et ne modifie jamais les fichiers sources.

Chaque personne doit disposer de son propre profil. Les faits et modèles d’un autre profil ne sont jamais réutilisés.

## 2. Connecter un moteur

Choisis un moteur dans les réglages. L’assistant indique si une installation, une connexion de compte ou une clé API est nécessaire. Un moteur local est préférable lorsque les données ne doivent pas quitter l’appareil.

Il n’est pas nécessaire de configurer tous les moteurs. Après une première connexion, utilise le bouton de vérification affiché dans l’interface.

## 3. Ajouter les candidatures

Tu peux coller :

- un lien d’offre ;
- plusieurs liens, avec un lien par ligne ;
- une colonne copiée depuis un tableur ;
- le texte complet d’une offre ;
- une cible de candidature spontanée.

Le contrat, la langue et le domaine peuvent rester en mode automatique ou être imposés. Un choix manuel l’emporte toujours sur la détection.

## 4. Confirmer les écarts

OpenApply compare les exigences de l’offre aux faits du profil. Pour chaque compétence importante, indique rapidement le niveau réel : professionnel, encadré, projet, notions ou jamais pratiqué.

Les champs de commentaire sont facultatifs. Utilise-les seulement lorsqu’un contexte court peut améliorer la formulation sans exagérer l’expérience.

## 5. Générer et contrôler

Le moteur adapte une copie du CV et de la lettre. LibreOffice génère ensuite les PDF et vérifie que chaque document tient sur une page.

Les résultats se trouvent sous `generated/<profil>/` et peuvent être téléchargés depuis l’interface en DOCX ou PDF.

En cas d’interruption ou de quota épuisé, reprends la candidature depuis l’étape enregistrée avec un autre moteur. Les offres déjà analysées et les documents déjà validés ne doivent pas être recalculés.

## 6. Suivre les candidatures

Classe les candidatures par catégorie et mets à jour leur statut : à préparer, envoyée, à relancer, entretien, acceptée, refusée ou archivée. La sélection multiple permet d’appliquer un statut ou une catégorie à plusieurs candidatures en une seule action.

## 7. Protéger les données

Ne place jamais `.openapply/`, `generated/`, un CV, une lettre, une clé ou un export de candidature dans Git.

Avant une publication :

```bash
npm run privacy:check
```

Pour changer l’emplacement des données privées, définis `OPENAPPLY_DATA_DIR` avant le lancement. Consulte le [guide d’installation](README.md#installation-rapide) pour les commandes Windows, macOS et Linux.
