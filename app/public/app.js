import {
  extractClipboardOfferLinks,
  extractOfferLinks,
  mergePastedOfferLinks,
} from "./link-import.js";

const form = document.querySelector("#jobForm");
const topNewApplicationButton = document.querySelector("#topNewApplicationButton");
const libraryNewApplicationButton = document.querySelector("#libraryNewApplicationButton");
const librarySearchField = document.querySelector("#librarySearchField");
const applicationsTotal = document.querySelector("#applicationsTotal");
const applicationsSummary = document.querySelector("#applicationsSummary");
const libraryStatusFilters = document.querySelector("#libraryStatusFilters");
const filterAllCount = document.querySelector("#filterAllCount");
const filterActiveCount = document.querySelector("#filterActiveCount");
const filterFollowUpCount = document.querySelector("#filterFollowUpCount");
const filterClosedCount = document.querySelector("#filterClosedCount");
const libraryAnnouncement = document.querySelector("#libraryAnnouncement");
const applicationsPane = document.querySelector(".applications-pane");
const librarySelectionToggle = document.querySelector("#librarySelectionToggle");
const libraryBulkPanel = document.querySelector("#libraryBulkPanel");
const libraryBulkSelectedCount = document.querySelector("#libraryBulkSelectedCount");
const libraryBulkSelectedLabel = document.querySelector("#libraryBulkSelectedLabel");
const librarySelectAllButton = document.querySelector("#librarySelectAllButton");
const libraryBulkCategory = document.querySelector("#libraryBulkCategory");
const libraryBulkStatus = document.querySelector("#libraryBulkStatus");
const libraryBulkApplyButton = document.querySelector("#libraryBulkApplyButton");
const libraryBulkMessage = document.querySelector("#libraryBulkMessage");
const applicationGroups = document.querySelector("#applicationGroups");
const workspace = document.querySelector(".workspace");
const profileSettings = document.querySelector("#profileSettings");
const previewPane = document.querySelector(".preview-pane");
const previewStage = document.querySelector("#previewStage");
const sourceComposer = document.querySelector("#sourceComposer");
const sourceComposerTitle = document.querySelector("#sourceComposerTitle");
const sourceComposerHelp = document.querySelector("#sourceComposerHelp");
const linkOfferRegion = document.querySelector("#linkOfferRegion");
const offerLinkList = document.querySelector("#offerLinkList");
const offerSlotCount = document.querySelector("#offerSlotCount");
const addOfferButton = document.querySelector("#addOfferButton");
const bulkImportButton = document.querySelector("#bulkImportButton");
const bulkImportRegion = document.querySelector("#bulkImportRegion");
const bulkOfferLinks = document.querySelector("#bulkOfferLinks");
const bulkImportCount = document.querySelector("#bulkImportCount");
const confirmBulkImportButton = document.querySelector("#confirmBulkImportButton");
const cancelBulkImportButton = document.querySelector("#cancelBulkImportButton");
const textModeButton = document.querySelector("#textModeButton");
const linkModeButton = document.querySelector("#linkModeButton");
const spontaneousModeButton = document.querySelector("#spontaneousModeButton");
const textOfferRegion = document.querySelector("#textOfferRegion");
const offerTextField = document.querySelector("#offerText");
const offerTextCount = document.querySelector("#offerTextCount");
const spontaneousRegion = document.querySelector("#spontaneousRegion");
const spontaneousTargetList = document.querySelector("#spontaneousTargetList");
const addSpontaneousTargetButton = document.querySelector("#addSpontaneousTargetButton");
const contractFieldset = document.querySelector("#contractFieldset");
const contractHelp = document.querySelector("#contractHelp");
const languageHelp = document.querySelector("#languageHelp");
const automationEnabledCheckbox = document.querySelector("#automationEnabledCheckbox");
const completionActionSelect = document.querySelector("#completionActionSelect");
const draftSaveStatus = document.querySelector("#draftSaveStatus");
const automationToast = document.querySelector("#automationToast");
const formError = document.querySelector("#formError");
const engineSetupPrompt = document.querySelector("#engineSetupPrompt");
const openConnectionWizardButton = document.querySelector("#openConnectionWizardButton");
const submitButton = document.querySelector("#submitButton");
const submitLabel = submitButton.querySelector(".button-label");
const cancelButton = document.querySelector("#cancelButton");
const resetButton = document.querySelector("#resetButton");
const progressRegion = document.querySelector("#progressRegion");
const progressTitle = document.querySelector("#progressTitle");
const progressMessage = document.querySelector("#progressMessage");
const progressPercent = document.querySelector("#progressPercent");
const progressBar = document.querySelector("#progressBar");
const automationToggleButton = document.querySelector("#automationToggleButton");
const soundToggleButton = document.querySelector("#soundToggleButton");
const processMetadata = document.querySelector("#processMetadata");
const recoveryPanel = document.querySelector("#recoveryPanel");
const recoveryKicker = document.querySelector("#recoveryKicker");
const recoveryMessage = document.querySelector("#recoveryMessage");
const recoveryStage = document.querySelector("#recoveryStage");
const recoveryProvider = document.querySelector("#recoveryProvider");
const recoveryModelField = document.querySelector("#recoveryModelField");
const recoveryModel = document.querySelector("#recoveryModel");
const resumeJobButton = document.querySelector("#resumeJobButton");
const errorReportLink = document.querySelector("#errorReportLink");
const recoveryError = document.querySelector("#recoveryError");
const steps = [...document.querySelectorAll(".steps li")];
const systemState = document.querySelector("#systemState");
const systemStateText = document.querySelector("#systemStateText");
const quotaSummaryRing = document.querySelector("#quotaSummaryRing");
const quotaSummaryValue = document.querySelector("#quotaSummaryValue");
const modelUsagePanel = document.querySelector("#modelUsagePanel");
const modelUsageList = document.querySelector("#modelUsageList");
const refreshUsageButton = document.querySelector("#refreshUsageButton");
const usageUpdatedAt = document.querySelector("#usageUpdatedAt");
const jobWatchButton = document.querySelector("#jobWatchButton");
const jobWatchPanel = document.querySelector("#jobWatchPanel");
const jobWatchSummaryValue = document.querySelector("#jobWatchSummaryValue");
const jobWatchBadge = document.querySelector("#jobWatchBadge");
const refreshJobWatchButton = document.querySelector("#refreshJobWatchButton");
const closeJobWatchButton = document.querySelector("#closeJobWatchButton");
const jobWatchTabs = [...document.querySelectorAll("[data-watch-tab]")];
const jobWatchViews = {
  offers: document.querySelector("#jobWatchOffersView"),
  search: document.querySelector("#jobWatchSearchView"),
  sources: document.querySelector("#jobWatchSourcesView"),
};
const jobWatchOffersTabCount = document.querySelector("#jobWatchOffersTabCount");
const jobWatchSourcesTabCount = document.querySelector("#jobWatchSourcesTabCount");
const jobWatchResultCount = document.querySelector("#jobWatchResultCount");
const jobWatchUpdatedAt = document.querySelector("#jobWatchUpdatedAt");
const jobWatchCoverage = document.querySelector("#jobWatchCoverage");
const markAllWatchJobsSeenButton = document.querySelector("#markAllWatchJobsSeenButton");
const importAllWatchJobsButton = document.querySelector("#importAllWatchJobsButton");
const jobWatchError = document.querySelector("#jobWatchError");
const jobWatchResults = document.querySelector("#jobWatchResults");
const jobWatchSettingsForm = document.querySelector("#jobWatchSettingsForm");
const jobWatchEnabled = document.querySelector("#jobWatchEnabled");
const jobWatchQuery = document.querySelector("#jobWatchQuery");
const jobWatchLocation = document.querySelector("#jobWatchLocation");
const jobWatchContract = document.querySelector("#jobWatchContract");
const jobWatchSeniority = document.querySelector("#jobWatchSeniority");
const jobWatchInterval = document.querySelector("#jobWatchInterval");
const jobWatchProfileFilter = document.querySelector("#jobWatchProfileFilter");
const jobWatchAtsSources = document.querySelector("#jobWatchAtsSources");
const jobWatchPublicSourceCount = document.querySelector("#jobWatchPublicSourceCount");
const savePublicSourcesButton = document.querySelector("#savePublicSourcesButton");
const franceTravailSourceCard = document.querySelector("#franceTravailSourceCard");
const franceTravailConnectionState = document.querySelector("#franceTravailConnectionState");
const franceTravailCredentialStatus = document.querySelector("#franceTravailCredentialStatus");
const franceTravailClientId = document.querySelector("#franceTravailClientId");
const franceTravailClientSecret = document.querySelector("#franceTravailClientSecret");
const connectFranceTravailButton = document.querySelector("#connectFranceTravailButton");
const disconnectFranceTravailButton = document.querySelector("#disconnectFranceTravailButton");
const laBonneAlternanceSourceCard = document.querySelector("#laBonneAlternanceSourceCard");
const laBonneAlternanceConnectionState = document.querySelector("#laBonneAlternanceConnectionState");
const laBonneAlternanceCredentialStatus = document.querySelector("#laBonneAlternanceCredentialStatus");
const laBonneAlternanceToken = document.querySelector("#laBonneAlternanceToken");
const connectLaBonneAlternanceButton = document.querySelector("#connectLaBonneAlternanceButton");
const disconnectLaBonneAlternanceButton = document.querySelector("#disconnectLaBonneAlternanceButton");
const copyFranceTravailDescriptionButton = document.querySelector("#copyFranceTravailDescriptionButton");
const jobWatchCredentialState = document.querySelector("#jobWatchCredentialState");
const jobWatchSettingsStatus = document.querySelector("#jobWatchSettingsStatus");
const jobWatchSourceSummary = document.querySelector("#jobWatchSourceSummary");
const jobWatchSources = document.querySelector("#jobWatchSources");const skillsReview = document.querySelector("#skillsReview");
const skillsReviewTitle = document.querySelector("#skillsReviewTitle");
const reviewCount = document.querySelector("#reviewCount");
const reviewSummary = document.querySelector("#reviewSummary");
const bundleReviewNav = document.querySelector("#bundleReviewNav");
const bundlePosition = document.querySelector("#bundlePosition");
const previousOfferButton = document.querySelector("#previousOfferButton");
const sharedAnswerStatus = document.querySelector("#sharedAnswerStatus");
const matchedStrengthsRegion = document.querySelector("#matchedStrengthsRegion");
const matchedStrengths = document.querySelector("#matchedStrengths");
const skillsReviewForm = document.querySelector("#skillsReviewForm");
const skillQuestions = document.querySelector("#skillQuestions");
const reviewError = document.querySelector("#reviewError");
const generateButton = document.querySelector("#generateButton");
const editOfferButton = document.querySelector("#editOfferButton");
const previewSubtitle = document.querySelector("#previewSubtitle");
const previewTabs = document.querySelector("#previewTabs");
const previewTabButtons = [...document.querySelectorAll(".preview-tab")];
const pageBadge = document.querySelector(".page-badge");
const documentPlaceholder = document.querySelector("#documentPlaceholder");
const emptyCopy = document.querySelector("#emptyCopy");
const emptyCopyTitle = emptyCopy.querySelector("strong");
const emptyCopyDetail = emptyCopy.querySelector("span");
const documentPreview = document.querySelector("#documentPreview");
const resultBar = document.querySelector("#resultBar");
const resultTitle = document.querySelector("#resultTitle");
const resultSummary = document.querySelector("#resultSummary");
const resultCategoryBadge = document.querySelector("#resultCategoryBadge");
const docxPackDownload = document.querySelector("#docxPackDownload");
const pdfPackDownload = document.querySelector("#pdfPackDownload");
const bundleResults = document.querySelector("#bundleResults");
const bundleResultsStatus = document.querySelector("#bundleResultsStatus");
const bundleResultList = document.querySelector("#bundleResultList");
const bundleRetryFailuresButton = document.querySelector("#bundleRetryFailuresButton");
const bundlePackActions = document.querySelector("#bundlePackActions");
const bundleExtensionDownload = document.querySelector("#bundleExtensionDownload");
const bundleExtensionSummary = document.querySelector("#bundleExtensionSummary");
const bundleExtensionReview = document.querySelector("#bundleExtensionReview");
const bundleExtensionReviewTitle = document.querySelector("#bundleExtensionReviewTitle");
const bundleExtensionReviewList = document.querySelector("#bundleExtensionReviewList");
const bundleDocxDownload = document.querySelector("#bundleDocxDownload");
const bundlePdfDownload = document.querySelector("#bundlePdfDownload");
const profileMenu = document.querySelector("#profileMenu");
const profileMenuButton = document.querySelector("#profileMenuButton");
const profileMenuList = document.querySelector("#profileMenuList");
const manageProfilesButton = document.querySelector("#manageProfilesButton");
const activeProfileInitials = document.querySelector("#activeProfileInitials");
const activeProfileName = document.querySelector("#activeProfileName");
const activeProfileHeadline = document.querySelector("#activeProfileHeadline");
const profileContextLine = document.querySelector("#profileContextLine");
const profileIntroText = document.querySelector("#profileIntroText");
const categoryControl = document.querySelector("#categoryControl");
const closeProfileSettingsButton = document.querySelector("#closeProfileSettingsButton");
const newProfileButton = document.querySelector("#newProfileButton");
const settingsProfileList = document.querySelector("#settingsProfileList");
const profileForm = document.querySelector("#profileForm");
const profileFormMode = document.querySelector("#profileFormMode");
const profileFormTitle = document.querySelector("#profileFormTitle");
const profileConfigurationStatus = document.querySelector("#profileConfigurationStatus");
const profileNameField = document.querySelector("#profileName");
const profileHeadlineField = document.querySelector("#profileHeadline");
const profileDomainsField = document.querySelector("#profileDomains");
const profileFactsField = document.querySelector("#profileFacts");
const candidateFactsSection = document.querySelector("#candidateFactsSection");
const lockedProfileNote = document.querySelector("#lockedProfileNote");
const profileTemplatesSection = document.querySelector("#profileTemplatesSection");
const profileCvFrField = document.querySelector("#profileCvFr");
const profileCvEnField = document.querySelector("#profileCvEn");
const profileCoverLetterField = document.querySelector("#profileCoverLetter");
const profileCvFrState = document.querySelector("#profileCvFrState");
const profileCvEnState = document.querySelector("#profileCvEnState");
const profileCoverLetterState = document.querySelector("#profileCoverLetterState");
const providerOptions = document.querySelector("#providerOptions");
const providerRuntimeFields = document.querySelector("#providerRuntimeFields");
const providerModelField = document.querySelector("#providerModelField");
const providerModel = document.querySelector("#providerModel");
const providerModelHelp = document.querySelector("#providerModelHelp");
const providerEndpointField = document.querySelector("#providerEndpointField");
const providerEndpoint = document.querySelector("#providerEndpoint");
const apiKeyField = document.querySelector("#apiKeyField");
const providerApiKey = document.querySelector("#providerApiKey");
const providerConnectionStatus = document.querySelector("#providerConnectionStatus");
const providerSetupButton = document.querySelector("#providerSetupButton");
const providerConnectionDialog = document.querySelector("#providerConnectionDialog");
const providerConnectionIcon = document.querySelector("#providerConnectionIcon");
const providerConnectionTitle = document.querySelector("#providerConnectionTitle");
const providerConnectionSubtitle = document.querySelector("#providerConnectionSubtitle");
const providerConnectionBadge = document.querySelector("#providerConnectionBadge");
const providerConnectionSteps = document.querySelector("#providerConnectionSteps");
const providerConnectionKeyRegion = document.querySelector("#providerConnectionKeyRegion");
const providerConnectionApiKey = document.querySelector("#providerConnectionApiKey");
const providerConnectionAccountLink = document.querySelector("#providerConnectionAccountLink");
const toggleProviderConnectionKeyButton = document.querySelector("#toggleProviderConnectionKeyButton");
const providerConnectionProgress = document.querySelector("#providerConnectionProgress");
const providerConnectionMessage = document.querySelector("#providerConnectionMessage");
const providerConnectionError = document.querySelector("#providerConnectionError");
const providerConnectionPrimaryButton = document.querySelector("#providerConnectionPrimaryButton");
const providerConnectionCheckButton = document.querySelector("#providerConnectionCheckButton");
const providerConnectionLaterButton = document.querySelector("#providerConnectionLaterButton");
const closeProviderConnectionButton = document.querySelector("#closeProviderConnectionButton");
const profileFormError = document.querySelector("#profileFormError");
const saveProfileButton = document.querySelector("#saveProfileButton");
const cancelProfileEditButton = document.querySelector("#cancelProfileEditButton");
const previewCurrentProfile = document.querySelector("#previewCurrentProfile");
const previewCurrentInitials = document.querySelector("#previewCurrentInitials");
const previewCurrentName = document.querySelector("#previewCurrentName");
const previewCurrentHeadline = document.querySelector("#previewCurrentHeadline");
const previewProfileConnector = document.querySelector("#previewProfileConnector");
const previewDraftProfile = document.querySelector("#previewDraftProfile");
const previewDraftLabel = document.querySelector("#previewDraftLabel");
const previewReadiness = document.querySelector("#previewReadiness");
const previewDraftInitials = document.querySelector("#previewDraftInitials");
const previewDraftName = document.querySelector("#previewDraftName");
const previewDraftHeadline = document.querySelector("#previewDraftHeadline");
const previewDomains = document.querySelector("#previewDomains");
const previewProvider = document.querySelector("#previewProvider");
const previewDocuments = document.querySelector("#previewDocuments");
const previewFacts = document.querySelector("#previewFacts");
const previewProgressBar = document.querySelector("#previewProgressBar");
const profilePreviewNote = document.querySelector("#profilePreviewNote");

let activeRequest = null;
let pollTimer = null;
let currentResult = null;
let currentAnalysis = null;
let currentAnalysisId = null;
let currentBundle = null;
let bundleReviewItems = [];
let bundleReviewIndex = 0;
let bundleAnswers = new Map();
let busyPhase = null;
let busyScope = "single";
let intakeLocked = false;
let sourceMode = "links";
let offerLinks = [""];
let spontaneousTargets = [{ company: "", role: "", website: "", notes: "" }];
let currentSourceType = "offer";
let applicationLibrary = [];
let librarySearchQuery = "";
let libraryStatusFilter = "all";
const expandedLibraryGroups = new Set();
const applicationMutationQueues = new Map();
const selectedApplicationIds = new Set();
let librarySelectionMode = false;
let bulkApplicationMutationPending = false;
let currentApplicationId = null;
let profiles = [];
let providers = [];
let activeProfile = null;
let activeProviderStatus = null;
let providerStatuses = {};
let providerUsage = [];
let connectionProviderId = "";
let connectionDetails = null;
let connectionPollTimer = null;
let connectionRefreshPending = false;
let connectionBusy = false;
let hasAutoOpenedConnection = false;
let hasAutoOpenedProfileSetup = false;
let healthState = null;
let failedRequest = null;
let usagePollTimer = null;
let jobWatchPollTimer = null;
let jobWatchPayload = null;
let jobWatchSuggestedFamilies = [];

const APPLICATION_STATUSES = [
  { id: "ready", label: "À envoyer", shortLabel: "À envoyer" },
  { id: "sent", label: "Envoyée", shortLabel: "Envoyée" },
  { id: "in_progress", label: "En cours", shortLabel: "En cours" },
  { id: "interview", label: "Entretien", shortLabel: "Entretien" },
  { id: "follow_up", label: "À relancer", shortLabel: "Relance" },
  { id: "accepted", label: "Acceptée", shortLabel: "Acceptée" },
  { id: "rejected", label: "Refusée", shortLabel: "Refusée" },
];

const ACTIVE_APPLICATION_STATUSES = new Set(["ready", "sent", "in_progress", "interview"]);
const CLOSED_APPLICATION_STATUSES = new Set(["accepted", "rejected"]);
const APPLICATION_STATUS_PRIORITY = {
  follow_up: 0,
  interview: 1,
  in_progress: 2,
  sent: 3,
  ready: 4,
  accepted: 5,
  rejected: 6,
};
let editingProfileId = null;
let settingsOpen = false;
let audioContext = null;
let soundEnabled = localStorage.getItem("openApplySoundEnabled") !== "false";
let automationEnabled = localStorage.getItem("openApplyAutomationEnabled") !== "false";
let completionAction = ["pdf", "docx", "preview"].includes(localStorage.getItem("openApplyCompletionAction"))
  ? localStorage.getItem("openApplyCompletionAction")
  : "pdf";
let notifiedMilestoneIndex = -1;
let pendingAutomationToken = 0;
let draftSaveTimer = null;
let automationToastTimer = null;
const autoDownloadedIds = new Set();

const MAX_OFFERS = 10;

const levelLabels = {
  professional: {
    label: "Entreprise, autonome",
    help: "Actions concrètes réalisées de façon autonome.",
  },
  professional_guided: {
    label: "Entreprise, accompagné",
    help: "Pratique réelle au travail avec supervision.",
  },
  project: {
    label: "Projet ou laboratoire",
    help: "Utilisation concrète hors production.",
  },
  knowledge: {
    label: "Formation ou notions",
    help: "Sujet connu sans pratique concrète.",
  },
  none: {
    label: "Jamais pratiqué",
    help: "La compétence restera absente du CV.",
  },
};

const bundleStateLabels = {
  queued: "En attente",
  analyzing: "Analyse en cours",
  needs_input: "À valider",
  queued_generation: "Prête à générer",
  generating: "CV et lettre en cours",
  completed: "Fichiers prêts",
  failed: "Échec",
  canceled: "Annulé",
};

const milestoneStages = ["review", "drafting", "verifying", "packaging", "completed"];
const milestoneTones = [
  [523.25, 659.25],
  [587.33, 739.99],
  [659.25, 830.61],
  [698.46, 880],
  [523.25, 659.25, 783.99],
];

function syncUtilityToggles() {
  soundToggleButton.setAttribute("aria-pressed", String(soundEnabled));
  soundToggleButton.title = soundEnabled ? "Couper les notifications sonores" : "Activer les notifications sonores";
  automationToggleButton.setAttribute("aria-pressed", String(automationEnabled));
  automationToggleButton.title = automationEnabled
    ? "Désactiver la continuation automatique"
    : "Continuer automatiquement lorsqu’aucune compétence ne nécessite de réponse";
  automationEnabledCheckbox.checked = automationEnabled;
  completionActionSelect.value = completionAction;
}

function armAudio() {
  if (!soundEnabled) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  audioContext ||= new AudioContextClass();
  if (audioContext.state === "suspended") void audioContext.resume();
}

