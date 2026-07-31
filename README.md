# OpenApply

OpenApply est une application locale et open source qui prépare des candidatures ciblées à partir de faits vérifiés. Elle analyse une offre, demande confirmation lorsqu’une compétence manque, adapte les copies d’un CV et d’une lettre, puis produit les fichiers DOCX et PDF.

## Ce que fait OpenApply

- Jusqu’à 10 offres ou candidatures spontanées par lot.
- Import de liens par collage, depuis un tableau ou une feuille Excel.
- Classification locale par métier, contrat, niveau, langue, mode de travail et outils détectés.
- Veille via Greenhouse, Lever, France Travail et La Bonne Alternance.
- Connexion à Codex, Google Antigravity, GitHub Copilot CLI, Hermes Agent, Ollama, LM Studio, llama.cpp ou à une API compatible.
- Confirmation rapide et honnête des écarts de compétences.
- Génération d’un CV et d’une lettre en DOCX et PDF.
- Contrôle LibreOffice pour conserver la mise en page et une page par document.
- Reprise après interruption, cache local et relance des seuls postes en échec.

OpenApply ne modifie jamais les modèles importés. Les profils sont isolés et le moteur n’utilise que les faits du profil actif.

## Installation rapide

Il faut installer trois composants :

- Node.js 20 ou plus récent, avec npm ;
- Python 3, avec le module `venv` ;
- LibreOffice.

Au premier `npm start` ou double-clic sur le lanceur, OpenApply crée automatiquement un environnement Python privé dans `.venv`, installe les modules documentaires et vérifie l’installation. `npm run setup` reste disponible pour relancer cette préparation manuellement.

### Windows 10 et 11

Ouvre PowerShell puis exécute :

```powershell
winget install OpenJS.NodeJS.LTS
winget install Python.Python.3.12
winget install TheDocumentFoundation.LibreOffice
```

Ferme et rouvre PowerShell après l’installation de Node.js. Télécharge ou clone ensuite OpenApply :

```powershell
git clone https://github.com/yvanfocsa/OpenApply.git
cd OpenApply
npm start
```

Tu peux aussi double-cliquer directement sur `start-openapply.cmd`. Le premier lancement prépare l’application, puis ouvre le navigateur. Les lancements suivants sont immédiats.

### macOS

