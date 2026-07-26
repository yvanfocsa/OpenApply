# Confidentialité

OpenApply est conçu pour une utilisation locale. Ce document décrit le comportement du logiciel distribué dans ce dépôt ; une version modifiée ou hébergée par un tiers peut se comporter différemment.

## Données conservées localement

Le dossier `.openapply/` contient les profils, modèles, réglages, caches, confirmations, historiques et secrets chiffrés. Le dossier `generated/` contient les candidatures produites. Ces emplacements sont exclus de Git.

La clé du coffre et les secrets chiffrés résident sur le même appareil. Ce mécanisme limite l’exposition accidentelle des fichiers, mais ne protège pas contre une personne ou un logiciel ayant déjà accès au compte système de l’utilisateur.

## Données transmises

Quand un moteur IA distant est choisi, OpenApply lui transmet les éléments nécessaires à la tâche : contenu de l’offre, faits du profil actif, confirmations et consignes de génération. Les conditions et politiques du fournisseur choisi s’appliquent. Avec un moteur local, ces données peuvent rester sur l’appareil.

La veille contacte uniquement les sources configurées. OpenApply n’intègre aucun outil publicitaire ni télémétrie applicative.

## Contrôle et suppression

L’utilisateur peut supprimer ses profils et sorties depuis son appareil. Pour une suppression complète, fermer OpenApply puis effacer les dossiers privés configurés. Une sauvegarde système ou cloud peut conserver des copies selon les réglages de l’ordinateur.

## Publication

N’ajoute jamais de vrais CV, lettres, journaux, clés, jetons ou dossiers locaux au dépôt. `npm run privacy:check` fournit un contrôle préventif, sans remplacer une revue humaine.