function playMilestoneTone(index, delay = 0) {
  if (!soundEnabled) return;
  armAudio();
  if (!audioContext) return;
  window.setTimeout(() => {
    if (!soundEnabled || !audioContext) return;
    const start = audioContext.currentTime + 0.02;
    milestoneTones[index].forEach((frequency, toneIndex) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const toneStart = start + toneIndex * 0.09;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, toneStart);
      gain.gain.setValueAtTime(0.0001, toneStart);
      gain.gain.exponentialRampToValueAtTime(index === 4 ? 0.075 : 0.05, toneStart + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, toneStart + 0.16);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(toneStart);
      oscillator.stop(toneStart + 0.18);
    });
  }, delay);
}

function resetMilestoneNotifications() {
  notifiedMilestoneIndex = -1;
}

function notifyProgressMilestones(stage, { silent = false } = {}) {
  const targetIndex = milestoneStages.indexOf(stage);
  if (targetIndex < 0) return;
  if (silent) {
    notifiedMilestoneIndex = Math.max(notifiedMilestoneIndex, targetIndex);
    return;
  }
  let delay = 0;
  for (let index = notifiedMilestoneIndex + 1; index <= targetIndex; index += 1) {
    playMilestoneTone(index, delay);
    delay += index === 4 ? 280 : 220;
  }
  notifiedMilestoneIndex = Math.max(notifiedMilestoneIndex, targetIndex);
}

function intakeDraftKey() {
  return activeProfile?.id ? `openApplyDraft:${activeProfile.id}` : "";
}

function selectedValue(name, fallback = "auto") {
  return form.querySelector(`input[name="${name}"]:checked`)?.value || fallback;
}

function emptySpontaneousTarget() {
  return { company: "", role: "", website: "", notes: "" };
}

function normalizedDraftTarget(value) {
  return {
    company: String(value?.company || "").slice(0, 120),
    role: String(value?.role || "").slice(0, 160),
    website: String(value?.website || "").slice(0, 500),
    notes: String(value?.notes || "").slice(0, 500),
  };
}

function intakeDraftPayload() {
  return {
    sourceMode,
    offerLinks: offerLinks.slice(0, MAX_OFFERS),
    offerText: offerTextField.value.slice(0, 60_000),
    spontaneousTargets: spontaneousTargets.slice(0, MAX_OFFERS).map(normalizedDraftTarget),
    category: selectedValue("category"),
    mode: selectedValue("mode"),
    language: selectedValue("language"),
    savedAt: new Date().toISOString(),
  };
}

function saveIntakeDraft(key = intakeDraftKey(), payload = intakeDraftPayload()) {
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(payload));
  if (key === intakeDraftKey()) draftSaveStatus.textContent = "Brouillon sauvegardé automatiquement.";
}

function scheduleIntakeDraftSave() {
  if (draftSaveTimer) window.clearTimeout(draftSaveTimer);
  const key = intakeDraftKey();
  const payload = intakeDraftPayload();
  draftSaveStatus.textContent = "Sauvegarde du brouillon…";
  draftSaveTimer = window.setTimeout(() => saveIntakeDraft(key, payload), 280);
}

function restoreRadioValue(name, value) {
  const input = form.querySelector(`input[name="${name}"][value="${CSS.escape(String(value || ""))}"]`);
  if (input) input.checked = true;
}

function restoreIntakeDraft() {
  const key = intakeDraftKey();
  if (!key) return;
  draftSaveStatus.textContent = "Le brouillon est sauvegardé automatiquement sur cet appareil.";
  try {
    const draft = JSON.parse(localStorage.getItem(key) || "null");
    if (!draft || !Array.isArray(draft.offerLinks)) return;
    offerLinks = draft.offerLinks.map((value) => String(value || "")).slice(0, MAX_OFFERS);
    if (!offerLinks.length) offerLinks = [""];
    offerTextField.value = String(draft.offerText || "").slice(0, 60_000);
    offerTextCount.textContent = `${offerTextField.value.length.toLocaleString("fr-FR")} / 60 000`;
    spontaneousTargets = Array.isArray(draft.spontaneousTargets)
      ? draft.spontaneousTargets.slice(0, MAX_OFFERS).map(normalizedDraftTarget)
      : [emptySpontaneousTarget()];
    if (!spontaneousTargets.length) spontaneousTargets = [emptySpontaneousTarget()];
    restoreRadioValue("category", draft.category);
    restoreRadioValue("mode", draft.mode);
    restoreRadioValue("language", draft.language);
    renderOfferLinks();
    renderSpontaneousTargets();
    const restoredMode = ["links", "text", "spontaneous"].includes(draft.sourceMode) ? draft.sourceMode : "links";
    setSourceMode(restoredMode, { focus: false, persist: false });
    const hasContent = offerLinks.some((value) => value.trim())
      || offerTextField.value.trim()
      || spontaneousTargets.some((target) => target.company.trim() || target.role.trim() || target.website.trim() || target.notes.trim());
    draftSaveStatus.textContent = hasContent
      ? "Brouillon précédent repris automatiquement."
      : "Le brouillon est sauvegardé automatiquement sur cet appareil.";
  } catch {
    localStorage.removeItem(key);
  }
}

function clearIntakeDraft() {
  const key = intakeDraftKey();
  if (key) localStorage.removeItem(key);
}

function showAutomationToast(message) {
  if (automationToastTimer) window.clearTimeout(automationToastTimer);
  automationToast.textContent = message;
  automationToast.hidden = false;
  automationToastTimer = window.setTimeout(() => {
    automationToast.hidden = true;
  }, 4_000);
}

function runCompletionAction(key, result) {
  if (completionAction === "preview" || autoDownloadedIds.has(key)) return;
  const url = completionAction === "docx" ? result?.docxPackUrl : result?.pdfPackUrl;
  if (!url) return;
  autoDownloadedIds.add(key);
  window.setTimeout(() => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    showAutomationToast(`Téléchargement automatique du pack ${completionAction.toUpperCase()} lancé.`);
  }, 250);
}

function setSystemState(kind, text) {
  systemState.classList.remove("ready", "error");
  if (kind) systemState.classList.add(kind);
  systemStateText.textContent = text;
}

function providerForConnection(providerId = connectionProviderId) {
  return providers.find((provider) => provider.id === providerId) || null;
}

function connectionProfileId() {
  return editingProfileId || activeProfile?.id || "";
}

function clearConnectionPolling() {
  if (connectionPollTimer) window.clearInterval(connectionPollTimer);
  connectionPollTimer = null;
}

function scheduleConnectionPolling() {
  clearConnectionPolling();
  connectionPollTimer = window.setInterval(() => {
    void refreshProviderConnection({ silent: true });
  }, 2_500);
}