Avec [Homebrew](https://brew.sh/) :

```bash
brew install node python
brew install --cask libreoffice
git clone https://github.com/yvanfocsa/OpenApply.git
cd OpenApply
npm start
```

Tu peux aussi double-cliquer directement sur `start-openapply.command`. Le premier lancement prépare l’application, puis ouvre le navigateur. Si macOS refuse le premier double-clic, ouvre le fichier avec clic droit, puis « Ouvrir ».

### Linux, Debian et Ubuntu

Installe d’abord Node.js 20 ou plus récent depuis [nodejs.org](https://nodejs.org/) ou avec le gestionnaire de versions de ton choix. Installe ensuite les dépendances système :

```bash
sudo apt update
sudo apt install python3 python3-venv python3-pip libreoffice
git clone https://github.com/yvanfocsa/OpenApply.git
cd OpenApply
npm start
```

Pour les lancements suivants, utilise `npm start` ou `./start-openapply.sh`.

### Installation depuis une archive ZIP

Git n’est pas obligatoire. Télécharge l’archive du projet, décompresse-la, ouvre un terminal dans ce dossier puis exécute :

```bash
npm start
```

Après avoir installé Node.js, Python et LibreOffice, `npm start` suffit : la préparation manquante est détectée et lancée automatiquement.

L’application attend que le serveur soit prêt, puis ouvre <http://localhost:4173>. Si elle fonctionne déjà, la commande ouvre simplement l’instance existante.

## Premier lancement

OpenApply guide la création du premier profil. Prépare :

1. les faits vérifiés du candidat ;
2. un modèle de CV français et/ou anglais au format DOCX ;
3. un modèle de lettre au format DOCX ;
4. un moteur IA local, un CLI connecté ou une clé API compatible.

Un seul moteur IA est nécessaire. Les moteurs indiqués comme optionnels par le diagnostic n’empêchent pas le lancement.

Chaque utilisateur apporte ses propres modèles. Aucun CV réel n’est fourni dans le dépôt public.

## Diagnostic et dépannage

La première commande à lancer en cas de problème est :

```bash
npm run doctor
```

Le diagnostic contrôle Node.js, npm, Python, les modules Python, LibreOffice, les droits d’écriture et les moteurs IA détectés. Il affiche une commande de correction adaptée à Windows, macOS ou Linux.

Une version exploitable par un outil automatisé est disponible avec :

```bash
npm run doctor:json
```

Problèmes courants :

- **Node.js trop ancien** : installe la version LTS actuelle, ferme le terminal, puis rouvre-le.
- **Modules Python manquants** : relance `npm run setup`. L’installation reste isolée dans `.venv`.
- **LibreOffice introuvable** : installe l’application complète, puis relance le terminal.
- **Port 4173 occupé** : choisis un autre port. Sous PowerShell, utilise `$env:PORT=4174; npm start`. Sous macOS ou Linux, utilise `PORT=4174 npm start`.
- **Le navigateur ne doit pas s’ouvrir** : utilise `npm run start:server`, ou définis `OPENAPPLY_NO_BROWSER=1` avant `npm start`.
- **Python installé dans un emplacement particulier** : définis `OPENAPPLY_PYTHON` avec le chemin complet de l’exécutable, puis relance `npm run setup`.

## Configuration locale

Les réglages ordinaires se font dans l’interface. Ces variables restent disponibles pour les installations avancées :

| Variable | Utilité | Valeur par défaut |
| --- | --- | --- |
| `PORT` | Port HTTP local | `4173` |
| `OPENAPPLY_DATA_DIR` | Dossier privé des profils et réglages | `.openapply/` |
| `OPENAPPLY_PYTHON` | Chemin d’un interpréteur Python précis | Détection automatique |
| `OPENAPPLY_NO_BROWSER` | Empêche l’ouverture automatique avec la valeur `1` | Désactivé |
| `OPENAPPLY_SKIP_SETUP` | Ignore la préparation automatique avec la valeur `1` | Désactivé |

OpenApply écoute uniquement sur `127.0.0.1`. Il n’expose pas l’interface au réseau local.

## Moteurs IA et confidentialité

OpenApply n’envoie une offre et les faits du profil actif qu’au moteur choisi. Un moteur local comme Ollama, LM Studio ou llama.cpp peut être utilisé lorsque les données ne doivent pas quitter l’appareil.

Les données privées sont enregistrées dans `.openapply/` et `generated/`, deux dossiers exclus de Git. Les secrets saisis dans l’interface sont chiffrés au repos dans le coffre local. La clé du coffre reste sur le même appareil, ce qui protège contre une lecture accidentelle mais pas contre un compte système déjà compromis.

Avant un commit ou une publication :

```bash
npm run privacy:check
npm run check
```

Consulte aussi [PRIVACY.md](PRIVACY.md) et [SECURITY.md](SECURITY.md).

## Sources d’offres

- Greenhouse et Lever : pages carrières publiques, sans clé.
- France Travail : identifiant client et secret d’une application autorisée pour `Offres d’emploi v2`.
- La Bonne Alternance : jeton pour `Recherche d’opportunités d’emploi en alternance`.
- LinkedIn et Welcome to the Jungle : import manuel lorsqu’un accès public automatisé n’est pas disponible.

Les identifiants peuvent être saisis dans l’interface. Les variables d’environnement restent disponibles pour une installation administrée :

```bash
FRANCE_TRAVAIL_CLIENT_ID="..." \
FRANCE_TRAVAIL_CLIENT_SECRET="..." \
LA_BONNE_ALTERNANCE_TOKEN="..." \
npm start
```

## Mise à jour

Depuis un clone Git :

```bash
git pull --ff-only
npm run setup
npm run check
```

Les profils et documents locaux ne sont pas remplacés par cette procédure. Une sauvegarde du dossier défini par `OPENAPPLY_DATA_DIR` reste recommandée avant une mise à jour importante.

## Contribution

Les corrections, traductions et nouveaux métiers sont bienvenus. Lis [CONTRIBUTING.md](CONTRIBUTING.md). En participant, tu acceptes la licence [MIT](LICENSE).
