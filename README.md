# OpenApply

OpenApply est une application locale et open source qui aide toute personne à préparer des candidatures ciblées, quel que soit son métier. Elle analyse une offre, signale les compétences à confirmer, adapte un CV et une lettre à partir de faits vérifiés, puis génère des fichiers DOCX et PDF.

## Principes

- **Tous les métiers** : les catégories couvrent notamment le numérique, la santé, l’enseignement, l’industrie, le bâtiment, le commerce, l’hôtellerie, la logistique, l’administration et les fonctions support.
- **Aucune invention** : le moteur utilise seulement les faits saisis dans le profil actif.
- **Données locales** : profils, modèles, clés, offres et documents restent dans `.openapply/` et `generated/`, deux dossiers exclus de Git.
- **Profils isolés** : une candidature ne peut utiliser que les faits et modèles du profil actif.
- **Interface guidée** : le profil et le moteur IA se configurent dans l’application, sans passage obligatoire par le terminal.
- **Sources ouvertes** : licence MIT, tests automatiques et règles de contribution publiques.

## Fonctionnalités

- Jusqu’à 10 offres ou candidatures spontanées par lot.
- Import de liens depuis un collage, un tableau ou une feuille Excel.
- Classification locale par métier, contrat, niveau, langue, mode de travail et outils détectés.
- Veille via Greenhouse, Lever, France Travail et La Bonne Alternance.
- Connexion visuelle à Codex, Google Antigravity, GitHub Copilot CLI, Hermes Agent, Ollama, LM Studio, llama.cpp ou à une API compatible.
- Confirmation des écarts de compétences avant adaptation.
- Génération d’un CV et d’une lettre en DOCX et PDF, avec contrôle LibreOffice sur une page.
- Reprise après interruption, cache local et relance ciblée des seuls postes en échec.

## Installation

Prérequis : Node.js 20 ou plus récent, Python 3 et LibreOffice.

### Windows

```powershell
winget install OpenJS.NodeJS.LTS
winget install TheDocumentFoundation.LibreOffice
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
npm install
npm run doctor
```

Double-clique ensuite sur `start-openapply.cmd`, ou lance `npm start` puis ouvre <http://localhost:4173>.

### macOS

```bash
brew install node
brew install --cask libreoffice
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
npm install
npm run doctor
```

Double-clique ensuite sur `start-openapply.command`, ou lance `npm start`.

## Premier lancement

OpenApply ouvre automatiquement la configuration du profil si les faits ou les modèles manquent. Importe :

1. les faits vérifiés du candidat ;
2. un modèle de CV français et/ou anglais ;
3. un modèle de lettre DOCX ;
4. le moteur IA souhaité.

Chaque utilisateur apporte ses propres modèles. Aucun CV réel n’est fourni dans le dépôt public.

## Confidentialité

Les données locales sont ignorées par Git. Les secrets saisis dans l’interface sont chiffrés au repos dans le coffre local ; la clé de coffre demeure sur le même appareil, ce qui protège contre une lecture accidentelle mais pas contre un compte système déjà compromis. OpenApply écoute uniquement sur `127.0.0.1` et applique des protections de navigateur strictes.

Avant un commit ou une publication :

```bash
npm run privacy:check
npm run check
```

Le premier contrôle bloque les dossiers locaux, les formats de documents personnels et plusieurs formes courantes de secrets. Consulte aussi [PRIVACY.md](PRIVACY.md) et [SECURITY.md](SECURITY.md).

## Moteurs IA et réseau

OpenApply n’envoie une offre et les faits du profil actif qu’au moteur choisi. Un moteur local compatible peut être utilisé pour éviter un service distant. Les appels aux sources d’offres ne sont effectués que lorsque la veille correspondante est configurée et activée.

## Sources d’offres

- Greenhouse et Lever : pages carrières publiques, sans clé.
- France Travail : identifiant client et secret d’une application développeur autorisée pour `Offres d’emploi v2`.
- La Bonne Alternance : jeton pour `Recherche d’opportunités d’emploi en alternance`.
- LinkedIn et Welcome to the Jungle : import manuel lorsque l’accès public automatisé n’est pas disponible.

Les identifiants peuvent être saisis dans l’interface ou fournis par variables d’environnement :

```bash
FRANCE_TRAVAIL_CLIENT_ID="..." \
FRANCE_TRAVAIL_CLIENT_SECRET="..." \
LA_BONNE_ALTERNANCE_TOKEN="..." \
npm start
```

## Stockage personnalisé

Par défaut, les données privées sont stockées dans `.openapply/`. Pour utiliser un autre emplacement local :

```bash
OPENAPPLY_DATA_DIR="/chemin/prive/openapply" npm start
```

## Contribution

Les corrections, traductions et nouveaux métiers sont bienvenus. Lis [CONTRIBUTING.md](CONTRIBUTING.md). En participant, tu acceptes la licence [MIT](LICENSE).