function connectionInitials(label) {
  return String(label || "IA")
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function renderProviderConnectionDialog() {
  const provider = providerForConnection();
  if (!provider) return;
  const status = providerStatuses[provider.id]
    || (activeProviderStatus?.id === provider.id ? activeProviderStatus : null)
    || {};
  const details = connectionDetails?.providerId === provider.id
    ? connectionDetails
    : provider.connection || {};
  const phase = status.ready ? "ready" : details.phase || "idle";
  const ready = Boolean(status.ready);
  const staged = phase === "staged";
  const waiting = ["waiting", "checking"].includes(phase);
  const failed = phase === "failed";
  const mode = details.mode || "external";

  providerConnectionIcon.textContent = connectionInitials(provider.label);
  providerConnectionTitle.textContent = ready ? `${provider.label} est connecté` : `Connecter ${provider.label}`;
  providerConnectionSubtitle.textContent = ready
    ? "OpenApply peut utiliser ce moteur pour tes candidatures."
    : "Suis les étapes ci-dessous. Aucun passage par le terminal n’est nécessaire.";
  providerConnectionBadge.textContent = ready ? "Prêt" : staged ? "Prêt à enregistrer" : waiting ? "Connexion en cours" : failed ? "À réessayer" : "À connecter";
  providerConnectionBadge.className = `provider-connect-badge ${ready || staged ? "is-ready" : waiting ? "is-waiting" : failed ? "is-error" : ""}`;

  const instructions = Array.isArray(details.instructions) && details.instructions.length
    ? details.instructions
    : ["Lance la configuration.", "Termine la connexion.", "Reviens ici pour la vérification."];
  providerConnectionSteps.replaceChildren(...instructions.map((instruction, index) => {
    const item = document.createElement("li");
    item.append(createTextElement("span", "provider-connect-step-number", String(index + 1)), createTextElement("p", "", instruction));
    return item;
  }));

  providerConnectionKeyRegion.hidden = mode !== "api-key" || Boolean(details.installationRequired);
  if (mode === "api-key") {
    providerConnectionAccountLink.href = details.accountUrl || "#";
    providerConnectionAccountLink.hidden = !details.accountUrl;
  }

  providerConnectionProgress.className = `provider-connect-progress ${ready || staged ? "is-ready" : waiting ? "is-waiting" : failed ? "is-error" : ""}`;
  providerConnectionMessage.textContent = ready
    ? `${provider.label} est connecté et prêt.`
    : details.message || status.message || "Choisis l’action ci-dessous pour commencer.";
  providerConnectionPrimaryButton.disabled = connectionBusy || Boolean(details.running);
  providerConnectionCheckButton.disabled = connectionBusy;
  providerConnectionPrimaryButton.textContent = ready
    ? "Fermer"
    : staged
      ? "Continuer vers le profil"
      : details.primaryAction || (mode === "api-key" ? "Enregistrer la clé" : "Commencer");
  providerConnectionCheckButton.hidden = ready || staged;
  providerConnectionLaterButton.hidden = ready;
}

function openProviderConnectionDialog(providerId, { automatic = false } = {}) {
  const provider = providerForConnection(providerId);
  if (!provider) return;
  connectionProviderId = provider.id;
  connectionDetails = { ...(provider.connection || {}), providerId: provider.id };
  providerConnectionApiKey.value = provider.auth === "api-key" ? providerApiKey.value : "";
  providerConnectionApiKey.type = "password";
  toggleProviderConnectionKeyButton.textContent = "Afficher";
  providerConnectionError.textContent = "";
  renderProviderConnectionDialog();
  if (!providerConnectionDialog.open) providerConnectionDialog.showModal();
  if (connectionDetails.phase === "waiting") scheduleConnectionPolling();
  if (!automatic) {
    window.setTimeout(() => {
      if (provider.auth === "api-key") providerConnectionApiKey.focus();
      else providerConnectionPrimaryButton.focus();
    }, 50);
  }
}

async function refreshProviderConnection({ silent = false } = {}) {
  if (!connectionProviderId || connectionRefreshPending) return;
  connectionRefreshPending = true;
  if (!silent) {
    connectionBusy = true;
    providerConnectionError.textContent = "";
    renderProviderConnectionDialog();
  }
  try {
    const profileId = connectionProfileId();
    const suffix = profileId ? `?profileId=${encodeURIComponent(profileId)}` : "";
    const response = await fetch(`/api/providers/${encodeURIComponent(connectionProviderId)}/connection${suffix}`, { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Vérification impossible.");
    providerStatuses[connectionProviderId] = payload.status;
    if (activeProfile?.provider === connectionProviderId && activeProfile.id === profileId) activeProviderStatus = payload.status;
    connectionDetails = { ...payload.connection, providerId: connectionProviderId };
    providerConnectionError.textContent = "";
    if (payload.status?.ready) {
      clearConnectionPolling();
      await checkHealth();
    } else if (payload.connection?.running || ["waiting", "checking"].includes(payload.connection?.phase)) {
      scheduleConnectionPolling();
    }
    if (settingsOpen) {
      const selectedId = selectedProviderId();
      renderProviderOptions(selectedId);
    }
    renderProviderConnectionDialog();
  } catch (error) {
    if (!silent) providerConnectionError.textContent = error instanceof Error ? error.message : "Vérification impossible.";
  } finally {
    connectionRefreshPending = false;
    connectionBusy = false;
    renderProviderConnectionDialog();
  }
}

async function beginProviderConnection() {
  const provider = providerForConnection();
  if (!provider || connectionBusy) return;
  const status = providerStatuses[provider.id] || {};
  if (status.ready) {
    providerConnectionDialog.close();
    return;
  }
  const details = connectionDetails || provider.connection || {};
  providerConnectionError.textContent = "";
  if (details.phase === "staged") {
    providerConnectionDialog.close();
    saveProfileButton.focus();
    return;
  }
  if (details.mode === "external") {
    if (!details.accountUrl) {
      providerConnectionError.textContent = "Aucun guide visuel n’est disponible pour ce moteur.";
      return;
    }
    window.open(details.accountUrl, "_blank", "noopener,noreferrer");
    connectionDetails = {
      ...details,
      providerId: provider.id,
      phase: "waiting",
      message: "La page officielle est ouverte. Termine la configuration puis reviens vérifier ici.",
    };
    renderProviderConnectionDialog();
    scheduleConnectionPolling();
    return;
  }

  const apiKey = providerConnectionApiKey.value.trim();
  if (details.mode === "api-key" && !details.installationRequired && !apiKey) {
    providerConnectionError.textContent = "Colle ta clé API avant de continuer.";
    providerConnectionApiKey.focus();
    return;
  }
  if (details.mode === "api-key" && !details.installationRequired && settingsOpen && !editingProfileId) {
    providerApiKey.value = apiKey;
    connectionDetails = {
      ...details,
      providerId: provider.id,
      phase: "staged",
      message: "Clé prête. Enregistre maintenant le nouveau profil pour la placer dans le coffre chiffré.",
    };
    renderProviderConnectionDialog();
    return;
  }

  connectionBusy = true;
  providerConnectionError.textContent = "";
  renderProviderConnectionDialog();
  try {
    const response = await fetch(`/api/providers/${encodeURIComponent(provider.id)}/connection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileId: connectionProfileId(),
        action: details.installationRequired ? "install" : "connect",
        apiKey: details.mode === "api-key" && !details.installationRequired ? apiKey : undefined,
      }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Connexion impossible.");
    providerStatuses[provider.id] = payload.status;
    if (activeProfile?.provider === provider.id && activeProfile.id === connectionProfileId()) activeProviderStatus = payload.status;
    connectionDetails = { ...payload.connection, providerId: provider.id };
    providerConnectionApiKey.value = "";
    providerApiKey.value = "";
    if (payload.status?.ready) {
      clearConnectionPolling();
      await checkHealth();
    } else {
      scheduleConnectionPolling();
    }
    if (settingsOpen) {
      const selectedId = selectedProviderId();
      renderProviderOptions(selectedId);
    }
  } catch (error) {
    providerConnectionError.textContent = error instanceof Error ? error.message : "Connexion impossible.";
  } finally {
    connectionBusy = false;
    renderProviderConnectionDialog();
  }
}

async function checkHealth({ autoPrompt = false } = {}) {
  try {
    const response = await fetch("/api/health", { cache: "no-store" });
    const health = await response.json();
    if (!response.ok) throw new Error(health.error || "État du moteur indisponible.");
    healthState = health;
    activeProviderStatus = health.engine || activeProviderStatus;
    const engineReady = Boolean(health.engine?.ready);
    const profileReady = Boolean(health.profileReady);
    const promptTitle = engineSetupPrompt.querySelector("strong");
    const promptDescription = engineSetupPrompt.querySelector("span");
    engineSetupPrompt.hidden = health.ready;
    engineSetupPrompt.dataset.mode = engineReady ? "profile" : "engine";
    if (!health.ready) {
      const message = health.message || health.engine?.message || "Configuration incomplète";
      setSystemState("error", message);
      if (engineReady && !profileReady) {
        promptTitle.textContent = "Ton profil candidat est à compléter";
        promptDescription.textContent = "Ajoute tes faits vérifiés et tes modèles DOCX depuis l’interface.";
        openConnectionWizardButton.textContent = "Compléter mon profil";
        formError.textContent = health.missingProfileItems?.length
          ? `À ajouter : ${health.missingProfileItems.join(", ")}.`
          : "Complète le profil candidat avant de lancer une candidature.";
        if (autoPrompt && !hasAutoOpenedProfileSetup) {
          hasAutoOpenedProfileSetup = true;
          window.setTimeout(showProfileSettings, 180);
        }
      } else {
        promptTitle.textContent = "Le moteur IA attend ta connexion";
        promptDescription.textContent = "Tout se fait depuis OpenApply, sans commande à copier.";
        openConnectionWizardButton.textContent = "Configurer le moteur IA";
        formError.textContent = `${health.engine?.label || "Le moteur IA"} n’est pas encore connecté. Utilise le bouton ci-dessous pour terminer la configuration.`;
        if (autoPrompt && !hasAutoOpenedConnection) {
          hasAutoOpenedConnection = true;
          window.setTimeout(() => openProviderConnectionDialog(health.engine?.id || activeProfile?.provider, { automatic: true }), 150);
        }
      }
      submitButton.disabled = true;
      return health;
    }
    engineSetupPrompt.hidden = true;
    formError.textContent = "";
    setSystemState("ready", health.engine.label);
    submitButton.disabled = false;
    return health;
  } catch (error) {
    healthState = null;
    engineSetupPrompt.hidden = true;
    setSystemState("error", error instanceof Error ? error.message : activeProviderStatus?.message || "Moteur indisponible");
    formError.textContent = "Impossible de vérifier la configuration d’OpenApply pour le moment.";
    submitButton.disabled = true;
    return null;
  }
}

function formatTokenCount(value) {
  const number = Number(value || 0);
  if (number >= 1_000_000) return `${(number / 1_000_000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} M`;
  if (number >= 1_000) return `${(number / 1_000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} k`;
  return number.toLocaleString("fr-FR");
}

function usageTone(entry) {
  if (entry?.unlimited) return "local";
  if (typeof entry?.remainingPercent !== "number") return entry?.ready ? "monitored" : "offline";
  if (entry.remainingPercent < 20) return "critical";
  if (entry.remainingPercent < 50) return "warning";
  return "healthy";
}

function renderProviderUsage(payload) {
  providerUsage = Array.isArray(payload?.providers) ? payload.providers : [];
  const selected = providerUsage.find((entry) => entry.selected) || providerUsage[0];
  const percent = typeof selected?.remainingPercent === "number" ? selected.remainingPercent : null;
  const selectedTone = usageTone(selected);
  quotaSummaryRing.style.setProperty("--quota", percent ?? 0);
  quotaSummaryRing.dataset.tone = selectedTone;
  quotaSummaryRing.classList.toggle("is-unknown", percent === null && !selected?.unlimited);
  quotaSummaryRing.classList.toggle("is-local", Boolean(selected?.unlimited));
  quotaSummaryValue.textContent = percent !== null
    ? `${percent} % restant`
    : selected?.unlimited
      ? "Illimité"
      : selected?.ready
        ? "Surveillé"
        : "À connecter";

  modelUsageList.replaceChildren();
  const visible = providerUsage
    .filter((entry) => entry.ready || entry.selected || entry.models?.length)
    .sort((first, second) => Number(second.selected) - Number(first.selected) || first.label.localeCompare(second.label, "fr"));
  visible.forEach((entry) => {
    const article = document.createElement("article");
    article.className = "model-usage-card";
    article.classList.toggle("is-selected", entry.selected);
    article.dataset.tone = usageTone(entry);
    const header = document.createElement("header");
    const identity = document.createElement("div");
    identity.append(
      createTextElement("strong", "", entry.label),
      createTextElement(
        "span",
        "",
        entry.selected ? "Moteur actif" : entry.ready ? "Moteur disponible" : "Configuration requise"
      )
    );
    const value = createTextElement(
      "b",
      typeof entry.remainingPercent === "number" ? "is-exact" : entry.unlimited ? "is-local" : "is-unavailable",
      typeof entry.remainingPercent === "number"
        ? `${entry.remainingPercent} %`
        : entry.unlimited
          ? "Illimité"
          : entry.ready
            ? "Surveillé"
            : "À configurer"
    );
    header.append(identity, value);
    article.append(header);

    if (typeof entry.remainingPercent === "number") {
      const track = document.createElement("div");
      track.className = "usage-meter";
      const fill = document.createElement("span");
      fill.dataset.tone = usageTone(entry);
      fill.style.transform = `scaleX(${entry.remainingPercent / 100})`;
      track.append(fill);
      article.append(track);
    }

    const selectedModel = entry.selectedModel || entry.models?.[0] || "";
    if (selectedModel || entry.models?.length) {
      const modelLine = document.createElement("p");
      modelLine.className = "usage-model-line";
      modelLine.textContent = selectedModel
        ? `${selectedModel}${entry.models?.length > 1 ? `, ${entry.models.length} modèles détectés` : ""}`
        : `${entry.models.length} modèles détectés`;
      article.append(modelLine);
    }

    if (entry.sessionUsage?.totalTokens) {
      article.append(createTextElement(
        "p",
        "usage-session-line",
        `${formatTokenCount(entry.sessionUsage.totalTokens)} tokens mesurés sur les dernières tâches`
      ));
    }
    if (entry.modelUsage?.length) {
      article.append(createTextElement(
        "p",
        "usage-session-line",
        `Par modèle : ${entry.modelUsage
          .map((item) => `${item.model} ${formatTokenCount(item.usage?.totalTokens)} tokens`)
          .join(", ")}`
      ));
    }
    article.append(createTextElement("p", "usage-message", entry.message || "Aucune information publiée."));
    modelUsageList.append(article);
  });
  if (!visible.length) {
    modelUsageList.append(createTextElement("p", "usage-empty", "Aucun moteur connecté pour ce profil."));
  }
  const checkedAt = new Date(payload?.checkedAt || Date.now());
  usageUpdatedAt.textContent = `Mis à jour à ${checkedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
}

async function loadProviderUsage({ force = false } = {}) {
  if (usagePollTimer) window.clearTimeout(usagePollTimer);
  refreshUsageButton.disabled = true;
  try {
    const response = await fetch(`/api/providers/usage${force ? "?refresh=1" : ""}`, { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Budgets IA indisponibles.");
    renderProviderUsage(payload);
  } catch {
    quotaSummaryValue.textContent = "Lecture indisponible";
  } finally {
    refreshUsageButton.disabled = false;
    usagePollTimer = window.setTimeout(() => {
      usagePollTimer = null;
      if (document.visibilityState === "visible") void loadProviderUsage();
    }, 30_000);
  }
}

async function restoreLatestJob() {
  try {
    let response = await fetch("/api/bundles/latest", { cache: "no-store" });
    if (response.ok) {
      const bundle = await response.json();
      setProgress(bundle, { silent: true });
      renderBundleResults(bundle);
      if (bundle.state === "needs_input") {
        showBundleReview(bundle);
      } else if (bundle.state === "completed") {
        showBundleComplete(bundle);
      } else if (["queued", "running"].includes(bundle.state)) {
        currentBundle = bundle;
        activeRequest = { kind: "bundle", id: bundle.id };
        setBusy(true, bundle.stage === "analyzing" ? "analysis" : "generation", "bundle");
        pollTimer = window.setTimeout(pollActive, 500);
      } else if (bundle.state === "failed") {
        showFailure(bundle.error || bundle.message, bundle);
      }
      return;
    }
    response = await fetch("/api/jobs/latest", { cache: "no-store" });
    if (!response.ok) return;
    const job = await response.json();
    setProgress(job, { silent: true });
    if (job.kind === "analysis" && job.state === "needs_input" && job.result) {
      showAnalysis(job);
    } else if (job.state === "completed" && job.result) {
      showResult(job);
      resetButton.hidden = false;
    } else if (["queued", "running"].includes(job.state)) {
      activeRequest = { kind: "job", id: job.id };
      setBusy(true, job.kind, "single");
      pollTimer = window.setTimeout(pollActive, 500);
    } else if (job.state === "failed") {
      showFailure(job.error || job.message, job);
    }
  } catch {
    // Restoring history is optional.
  }
}

function formatApplicationDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(date).replace(".", "");
}

function domainById(domainId) {
  return activeProfile?.domains.find((domain) => domain.id === domainId) || activeProfile?.domains[0] || { id: "auto", label: "Domaine" };
}

function normalizedApplicationStatus(application) {
  return APPLICATION_STATUSES.some((status) => status.id === application?.applicationStatus)
    ? application.applicationStatus
    : "ready";
}

function applicationMatchesStatusFilter(application) {
  const status = normalizedApplicationStatus(application);
  if (libraryStatusFilter === "active") return ACTIVE_APPLICATION_STATUSES.has(status);
  if (libraryStatusFilter === "follow_up") return status === "follow_up";
  if (libraryStatusFilter === "closed") return CLOSED_APPLICATION_STATUSES.has(status);
  return true;
}

function normalizedLibrarySearchQuery() {
  return librarySearchQuery
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function applicationMatchesSearch(application, normalizedQuery = normalizedLibrarySearchQuery()) {
  if (!normalizedQuery) return true;
  return [
    application.result?.company,
    application.result?.role,
    application.result?.contractType,
    domainById(application.category).label,
    APPLICATION_STATUSES.find((status) => status.id === normalizedApplicationStatus(application))?.label,
  ].filter(Boolean).join(" ")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .includes(normalizedQuery);
}

function applicationsMatchingLibraryView() {
  const domainIds = new Set((activeProfile?.domains || []).map((domain) => domain.id));
  const normalizedQuery = normalizedLibrarySearchQuery();
  return applicationLibrary.filter((application) => (
    domainIds.has(application.category)
    && applicationMatchesStatusFilter(application)
    && applicationMatchesSearch(application, normalizedQuery)
  ));
}

function setLibraryBulkMessage(message = "", tone = "") {
  libraryBulkMessage.hidden = !message;
  libraryBulkMessage.textContent = message;
  libraryBulkMessage.dataset.tone = tone;
}

function renderLibraryBulkOptions() {
  const previousCategory = libraryBulkCategory.value;
  const previousStatus = libraryBulkStatus.value;
  libraryBulkCategory.replaceChildren(new Option("Conserver", ""));
  (activeProfile?.domains || []).forEach((domain) => {
    libraryBulkCategory.append(new Option(domain.label, domain.id));
  });
  libraryBulkStatus.replaceChildren(new Option("Conserver", ""));
  APPLICATION_STATUSES.forEach((status) => {
    libraryBulkStatus.append(new Option(status.label, status.id));
  });
  if ([...libraryBulkCategory.options].some((option) => option.value === previousCategory)) {
    libraryBulkCategory.value = previousCategory;
  }
  if ([...libraryBulkStatus.options].some((option) => option.value === previousStatus)) {
    libraryBulkStatus.value = previousStatus;
  }
}

function syncLibraryBulkPanel() {
  const availableIds = new Set(applicationLibrary.map((application) => application.id));
  selectedApplicationIds.forEach((id) => {
    if (!availableIds.has(id)) selectedApplicationIds.delete(id);
  });
  const filteredItems = applicationsMatchingLibraryView();
  const selectedFilteredCount = filteredItems.filter((application) => selectedApplicationIds.has(application.id)).length;
  const allFilteredSelected = filteredItems.length > 0 && selectedFilteredCount === filteredItems.length;
  const selectedCount = selectedApplicationIds.size;
  const hasChange = Boolean(libraryBulkCategory.value || libraryBulkStatus.value);
  const unavailable = Boolean(busyPhase) || bulkApplicationMutationPending;

  applicationsPane.classList.toggle("is-selection-mode", librarySelectionMode);
  libraryBulkPanel.hidden = !librarySelectionMode;
  librarySelectionToggle.classList.toggle("is-active", librarySelectionMode);
  librarySelectionToggle.setAttribute("aria-pressed", String(librarySelectionMode));
  librarySelectionToggle.textContent = librarySelectionMode ? "Terminer" : "Sélectionner";
  librarySelectionToggle.disabled = unavailable || (!applicationLibrary.length && !librarySelectionMode);
  libraryBulkSelectedCount.textContent = String(selectedCount);
  libraryBulkSelectedLabel.textContent = selectedCount > 1 ? "sélectionnées" : "sélectionnée";
  librarySelectAllButton.textContent = allFilteredSelected
    ? `Désélectionner (${filteredItems.length})`
    : `Tout sélectionner (${filteredItems.length})`;
  librarySelectAllButton.setAttribute("aria-pressed", String(allFilteredSelected));
  librarySelectAllButton.disabled = unavailable || !filteredItems.length;
  libraryBulkCategory.disabled = unavailable;
  libraryBulkStatus.disabled = unavailable;
  libraryBulkApplyButton.disabled = unavailable || !selectedCount || !hasChange;
}

function resetLibrarySelection({ exit = true, clearMessage = true } = {}) {
  selectedApplicationIds.clear();
  if (exit) librarySelectionMode = false;
  libraryBulkCategory.value = "";
  libraryBulkStatus.value = "";
  if (clearMessage) setLibraryBulkMessage();
}

function setApplicationSelected(applicationId, selected) {
  if (!applicationLibrary.some((application) => application.id === applicationId)) return;
  if (selected) selectedApplicationIds.add(applicationId);
  else selectedApplicationIds.delete(applicationId);
  const row = applicationRow(applicationId);
  row?.classList.toggle("is-bulk-selected", selected);
  const checkbox = row?.querySelector("[data-select-application-id]");
  if (checkbox) checkbox.checked = selected;
  syncLibraryBulkPanel();
}

function updateLibraryOverview() {
  const total = applicationLibrary.length;
  const active = applicationLibrary.filter((application) => ACTIVE_APPLICATION_STATUSES.has(normalizedApplicationStatus(application))).length;
  const followUp = applicationLibrary.filter((application) => normalizedApplicationStatus(application) === "follow_up").length;
  const closed = applicationLibrary.filter((application) => CLOSED_APPLICATION_STATUSES.has(normalizedApplicationStatus(application))).length;
  const interviews = applicationLibrary.filter((application) => normalizedApplicationStatus(application) === "interview").length;

  applicationsTotal.textContent = String(total);
  applicationsTotal.setAttribute("aria-label", `${total} candidature${total > 1 ? "s" : ""}`);
  filterAllCount.textContent = String(total);
  filterActiveCount.textContent = String(active);
  filterFollowUpCount.textContent = String(followUp);
  filterClosedCount.textContent = String(closed);

  if (!total) applicationsSummary.textContent = "Commence par préparer ta première candidature.";
  else if (followUp) applicationsSummary.textContent = `${followUp} relance${followUp > 1 ? "s" : ""} à faire maintenant.`;
  else if (interviews) applicationsSummary.textContent = `${interviews} entretien${interviews > 1 ? "s" : ""} à préparer.`;
  else applicationsSummary.textContent = `${active} candidature${active > 1 ? "s" : ""} active${active > 1 ? "s" : ""}.`;

  libraryStatusFilters.querySelectorAll("[data-library-status-filter]").forEach((button) => {
    const activeFilter = button.dataset.libraryStatusFilter === libraryStatusFilter;
    button.classList.toggle("is-active", activeFilter);
    button.setAttribute("aria-pressed", String(activeFilter));
  });
}

function applicationAccessibleName(application) {
  const company = application?.result?.company || "Entreprise";
  const role = application?.result?.role || activeProfile?.headline || "Poste ciblé";
  return `${company}, ${role}`;
}

function applicationRow(applicationId) {
  return document.querySelector(`[data-application-entry-id="${CSS.escape(applicationId)}"]`);
}

function setApplicationRowMutationState(applicationId, { pending = false, message = "", tone = "" } = {}) {
  const row = applicationRow(applicationId);
  if (!row) return;
  row.classList.toggle("is-saving", pending);
  row.querySelectorAll("select").forEach((select) => {
    select.disabled = pending || Boolean(busyPhase);
  });
  const status = row.querySelector("[data-application-row-message]");
  if (!status) return;
  status.hidden = !message;
  status.textContent = message;
  status.dataset.tone = tone;
}

function focusApplicationControl(applicationId, selector) {
  window.queueMicrotask(() => {
    const target = applicationRow(applicationId)?.querySelector(selector);
    if (target) {
      target.focus();
      return;
    }
    libraryStatusFilters.querySelector(".is-active")?.focus();
  });
}

function enqueueApplicationMutation(applicationId, mutation) {
  const previous = applicationMutationQueues.get(applicationId) || Promise.resolve();
  const queued = previous.catch(() => {}).then(mutation);
  applicationMutationQueues.set(applicationId, queued);
  return queued.finally(() => {
    if (applicationMutationQueues.get(applicationId) === queued) {
      applicationMutationQueues.delete(applicationId);
    }
  });
}

function replaceApplicationInLibrary(application) {
  const index = applicationLibrary.findIndex((entry) => entry.id === application.id);
  if (index !== -1) applicationLibrary[index] = application;
}

function renderApplicationGroup(container, applications, domain) {
  container.replaceChildren();
  if (!applications.length) {
    const empty = document.createElement("p");
    empty.className = "application-empty";
    empty.textContent = `Aucun poste ${domain.label} pour l’instant.`;
    container.append(empty);
    return;
  }

  applications.forEach((application) => {
    const entry = document.createElement("article");
    entry.className = "application-entry";
    entry.classList.toggle("is-selected", application.id === currentApplicationId);
    entry.classList.toggle("is-bulk-selected", selectedApplicationIds.has(application.id));
    entry.dataset.applicationEntryId = application.id;
    entry.dataset.status = normalizedApplicationStatus(application);

    const selectionControl = document.createElement("label");
    selectionControl.className = "application-selection-control";
    const selectionCheckbox = document.createElement("input");
    selectionCheckbox.className = "application-selection-checkbox";
    selectionCheckbox.type = "checkbox";
    selectionCheckbox.checked = selectedApplicationIds.has(application.id);
    selectionCheckbox.dataset.selectApplicationId = application.id;
    selectionCheckbox.setAttribute("aria-label", `Sélectionner ${applicationAccessibleName(application)}`);
    const selectionMark = document.createElement("span");
    selectionMark.setAttribute("aria-hidden", "true");
    selectionControl.append(selectionCheckbox, selectionMark);

    const openButton = document.createElement("button");
    openButton.className = "application-item-button";
    openButton.type = "button";
    openButton.dataset.applicationId = application.id;
    openButton.setAttribute("aria-current", application.id === currentApplicationId ? "page" : "false");
    const company = createTextElement("strong", "", application.result?.company || "Entreprise");
    const role = createTextElement("span", "", application.result?.role || activeProfile?.headline || "Poste ciblé");
    const metadata = createTextElement(
      "small",
      "",
      [
        application.sourceType === "spontaneous" ? "Spontanée" : "",
        application.result?.contractType?.toUpperCase(),
        formatApplicationDate(application.createdAt),
      ].filter(Boolean).join(" · ")
    );
    openButton.append(company, role, metadata);

    const controls = document.createElement("div");
    controls.className = "application-entry-controls";

    const domainLabel = document.createElement("label");
    domainLabel.className = "application-control application-domain-control";
    domainLabel.append(createTextElement("span", "visually-hidden", "Domaine"));
    const domainSelect = document.createElement("select");
    domainSelect.className = "move-application-select";
    domainSelect.dataset.moveApplicationId = application.id;
    domainSelect.dataset.previousValue = domain.id;
    domainSelect.setAttribute("aria-label", `Domaine de ${applicationAccessibleName(application)}, actuellement ${domain.label}`);
    activeProfile.domains.forEach((optionDomain) => {
      const option = document.createElement("option");
      option.value = optionDomain.id;
      option.textContent = optionDomain.label;
      option.selected = optionDomain.id === domain.id;
      domainSelect.append(option);
    });
    domainLabel.append(domainSelect);

    const status = normalizedApplicationStatus(application);
    const statusLabel = document.createElement("label");
    statusLabel.className = "application-control application-status-control";
    statusLabel.dataset.status = status;
    statusLabel.append(createTextElement("span", "status-indicator", ""));
    const statusSelect = document.createElement("select");
    statusSelect.className = "application-status-select";
    statusSelect.dataset.applicationStatusId = application.id;
    statusSelect.dataset.previousValue = status;
    const currentStatusLabel = APPLICATION_STATUSES.find((statusOption) => statusOption.id === status)?.label || "À envoyer";
    statusSelect.setAttribute("aria-label", `Statut de ${applicationAccessibleName(application)}, actuellement ${currentStatusLabel}`);
    APPLICATION_STATUSES.forEach((statusOption) => {
      const option = document.createElement("option");
      option.value = statusOption.id;
      option.textContent = statusOption.label;
      option.selected = statusOption.id === status;
      statusSelect.append(option);
    });
    statusLabel.append(statusSelect);
    controls.append(domainLabel, statusLabel);
    const rowMessage = createTextElement("p", "application-row-message", "");
    rowMessage.dataset.applicationRowMessage = "";
    rowMessage.setAttribute("role", "status");
    rowMessage.setAttribute("aria-live", "polite");
    rowMessage.hidden = true;
    entry.append(selectionControl, openButton, controls, rowMessage);
    container.append(entry);
  });
}

function renderApplicationLibrary() {
  updateLibraryOverview();
  renderLibraryBulkOptions();
  applicationGroups.replaceChildren();
  const normalizedQuery = normalizedLibrarySearchQuery();
  (activeProfile?.domains || []).forEach((domain, index) => {
    const section = document.createElement("section");
    section.className = "application-group";
    const titleId = `application-group-${domain.id}`;
    section.setAttribute("aria-labelledby", titleId);
    const header = document.createElement("header");
    const headerCopy = document.createElement("div");
    headerCopy.className = "application-group-heading";
    const heading = document.createElement("h3");
    heading.id = titleId;
    const mark = document.createElement("span");
    mark.className = `group-mark domain-tone-${index % 6}`;
    mark.setAttribute("aria-hidden", "true");
    heading.append(mark, document.createTextNode(domain.label));
    headerCopy.append(
      heading,
      createTextElement("small", "", "Automatique et modifiable")
    );
    const domainItems = applicationLibrary
      .filter((application) => application.category === domain.id)
      .sort((first, second) => {
        const priorityDifference = APPLICATION_STATUS_PRIORITY[normalizedApplicationStatus(first)]
          - APPLICATION_STATUS_PRIORITY[normalizedApplicationStatus(second)];
        if (priorityDifference) return priorityDifference;
        return Date.parse(second.applicationStatusUpdatedAt || second.createdAt)
          - Date.parse(first.applicationStatusUpdatedAt || first.createdAt);
      });
    const items = domainItems.filter((application) => (
      applicationMatchesStatusFilter(application)
      && applicationMatchesSearch(application, normalizedQuery)
    ));
    if ((normalizedQuery || libraryStatusFilter !== "all") && !items.length) return;
    const count = createTextElement("span", "group-count", String(items.length));
    header.append(headerCopy, count);
    const list = document.createElement("div");
    list.className = "application-list";
    const expanded = expandedLibraryGroups.has(domain.id) || Boolean(normalizedQuery);
    const visibleItems = expanded ? items : items.slice(0, 6);
    renderApplicationGroup(list, visibleItems, domain);
    if (items.length > visibleItems.length) {
      const moreButton = document.createElement("button");
      moreButton.className = "library-more-button";
      moreButton.type = "button";
      moreButton.dataset.expandLibraryGroup = domain.id;
      moreButton.textContent = `Voir ${items.length - visibleItems.length} autres`;
      list.append(moreButton);
    } else if (expanded && !normalizedQuery && items.length > 6) {
      const lessButton = document.createElement("button");
      lessButton.className = "library-more-button";
      lessButton.type = "button";
      lessButton.dataset.collapseLibraryGroup = domain.id;
      lessButton.textContent = "Réduire";
      list.append(lessButton);
    }
    section.append(header, list);
    applicationGroups.append(section);
  });
  if (!applicationGroups.childElementCount) {
    const emptyMessage = normalizedQuery
      ? "Aucune candidature ne correspond à cette recherche."
      : libraryStatusFilter === "follow_up"
        ? "Aucune relance en attente."
        : libraryStatusFilter === "closed"
          ? "Aucune candidature terminée."
          : "Aucune candidature dans ce filtre.";
    applicationGroups.append(createTextElement("p", "application-empty application-empty-global", emptyMessage));
  }
  syncLibraryBulkPanel();
  syncControlState();
}

async function loadApplicationLibrary() {
  try {
    const response = await fetch("/api/applications", { cache: "no-store" });
    if (!response.ok) throw new Error("Historique indisponible");
    const payload = await response.json();
    applicationLibrary = Array.isArray(payload.applications) ? payload.applications : [];
  } catch {
    applicationLibrary = [];
  }
  renderApplicationLibrary();
}

async function openApplication(applicationId) {
  if (busyPhase) return;
  formError.textContent = "";
  try {
    const response = await fetch(`/api/jobs/${applicationId}`, { cache: "no-store" });
    const job = await response.json();
    if (!response.ok || job.state !== "completed" || !job.result) throw new Error(job.error || "Candidature indisponible.");
    currentApplicationId = job.id;
    showResult(job);
    renderApplicationLibrary();
    document.querySelector(".preview-pane")?.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    formError.textContent = error instanceof Error ? error.message : "Impossible d’ouvrir cette candidature.";
  }
}

async function moveApplication(applicationId, category, previousCategory) {
  if (busyPhase) return;
  setApplicationRowMutationState(applicationId, {
    pending: true,
    message: "Enregistrement du domaine…",
  });
  try {
    const response = await fetch(`/api/applications/${applicationId}/category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category }),
    });
    const job = await response.json();
    if (!response.ok) throw new Error(job.error || "Déplacement impossible.");
    replaceApplicationInLibrary(job);
    if (currentApplicationId === job.id) {
      resultCategoryBadge.textContent = domainById(job.category).label;
      resultCategoryBadge.dataset.category = job.category;
    }
    libraryAnnouncement.textContent = `${applicationAccessibleName(job)} classée dans ${domainById(job.category).label}.`;
    renderApplicationLibrary();
    focusApplicationControl(applicationId, ".move-application-select");
  } catch (error) {
    const row = applicationRow(applicationId);
    const select = row?.querySelector(".move-application-select");
    if (select) select.value = previousCategory;
    setApplicationRowMutationState(applicationId, {
      message: `${error instanceof Error ? error.message : "Classement impossible."} Le domaine précédent est conservé.`,
      tone: "error",
    });
  }
}

async function updateApplicationStatus(applicationId, status, previousStatus) {
  if (busyPhase) return;
  const row = applicationRow(applicationId);
  const statusControl = row?.querySelector(".application-status-control");
  if (statusControl) statusControl.dataset.status = status;
  setApplicationRowMutationState(applicationId, {
    pending: true,
    message: "Enregistrement du statut…",
  });
  try {
    const response = await fetch(`/api/applications/${applicationId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const job = await response.json();
    if (!response.ok) throw new Error(job.error || "Mise à jour du statut impossible.");
    replaceApplicationInLibrary(job);
    const statusLabel = APPLICATION_STATUSES.find((option) => option.id === job.applicationStatus)?.label || "À envoyer";
    libraryAnnouncement.textContent = `${applicationAccessibleName(job)} est maintenant ${statusLabel.toLocaleLowerCase("fr")}.`;
    renderApplicationLibrary();
    focusApplicationControl(applicationId, ".application-status-select");
  } catch (error) {
    const currentRow = applicationRow(applicationId);
    const select = currentRow?.querySelector(".application-status-select");
    const control = currentRow?.querySelector(".application-status-control");
    if (select) select.value = previousStatus;
    if (control) control.dataset.status = previousStatus;
    setApplicationRowMutationState(applicationId, {
      message: `${error instanceof Error ? error.message : "Mise à jour impossible."} Le statut précédent est conservé.`,
      tone: "error",
    });
  }
}

async function updateSelectedApplications() {
  if (busyPhase || bulkApplicationMutationPending || !selectedApplicationIds.size) return;
  const category = libraryBulkCategory.value;
  const status = libraryBulkStatus.value;
  if (!category && !status) {
    setLibraryBulkMessage("Choisis au moins un domaine ou un statut.", "error");
    libraryBulkCategory.focus();
    return;
  }

  const ids = [...selectedApplicationIds];
  bulkApplicationMutationPending = true;
  setLibraryBulkMessage(`Mise à jour de ${ids.length} candidature${ids.length > 1 ? "s" : ""}…`);
  syncControlState();
  try {
    const response = await fetch("/api/applications/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, category, status }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Modification groupée impossible.");
    (Array.isArray(payload.applications) ? payload.applications : []).forEach(replaceApplicationInLibrary);
    if (currentApplicationId && category && ids.includes(currentApplicationId)) {
      resultCategoryBadge.textContent = domainById(category).label;
      resultCategoryBadge.dataset.category = category;
    }
    selectedApplicationIds.clear();
    libraryBulkCategory.value = "";
    libraryBulkStatus.value = "";
    const updatedCount = Number(payload.updated) || ids.length;
    const confirmation = `${updatedCount} candidature${updatedCount > 1 ? "s" : ""} mise${updatedCount > 1 ? "s" : ""} à jour.`;
    setLibraryBulkMessage(confirmation, "success");
    libraryAnnouncement.textContent = confirmation;
    renderApplicationLibrary();
    window.queueMicrotask(() => librarySelectAllButton.focus());
  } catch (error) {
    setLibraryBulkMessage(
      `${error instanceof Error ? error.message : "Modification groupée impossible."} Aucun changement partiel n’a été conservé.`,
      "error"
    );
  } finally {
    bulkApplicationMutationPending = false;
    syncControlState();
  }
}

function renderCategoryControl() {
  const selected = categoryControl.querySelector('input[name="category"]:checked')?.value || "auto";
  const domains = [{ id: "auto", label: "Auto" }, ...(activeProfile?.domains || [])];
  categoryControl.replaceChildren();
  domains.forEach((domain, index) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "category";
    input.value = domain.id;
    input.checked = selected === domain.id || (index === 0 && !domains.some((candidate) => candidate.id === selected));
    const span = document.createElement("span");
    span.textContent = domain.label;
    label.append(input, span);
    categoryControl.append(label);
  });
}

function renderProfileMenu() {
  profileMenuList.replaceChildren();
  profiles.forEach((profile) => {
    const button = document.createElement("button");
    button.className = "profile-menu-item";
    button.classList.toggle("is-active", profile.id === activeProfile?.id);
    button.type = "button";
    button.dataset.activateProfileId = profile.id;
    button.setAttribute("aria-current", profile.id === activeProfile?.id ? "true" : "false");
    button.append(
      createTextElement("span", "profile-avatar", profile.initials),
      createTextElement("strong", "", profile.name),
      createTextElement("small", "", profile.headline),
      createTextElement("span", "profile-menu-check", profile.id === activeProfile?.id ? "✓" : "")
    );
    profileMenuList.append(button);
  });
}

function applyActiveProfile() {
  if (!activeProfile) return;
  activeProfileInitials.textContent = activeProfile.initials;
  activeProfileName.textContent = activeProfile.name;
  activeProfileHeadline.textContent = activeProfile.headline;
  profileContextLine.textContent = activeProfile.headline;
  profileIntroText.textContent = `Colle une offre ou une liste de liens. OpenApply analyse, adapte et contrôle le CV et la lettre pour ${activeProfile.name}.`;
  renderCategoryControl();
  renderProfileMenu();
  renderApplicationLibrary();
}

async function loadProfiles() {
  const response = await fetch("/api/profiles", { cache: "no-store" });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Profils indisponibles.");
  profiles = Array.isArray(payload.profiles) ? payload.profiles : [];
  providers = Array.isArray(payload.providers) ? payload.providers : [];
  providerStatuses = payload.providerStatuses || {};
  activeProfile = profiles.find((profile) => profile.id === payload.activeProfileId) || profiles[0] || null;
  activeProviderStatus = payload.providerStatus || null;
  applyActiveProfile();
}

async function activateProfile(profileId) {
  if (!profileId || profileId === activeProfile?.id || busyPhase) return;
  const response = await fetch(`/api/profiles/${profileId}/activate`, { method: "POST" });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Impossible de changer de profil.");
  if (profileMenu.matches(":popover-open")) profileMenu.hidePopover();
  libraryStatusFilter = "all";
  librarySearchQuery = "";
  if (librarySearchField) librarySearchField.value = "";
  resetInterface();
  await loadProfiles();
  restoreIntakeDraft();
  await checkHealth({ autoPrompt: true });
  await loadApplicationLibrary();
  await restoreLatestJob();
  await loadProviderUsage();
  jobWatchPayload = null;
  await loadJobWatch({ hydrateSettings: true });
  if (settingsOpen) renderSettingsProfileList();
}

function showProfileSettings() {
  settingsOpen = true;
  profileSettings.hidden = false;
  workspace.hidden = true;
  document.querySelector(".app-shell").classList.add("settings-mode");
  if (profileMenu.matches(":popover-open")) profileMenu.hidePopover();
  renderSettingsProfileList();
  editProfile(activeProfile);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function hideProfileSettings() {
  settingsOpen = false;
  profileSettings.hidden = true;
  workspace.hidden = false;
  document.querySelector(".app-shell").classList.remove("settings-mode");
  profileFormError.textContent = "";
  topNewApplicationButton.focus();
}

function renderSettingsProfileList() {
  settingsProfileList.replaceChildren();
  profiles.forEach((profile) => {
    const row = document.createElement("article");
    row.className = "settings-profile-row";
    row.classList.toggle("is-selected", profile.id === editingProfileId);
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "settings-profile-edit";
    editButton.dataset.editProfileId = profile.id;
    editButton.append(
      createTextElement("span", "profile-avatar", profile.initials),
      createTextElement("strong", "", profile.name),
      createTextElement("small", "", profile.headline)
    );
    row.append(editButton);
    if (profile.id === activeProfile?.id) {
      row.append(createTextElement("span", "active-profile-label", "Actif"));
    } else {
      const activateButton = document.createElement("button");
      activateButton.type = "button";
      activateButton.className = "activate-profile-button";
      activateButton.dataset.activateSettingsProfileId = profile.id;
      activateButton.textContent = "Utiliser";
      row.append(activateButton);
    }
    settingsProfileList.append(row);
  });
}

function selectedProviderId() {
  return providerOptions.querySelector('input[name="provider"]:checked')?.value || "codex";
}

function initialsFromName(value) {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase() || "NP";
}

function editedProfile() {
  return profiles.find((profile) => profile.id === editingProfileId) || null;
}

function uploadedOrSaved(input, key) {
  return Boolean(input.files?.[0] || editedProfile()?.templates?.[key]);
}

function updateProfilePreview() {
  const profile = editedProfile();
  const isNew = !profile;
  const showCurrent = Boolean(activeProfile && (isNew || profile.id !== activeProfile.id));
  previewCurrentProfile.hidden = !showCurrent;
  previewProfileConnector.hidden = !showCurrent;
  if (activeProfile) {
    previewCurrentInitials.textContent = activeProfile.initials;
    previewCurrentName.textContent = activeProfile.name;
    previewCurrentHeadline.textContent = activeProfile.headline;
  }

  const name = profileNameField.value.trim();
  const headline = profileHeadlineField.value.trim();
  const domains = profileDomainsField.value.split(",").map((value) => value.trim()).filter(Boolean).slice(0, 6);
  const provider = providers.find((candidate) => candidate.id === selectedProviderId());
  const factsReady = profileFactsField.value.trim().length >= 80;
  const cvReady = uploadedOrSaved(profileCvFrField, "cvFr");
  const letterReady = uploadedOrSaved(profileCoverLetterField, "coverLetter");
  const requiredDocuments = Number(cvReady) + Number(letterReady);
  const providerReady = providerStatuses[provider?.id]?.ready || (profile?.provider === provider?.id && activeProviderStatus?.ready);
  const checks = [name.length >= 2, headline.length >= 3, domains.length > 0, factsReady, cvReady, letterReady, Boolean(providerReady)];
  const readiness = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  previewDraftLabel.textContent = isNew ? "Nouveau profil" : profile.id === activeProfile?.id ? "Profil actif en modification" : "Profil enregistré";
  previewDraftName.textContent = name || "Nom du candidat";
  previewDraftHeadline.textContent = headline || "Objectif professionnel";
  previewDraftInitials.textContent = initialsFromName(name);
  previewProvider.textContent = provider?.label || "À choisir";
  previewDocuments.textContent = `${requiredDocuments} sur 2 requis`;
  previewFacts.textContent = factsReady ? "Base prête" : "À renseigner";
  previewReadiness.textContent = readiness === 100 ? "Prêt" : `${readiness} %`;
  previewReadiness.classList.toggle("is-ready", readiness === 100);
  previewProgressBar.style.transform = `scaleX(${readiness / 100})`;
  previewDraftProfile.classList.toggle("is-ready", readiness === 100);
  previewDomains.replaceChildren(...(domains.length ? domains : ["Domaine"]).map((domain) => createTextElement("span", "preview-domain", domain)));
  profilePreviewNote.textContent = isNew
    ? "À l’enregistrement, ce profil apparaîtra sous le profil actif et gardera ses candidatures séparées."
    : "Les changements seront appliqués à ce profil sans toucher aux espaces des autres candidats.";
}

function updateProviderFields() {
  const provider = providers.find((candidate) => candidate.id === selectedProviderId());
  const status = providerStatuses[provider?.id] || (activeProviderStatus?.id === provider?.id ? activeProviderStatus : null);
  apiKeyField.hidden = provider?.auth !== "api-key";
  providerRuntimeFields.hidden = !provider?.modelRequired;
  providerRuntimeFields.classList.toggle("is-model-only", Boolean(provider?.modelRequired && !provider?.defaultBaseUrl));
  providerModelField.hidden = !provider?.modelRequired;
  providerEndpointField.hidden = !provider?.defaultBaseUrl;
  providerModelHelp.textContent = provider?.id === "antigravity"
    ? "Avec Flash High, OpenApply utilise Medium au premier passage puis High seulement si un contrôle échoue."
    : provider?.id === "ollama"
      ? status?.message || "OpenApply exige les outils et au moins 64k de contexte pour Ollama."
      : "Les modèles détectés sur le serveur local apparaissent ici.";

  if (provider?.modelRequired) {
    const profile = editedProfile();
    const savedModel = profile?.provider === provider.id ? profile.providerModel : "";
    const selectedModel = providerModel.dataset.provider === provider.id ? providerModel.value : savedModel || status?.selectedModel || "";
    const models = [...new Set([selectedModel, ...(status?.models || [])].filter(Boolean))];
    providerModel.replaceChildren();
    if (!models.length) {
      const option = new Option("Aucun modèle détecté", "");
      providerModel.append(option);
    } else {
      const detailsByModel = new Map((status?.modelDetails || []).map((detail) => [detail.id, detail]));
      models.forEach((model) => {
        const detail = detailsByModel.get(model);
        const context = detail?.contextLength >= 1_000
          ? `${Math.round(detail.contextLength / 1_000)}k`
          : "";
        const quality = {
          maximum: "qualité maximale",
          quality: "haute qualité",
          balanced: "rapide",
          incompatible: "incompatible",
        }[detail?.level] || "";
        const label = [
          model,
          detail?.parameterSize,
          context ? `${context} contexte` : "",
          quality,
        ].filter(Boolean).join(" · ");
        providerModel.append(new Option(label, model, false, model === selectedModel));
      });
    }
    providerModel.disabled = !models.length;
    providerModel.dataset.provider = provider.id;
    const savedEndpoint = profile?.provider === provider.id ? profile.providerBaseUrl : "";
    if (providerEndpoint.dataset.provider !== provider.id) {
      providerEndpoint.value = savedEndpoint || provider.defaultBaseUrl || "";
      providerEndpoint.dataset.provider = provider.id;
    }
  } else {
    providerModel.replaceChildren();
    providerModel.dataset.provider = "";
    providerEndpoint.value = "";
    providerEndpoint.dataset.provider = "";
  }

  const editingIsActive = editingProfileId === activeProfile?.id;
  const visibleStatus = editingIsActive && activeProviderStatus?.id === provider?.id ? activeProviderStatus : status;
  providerConnectionStatus.className = `provider-connection-status ${visibleStatus?.ready ? "is-ready" : "is-warning"}`;
  providerConnectionStatus.textContent = visibleStatus?.message || (provider?.auth === "api-key"
    ? "La clé sera enregistrée dans le coffre local chiffré."
    : "OpenApply te guide pour terminer cette connexion.");
  providerSetupButton.hidden = Boolean(visibleStatus?.ready);
  providerSetupButton.dataset.provider = provider?.id || "";
  providerSetupButton.textContent = provider?.auth === "api-key" ? "Ajouter la clé" : "Configurer visuellement";
  updateProfilePreview();
}

function renderProviderOptions(selectedId) {
  providerOptions.replaceChildren();
  [
    { id: "local", title: "Connexions locales", note: "Compte ou modèle local, sans clé à coller" },
    { id: "api", title: "Clés API", note: "Pour garder tes fournisseurs habituels" },
  ].forEach((group) => {
    const section = document.createElement("section");
    section.className = "provider-group";
    const heading = document.createElement("div");
    heading.className = "provider-group-heading";
    heading.append(createTextElement("h4", "", group.title), createTextElement("span", "", group.note));
    const grid = document.createElement("div");
    grid.className = "provider-option-grid";
    providers.filter((provider) => provider.group === group.id).forEach((provider) => {
      const label = document.createElement("label");
      label.className = "provider-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "provider";
      input.value = provider.id;
      input.checked = provider.id === selectedId;
      const copy = document.createElement("span");
      copy.append(createTextElement("strong", "", provider.label), createTextElement("small", "", provider.description));
      const status = providerStatuses[provider.id];
      const needsModel = provider.id === "ollama" && status?.installed && !status?.qualityReady;
      const badge = createTextElement(
        "span",
        `provider-ready-dot ${status?.ready ? "is-ready" : ""}`,
        status?.ready ? "Prêt" : needsModel ? "Modèle requis" : "À connecter"
      );
      label.append(input, copy, badge);
      grid.append(label);
    });
    section.append(heading, grid);
    providerOptions.append(section);
  });
  updateProviderFields();
}

function setTemplateState(element, ready, optional = false, custom = false) {
  element.textContent = ready
    ? custom ? "Modèle personnalisé actif. Choisir un fichier le remplace." : "Modèle actif. Choisir un fichier le remplace."
    : optional ? "Optionnel, ajout possible à tout moment." : "À ajouter";
  element.classList.toggle("is-ready", ready);
}

function editProfile(profile = null) {
  editingProfileId = profile?.id || null;
  profileForm.reset();
  profileFormError.textContent = "";
  const isNew = !profile;
  profileFormMode.textContent = isNew ? "Nouveau candidat" : profile.id === activeProfile?.id ? "Profil actif" : "Profil enregistré";
  profileFormTitle.textContent = isNew ? "Créer un espace séparé" : profile.name;
  profileNameField.value = profile?.name || "";
  profileHeadlineField.value = profile?.headline || "";
  profileDomainsField.value = profile?.domains.map((domain) => domain.label).join(", ") || "";
  profileFactsField.value = profile?.facts || "";
  profileNameField.disabled = false;
  profileFactsField.hidden = false;
  lockedProfileNote.hidden = true;
  profileTemplatesSection.classList.remove("is-locked");
  profileCvFrField.disabled = false;
  profileCvEnField.disabled = false;
  profileCoverLetterField.disabled = false;
  setTemplateState(profileCvFrState, Boolean(profile?.templates.cvFr), false, Boolean(profile?.templates.overrides?.cvFr));
  setTemplateState(profileCvEnState, Boolean(profile?.templates.cvEn), true, Boolean(profile?.templates.overrides?.cvEn));
  setTemplateState(profileCoverLetterState, Boolean(profile?.templates.coverLetter), false, Boolean(profile?.templates.overrides?.coverLetter));
  const configured = Boolean(profile?.factsReady && profile?.templatesReady);
  profileConfigurationStatus.textContent = configured ? "Configuré" : isNew ? "À compléter" : "Incomplet";
  profileConfigurationStatus.classList.toggle("is-incomplete", !configured);
  renderProviderOptions(profile?.provider || "codex");
  providerModel.dataset.provider = "";
  providerEndpoint.dataset.provider = "";
  updateProviderFields();
  providerApiKey.value = "";
  saveProfileButton.textContent = isNew ? "Créer et utiliser ce profil" : "Enregistrer le profil";
  cancelProfileEditButton.textContent = isNew ? "Revenir au profil actif" : "Annuler";
  renderSettingsProfileList();
  updateProfilePreview();
}

async function filePayload(input) {
  const file = input.files?.[0];
  if (!file) return null;
  if (!file.name.toLowerCase().endsWith(".docx")) throw new Error(`${file.name} doit être un fichier DOCX.`);
  if (file.size > 6 * 1024 * 1024) throw new Error(`${file.name} dépasse 6 Mo.`);
  const data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(new Error(`Impossible de lire ${file.name}.`)));
    reader.readAsDataURL(file);
  });
  return { name: file.name, data };
}

async function initialize() {
  await loadProfiles();
  restoreIntakeDraft();
  await checkHealth({ autoPrompt: true });
  await loadApplicationLibrary();
  await restoreLatestJob();
  await loadProviderUsage();
  await loadJobWatch({ hydrateSettings: true });
}

function updateSubmitLabel() {
  if (busyPhase === "analysis") {
    submitLabel.textContent = busyScope === "bundle" ? "Analyse du lot" : "Analyse en cours";
    return;
  }
  if (sourceMode === "spontaneous") {
    const count = spontaneousTargets.length;
    submitLabel.textContent = count > 1 ? `Préparer ${count} candidatures` : "Préparer la candidature";
    return;
  }
  const count = sourceMode === "links" ? offerLinks.length : 1;
  submitLabel.textContent = count > 1 ? `Analyser ${count} offres` : "Analyser l’offre";
}

function updateSourceMeta() {
  const count = sourceMode === "spontaneous" ? spontaneousTargets.length : offerLinks.length;
  if (sourceMode === "spontaneous") {
    offerSlotCount.textContent = `${count} / ${MAX_OFFERS} ${count > 1 ? "cibles" : "cible"}`;
  } else if (sourceMode === "text") {
    offerSlotCount.textContent = "1 offre";
  } else {
    offerSlotCount.textContent = `${count} / ${MAX_OFFERS} ${count > 1 ? "postes" : "poste"}`;
  }
  const addLabel = addOfferButton.querySelector(".add-offer-label");
  addLabel.textContent = offerLinks.length >= MAX_OFFERS ? `${MAX_OFFERS} postes ajoutés` : "Ajouter un poste";
  addOfferButton.disabled = offerLinks.length >= MAX_OFFERS || Boolean(busyPhase) || intakeLocked;
  const spontaneousLabel = addSpontaneousTargetButton.querySelector(".add-spontaneous-label");
  spontaneousLabel.textContent = spontaneousTargets.length >= MAX_OFFERS
    ? `${MAX_OFFERS} entreprises ajoutées`
    : "Ajouter une entreprise";
  addSpontaneousTargetButton.disabled = spontaneousTargets.length >= MAX_OFFERS || Boolean(busyPhase) || intakeLocked;
  offerLinkList.classList.toggle("is-volume", offerLinks.length > 6);
  spontaneousTargetList.classList.toggle("is-volume", spontaneousTargets.length > 4);
  updateSubmitLabel();
}

function clearLinkError(index) {
  const input = document.querySelector(`#offer-link-${index + 1}`);
  const error = document.querySelector(`#offer-link-error-${index + 1}`);
  input?.removeAttribute("aria-invalid");
  if (error) error.textContent = "";
}

function renderOfferLinks({ focusIndex = -1, animateIndex = -1 } = {}) {
  const fragment = document.createDocumentFragment();
  offerLinks.forEach((value, index) => {
    const row = document.createElement("div");
    row.className = "offer-link-row";
    if (index === animateIndex) row.classList.add("is-new");
    row.dataset.index = String(index);

    const marker = document.createElement("span");
    marker.className = "offer-marker";
    marker.setAttribute("aria-hidden", "true");
    marker.textContent = String(index + 1);

    const field = document.createElement("div");
    field.className = "offer-link-field";
    const label = document.createElement("label");
    label.htmlFor = `offer-link-${index + 1}`;
    label.textContent = `Poste ${index + 1}`;
    const input = document.createElement("input");
    input.className = "offer-link-input";
    input.id = `offer-link-${index + 1}`;
    input.name = "offerLink";
    input.type = "url";
    input.inputMode = "url";
    input.autocomplete = "url";
    input.placeholder = "https://entreprise.com/carrieres/poste-cyber";
    input.value = value;
    input.required = true;
    input.setAttribute("aria-describedby", `offer-link-error-${index + 1}`);
    const error = document.createElement("p");
    error.className = "link-row-error";
    error.id = `offer-link-error-${index + 1}`;
    error.setAttribute("role", "alert");
    field.append(label, input, error);

    if (index === 0) {
      const spacer = document.createElement("span");
      spacer.className = "remove-offer-spacer";
      spacer.setAttribute("aria-hidden", "true");
      row.append(marker, field, spacer);
    } else {
      const removeButton = document.createElement("button");
      removeButton.className = "remove-offer-button";
      removeButton.type = "button";
      removeButton.dataset.removeIndex = String(index);
      removeButton.setAttribute("aria-label", `Supprimer le poste ${index + 1}`);
      removeButton.textContent = "×";
      row.append(marker, field, removeButton);
    }
    fragment.append(row);
  });
  offerLinkList.replaceChildren(fragment);
  updateSourceMeta();
  syncControlState();
  if (focusIndex >= 0) document.querySelector(`#offer-link-${focusIndex + 1}`)?.focus();
}

function renderSpontaneousTargets({ focusIndex = -1, animateIndex = -1 } = {}) {
  const fragment = document.createDocumentFragment();
  spontaneousTargets.forEach((target, index) => {
    const article = document.createElement("article");
    article.className = "spontaneous-target";
    if (index === animateIndex) article.classList.add("is-new");
    article.dataset.targetIndex = String(index);

    const heading = document.createElement("header");
    const identity = document.createElement("div");
    const marker = createTextElement("span", "offer-marker spontaneous-marker", String(index + 1));
    marker.setAttribute("aria-hidden", "true");
    identity.append(marker, createTextElement("strong", "", `Cible ${index + 1}`));
    heading.append(identity);
    if (index > 0) {
      const removeButton = document.createElement("button");
      removeButton.className = "remove-spontaneous-button";
      removeButton.type = "button";
      removeButton.dataset.removeTargetIndex = String(index);
      removeButton.setAttribute("aria-label", `Supprimer la cible ${index + 1}`);
      removeButton.textContent = "Supprimer";
      heading.append(removeButton);
    }

    const fields = document.createElement("div");
    fields.className = "spontaneous-fields";
    const fieldDefinitions = [
      {
        key: "company",
        label: "Entreprise",
        placeholder: "Exemple : Airbus",
        required: true,
        maxLength: 120,
        autocomplete: "organization",
      },
      {
        key: "role",
        label: "Poste ou équipe visée",
        placeholder: "Exemple : Analyste SOC",
        required: true,
        maxLength: 160,
        autocomplete: "off",
      },
      {
        key: "website",
        label: "Lien de candidature spontanée ou page carrières",
        placeholder: "https://entreprise.com/carrieres",
        help: "Colle le lien exact d’une page dédiée, d’une offre générique ou d’une campagne. Sinon, utilise la page carrières ou le site officiel.",
        required: false,
        maxLength: 500,
        autocomplete: "url",
        inputMode: "url",
      },
      {
        key: "notes",
        label: "Angle à mettre en avant",
        placeholder: "Optionnel : équipe, secteur, expertise ou motivation",
        required: false,
        maxLength: 500,
        autocomplete: "off",
      },
    ];

    fieldDefinitions.forEach((definition) => {
      const wrapper = document.createElement("div");
      wrapper.className = `spontaneous-field field-${definition.key}`;
      const inputId = `spontaneous-${definition.key}-${index + 1}`;
      const errorId = `${inputId}-error`;
      const labelText = definition.required ? definition.label : `${definition.label} (optionnel)`;
      const fieldLabel = createTextElement("label", "", labelText);
      fieldLabel.htmlFor = inputId;
      wrapper.append(fieldLabel);
      const input = document.createElement("input");
      input.id = inputId;
      input.dataset.targetField = definition.key;
      input.type = definition.key === "website" ? "url" : "text";
      input.inputMode = definition.inputMode || "text";
      input.autocomplete = definition.autocomplete;
      input.maxLength = definition.maxLength;
      input.placeholder = definition.placeholder;
      input.value = target[definition.key];
      input.required = definition.required;
      const describedBy = [];
      if (definition.help) describedBy.push(`${inputId}-help`);
      describedBy.push(errorId);
      input.setAttribute("aria-describedby", describedBy.join(" "));
      if (definition.help) {
        const help = createTextElement("small", "spontaneous-field-help", definition.help);
        help.id = `${inputId}-help`;
        wrapper.append(input, help);
      } else {
        wrapper.append(input);
      }
      const error = createTextElement("small", "target-field-error", "");
      error.id = errorId;
      error.setAttribute("role", "alert");
      wrapper.append(error);
      fields.append(wrapper);
    });

    article.append(heading, fields);
    fragment.append(article);
  });
  spontaneousTargetList.replaceChildren(fragment);
  updateSourceMeta();
  syncControlState();
  if (focusIndex >= 0) document.querySelector(`#spontaneous-company-${focusIndex + 1}`)?.focus();
}

function setSourceMode(mode, { focus = true, persist = true } = {}) {
  sourceMode = ["links", "text", "spontaneous"].includes(mode) ? mode : "links";
  const isText = sourceMode === "text";
  const isSpontaneous = sourceMode === "spontaneous";
  const isLinks = !isText && !isSpontaneous;
  sourceComposer.classList.toggle("text-mode", isText);
  sourceComposer.classList.toggle("spontaneous-mode", isSpontaneous);
  linkOfferRegion.hidden = !isLinks;
  textOfferRegion.hidden = !isText;
  spontaneousRegion.hidden = !isSpontaneous;
  linkModeButton.classList.toggle("is-active", isLinks);
  textModeButton.classList.toggle("is-active", isText);
  spontaneousModeButton.classList.toggle("is-active", isSpontaneous);
  linkModeButton.setAttribute("aria-pressed", String(isLinks));
  textModeButton.setAttribute("aria-pressed", String(isText));
  spontaneousModeButton.setAttribute("aria-pressed", String(isSpontaneous));
  sourceComposerTitle.textContent = isSpontaneous ? "Entreprises à cibler" : isText ? "Offre à analyser" : "Offres à analyser";
  sourceComposerHelp.textContent = isSpontaneous
    ? "Ajoute une ou plusieurs entreprises. Chaque CV et lettre sera personnalisé sans prétendre répondre à une offre publiée."
    : isText
      ? "Colle une annonce complète lorsque son lien est privé, expiré ou inaccessible."
      : "Colle un lien ou toute une colonne Excel dans le premier champ. Un poste sera créé automatiquement par lien, jusqu’à 10.";
  contractHelp.textContent = isSpontaneous
    ? "Pour une candidature spontanée, choisis explicitement CDI ou Alternance."
    : "Auto lit le type de contrat dans l’offre. Ton choix manuel reste prioritaire.";
  languageHelp.textContent = isSpontaneous
    ? "Auto suit la langue de la page fournie si elle est accessible, sinon utilise le français."
    : "Auto suit la langue dominante de l’offre. Le CV FR ou EN sert aussi bien au CDI qu’à l’alternance.";
  contractFieldset.removeAttribute("aria-invalid");
  if (isSpontaneous && spontaneousTargets.length === 1 && !spontaneousTargets[0].role.trim() && activeProfile?.headline) {
    spontaneousTargets[0].role = activeProfile.headline;
    renderSpontaneousTargets();
  }
  if (!isLinks) bulkImportRegion.hidden = true;
  updateSubmitLabel();
  updateSourceMeta();
  if (persist) scheduleIntakeDraftSave();
  if (focus) focusCurrentSource();
}

function resetSourceComposer() {
  offerLinks = [""];
  spontaneousTargets = [emptySpontaneousTarget()];
  offerTextField.value = "";
  offerTextCount.textContent = "0 / 60 000";
  bulkOfferLinks.value = "";
  bulkImportCount.textContent = "0 lien détecté";
  bulkImportRegion.hidden = true;
  setSourceMode("links", { focus: false, persist: false });
  renderOfferLinks();
  renderSpontaneousTargets();
}

function setSourceDisabled(disabled) {
  offerLinkList.querySelectorAll("input, button").forEach((control) => {
    control.disabled = disabled;
  });
  addOfferButton.disabled = disabled || offerLinks.length >= MAX_OFFERS;
  bulkImportButton.disabled = disabled;
  bulkOfferLinks.disabled = disabled;
  confirmBulkImportButton.disabled = disabled;
  cancelBulkImportButton.disabled = disabled;
  textModeButton.disabled = disabled;
  linkModeButton.disabled = disabled;
  spontaneousModeButton.disabled = disabled;
  offerTextField.disabled = disabled;
  spontaneousTargetList.querySelectorAll("input, button").forEach((control) => {
    control.disabled = disabled;
  });
  addSpontaneousTargetButton.disabled = disabled || spontaneousTargets.length >= MAX_OFFERS;
}

function focusCurrentSource() {
  const target = sourceMode === "text"
    ? offerTextField
    : sourceMode === "spontaneous"
      ? document.querySelector(".spontaneous-target input")
      : document.querySelector(".offer-link-input");
  target?.focus();
}

function syncControlState() {
  const busy = Boolean(busyPhase);
  setSourceDisabled(busy || intakeLocked);
  document.querySelectorAll('input[name="category"], input[name="mode"], input[name="language"]').forEach((input) => {
    input.disabled = busy || intakeLocked;
  });
  document.querySelectorAll(".application-item-button, #topNewApplicationButton, #libraryNewApplicationButton, #profileMenuButton").forEach((control) => {
    control.disabled = busy;
  });
  document.querySelectorAll(".move-application-select, .application-status-select").forEach((control) => {
    control.disabled = busy || librarySelectionMode || bulkApplicationMutationPending;
  });
  document.querySelectorAll(".application-selection-checkbox").forEach((control) => {
    control.disabled = busy || bulkApplicationMutationPending;
  });
  syncLibraryBulkPanel();
  bundleRetryFailuresButton.disabled = busy;
  skillsReviewForm.querySelectorAll("select, input, button").forEach((control) => {
    control.disabled = busy;
  });
  previousOfferButton.disabled = busy || bundleReviewIndex === 0;
}

function updateReviewActionLabel() {
  if (busyPhase === "generation") {
    generateButton.textContent = busyScope === "bundle" ? "Génération du bundle…" : "Génération en cours…";
    return;
  }
  if (currentBundle && bundleReviewItems.length) {
    generateButton.textContent = bundleReviewIndex < bundleReviewItems.length - 1
      ? currentSourceType === "spontaneous"
        ? "Enregistrer et passer à la cible suivante"
        : "Enregistrer et passer à l’offre suivante"
      : `Générer le lot (${currentBundle.items.filter((item) => item.state === "needs_input").length})`;
  } else {
    generateButton.textContent = "Générer avec mes réponses";
  }
}

function setBusy(busy, phase = null, scope = "single") {
  busyPhase = busy ? phase || busyPhase || "generation" : null;
  if (busy) busyScope = scope;
  submitButton.disabled = busy;
  submitButton.classList.toggle("loading", busy && busyPhase === "analysis");
  updateSubmitLabel();
  cancelButton.hidden = !busy;
  updateReviewActionLabel();
  syncControlState();
}

function setIntakeLocked(locked) {
  intakeLocked = locked;
  syncControlState();
}

function updateRecoveryModels() {
  const providerId = recoveryProvider.value;
  const status = providerStatuses[providerId];
  const models = status?.models || [];
  recoveryModel.replaceChildren();
  if (models.length) {
    models.forEach((model) => recoveryModel.append(new Option(model, model)));
    const previousModel = failedRequest?.providerModel || "";
    recoveryModel.value = models.includes(previousModel) ? previousModel : status.selectedModel || models[0];
  } else {
    recoveryModel.append(new Option("Modèle géré automatiquement", ""));
  }
  recoveryModelField.hidden = !models.length;
}

function hideRecovery() {
  recoveryPanel.hidden = true;
  recoveryError.textContent = "";
  failedRequest = null;
}

function renderRecovery(job) {
  const isBundle = job.kind === "bundle";
  const resumable = isBundle ? job.retryableFailures > 0 : job.canResume;
  if (!resumable || job.state !== "failed") {
    hideRecovery();
    return;
  }
  failedRequest = {
    kind: isBundle ? "bundle" : "job",
    id: job.id,
    provider: job.provider,
    providerModel: job.providerModel || "",
    resumeFrom: isBundle ? "checkpoint" : job.resumeFrom,
  };
  const readyProviders = providers.filter((provider) => providerStatuses[provider.id]?.ready);
  recoveryProvider.replaceChildren();
  readyProviders.forEach((provider) => {
    recoveryProvider.append(new Option(provider.label, provider.id));
  });
  const preferredProvider = job.failureKind === "quota"
    ? readyProviders.find((provider) => provider.id !== job.provider)?.id || job.provider
    : job.provider;
  if (readyProviders.some((provider) => provider.id === preferredProvider)) {
    recoveryProvider.value = preferredProvider;
  }
  recoveryKicker.textContent = job.failureKind === "quota"
    ? "Quota épuisé, changement conseillé"
    : "Checkpoint disponible";
  recoveryMessage.textContent = isBundle
    ? "Les analyses et réponses déjà validées sont conservées. Seules les étapes en échec seront reprises."
    : job.resumeFrom === "generation"
      ? "L’analyse et tes réponses sont conservées. La génération reprend directement."
      : "L’offre et sa classification locale sont conservées. Seule l’analyse IA reprend.";
  recoveryStage.textContent = isBundle
    ? `${job.retryableFailures} élément${job.retryableFailures > 1 ? "s" : ""} à reprendre`
    : job.resumeFrom === "generation"
      ? "Reprise : adaptation"
      : "Reprise : analyse";
  resumeJobButton.textContent = preferredProvider !== job.provider
    ? "Changer et reprendre"
    : "Reprendre";
  resumeJobButton.disabled = readyProviders.length === 0;
  updateRecoveryModels();
  errorReportLink.hidden = !job.errorReportUrl;
  if (job.errorReportUrl) errorReportLink.href = job.errorReportUrl;
  recoveryPanel.hidden = false;
  if (job.failureKind === "quota") void loadProviderUsage({ force: true });
}

function setProgress(job, options = {}) {
  progressRegion.hidden = false;
  progressRegion.dataset.state = job.state || "";
  progressRegion.classList.toggle("is-complete", job.state === "completed");
  progressTitle.textContent = job.retryCount && ["queued", "running"].includes(job.state)
    ? "Nouvelle tentative automatique"
    : job.state === "completed"
    ? "Traitement terminé"
    : job.state === "needs_input"
      ? "Analyse terminée"
      : job.state === "failed"
        ? "Traitement interrompu"
        : job.state === "canceled"
          ? "Traitement annulé"
          : "Traitement en cours";
  progressMessage.textContent = job.error || job.message || job.stageLabel;
  const metadata = [
    providers.find((provider) => provider.id === job.provider)?.label || job.provider,
    job.modelUsed || job.providerModel || "",
    job.classification?.family?.label || "",
    job.tokenUsage?.totalTokens ? `${formatTokenCount(job.tokenUsage.totalTokens)} tokens` : "",
  ].filter(Boolean);
  processMetadata.textContent = metadata.join(" · ");
  progressPercent.textContent = `${job.progress} %`;
  progressBar.style.transform = `scaleX(${job.progress / 100})`;
  notifyProgressMilestones(job.stage, options);
  const order = ["analyzing", "review", "drafting", "verifying", "completed"];
  const visibleStage = job.stage === "packaging" ? "completed" : job.stage;
  const activeIndex = order.indexOf(visibleStage);
  steps.forEach((step, index) => {
    step.classList.toggle("done", activeIndex > index || visibleStage === "completed" && job.stage === "completed");
    step.classList.toggle("active", activeIndex === index && job.stage !== "completed");
  });
  if (job.state === "failed") renderRecovery(job);
  else if (job.state !== "canceled") hideRecovery();
}

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function formatWatchDate(value, fallback = "Date non publiée") {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function watchContractLabel(value) {
  if (value === "alternance") return "Alternance";
  if (value === "cdi") return "CDI";
  return "Contrat à confirmer";
}

function activateJobWatchTab(tabName, { focus = false } = {}) {
  const selected = Object.hasOwn(jobWatchViews, tabName) ? tabName : "offers";
  jobWatchTabs.forEach((tab) => {
    const active = tab.dataset.watchTab === selected;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });
  Object.entries(jobWatchViews).forEach(([name, view]) => {
    view.hidden = name !== selected;
    if (name === selected) view.scrollTop = 0;
  });
}

function renderJobWatchCredentials(payload) {
  const franceConnected = Boolean(payload.credentials?.franceTravail);
  const alternanceConnected = Boolean(payload.credentials?.laBonneAlternance);
  const connectedCount = Number(franceConnected) + Number(alternanceConnected);

  franceTravailSourceCard.dataset.connected = String(franceConnected);
  franceTravailConnectionState.textContent = franceConnected ? "Connecté" : "À connecter";
  franceTravailCredentialStatus.textContent = franceConnected
    ? "Connexion chiffrée sur cet appareil."
    : "Les deux champs sont nécessaires.";
  franceTravailCredentialStatus.dataset.state = franceConnected ? "success" : "";
  connectFranceTravailButton.textContent = franceConnected ? "Remplacer la connexion" : "Vérifier et connecter";
  disconnectFranceTravailButton.hidden = !franceConnected;
  franceTravailClientId.placeholder = franceConnected ? "Nouvel identifiant, si besoin" : "Identifiant développeur";
  franceTravailClientSecret.placeholder = franceConnected ? "Nouveau secret, si besoin" : "Secret développeur";

  laBonneAlternanceSourceCard.dataset.connected = String(alternanceConnected);
  laBonneAlternanceConnectionState.textContent = alternanceConnected ? "Connectée" : "À connecter";
  laBonneAlternanceCredentialStatus.textContent = alternanceConnected
    ? "Connexion chiffrée sur cet appareil."
    : "Aucune carte bancaire nécessaire.";
  laBonneAlternanceCredentialStatus.dataset.state = alternanceConnected ? "success" : "";
  connectLaBonneAlternanceButton.textContent = alternanceConnected ? "Remplacer le jeton" : "Vérifier et connecter";
  disconnectLaBonneAlternanceButton.hidden = !alternanceConnected;
  laBonneAlternanceToken.placeholder = alternanceConnected ? "Nouveau jeton, si besoin" : "Jeton d’accès";

  jobWatchCredentialState.textContent = connectedCount === 1 ? "1 sur 2 source connectée" : `${connectedCount} sur 2 sources connectées`;
  jobWatchSourcesTabCount.textContent = `${connectedCount}/2`;
}

function renderJobWatchSettings(payload) {
  jobWatchEnabled.checked = Boolean(payload.enabled);
  jobWatchQuery.value = payload.query || "";
  jobWatchLocation.value = payload.location || "";
  jobWatchContract.value = ["all", "cdi", "alternance"].includes(payload.contract) ? payload.contract : "all";
  jobWatchSeniority.value = payload.seniority === "entry" ? "entry" : "all";
  jobWatchInterval.value = String(payload.intervalMinutes || 30);
  jobWatchSuggestedFamilies = Array.isArray(payload.suggestedFamilies) ? payload.suggestedFamilies : [];
  jobWatchProfileFilter.checked = Array.isArray(payload.families) && payload.families.length > 0;
  jobWatchProfileFilter.disabled = jobWatchSuggestedFamilies.length === 0;
  jobWatchAtsSources.value = payload.atsSourcesText || "";
  const publicCount = Array.isArray(payload.atsSources) ? payload.atsSources.length : 0;
  jobWatchPublicSourceCount.textContent = `${publicCount} page${publicCount > 1 ? "s" : ""} carrière configurée${publicCount > 1 ? "s" : ""}`;
}

function renderJobWatchSources(payload) {
  jobWatchSources.replaceChildren();
  const sources = Array.isArray(payload.sources) ? payload.sources : [];
  sources.forEach((source) => {
    const row = document.createElement("div");
    row.className = "job-watch-source";
    row.dataset.state = source.state || "";
    row.append(
      createTextElement("span", "job-watch-source-dot", ""),
      createTextElement("strong", "", source.name || source.id),
      createTextElement("b", "", source.state === "ready" ? `${source.count || 0} offre${source.count > 1 ? "s" : ""}` : ""),
      createTextElement("small", "", source.message || "")
    );
    jobWatchSources.append(row);
  });
  if (!sources.length) {
    jobWatchSources.append(createTextElement("p", "job-watch-empty-source", "Lance une première recherche pour vérifier les sources."));
  }
  const readyCount = sources.filter((source) => source.state === "ready").length;
  jobWatchSourceSummary.textContent = readyCount
    ? `État détaillé · ${readyCount} source${readyCount > 1 ? "s" : ""} en direct`
    : "État détaillé des sources";
}

function renderJobWatch(payload, { hydrateSettings = false } = {}) {
  jobWatchPayload = payload;
  if (hydrateSettings) renderJobWatchSettings(payload);
  renderJobWatchCredentials(payload);
  renderJobWatchSources(payload);

  const jobs = Array.isArray(payload.jobs) ? payload.jobs : [];
  const newJobs = jobs.filter((job) => job.isNew);
  const sources = Array.isArray(payload.sources) ? payload.sources : [];
  const publicSourceCount = sources.filter((source) => source.state === "ready" && /^(greenhouse|lever):/.test(source.id)).length;
  const officialSourceCount = sources.filter((source) => source.state === "ready" && ["francetravail", "labonnealternance"].includes(source.id)).length;
  const readySourceCount = sources.filter((source) => source.state === "ready").length;
  const failedSourceCount = sources.filter((source) => source.state === "error").length;
  jobWatchButton.classList.toggle("has-new", newJobs.length > 0);
  jobWatchBadge.hidden = newJobs.length === 0;
  jobWatchBadge.textContent = String(Math.min(99, newJobs.length));
  jobWatchSummaryValue.textContent = !payload.enabled
    ? "Désactivée"
    : newJobs.length
      ? `${newJobs.length} nouvelle${newJobs.length > 1 ? "s" : ""}`
      : payload.lastSuccessfulScanAt
        ? "À jour"
        : "Prête";
  jobWatchButton.setAttribute(
    "aria-label",
    newJobs.length
      ? `Veille d’offres, ${newJobs.length} nouvelle${newJobs.length > 1 ? "s" : ""} offre${newJobs.length > 1 ? "s" : ""}`
      : payload.enabled
        ? "Veille d’offres, aucune nouveauté"
        : "Veille d’offres désactivée"
  );
  jobWatchResultCount.textContent = String(jobs.length);
  jobWatchOffersTabCount.textContent = String(jobs.length);
  jobWatchUpdatedAt.textContent = payload.lastScanAt
    ? formatWatchDate(payload.lastScanAt)
    : "En attente";
  jobWatchCoverage.textContent = failedSourceCount
    ? `${readySourceCount} active${readySourceCount > 1 ? "s" : ""} · ${failedSourceCount} en erreur`
    : readySourceCount
      ? `${readySourceCount} source${readySourceCount > 1 ? "s" : ""} en direct`
      : `${publicSourceCount} page${publicSourceCount > 1 ? "s" : ""} prête${publicSourceCount > 1 ? "s" : ""}`;
  jobWatchError.hidden = !payload.lastError;
  jobWatchError.textContent = payload.lastError || "";
  importAllWatchJobsButton.disabled = newJobs.length === 0;
  markAllWatchJobsSeenButton.disabled = newJobs.length === 0;

  jobWatchResults.replaceChildren();
  if (!jobs.length) {
    const empty = document.createElement("div");
    empty.className = "job-watch-empty";
    const title = !payload.enabled ? "La veille est en pause" : "Aucune offre pour le moment";
    const copy = !payload.enabled
      ? "Active-la et OpenApply cherchera automatiquement de nouvelles offres."
      : officialSourceCount === 0
        ? "Connecte une source française pour élargir la recherche."
        : "Tes critères sont enregistrés. OpenApply continue de surveiller les sources.";
    const action = document.createElement("button");
    action.type = "button";
    action.dataset.openWatchTab = !payload.enabled ? "search" : officialSourceCount === 0 ? "sources" : "search";
    action.textContent = !payload.enabled ? "Activer la veille" : officialSourceCount === 0 ? "Connecter une source" : "Ajuster les critères";
    empty.append(
      createTextElement("strong", "", title),
      createTextElement("span", "", copy),
      action
    );
    jobWatchResults.append(empty);
    return;
  }

  jobs.slice(0, 40).forEach((job) => {
    const article = document.createElement("article");
    article.className = "job-watch-result";
    article.classList.toggle("is-new", Boolean(job.isNew));
    article.dataset.watchJobId = job.id;

    const main = document.createElement("div");
    main.className = "job-watch-result-main";
    const title = createTextElement("h3", "job-watch-result-title", job.title);
    main.append(title);
    if (job.isNew) title.append(createTextElement("span", "visually-hidden", ", nouvelle offre"));
    main.append(createTextElement("p", "job-watch-result-company", `${job.company}${job.location ? `, ${job.location}` : ""}`));
    const meta = document.createElement("div");
    meta.className = "job-watch-result-meta";
    [
      watchContractLabel(job.contract),
      job.classification?.family?.label || "",
      job.sourceName || "",
      job.sourceStale ? "Dernière vérification connue, source temporairement indisponible" : "",
      job.updatedAt || job.publishedAt
        ? `Publié ou actualisé le ${formatWatchDate(job.updatedAt || job.publishedAt, "")}`
        : "",
    ].filter(Boolean).forEach((value) => meta.append(createTextElement("span", "", value)));
    main.append(meta);

    const actions = document.createElement("div");
    actions.className = "job-watch-result-actions";
    const viewLink = document.createElement("a");
    viewLink.href = job.applyUrl || job.url;
    viewLink.target = "_blank";
    viewLink.rel = "noopener noreferrer";
    viewLink.textContent = "Voir";
    actions.append(viewLink);
    if (job.isNew) {
      const ignoreButton = document.createElement("button");
      ignoreButton.type = "button";
      ignoreButton.dataset.ignoreWatchJobId = job.id;
      ignoreButton.textContent = "Ignorer";
      actions.append(ignoreButton);
    }
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.dataset.addWatchJobId = job.id;
    addButton.textContent = "Ajouter";
    actions.append(addButton);
    article.append(main, actions);
    jobWatchResults.append(article);
  });
}
async function loadJobWatch({ refresh = false, hydrateSettings = false } = {}) {
  if (jobWatchPollTimer) window.clearTimeout(jobWatchPollTimer);
  refreshJobWatchButton.disabled = true;
  jobWatchSettingsStatus.textContent = refresh ? "Recherche en cours…" : jobWatchSettingsStatus.textContent;
  try {
    const response = await fetch(refresh ? "/api/job-watch/scan" : "/api/job-watch", {
      method: refresh ? "POST" : "GET",
      cache: "no-store",
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Veille indisponible.");
    renderJobWatch(payload, { hydrateSettings: hydrateSettings || !jobWatchPayload });
    if (refresh) jobWatchSettingsStatus.textContent = "Recherche terminée.";
  } catch (error) {
    const message = error instanceof Error ? error.message : "Veille indisponible.";
    jobWatchSummaryValue.textContent = "Indisponible";
    jobWatchError.hidden = false;
    jobWatchError.textContent = message;
    if (refresh) jobWatchSettingsStatus.textContent = message;
  } finally {
    refreshJobWatchButton.disabled = false;
    jobWatchPollTimer = window.setTimeout(() => {
      jobWatchPollTimer = null;
      if (document.visibilityState === "visible") void loadJobWatch();
    }, 60_000);
  }
}

async function acknowledgeWatchJobs(ids) {
  const response = await fetch("/api/job-watch/acknowledge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Impossible de mettre à jour la veille.");
  renderJobWatch(payload);
}

async function addWatchJobs(jobs) {
  const selectedJobs = Array.isArray(jobs) ? jobs : [];
  const selectedUrls = selectedJobs.map((job) => job.applyUrl || job.url).filter(isHttpUrl);
  if (!selectedUrls.length) return;
  const existing = offerLinks.map((value) => value.trim()).filter(isHttpUrl);
  const combined = [...new Set([...existing, ...selectedUrls])].slice(0, MAX_OFFERS);
  const includedUrls = new Set(combined);
  const includedJobs = selectedJobs.filter((job) => includedUrls.has(job.applyUrl || job.url));
  const addedCount = Math.max(0, combined.length - existing.length);
  if (!addedCount) {
    showAutomationToast(existing.length >= MAX_OFFERS
      ? `Le lot contient déjà ${MAX_OFFERS} postes.`
      : "Cette offre est déjà dans le lot.");
    return;
  }
  if (settingsOpen) hideProfileSettings();
  offerLinks = combined;
  setSourceMode("links", { focus: false, persist: false });
  renderOfferLinks({ focusIndex: existing.length, animateIndex: existing.length });
  scheduleIntakeDraftSave();
  if (jobWatchPanel.matches(":popover-open")) jobWatchPanel.hidePopover();
  const omittedCount = selectedUrls.length - includedJobs.length;
  showAutomationToast(omittedCount > 0
    ? `${addedCount} offre${addedCount > 1 ? "s" : ""} ajoutée${addedCount > 1 ? "s" : ""}. ${omittedCount} conservée${omittedCount > 1 ? "s" : ""} dans la veille.`
    : `${addedCount} offre${addedCount > 1 ? "s" : ""} ajoutée${addedCount > 1 ? "s" : ""} au lot.`);
  await acknowledgeWatchJobs(includedJobs.map((job) => job.id)).catch(() => {});
}

function renderMatchedStrengths(items) {
  matchedStrengths.replaceChildren();
  matchedStrengthsRegion.hidden = !items.length;
  items.slice(0, 8).forEach((item) => {
    const listItem = document.createElement("li");
    listItem.append(
      createTextElement("strong", "", item.requirement),
      createTextElement("span", "", item.evidence)
    );
    matchedStrengths.append(listItem);
  });
}

function renderSkillQuestions(questions, savedAnswers = []) {
  const savedById = new Map(savedAnswers.map((answer) => [answer.id, answer]));
  skillQuestions.replaceChildren();
  if (!questions.length) {
    skillQuestions.append(createTextElement(
      "p",
      "review-empty",
      currentSourceType === "spontaneous"
        ? "Aucune compétence supplémentaire ne nécessite de confirmation pour cette cible."
        : "Aucun outil important ne nécessite de confirmation pour cette offre."
    ));
    return;
  }

  questions.forEach((question, index) => {
    const article = document.createElement("article");
    article.className = "skill-question";
    article.dataset.questionId = question.id;
    const header = document.createElement("header");
    const headingGroup = document.createElement("div");
    headingGroup.append(
      createTextElement("span", "skill-category", question.category),
      createTextElement("h3", "", question.requirement)
    );
    header.append(headingGroup, createTextElement("span", "question-number", `${index + 1}/${questions.length}`));
    article.append(header, createTextElement("p", "question-reason", question.whyItMatters));

    if (question.verifiedAlternative) {
      const alternative = document.createElement("div");
      alternative.className = "alternative-note";
      alternative.append(
        createTextElement("strong", "", `Alternative déjà vérifiée : ${question.verifiedAlternative}`),
        createTextElement("p", "", question.alternativeReason),
        createTextElement("span", "", question.suggestedPhrasing)
      );
      article.append(alternative);
    }

    const choiceGroup = document.createElement("fieldset");
    choiceGroup.className = "level-choice-group";
    choiceGroup.dataset.levelGroup = question.id;
    choiceGroup.append(createTextElement("legend", "", "Ton niveau réel"));
    const choices = document.createElement("div");
    choices.className = "level-choices";
    const saved = savedById.get(question.id);
    Object.entries(levelLabels).forEach(([value, copyText]) => {
      const choice = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `level-${question.id}`;
      input.value = value;
      input.required = true;
      input.checked = saved?.level === value;
      const copy = document.createElement("span");
      copy.append(
        createTextElement("strong", "", copyText.label),
        createTextElement("small", "", copyText.help)
      );
      choice.append(input, copy);
      choices.append(choice);
    });
    choiceGroup.append(choices);
    choiceGroup.addEventListener("change", () => {
      choiceGroup.removeAttribute("aria-invalid");
      reviewError.textContent = "";
    });
    article.append(choiceGroup);
    skillQuestions.append(article);
  });
}

function openReviewShell() {
  setBusy(false);
  setIntakeLocked(true);
  workspace.classList.add("review-mode");
  workspace.classList.remove("bundle-result-mode");
  form.hidden = true;
  submitButton.hidden = true;
  resetButton.hidden = false;
  skillsReview.hidden = false;
  reviewError.textContent = "";
  const spontaneous = currentSourceType === "spontaneous";
  skillsReviewTitle.textContent = spontaneous
    ? "Vérifie les compétences à mettre en avant"
    : "Vérifie les compétences avant le CV";
  previewSubtitle.textContent = spontaneous
    ? "Positionnement prêt · confirme uniquement ce que tu as réellement pratiqué."
    : "Analyse prête · confirme uniquement ce que tu as réellement pratiqué.";
  emptyCopyTitle.textContent = spontaneous ? "Ton profil est aligné avec la cible" : "Ton profil est comparé à l’offre";
  emptyCopyDetail.textContent = spontaneous
    ? "La candidature ne fera référence à aucune offre publiée."
    : "Les alternatives proposées restent fondées sur ton parcours vérifié.";
}

function showAnalysis(job) {
  currentBundle = null;
  bundleReviewItems = [];
  bundleAnswers = new Map();
  currentAnalysisId = job.id;
  currentAnalysis = job.result;
  currentSourceType = job.sourceType === "spontaneous" ? "spontaneous" : "offer";
  openReviewShell();
  bundleReviewNav.hidden = true;
  reviewSummary.textContent = `${job.result.company} | ${job.result.role}. ${job.result.summary}`;
  const count = job.result.questions.length;
  reviewCount.textContent = count ? `${count} à confirmer` : "Aucun écart";
  renderMatchedStrengths(job.result.matchedStrengths || []);
  renderSkillQuestions(job.result.questions || []);
  updateReviewActionLabel();
  skillsReview.scrollIntoView({ behavior: "smooth", block: "start" });
  if (automationEnabled && count === 0) {
    const token = ++pendingAutomationToken;
    reviewCount.textContent = "Suite automatique";
    reviewSummary.textContent = `${reviewSummary.textContent} Aucun écart à confirmer, génération lancée automatiquement.`;
    window.setTimeout(() => {
      if (token !== pendingAutomationToken || !automationEnabled || currentAnalysisId !== job.id || busyPhase) return;
      skillsReviewForm.requestSubmit();
    }, 500);
  }
}

function renderBundleReviewItem() {
  const item = bundleReviewItems[bundleReviewIndex];
  if (!item) return;
  currentAnalysis = item.analysis;
  currentAnalysisId = null;
  bundleReviewNav.hidden = false;
  bundlePosition.textContent = currentSourceType === "spontaneous"
    ? `Cible ${bundleReviewIndex + 1} sur ${bundleReviewItems.length}`
    : `Offre ${bundleReviewIndex + 1} sur ${bundleReviewItems.length}`;
  previousOfferButton.textContent = currentSourceType === "spontaneous" ? "← Cible précédente" : "← Offre précédente";
  previousOfferButton.disabled = bundleReviewIndex === 0;
  reviewSummary.textContent = `${item.analysis.company} | ${item.analysis.role}. ${item.analysis.summary}`;
  const count = item.analysis.questions.length;
  reviewCount.textContent = count ? `${count} à confirmer` : "Aucun écart";
  renderMatchedStrengths(item.analysis.matchedStrengths || []);
  renderSkillQuestions(item.analysis.questions || [], bundleAnswers.get(item.id) || []);
  updateReviewActionLabel();
  skillsReview.scrollIntoView({ behavior: "smooth", block: "start" });
  if (automationEnabled && count === 0) {
    const itemId = item.id;
    const token = ++pendingAutomationToken;
    reviewCount.textContent = "Suite automatique";
    window.setTimeout(() => {
      if (token !== pendingAutomationToken || !automationEnabled || busyPhase) return;
      const currentItem = bundleReviewItems[bundleReviewIndex];
      if (!currentItem || currentItem.id !== itemId) return;
      bundleAnswers.set(itemId, []);
      if (bundleReviewIndex < bundleReviewItems.length - 1) {
        bundleReviewIndex += 1;
        renderBundleReviewItem();
      } else {
        skillsReviewForm.requestSubmit();
      }
    }, 450);
  }
}

function showBundleReview(bundle) {
  if (currentBundle?.id !== bundle.id) bundleAnswers = new Map();
  currentBundle = bundle;
  const readyItems = bundle.items.filter((item) => item.state === "needs_input" && item.analysis);
  readyItems.filter((item) => item.analysis.questions.length === 0).forEach((item) => bundleAnswers.set(item.id, []));
  const itemsWithQuestions = readyItems.filter((item) => item.analysis.questions.length > 0);
  bundleReviewItems = automationEnabled
    ? itemsWithQuestions.length
      ? itemsWithQuestions
      : readyItems.slice(0, 1)
    : readyItems;
  bundleReviewIndex = 0;
  currentSourceType = bundle.sourceType === "spontaneous" ? "spontaneous" : "offer";
  sharedAnswerStatus.textContent = "Réponses identiques mutualisées";
  openReviewShell();
  renderBundleReviewItem();
}

function showResult(job, { autoDownload = false } = {}) {
  const result = job.result;
  currentApplicationId = job.id;
  currentResult = result;
  currentAnalysis = null;
  currentAnalysisId = null;
  currentBundle = null;
  currentSourceType = job.sourceType === "spontaneous" ? "spontaneous" : "offer";
  skillsReview.hidden = true;
  bundleResults.hidden = true;
  previewStage.hidden = false;
  workspace.classList.remove("review-mode", "bundle-result-mode");
  previewPane.classList.remove("bundle-view");
  pageBadge.textContent = "2 documents · 1 page";
  form.hidden = false;
  setIntakeLocked(false);
  submitButton.hidden = false;
  const titleParts = [result.company, result.role].filter(Boolean);
  resultTitle.textContent = titleParts.length ? titleParts.join(" | ") : "Candidature prête";
  const category = job.category || activeProfile?.domains[0]?.id || "auto";
  resultCategoryBadge.textContent = domainById(category).label;
  resultCategoryBadge.dataset.category = category;
  const languageLabel = result.language === "en" ? "EN" : "FR";
  resultSummary.textContent = result.summary || [
    currentSourceType === "spontaneous" ? "Candidature spontanée" : "",
    `CV et lettre ${languageLabel}`,
    result.contractType.toUpperCase(),
    "une page chacun",
  ].filter(Boolean).join(" · ");
  docxPackDownload.href = result.docxPackUrl;
  pdfPackDownload.href = result.pdfPackUrl;
  previewTabs.hidden = false;
  documentPlaceholder.hidden = true;
  emptyCopy.hidden = true;
  documentPreview.hidden = false;
  previewStage.classList.add("has-document");
  selectPreview("cv");
  resultBar.hidden = false;
  resetButton.hidden = false;
  renderApplicationLibrary();
  void loadApplicationLibrary();
  if (autoDownload) runCompletionAction(`job:${job.id}`, result);
}

function selectPreview(kind) {
  if (!currentResult) return;
  const isLetter = kind === "letter";
  const previewUrl = isLetter ? currentResult.coverLetterPreviewUrl : currentResult.previewUrl;
  const documentLabel = isLetter
    ? currentResult.language === "en" ? "cover letter" : "lettre de motivation"
    : "CV";
  documentPlaceholder.hidden = true;
  emptyCopy.hidden = true;
  documentPreview.hidden = false;
  previewStage.classList.add("has-document", "is-loading");
  previewStage.setAttribute("aria-busy", "true");
  documentPreview.src = previewUrl;
  documentPreview.alt = `Aperçu de la page finale du ${documentLabel}`;
  const languageLabel = currentResult.language === "en" ? "EN" : "FR";
  previewSubtitle.textContent = `${isLetter ? (currentResult.language === "en" ? "Cover letter" : "Lettre de motivation") : "CV"} ${languageLabel} · ${currentResult.contractType.toUpperCase()} · 1 page contrôlée avec LibreOffice`;
  previewTabButtons.forEach((button) => {
    button.setAttribute("aria-selected", String(button.dataset.document === kind));
  });
}

documentPreview.addEventListener("load", () => {
  previewStage.classList.remove("is-loading");
  previewStage.setAttribute("aria-busy", "false");
});

documentPreview.addEventListener("error", () => {
  previewStage.classList.remove("has-document", "is-loading");
  previewStage.setAttribute("aria-busy", "false");
  documentPreview.hidden = true;
  emptyCopy.hidden = false;
  emptyCopyTitle.textContent = "Aperçu indisponible";
  emptyCopyDetail.textContent = "Les packs restent disponibles au téléchargement.";
});

function makeDownloadLink(label, url, primary = false) {
  const link = document.createElement("a");
  link.className = `${primary ? "primary-button" : "secondary-button"} compact`;
  link.href = url;
  link.textContent = label;
  return link;
}

function renderBundleResults(bundle) {
  bundleResults.hidden = false;
  previewStage.hidden = true;
  resultBar.hidden = true;
  previewTabs.hidden = true;
  previewPane.classList.add("bundle-view");
  workspace.classList.add("bundle-result-mode");
  pageBadge.textContent = `${bundle.items.length} × 2 documents`;
  bundleResultsStatus.textContent = bundle.state === "completed"
    ? "Bundle terminé"
    : bundle.state === "canceled"
      ? "Bundle annulé"
      : bundle.state === "failed"
        ? "Bundle interrompu"
        : "Bundle en cours";
  const packsReady = Boolean(bundle.docxPackUrl && bundle.pdfPackUrl);
  const extensionReady = Boolean(bundle.extensionPackUrl);
  bundleRetryFailuresButton.hidden = !bundle.retryableFailures || !["completed", "failed"].includes(bundle.state);
  if (!bundleRetryFailuresButton.hidden) {
    bundleRetryFailuresButton.textContent = `Relancer ${bundle.retryableFailures} échec${bundle.retryableFailures > 1 ? "s" : ""}`;
  }
  bundlePackActions.hidden = !packsReady && !extensionReady;
  bundleExtensionDownload.hidden = !extensionReady;
  bundleDocxDownload.hidden = !packsReady;
  bundlePdfDownload.hidden = !packsReady;
  if (extensionReady) bundleExtensionDownload.href = bundle.extensionPackUrl;
  if (packsReady) {
    bundleDocxDownload.href = bundle.docxPackUrl;
    bundlePdfDownload.href = bundle.pdfPackUrl;
  }
  const extensionSummary = bundle.extensionPackSummary;
  if (extensionSummary) {
    const verificationRequired = Array.isArray(extensionSummary.verificationRequired)
      ? extensionSummary.verificationRequired
      : [];
    const reviewCount = verificationRequired.length;
    bundleExtensionSummary.hidden = false;
    bundleExtensionSummary.dataset.tone = reviewCount || extensionSummary.excluded ? "warning" : "success";
    bundleExtensionSummary.textContent = [
      `Pack extension : ${extensionSummary.applications} candidature${extensionSummary.applications > 1 ? "s" : ""} importable${extensionSummary.applications > 1 ? "s" : ""}`,
      extensionSummary.excluded
        ? `${extensionSummary.excluded} exclue${extensionSummary.excluded > 1 ? "s" : ""} du manifeste`
        : "",
      reviewCount
        ? `${reviewCount} vérification${reviewCount > 1 ? "s" : ""} humaine${reviewCount > 1 ? "s" : ""} signalée${reviewCount > 1 ? "s" : ""} dans tracker.csv`
        : "aucune vérification particulière",
    ].filter(Boolean).join(" · ");
    bundleExtensionReview.hidden = !reviewCount;
    bundleExtensionReviewTitle.textContent = `${reviewCount} vérification${reviewCount > 1 ? "s" : ""} humaine${reviewCount > 1 ? "s" : ""}`;
    bundleExtensionReviewList.replaceChildren(...verificationRequired.map((entry) => {
      const item = document.createElement("li");
      item.append(
        createTextElement("strong", "", `${entry.company} | ${entry.jobTitle}`),
        createTextElement("span", "", entry.reason)
      );
      return item;
    }));
  } else if (bundle.extensionPackError && ["completed", "failed"].includes(bundle.state)) {
    bundleExtensionSummary.hidden = false;
    bundleExtensionSummary.dataset.tone = "error";
    bundleExtensionSummary.textContent = `Pack extension indisponible : ${bundle.extensionPackError}`;
    bundleExtensionReview.hidden = true;
    bundleExtensionReviewList.replaceChildren();
  } else {
    bundleExtensionSummary.hidden = true;
    bundleExtensionSummary.textContent = "";
    delete bundleExtensionSummary.dataset.tone;
    bundleExtensionReview.hidden = true;
    bundleExtensionReviewList.replaceChildren();
  }
  bundleResultList.replaceChildren();

  bundle.items.forEach((item) => {
    const row = document.createElement("article");
    row.className = `bundle-result-row state-${item.state}`;
    const copy = document.createElement("div");
    copy.className = "bundle-result-copy";
    const company = item.result?.company
      || item.analysis?.company
      || item.spontaneousTarget?.company
      || `${bundle.sourceType === "spontaneous" ? "Cible" : "Offre"} ${item.index + 1}`;
    const role = item.result?.role
      || item.analysis?.role
      || item.spontaneousTarget?.role
      || (bundle.sourceType === "spontaneous" ? "Analyse du positionnement" : "Lecture du lien");
    const status = item.error || bundleStateLabels[item.state] || "En cours";
    copy.append(
      createTextElement("span", "bundle-item-index", String(item.index + 1).padStart(2, "0")),
      createTextElement("strong", "", `${company} | ${role}`),
      createTextElement("small", "", status)
    );
    if (item.duplicateWarning) {
      copy.append(createTextElement("small", "bundle-item-warning", `⚠️ ${item.duplicateWarning}`));
    }
    row.append(copy);
    if (item.result) {
      const downloads = document.createElement("div");
      downloads.className = "bundle-item-downloads";
      downloads.append(
        makeDownloadLink("DOCX", item.result.docxPackUrl),
        makeDownloadLink("PDF", item.result.pdfPackUrl, true)
      );
      row.append(downloads);
    }
    bundleResultList.append(row);
  });
  previewSubtitle.textContent = bundle.message;
}

function showBundleComplete(bundle, { autoDownload = false } = {}) {
  currentBundle = bundle;
  currentAnalysis = null;
  currentAnalysisId = null;
  currentSourceType = bundle.sourceType === "spontaneous" ? "spontaneous" : "offer";
  skillsReview.hidden = true;
  workspace.classList.remove("review-mode");
  form.hidden = false;
  submitButton.hidden = false;
  setIntakeLocked(false);
  resetButton.hidden = false;
  renderBundleResults(bundle);
  void loadApplicationLibrary();
  if (autoDownload) runCompletionAction(`bundle:${bundle.id}`, bundle);
}

function showFailure(message, job = null) {
  formError.textContent = message;
  reviewError.textContent = message;
  previewSubtitle.textContent = job?.canResume || job?.retryableFailures
    ? "Le traitement est interrompu, mais le dernier checkpoint est prêt à reprendre."
    : "Le traitement n’a pas abouti. Corrige la saisie puis relance.";
  if (job) renderRecovery(job);
  resetButton.hidden = false;
}

async function pollActive() {
  if (!activeRequest) return;
  const requestSnapshot = activeRequest;
  try {
    const endpoint = requestSnapshot.kind === "bundle"
      ? `/api/bundles/${requestSnapshot.id}`
      : `/api/jobs/${requestSnapshot.id}`;
    const response = await fetch(endpoint, { cache: "no-store" });
    const job = await response.json();
    if (!response.ok) throw new Error(job.error || "Traitement introuvable.");
    setProgress(job);
    if (job.kind === "bundle") renderBundleResults(job);

    if (job.state === "needs_input") {
      setBusy(false);
      cancelButton.hidden = true;
      activeRequest = null;
      if (job.kind === "bundle") showBundleReview(job);
      else showAnalysis(job);
      return;
    }
    if (job.state === "completed") {
      setBusy(false);
      cancelButton.hidden = true;
      activeRequest = null;
      if (job.kind === "bundle") showBundleComplete(job, { autoDownload: true });
      else showResult(job, { autoDownload: true });
      return;
    }
    if (["failed", "canceled"].includes(job.state)) {
      setBusy(false);
      cancelButton.hidden = true;
      activeRequest = null;
      if (job.kind !== "bundle" && job.state === "canceled" && currentAnalysis && currentAnalysisId) {
        showAnalysis({ id: currentAnalysisId, result: currentAnalysis, sourceType: job.sourceType });
        reviewError.textContent = "La génération a été annulée. Tes réponses peuvent être modifiées avant de relancer.";
        return;
      }
      showFailure(job.error || job.message || "Le traitement a été interrompu.", job);
      return;
    }
    pollTimer = window.setTimeout(pollActive, 500);
  } catch (error) {
    setBusy(false);
    showFailure(error instanceof Error ? error.message : "Connexion au serveur local perdue.");
    activeRequest = null;
  }
}

function resetPreview() {
  resultBar.hidden = true;
  bundleResults.hidden = true;
  previewStage.hidden = false;
  previewPane.classList.remove("bundle-view");
  pageBadge.textContent = "2 documents · 1 page";
  workspace.classList.remove("bundle-result-mode");
  previewTabs.hidden = true;
  previewStage.classList.remove("has-document", "is-loading");
  previewStage.removeAttribute("aria-busy");
  documentPreview.hidden = true;
  documentPreview.src = "/document-canvas.svg";
  documentPreview.alt = "";
  documentPlaceholder.hidden = false;
  emptyCopy.hidden = false;
  emptyCopyTitle.textContent = "Prêt pour la prochaine candidature";
  emptyCopyDetail.textContent = "Le modèle original ne sera jamais écrasé.";
  currentResult = null;
  previewSubtitle.textContent = "Les PDF apparaîtront ici après validation.";
}

function resetInterface({ keepOffer = false } = {}) {
  if (pollTimer) window.clearTimeout(pollTimer);
  pendingAutomationToken += 1;
  activeRequest = null;
  currentAnalysis = null;
  currentAnalysisId = null;
  currentBundle = null;
  currentApplicationId = null;
  currentSourceType = "offer";
  resetLibrarySelection();
  bundleReviewItems = [];
  bundleReviewIndex = 0;
  bundleAnswers = new Map();
  setBusy(false);
  setIntakeLocked(false);
  formError.textContent = "";
  reviewError.textContent = "";
  progressRegion.hidden = true;
  progressTitle.textContent = "Traitement en cours";
  progressBar.style.transform = "scaleX(0)";
  processMetadata.textContent = "";
  hideRecovery();
  steps.forEach((step) => step.classList.remove("active", "done"));
  skillsReview.hidden = true;
  bundleReviewNav.hidden = true;
  workspace.classList.remove("review-mode", "bundle-result-mode");
  form.hidden = false;
  submitButton.hidden = false;
  resetButton.hidden = true;
  resetPreview();
  renderApplicationLibrary();
  if (!keepOffer) {
    resetSourceComposer();
  }
  focusCurrentSource();
}

function collectAnswers({ partial = false } = {}) {
  if (!currentAnalysis) return null;
  const answers = [];
  for (const question of currentAnalysis.questions) {
    const choiceGroup = document.querySelector(`[data-level-group="${CSS.escape(question.id)}"]`);
    const selectedLevel = choiceGroup?.querySelector('input[type="radio"]:checked');
    if (!selectedLevel) {
      if (partial) continue;
      choiceGroup?.setAttribute("aria-invalid", "true");
      reviewError.textContent = `Choisis ton niveau réel pour ${question.requirement}.`;
      choiceGroup?.querySelector('input[type="radio"]')?.focus();
      return null;
    }
    choiceGroup.removeAttribute("aria-invalid");
    answers.push({ id: question.id, level: selectedLevel.value, detail: "" });
  }
  return answers;
}

function requirementKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .replace(/[^a-z0-9+#.]+/g, " ")
    .trim();
}

function propagateBundleAnswer(questionId) {
  if (!currentBundle || !currentAnalysis) return;
  const sourceQuestion = currentAnalysis.questions.find((question) => question.id === questionId);
  if (!sourceQuestion) return;
  const choiceGroup = document.querySelector(`[data-level-group="${CSS.escape(questionId)}"]`);
  const level = choiceGroup?.querySelector('input[type="radio"]:checked')?.value || "";
  if (!level) return;
  const sourceKey = requirementKey(sourceQuestion.requirement);
  let appliedCount = 0;

  for (const item of bundleReviewItems) {
    const matchingQuestions = item.analysis.questions.filter((question) => requirementKey(question.requirement) === sourceKey);
    if (!matchingQuestions.length) continue;
    const answersById = new Map((bundleAnswers.get(item.id) || []).map((answer) => [answer.id, answer]));
    for (const question of matchingQuestions) {
      answersById.set(question.id, {
        id: question.id,
        requirement: question.requirement,
        level,
        detail: "",
      });
      appliedCount += 1;
    }
    bundleAnswers.set(
      item.id,
      item.analysis.questions.map((question) => answersById.get(question.id)).filter(Boolean)
    );
  }

  sharedAnswerStatus.textContent = appliedCount > 1
    ? `Réponse réutilisée sur ${appliedCount} ${currentSourceType === "spontaneous" ? "cibles" : "offres"}`
    : "Réponses identiques mutualisées";
}

function isHttpUrl(value) {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function setLinkError(index, message) {
  const input = document.querySelector(`#offer-link-${index + 1}`);
  const error = document.querySelector(`#offer-link-error-${index + 1}`);
  input?.setAttribute("aria-invalid", "true");
  if (error) error.textContent = message;
}

function canonicalUrlClient(value) {
  try {
    const url = new URL(value);
    url.hash = "";
    ["gh_jid", "lever-source", "source", "src", "ref", "referrer", "utm_campaign", "utm_content", "utm_medium", "utm_source", "utm_term"].forEach((p) => url.searchParams.delete(p));
    url.pathname = url.pathname.replace(/\/+$/, "") || "/";
    return url.toString();
  } catch {
    return value;
  }
}

function validateLinkOffers() {
  offerLinks.forEach((_, index) => clearLinkError(index));
  const values = offerLinks.map((value) => value.trim());
  let firstInvalid = -1;
  const seen = new Map();

  values.forEach((value, index) => {
    let message = "";
    if (!value) {
      message = index === 0 ? "Ajoute le lien du poste à analyser." : "Ajoute un lien ou supprime ce poste.";
    } else if (!isHttpUrl(value)) {
      message = "Utilise un lien complet commençant par http:// ou https://.";
    } else {
      const canonical = canonicalUrlClient(value);
      if (seen.has(canonical)) {
        message = `Ce lien est déjà utilisé pour le poste ${seen.get(canonical) + 1} (URL identique ou paramètres différents).`;
      } else {
        seen.set(canonical, index);
      }
    }
    if (message) {
      setLinkError(index, message);
      if (firstInvalid < 0) firstInvalid = index;
    }
  });

  if (firstInvalid >= 0) {
    formError.textContent = "Vérifie les liens indiqués avant de lancer l’analyse.";
    document.querySelector(`#offer-link-${firstInvalid + 1}`)?.focus();
    return null;
  }
  return values;
}

function clearSpontaneousFieldError(index, key) {
  const input = document.querySelector(`#spontaneous-${key}-${index + 1}`);
  const error = document.querySelector(`#spontaneous-${key}-${index + 1}-error`);
  input?.removeAttribute("aria-invalid");
  if (error) error.textContent = "";
}

function setSpontaneousFieldError(index, key, message) {
  const input = document.querySelector(`#spontaneous-${key}-${index + 1}`);
  const error = document.querySelector(`#spontaneous-${key}-${index + 1}-error`);
  input?.setAttribute("aria-invalid", "true");
  if (error) error.textContent = message;
}

function validateSpontaneousTargets() {
  let firstInvalid = null;
  const seen = new Map();
  const normalized = spontaneousTargets.map((target) => ({
    company: target.company.trim(),
    role: target.role.trim(),
    website: target.website.trim(),
    notes: target.notes.trim(),
  }));

  normalized.forEach((target, index) => {
    ["company", "role", "website", "notes"].forEach((key) => clearSpontaneousFieldError(index, key));
    if (target.company.length < 2) {
      setSpontaneousFieldError(index, "company", "Indique l’entreprise ciblée.");
      firstInvalid ||= { index, key: "company" };
    }
    if (target.role.length < 3) {
      setSpontaneousFieldError(index, "role", "Indique le poste, l’équipe ou le métier visé.");
      firstInvalid ||= { index, key: "role" };
    }
    if (target.website && !isHttpUrl(target.website)) {
      setSpontaneousFieldError(index, "website", "Utilise un lien complet commençant par http:// ou https://.");
      firstInvalid ||= { index, key: "website" };
    }
    const duplicateKey = `${target.company.toLocaleLowerCase("fr")}|${target.role.toLocaleLowerCase("fr")}`;
    if (target.company && target.role && seen.has(duplicateKey)) {
      setSpontaneousFieldError(index, "company", `Cette cible est déjà utilisée à la ligne ${seen.get(duplicateKey) + 1}.`);
      firstInvalid ||= { index, key: "company" };
    } else if (target.company && target.role) {
      seen.set(duplicateKey, index);
    }
  });

  if (selectedValue("mode") === "auto") {
    contractFieldset.setAttribute("aria-invalid", "true");
    formError.textContent = "Choisis CDI ou Alternance pour une candidature spontanée.";
    form.querySelector('input[name="mode"][value="cdi"]')?.focus();
    return null;
  }
  contractFieldset.removeAttribute("aria-invalid");
  if (firstInvalid) {
    formError.textContent = "Complète les entreprises ciblées avant de lancer la préparation.";
    document.querySelector(`#spontaneous-${firstInvalid.key}-${firstInvalid.index + 1}`)?.focus();
    return null;
  }
  return normalized;
}

addOfferButton.addEventListener("click", () => {
  if (offerLinks.length >= MAX_OFFERS) return;
  offerLinks.push("");
  renderOfferLinks({ focusIndex: offerLinks.length - 1, animateIndex: offerLinks.length - 1 });
  scheduleIntakeDraftSave();
});

addSpontaneousTargetButton.addEventListener("click", () => {
  if (spontaneousTargets.length >= MAX_OFFERS) return;
  spontaneousTargets.push({
    ...emptySpontaneousTarget(),
    role: activeProfile?.headline || "",
  });
  renderSpontaneousTargets({
    focusIndex: spontaneousTargets.length - 1,
    animateIndex: spontaneousTargets.length - 1,
  });
  scheduleIntakeDraftSave();
});

spontaneousTargetList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-target-index]");
  if (!button) return;
  const index = Number(button.dataset.removeTargetIndex);
  spontaneousTargets.splice(index, 1);
  if (!spontaneousTargets.length) spontaneousTargets = [emptySpontaneousTarget()];
  renderSpontaneousTargets({ focusIndex: Math.max(0, index - 1) });
  scheduleIntakeDraftSave();
});

spontaneousTargetList.addEventListener("input", (event) => {
  const input = event.target.closest("[data-target-field]");
  if (!input) return;
  const article = input.closest("[data-target-index]");
  const index = Number(article?.dataset.targetIndex);
  const key = input.dataset.targetField;
  if (!Number.isInteger(index) || !spontaneousTargets[index] || !["company", "role", "website", "notes"].includes(key)) return;
  spontaneousTargets[index][key] = input.value;
  clearSpontaneousFieldError(index, key);
  formError.textContent = "";
  scheduleIntakeDraftSave();
});

spontaneousTargetList.addEventListener("focusout", (event) => {
  const input = event.target.closest('[data-target-field="website"]');
  if (!input || !input.value.trim()) return;
  const index = Number(input.closest("[data-target-index]")?.dataset.targetIndex);
  if (!isHttpUrl(input.value.trim())) {
    setSpontaneousFieldError(index, "website", "Utilise un lien complet commençant par http:// ou https://.");
  }
});

bulkImportButton.addEventListener("click", () => {
  bulkImportRegion.hidden = false;
  bulkOfferLinks.focus();
});

bulkOfferLinks.addEventListener("input", () => {
  const count = extractOfferLinks(bulkOfferLinks.value).length;
  bulkImportCount.textContent = `${count} lien${count > 1 ? "s" : ""} détecté${count > 1 ? "s" : ""}`;
});

bulkOfferLinks.addEventListener("paste", (event) => {
  const links = extractClipboardOfferLinks(event.clipboardData);
  if (!links.length) return;
  const plainText = event.clipboardData?.getData("text/plain") || "";
  const html = event.clipboardData?.getData("text/html") || "";
  const isStructuredClipboard = /[\r\n\t]/.test(plainText) || /<table\b/i.test(html);
  if (links.length < 2 && !isStructuredClipboard && extractOfferLinks(plainText).length) return;
  event.preventDefault();
  const existing = extractOfferLinks(bulkOfferLinks.value);
  const combined = [...new Set([...existing, ...links])].slice(0, MAX_OFFERS);
  bulkOfferLinks.value = combined.join("\n");
  bulkImportCount.textContent = `${combined.length} lien${combined.length > 1 ? "s" : ""} détecté${combined.length > 1 ? "s" : ""}`;
});

confirmBulkImportButton.addEventListener("click", () => {
  const links = extractOfferLinks(bulkOfferLinks.value);
  if (!links.length) {
    formError.textContent = "Aucun lien http ou https valide n’a été détecté dans la liste.";
    bulkOfferLinks.focus();
    return;
  }
  offerLinks = links.slice(0, MAX_OFFERS);
  renderOfferLinks({ focusIndex: 0, animateIndex: 0 });
  bulkImportRegion.hidden = true;
  formError.textContent = "";
  showAutomationToast(links.length > MAX_OFFERS
    ? `Les ${MAX_OFFERS} premiers liens uniques ont été importés.`
    : `${offerLinks.length} poste${offerLinks.length > 1 ? "s" : ""} prêt${offerLinks.length > 1 ? "s" : ""} à analyser.`);
  scheduleIntakeDraftSave();
});

cancelBulkImportButton.addEventListener("click", () => {
  bulkImportRegion.hidden = true;
  bulkImportButton.focus();
});

offerLinkList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-index]");
  if (!button) return;
  const index = Number(button.dataset.removeIndex);
  offerLinks.splice(index, 1);
  renderOfferLinks({ focusIndex: Math.max(0, index - 1) });
  scheduleIntakeDraftSave();
});

offerLinkList.addEventListener("input", (event) => {
  const input = event.target.closest(".offer-link-input");
  if (!input) return;
  const index = Number(input.closest(".offer-link-row").dataset.index);
  offerLinks[index] = input.value;
  clearLinkError(index);
  formError.textContent = "";
  scheduleIntakeDraftSave();
});

offerLinkList.addEventListener("focusout", (event) => {
  const input = event.target.closest(".offer-link-input");
  if (!input || !input.value.trim()) return;
  const index = Number(input.closest(".offer-link-row").dataset.index);
  if (!isHttpUrl(input.value.trim())) {
    setLinkError(index, "Utilise un lien complet commençant par http:// ou https://.");
  }
});

offerLinkList.addEventListener("paste", (event) => {
  const input = event.target.closest(".offer-link-input");
  if (!input) return;
  const pasted = extractClipboardOfferLinks(event.clipboardData);
  if (!pasted.length) return;
  const plainText = event.clipboardData?.getData("text/plain") || "";
  const html = event.clipboardData?.getData("text/html") || "";
  const isStructuredClipboard = /[\r\n\t]/.test(plainText) || /<table\b/i.test(html);
  const plainLinks = extractOfferLinks(plainText);
  if (pasted.length < 2 && !isStructuredClipboard && plainLinks.length) return;
  event.preventDefault();
  const index = Number(input.closest(".offer-link-row").dataset.index);
  const merged = mergePastedOfferLinks(offerLinks, index, pasted, MAX_OFFERS);
  offerLinks = merged.links;
  renderOfferLinks({ focusIndex: merged.lastPastedIndex, animateIndex: merged.firstPastedIndex });
  scheduleIntakeDraftSave();
  const omittedCount = merged.omittedPasted.length;
  if (merged.truncated || omittedCount) {
    formError.textContent = `Les ${MAX_OFFERS} premiers liens ont été ajoutés. Le lot est limité à ${MAX_OFFERS} postes.`;
    showAutomationToast(omittedCount
      ? `${merged.includedPasted.length} lien${merged.includedPasted.length > 1 ? "s" : ""} réparti${merged.includedPasted.length > 1 ? "s" : ""}. ${omittedCount} ignoré${omittedCount > 1 ? "s" : ""}.`
      : `${MAX_OFFERS} postes conservés. Vérifie le dernier lien, car la limite du lot est atteinte.`);
    return;
  }
  formError.textContent = "";
  showAutomationToast(merged.includedPasted.length > 1
    ? `${merged.includedPasted.length} liens collés, ${merged.includedPasted.length} postes créés automatiquement.`
    : "Lien Excel reconnu et ajouté au poste.");
});

linkModeButton.addEventListener("click", () => setSourceMode("links"));
textModeButton.addEventListener("click", () => setSourceMode("text"));
spontaneousModeButton.addEventListener("click", () => setSourceMode("spontaneous"));

offerTextField.addEventListener("input", () => {
  offerTextCount.textContent = `${offerTextField.value.length.toLocaleString("fr-FR")} / 60 000`;
  offerTextField.removeAttribute("aria-invalid");
  formError.textContent = "";
  scheduleIntakeDraftSave();
});

form.addEventListener("change", (event) => {
  if (event.target.matches('input[name="category"], input[name="mode"], input[name="language"]')) {
    if (event.target.matches('input[name="mode"]')) contractFieldset.removeAttribute("aria-invalid");
    formError.textContent = "";
    scheduleIntakeDraftSave();
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  armAudio();
  resetMilestoneNotifications();
  pendingAutomationToken += 1;
  formError.textContent = "";
  let offer = "";
  let uniqueLinks = [];
  let targetPayload = [];
  if (sourceMode === "text") {
    offer = offerTextField.value.trim();
    if (offer.length < 10) {
      offerTextField.setAttribute("aria-invalid", "true");
      formError.textContent = "Colle au moins quelques lignes du texte complet de l’offre.";
      offerTextField.focus();
      return;
    }
  } else if (sourceMode === "spontaneous") {
    const targets = validateSpontaneousTargets();
    if (!targets) return;
    targetPayload = targets;
  } else {
    const links = validateLinkOffers();
    if (!links) return;
    uniqueLinks = links;
    offer = links[0];
  }
  const isBundle = sourceMode === "links"
    ? uniqueLinks.length > 1
    : sourceMode === "spontaneous" && targetPayload.length > 1;

  const data = new FormData(form);
  const category = data.get("category");
  const mode = data.get("mode");
  const language = data.get("language");
  currentSourceType = sourceMode === "spontaneous" ? "spontaneous" : "offer";
  skillsReview.hidden = true;
  resetPreview();
  setBusy(true, "analysis", isBundle ? "bundle" : "single");
  resetButton.hidden = true;
  progressRegion.hidden = false;
  const itemCount = sourceMode === "spontaneous" ? targetPayload.length : uniqueLinks.length;
  progressMessage.textContent = sourceMode === "spontaneous"
    ? isBundle
      ? `Préparation de ${itemCount} candidatures spontanées`
      : `Analyse du positionnement pour ${targetPayload[0].company}`
    : isBundle
      ? `Préparation de ${uniqueLinks.length} offres`
      : "Lecture des outils et compétences demandés";
  progressPercent.textContent = "6 %";
  progressBar.style.transform = "scaleX(0.06)";

  try {
    const requestBody = isBundle
      ? sourceMode === "spontaneous"
        ? { sourceType: "spontaneous", category, mode, language, targets: targetPayload }
        : { sourceType: "offer", category, mode, language, offers: uniqueLinks }
      : sourceMode === "spontaneous"
        ? { sourceType: "spontaneous", category, mode, language, target: targetPayload[0] }
        : { sourceType: "offer", category, mode, language, offer };
    const response = await fetch(isBundle ? "/api/bundles" : "/api/analyses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    const job = await response.json();
    if (!response.ok) throw new Error(job.error || "Impossible de démarrer l’analyse.");
    activeRequest = { kind: isBundle ? "bundle" : "job", id: job.id };
    setProgress(job);
    if (isBundle) renderBundleResults(job);
    pollTimer = window.setTimeout(pollActive, 500);
  } catch (error) {
    setBusy(false);
    showFailure(error instanceof Error ? error.message : "Erreur inconnue.");
  }
});

skillsReviewForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  armAudio();
  pendingAutomationToken += 1;
  reviewError.textContent = "";
  const answers = collectAnswers();
  if (!answers) return;

  if (currentBundle) {
    const item = bundleReviewItems[bundleReviewIndex];
    bundleAnswers.set(item.id, answers);
    if (bundleReviewIndex < bundleReviewItems.length - 1) {
      bundleReviewIndex += 1;
      renderBundleReviewItem();
      return;
    }

    setBusy(true, "generation", "bundle");
    skillsReview.hidden = true;
    workspace.classList.remove("review-mode");
    form.hidden = false;
    submitButton.hidden = true;
    progressRegion.hidden = false;
    progressMessage.textContent = "Lancement des candidatures du bundle";
    progressPercent.textContent = "55 %";
    progressBar.style.transform = "scaleX(0.55)";
    renderBundleResults(currentBundle);
    try {
      const response = await fetch(`/api/bundles/${currentBundle.id}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: currentBundle.items
            .filter((bundleItem) => bundleItem.state === "needs_input")
            .map((bundleItem) => ({ itemId: bundleItem.id, answers: bundleAnswers.get(bundleItem.id) || [] })),
        }),
      });
      const bundle = await response.json();
      if (!response.ok) throw new Error(bundle.error || "Impossible de démarrer le bundle.");
      currentBundle = bundle;
      activeRequest = { kind: "bundle", id: bundle.id };
      setProgress(bundle);
      renderBundleResults(bundle);
      pollTimer = window.setTimeout(pollActive, 500);
    } catch (error) {
      setBusy(false);
      workspace.classList.add("review-mode");
      workspace.classList.remove("bundle-result-mode");
      form.hidden = true;
      skillsReview.hidden = false;
      previewPane.classList.remove("bundle-view");
      showFailure(error instanceof Error ? error.message : "Erreur inconnue.");
    }
    return;
  }

  if (!currentAnalysis || !currentAnalysisId) return;
  setBusy(true, "generation", "single");
  skillsReview.hidden = true;
  workspace.classList.remove("review-mode");
  form.hidden = false;
  submitButton.hidden = true;
  resultBar.hidden = true;
  previewTabs.hidden = true;
  progressRegion.hidden = false;
  progressMessage.textContent = "Application de tes réponses au CV et à la lettre";
  progressPercent.textContent = "35 %";
  progressBar.style.transform = "scaleX(0.35)";

  try {
    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analysisId: currentAnalysisId, answers }),
    });
    const job = await response.json();
    if (!response.ok) throw new Error(job.error || "Impossible de démarrer la génération.");
    activeRequest = { kind: "job", id: job.id };
    setProgress(job);
    pollTimer = window.setTimeout(pollActive, 500);
  } catch (error) {
    setBusy(false);
    workspace.classList.add("review-mode");
    form.hidden = true;
    skillsReview.hidden = false;
    showFailure(error instanceof Error ? error.message : "Erreur inconnue.");
  }
});

skillQuestions.addEventListener("change", (event) => {
  const article = event.target.closest("[data-question-id]");
  if (article) propagateBundleAnswer(article.dataset.questionId);
});

previousOfferButton.addEventListener("click", () => {
  if (!currentBundle || bundleReviewIndex === 0) return;
  const item = bundleReviewItems[bundleReviewIndex];
  bundleAnswers.set(item.id, collectAnswers({ partial: true }) || []);
  bundleReviewIndex -= 1;
  renderBundleReviewItem();
});

async function discardAndReset(keepOffer = false) {
  if (currentBundle && !["completed", "failed", "canceled"].includes(currentBundle.state)) {
    try {
      await fetch(`/api/bundles/${currentBundle.id}/cancel`, { method: "POST" });
    } catch {
      // The interface can still reset if the local request has already ended.
    }
  }
  resetInterface({ keepOffer });
}

editOfferButton.addEventListener("click", () => void discardAndReset(true));

cancelButton.addEventListener("click", async () => {
  if (!activeRequest) return;
  cancelButton.disabled = true;
  const endpoint = activeRequest.kind === "bundle"
    ? `/api/bundles/${activeRequest.id}/cancel`
    : `/api/jobs/${activeRequest.id}/cancel`;
  try {
    await fetch(endpoint, { method: "POST" });
  } finally {
    cancelButton.disabled = false;
    pollTimer = window.setTimeout(pollActive, 100);
  }
});

bundleRetryFailuresButton.addEventListener("click", async () => {
  if (!currentBundle?.id || busyPhase) return;
  setBusy(true, "analysis", "bundle");
  bundleRetryFailuresButton.disabled = true;
  try {
    const response = await fetch(`/api/bundles/${currentBundle.id}/retry-failed`, { method: "POST" });
    const bundle = await response.json();
    if (!response.ok) throw new Error(bundle.error || "Impossible de relancer les postes en échec.");
    currentBundle = bundle;
    activeRequest = { kind: "bundle", id: bundle.id };
    setProgress(bundle);
    renderBundleResults(bundle);
    pollTimer = window.setTimeout(pollActive, 500);
  } catch (error) {
    setBusy(false);
    showFailure(error instanceof Error ? error.message : "Impossible de relancer les postes en échec.");
  }
});

async function beginNewApplication() {
  clearIntakeDraft();
  await discardAndReset();
  draftSaveStatus.textContent = "Nouveau brouillon prêt, la sauvegarde est automatique.";
  document.querySelector(".control-pane")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

resetButton.addEventListener("click", () => void beginNewApplication());
topNewApplicationButton.addEventListener("click", () => void beginNewApplication());
libraryNewApplicationButton?.addEventListener("click", () => void beginNewApplication());

document.querySelector(".applications-pane").addEventListener("click", (event) => {
  const filterButton = event.target.closest("[data-library-status-filter]");
  if (filterButton) {
    libraryStatusFilter = filterButton.dataset.libraryStatusFilter;
    renderApplicationLibrary();
    return;
  }
  const expandButton = event.target.closest("[data-expand-library-group]");
  if (expandButton) {
    expandedLibraryGroups.add(expandButton.dataset.expandLibraryGroup);
    renderApplicationLibrary();
    return;
  }
  const collapseButton = event.target.closest("[data-collapse-library-group]");
  if (collapseButton) {
    expandedLibraryGroups.delete(collapseButton.dataset.collapseLibraryGroup);
    renderApplicationLibrary();
    return;
  }
  const applicationButton = event.target.closest("[data-application-id]");
  if (applicationButton) {
    const applicationId = applicationButton.dataset.applicationId;
    if (librarySelectionMode) {
      setApplicationSelected(applicationId, !selectedApplicationIds.has(applicationId));
      applicationRow(applicationId)?.querySelector("[data-select-application-id]")?.focus();
      return;
    }
    void openApplication(applicationId);
  }
});

librarySelectionToggle.addEventListener("click", () => {
  if (busyPhase || bulkApplicationMutationPending) return;
  librarySelectionMode = !librarySelectionMode;
  selectedApplicationIds.clear();
  libraryBulkCategory.value = "";
  libraryBulkStatus.value = "";
  setLibraryBulkMessage();
  renderApplicationLibrary();
  window.queueMicrotask(() => {
    if (librarySelectionMode) {
      document.querySelector("[data-select-application-id]")?.focus();
    } else {
      librarySelectionToggle.focus();
    }
  });
});

librarySelectAllButton.addEventListener("click", () => {
  if (!librarySelectionMode || busyPhase || bulkApplicationMutationPending) return;
  const filteredItems = applicationsMatchingLibraryView();
  const allSelected = filteredItems.length > 0
    && filteredItems.every((application) => selectedApplicationIds.has(application.id));
  filteredItems.forEach((application) => {
    if (allSelected) selectedApplicationIds.delete(application.id);
    else selectedApplicationIds.add(application.id);
  });
  setLibraryBulkMessage();
  renderApplicationLibrary();
  window.queueMicrotask(() => librarySelectAllButton.focus());
});

libraryBulkCategory.addEventListener("change", () => {
  setLibraryBulkMessage();
  syncLibraryBulkPanel();
});

libraryBulkStatus.addEventListener("change", () => {
  setLibraryBulkMessage();
  syncLibraryBulkPanel();
});

libraryBulkApplyButton.addEventListener("click", () => void updateSelectedApplications());

librarySearchField?.addEventListener("input", () => {
  librarySearchQuery = librarySearchField.value;
  renderApplicationLibrary();
});

document.querySelector(".applications-pane").addEventListener("change", (event) => {
  const selectionCheckbox = event.target.closest("[data-select-application-id]");
  if (selectionCheckbox) {
    setApplicationSelected(selectionCheckbox.dataset.selectApplicationId, selectionCheckbox.checked);
    return;
  }
  const categorySelect = event.target.closest("[data-move-application-id]");
  if (categorySelect) {
    const applicationId = categorySelect.dataset.moveApplicationId;
    const previousCategory = categorySelect.dataset.previousValue;
    const nextCategory = categorySelect.value;
    void enqueueApplicationMutation(
      applicationId,
      () => moveApplication(applicationId, nextCategory, previousCategory)
    );
    return;
  }
  const statusSelect = event.target.closest("[data-application-status-id]");
  if (statusSelect) {
    const applicationId = statusSelect.dataset.applicationStatusId;
    const previousStatus = statusSelect.dataset.previousValue;
    const nextStatus = statusSelect.value;
    void enqueueApplicationMutation(
      applicationId,
      () => updateApplicationStatus(applicationId, nextStatus, previousStatus)
    );
  }
});

profileMenuList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-activate-profile-id]");
  if (!button) return;
  void activateProfile(button.dataset.activateProfileId).catch((error) => {
    formError.textContent = error instanceof Error ? error.message : "Impossible de changer de profil.";
  });
});

manageProfilesButton.addEventListener("click", showProfileSettings);
closeProfileSettingsButton.addEventListener("click", hideProfileSettings);
newProfileButton.addEventListener("click", () => editProfile(null));
cancelProfileEditButton.addEventListener("click", () => editProfile(activeProfile));

settingsProfileList.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-profile-id]");
  if (editButton) {
    editProfile(profiles.find((profile) => profile.id === editButton.dataset.editProfileId) || activeProfile);
    return;
  }
  const activateButton = event.target.closest("[data-activate-settings-profile-id]");
  if (!activateButton) return;
  void activateProfile(activateButton.dataset.activateSettingsProfileId)
    .then(() => editProfile(activeProfile))
    .catch((error) => {
      profileFormError.textContent = error instanceof Error ? error.message : "Impossible de changer de profil.";
    });
});

providerOptions.addEventListener("change", () => {
  updateProviderFields();
  const providerId = selectedProviderId();
  if (!providerStatuses[providerId]?.ready) openProviderConnectionDialog(providerId);
});
providerModel.addEventListener("change", updateProfilePreview);
providerEndpoint.addEventListener("input", updateProfilePreview);

[profileNameField, profileHeadlineField, profileDomainsField, profileFactsField].forEach((field) => {
  field.addEventListener("input", updateProfilePreview);
});

providerSetupButton.addEventListener("click", () => {
  openProviderConnectionDialog(providerSetupButton.dataset.provider || selectedProviderId());
});

openConnectionWizardButton.addEventListener("click", () => {
  if (engineSetupPrompt.dataset.mode === "profile") showProfileSettings();
  else openProviderConnectionDialog(activeProviderStatus?.id || activeProfile?.provider || "codex");
});
providerConnectionPrimaryButton.addEventListener("click", () => void beginProviderConnection());
providerConnectionCheckButton.addEventListener("click", () => void refreshProviderConnection());
providerConnectionLaterButton.addEventListener("click", () => providerConnectionDialog.close());
closeProviderConnectionButton.addEventListener("click", () => providerConnectionDialog.close());
providerConnectionDialog.addEventListener("close", clearConnectionPolling);
providerConnectionDialog.addEventListener("click", (event) => {
  if (event.target === providerConnectionDialog) providerConnectionDialog.close();
});
toggleProviderConnectionKeyButton.addEventListener("click", () => {
  const reveal = providerConnectionApiKey.type === "password";
  providerConnectionApiKey.type = reveal ? "text" : "password";
  toggleProviderConnectionKeyButton.textContent = reveal ? "Masquer" : "Afficher";
});
providerConnectionApiKey.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    void beginProviderConnection();
  }
});

[
  [profileCvFrField, profileCvFrState],
  [profileCvEnField, profileCvEnState],
  [profileCoverLetterField, profileCoverLetterState],
].forEach(([input, state]) => {
  input.addEventListener("change", () => {
    if (!input.files?.[0]) return;
    state.textContent = input.files[0].name;
    state.classList.add("is-ready");
    updateProfilePreview();
  });
});

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  profileFormError.textContent = "";
  saveProfileButton.disabled = true;
  saveProfileButton.textContent = editingProfileId ? "Enregistrement…" : "Création…";
  try {
    const payload = {
      name: profileNameField.value.trim(),
      headline: profileHeadlineField.value.trim(),
      domains: profileDomainsField.value.split(",").map((value) => value.trim()).filter(Boolean),
      facts: profileFactsField.value.trim(),
      provider: selectedProviderId(),
      providerModel: providerModel.value,
      providerBaseUrl: providerEndpoint.value.trim(),
      apiKey: providerApiKey.value.trim(),
      templates: {
        cvFr: await filePayload(profileCvFrField),
        cvEn: await filePayload(profileCvEnField),
        coverLetter: await filePayload(profileCoverLetterField),
      },
    };
    const response = await fetch(editingProfileId ? `/api/profiles/${editingProfileId}` : "/api/profiles", {
      method: editingProfileId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Impossible d’enregistrer le profil.");
    await loadProfiles();
    await checkHealth();
    await loadApplicationLibrary();
    resetInterface();
    editProfile(activeProfile);
  } catch (error) {
    profileFormError.textContent = error instanceof Error ? error.message : "Impossible d’enregistrer le profil.";
  } finally {
    saveProfileButton.disabled = false;
    saveProfileButton.textContent = editingProfileId ? "Enregistrer le profil" : "Créer et utiliser ce profil";
  }
});

previewTabButtons.forEach((button) => {
  button.addEventListener("click", () => selectPreview(button.dataset.document));
});

soundToggleButton.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem("openApplySoundEnabled", String(soundEnabled));
  syncUtilityToggles();
  if (soundEnabled) playMilestoneTone(0);
});

automationEnabledCheckbox.addEventListener("change", () => {
  automationEnabled = automationEnabledCheckbox.checked;
  pendingAutomationToken += 1;
  localStorage.setItem("openApplyAutomationEnabled", String(automationEnabled));
  syncUtilityToggles();
});

automationToggleButton.addEventListener("click", () => {
  automationEnabled = !automationEnabled;
  pendingAutomationToken += 1;
  localStorage.setItem("openApplyAutomationEnabled", String(automationEnabled));
  syncUtilityToggles();
});

completionActionSelect.addEventListener("change", () => {
  completionAction = ["pdf", "docx", "preview"].includes(completionActionSelect.value)
    ? completionActionSelect.value
    : "preview";
  localStorage.setItem("openApplyCompletionAction", completionAction);
  syncUtilityToggles();
});

refreshUsageButton.addEventListener("click", () => {
  void loadProviderUsage({ force: true });
});

modelUsagePanel?.addEventListener("beforetoggle", (event) => {
  if (event.newState === "open") void loadProviderUsage({ force: true });
});

refreshJobWatchButton.addEventListener("click", () => {
  void loadJobWatch({ refresh: true });
});

closeJobWatchButton.addEventListener("click", () => {
  if (jobWatchPanel.matches(":popover-open")) jobWatchPanel.hidePopover();
});

jobWatchPanel?.addEventListener("beforetoggle", (event) => {
  if (event.newState === "open") void loadJobWatch({ hydrateSettings: !jobWatchPayload });
});

jobWatchTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateJobWatchTab(tab.dataset.watchTab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const offset = event.key === "ArrowRight" ? 1 : -1;
    const next = jobWatchTabs[(index + offset + jobWatchTabs.length) % jobWatchTabs.length];
    activateJobWatchTab(next.dataset.watchTab, { focus: true });
  });
});

jobWatchPanel.addEventListener("click", (event) => {
  const tabButton = event.target.closest("[data-open-watch-tab]");
  if (tabButton) {
    activateJobWatchTab(tabButton.dataset.openWatchTab, { focus: true });
    return;
  }
  const revealButton = event.target.closest("[data-secret-toggle]");
  if (!revealButton) return;
  const input = document.getElementById(revealButton.dataset.secretToggle);
  if (!input) return;
  const reveal = input.type === "password";
  input.type = reveal ? "text" : "password";
  revealButton.textContent = reveal ? "Masquer" : "Afficher";
  revealButton.setAttribute("aria-label", reveal ? "Masquer cette valeur" : "Afficher cette valeur");
});

copyFranceTravailDescriptionButton.addEventListener("click", async () => {
  const value = copyFranceTravailDescriptionButton.dataset.copyValue || "";
  try {
    await navigator.clipboard.writeText(value);
    copyFranceTravailDescriptionButton.textContent = "Description copiée ✓";
    window.setTimeout(() => {
      copyFranceTravailDescriptionButton.textContent = "Copier la description";
    }, 2_000);
  } catch {
    franceTravailCredentialStatus.textContent = "La copie automatique a échoué. Sélectionne la description manuellement.";
    franceTravailCredentialStatus.dataset.state = "error";
  }
});

jobWatchResults.addEventListener("click", (event) => {
  const openTabButton = event.target.closest("[data-open-watch-tab]");
  if (openTabButton) {
    activateJobWatchTab(openTabButton.dataset.openWatchTab, { focus: true });
    return;
  }
  const ignoreButton = event.target.closest("[data-ignore-watch-job-id]");
  if (ignoreButton) {
    void acknowledgeWatchJobs([ignoreButton.dataset.ignoreWatchJobId]).catch((error) => {
      jobWatchError.hidden = false;
      jobWatchError.textContent = error instanceof Error ? error.message : "Impossible de marquer cette offre comme vue.";
    });
    return;
  }
  const button = event.target.closest("[data-add-watch-job-id]");
  if (!button || !jobWatchPayload) return;
  const job = jobWatchPayload.jobs?.find((item) => item.id === button.dataset.addWatchJobId);
  if (job) void addWatchJobs([job]);
});

markAllWatchJobsSeenButton.addEventListener("click", () => {
  if (!jobWatchPayload) return;
  const ids = (jobWatchPayload.jobs || []).filter((job) => job.isNew).map((job) => job.id);
  if (!ids.length) return;
  void acknowledgeWatchJobs(ids).catch((error) => {
    jobWatchError.hidden = false;
    jobWatchError.textContent = error instanceof Error ? error.message : "Impossible de marquer les offres comme vues.";
  });
});

importAllWatchJobsButton.addEventListener("click", () => {
  if (!jobWatchPayload) return;
  const newJobs = (jobWatchPayload.jobs || []).filter((job) => job.isNew);
  void addWatchJobs(newJobs);
});

function currentJobWatchSettings() {
  return {
    enabled: jobWatchEnabled.checked,
    query: jobWatchQuery.value.trim(),
    location: jobWatchLocation.value.trim(),
    contract: jobWatchContract.value,
    seniority: jobWatchSeniority.value,
    intervalMinutes: Number(jobWatchInterval.value),
    families: jobWatchProfileFilter.checked ? jobWatchSuggestedFamilies : [],
    atsSources: jobWatchAtsSources.value,
    lbaRomes: jobWatchPayload?.lbaRomes || [],
    lbaTargetDiplomaLevel: jobWatchPayload?.lbaTargetDiplomaLevel || "7",
  };
}

async function persistJobWatchSettings({ scanNow = true } = {}) {
  const response = await fetch("/api/job-watch/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...currentJobWatchSettings(), scanNow }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Impossible d’enregistrer la veille.");
  renderJobWatch(result, { hydrateSettings: true });
  return result;
}

jobWatchSettingsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submit = jobWatchSettingsForm.querySelector('button[type="submit"]');
  submit.disabled = true;
  jobWatchSettingsStatus.textContent = "Enregistrement et recherche en cours…";
  try {
    await persistJobWatchSettings();
    jobWatchSettingsStatus.textContent = "Réglages enregistrés et sources actualisées.";
  } catch (error) {
    jobWatchSettingsStatus.textContent = error instanceof Error ? error.message : "Réglages non enregistrés.";
  } finally {
    submit.disabled = false;
  }
});

savePublicSourcesButton.addEventListener("click", async () => {
  const originalText = savePublicSourcesButton.textContent;
  savePublicSourcesButton.disabled = true;
  savePublicSourcesButton.textContent = "Vérification…";
  try {
    await persistJobWatchSettings();
    showAutomationToast("Pages carrières enregistrées et vérifiées.");
    savePublicSourcesButton.textContent = "Pages enregistrées ✓";
  } catch (error) {
    showAutomationToast(error instanceof Error ? error.message : "Pages carrières non enregistrées.");
    savePublicSourcesButton.textContent = "Réessayer";
  } finally {
    window.setTimeout(() => {
      savePublicSourcesButton.textContent = originalText;
      savePublicSourcesButton.disabled = false;
    }, 1_800);
  }
});

async function connectOfficialJobSource(source) {
  const isFranceTravail = source === "francetravail";
  const button = isFranceTravail ? connectFranceTravailButton : connectLaBonneAlternanceButton;
  const status = isFranceTravail ? franceTravailCredentialStatus : laBonneAlternanceCredentialStatus;
  const body = isFranceTravail
    ? {
        source,
        clientId: franceTravailClientId.value.trim(),
        clientSecret: franceTravailClientSecret.value.trim(),
      }
    : {
        source,
        token: laBonneAlternanceToken.value.trim(),
      };
  if (isFranceTravail && (!body.clientId || !body.clientSecret)) {
    status.textContent = "Colle l’identifiant client et le secret client.";
    status.dataset.state = "error";
    (body.clientId ? franceTravailClientSecret : franceTravailClientId).focus();
    return;
  }
  if (!isFranceTravail && !body.token) {
    status.textContent = "Colle le jeton d’accès reçu.";
    status.dataset.state = "error";
    laBonneAlternanceToken.focus();
    return;
  }

  button.disabled = true;
  status.textContent = "Vérification auprès du service officiel…";
  status.dataset.state = "";
  try {
    const response = await fetch("/api/job-watch/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Connexion impossible.");
    if (isFranceTravail) {
      franceTravailClientId.value = "";
      franceTravailClientSecret.value = "";
    } else {
      laBonneAlternanceToken.value = "";
    }
    renderJobWatch(result);
    status.textContent = result.credentialNotice || "Connexion vérifiée et enregistrée.";
    status.dataset.state = "success";
    showAutomationToast(status.textContent);
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : "Connexion impossible.";
    status.dataset.state = "error";
  } finally {
    button.disabled = false;
  }
}

connectFranceTravailButton.addEventListener("click", () => {
  void connectOfficialJobSource("francetravail");
});

connectLaBonneAlternanceButton.addEventListener("click", () => {
  void connectOfficialJobSource("labonnealternance");
});

async function disconnectOfficialJobSource(source) {
  const isFranceTravail = source === "francetravail";
  const label = isFranceTravail ? "France Travail" : "La Bonne Alternance";
  if (!window.confirm(`Retirer la connexion ${label} de cet appareil ?`)) return;
  const button = isFranceTravail ? disconnectFranceTravailButton : disconnectLaBonneAlternanceButton;
  const status = isFranceTravail ? franceTravailCredentialStatus : laBonneAlternanceCredentialStatus;
  button.disabled = true;
  status.textContent = "Suppression de la connexion…";
  status.dataset.state = "";
  try {
    const response = await fetch(`/api/job-watch/credentials/${source}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Déconnexion impossible.");
    renderJobWatch(result);
    status.textContent = result.credentialNotice || "Connexion retirée.";
    showAutomationToast(status.textContent);
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : "Déconnexion impossible.";
    status.dataset.state = "error";
  } finally {
    button.disabled = false;
  }
}

disconnectFranceTravailButton.addEventListener("click", () => {
  void disconnectOfficialJobSource("francetravail");
});

disconnectLaBonneAlternanceButton.addEventListener("click", () => {
  void disconnectOfficialJobSource("labonnealternance");
});

activateJobWatchTab("offers");

recoveryProvider.addEventListener("change", () => {
  updateRecoveryModels();
  if (failedRequest) {
    resumeJobButton.textContent = recoveryProvider.value !== failedRequest.provider
      ? "Changer et reprendre"
      : "Reprendre";
  }
});

resumeJobButton.addEventListener("click", async () => {
  if (!failedRequest || busyPhase) return;
  recoveryError.textContent = "";
  resumeJobButton.disabled = true;
  const endpoint = failedRequest.kind === "bundle"
    ? `/api/bundles/${failedRequest.id}/retry-failed`
    : `/api/jobs/${failedRequest.id}/resume`;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: recoveryProvider.value,
        model: recoveryModelField.hidden ? "" : recoveryModel.value,
      }),
    });
    const job = await response.json();
    if (!response.ok) throw new Error(job.error || "La reprise n’a pas pu démarrer.");
    failedRequest = null;
    recoveryPanel.hidden = true;
    formError.textContent = "";
    reviewError.textContent = "";
    activeRequest = { kind: job.kind === "bundle" ? "bundle" : "job", id: job.id };
    setBusy(true, job.stage === "analyzing" ? "analysis" : "generation", job.kind === "bundle" ? "bundle" : "single");
    setProgress(job);
    if (job.kind === "bundle") renderBundleResults(job);
    pollTimer = window.setTimeout(pollActive, 300);
  } catch (error) {
    recoveryError.textContent = error instanceof Error ? error.message : "Reprise impossible.";
    resumeJobButton.disabled = false;
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    void loadProviderUsage({ force: true });
    void loadJobWatch();
  }
});

syncUtilityToggles();
renderOfferLinks();
void initialize().catch((error) => {
  setSystemState("error", "Initialisation impossible");
  formError.textContent = error instanceof Error ? error.message : "Impossible de charger OpenApply.";
  submitButton.disabled = true;
});
