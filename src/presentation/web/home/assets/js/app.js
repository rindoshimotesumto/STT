const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => [...document.querySelectorAll(selector)];

const el = {
  dropzone: qs('#dropzone'),
  fileInput: qs('#fileInput'),
  audioCaptureInput: qs('#audioCaptureInput'),
  fileInfo: qs('#fileInfo'),
  fileName: qs('#fileName'),
  fileSize: qs('#fileSize'),
  removeBtn: qs('#removeBtn'),
  transcribeBtn: qs('#transcribeBtn'),
  actions: qs('#transcribeBtn')?.closest('.actions'),
  status: qs('#status'),
  outputText: qs('#outputText'),
  copyResultBtn: qs('#copyResultBtn'),
  downloadResultBtn: qs('#downloadResultBtn'),
  audioPlayer: qs('#audioPlayer'),
  playerPlayBtn: qs('#playerPlayBtn'),
  playerPlayIcon: qs('#playerPlayIcon'),
  playerProgress: qs('#playerProgress'),
  playerProgressFill: qs('#playerProgressFill'),
  playerTime: qs('#playerTime'),
  downloadAudioBtn: qs('#downloadAudioBtn'),
  themeToggle: qs('#themeToggle'),
  themeIcon: qs('#themeIcon'),
  langMenu: qs('#langMenu'),
  langToggle: qs('#langToggle'),
  langButtons: qsa('.lang-btn'),
  audioLangSelector: qs('#audioLangSelector'),
  audioLangButtons: qsa('.audio-lang-btn'),
  uploadModeBtn: qs('#uploadModeBtn'),
  recordModeBtn: qs('#recordModeBtn'),
  uploadPanel: qs('#uploadPanel'),
  recordPanel: qs('#recordPanel'),
  recordZone: qs('#recordZone'),
  recordBtn: qs('#recordBtn'),
  recordControls: qs('#recordControls'),
  pauseRecordBtn: qs('#pauseRecordBtn'),
  stopRecordBtn: qs('#stopRecordBtn'),
  recordTimer: qs('#recordTimer'),
  a11yWrap: qs('#a11yWrap'),
  a11yToggle: qs('#a11yToggle'),
  a11yPanel: qs('#a11yPanel'),
  fontDecreaseBtn: qs('#fontDecreaseBtn'),
  fontIncreaseBtn: qs('#fontIncreaseBtn'),
  fontSizeValue: qs('#fontSizeValue'),
  contrastToggleBtn: qs('#contrastToggleBtn'),
  contrastToggleText: qs('#contrastToggleText'),
};

const MAX_SECONDS = 30;
const MAX_FALLBACK_SIZE = 15 * 1024 * 1024;
const API_URL = '/api/stt';
const ALLOWED_EXTENSIONS = new Set(['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac', '.webm']);

const i18n = {
  en: {
    title: 'Speech to Text',
    subtitle: 'Upload an audio file to get a text transcription.',
    dropTitle: 'Drop audio here',
    dropText: 'or click to choose a file',
    uploadMode: 'Upload file',
    recordMode: 'Record audio',
    audioLangLabel: 'Audio language',
    recordTitle: 'Record in browser',
    recordText: 'Maximum recording length is 30 seconds',
    recordBtn: 'Record',
    recordHover: 'Record',
    pauseRecordBtn: 'Pause',
    resumeRecordBtn: 'Resume',
    stopRecordBtn: 'Stop',
    transcribeBtn: 'Start',
    statusWaiting: 'Waiting for file',
    statusWaitingRecording: 'Waiting for recording',
    selectAudioLangStatus: 'Choose audio language',
    statusChecking: 'Checking file...',
    statusProcessing: 'Transcribing...',
    statusRecording: 'Recording...',
    statusPaused: 'Recording paused',
    statusReady: 'Start',
    statusError: 'Error',
    outputPlaceholder: 'The transcription result will appear here.',
    outputReady: 'Choose the audio language, then click “Start”.',
    onlyAudio: 'Only popular audio formats can be uploaded: MP3, WAV, M4A, AAC, OGG, FLAC.',
    audioTooLong: 'Audio length must not exceed 30 seconds.',
    audioTooLarge: 'Audio is too large. Use a file up to 15 MB or 30 seconds.',
    processingText: 'Audio sent to STT service. Waiting for result...',
    failedText: 'Could not transcribe audio. Check backend endpoint /api/stt.',
    noText: 'No text found.',
    micError: 'Microphone is unavailable here. Open the page through HTTPS/localhost or upload an audio file.',
    copiedResult: 'Copied',
    downloadResult: 'Download',
    copyResult: 'Copy',
    fontSize: 'Text size',
    contrast: 'Contrast',
    contrastOn: 'On',
    contrastOff: 'Off',
  },
  ru: {
    title: 'Speech to Text',
    subtitle: 'Загрузите аудио файл, чтобы получить текстовую расшифровку.',
    dropTitle: 'Перетащите аудио сюда',
    dropText: 'или нажмите, чтобы выбрать файл',
    uploadMode: 'Загрузить файл',
    recordMode: 'Записать звук',
    audioLangLabel: 'Язык аудио',
    recordTitle: 'Запись в браузере',
    recordText: 'Максимальная длина записи — 30 секунд',
    recordBtn: 'Записать',
    recordHover: 'Запись',
    pauseRecordBtn: 'Пауза',
    resumeRecordBtn: 'Продолжить',
    stopRecordBtn: 'Стоп',
    transcribeBtn: 'Начать',
    statusWaiting: 'Ожидание файла',
    statusWaitingRecording: 'Ожидание записи',
    selectAudioLangStatus: 'Выберите язык аудио',
    statusChecking: 'Проверка файла...',
    statusProcessing: 'Распознавание...',
    statusRecording: 'Идёт запись...',
    statusPaused: 'Запись на паузе',
    statusReady: 'Начать',
    statusError: 'Ошибка',
    outputPlaceholder: 'Здесь появится результат распознавания.',
    outputReady: 'Выберите язык аудио, затем нажмите «Начать».',
    onlyAudio: 'Можно загрузить только популярные аудио форматы: MP3, WAV, M4A, AAC, OGG, FLAC.',
    audioTooLong: 'Длина аудио не должна превышать 30 секунд.',
    audioTooLarge: 'Файл слишком большой. Используйте файл до 15 МБ или до 30 секунд.',
    processingText: 'Файл отправлен на STT сервис. Ожидается результат...',
    failedText: 'Не удалось распознать аудио. Проверь backend endpoint /api/stt.',
    noText: 'Текст не найден.',
    micError: 'Микрофон здесь недоступен. Открой страницу через HTTPS/localhost или загрузите аудио файлом.',
    copiedResult: 'Скопировано',
    downloadResult: 'Скачать',
    copyResult: 'Копировать',
    fontSize: 'Шрифт',
    contrast: 'Контраст',
    contrastOn: 'Вкл',
    contrastOff: 'Выкл',
  },
  uz: {
    title: 'Speech to Text',
    subtitle: 'Audio fayl yuklang va uning matn ko‘rinishidagi transkripsiyasini oling.',
    dropTitle: 'Audioni shu yerga tashlang',
    dropText: 'yoki fayl tanlash uchun bosing',
    uploadMode: 'Fayl yuklash',
    recordMode: 'Ovoz yozish',
    audioLangLabel: 'Audio tili',
    recordTitle: 'Brauzerda yozish',
    recordText: 'Yozuv uzunligi 30 soniyadan oshmasin',
    recordBtn: 'Yozish',
    recordHover: 'Yozuv',
    pauseRecordBtn: 'Pauza',
    resumeRecordBtn: 'Davom etish',
    stopRecordBtn: 'To‘xtatish',
    transcribeBtn: 'Boshlash',
    statusWaiting: 'Fayl kutilmoqda',
    statusWaitingRecording: 'Yozuv kutilmoqda',
    selectAudioLangStatus: 'Audio tilini tanlang',
    statusChecking: 'Fayl tekshirilmoqda...',
    statusProcessing: 'Tanish jarayoni...',
    statusRecording: 'Yozilmoqda...',
    statusPaused: 'Yozuv pauzada',
    statusReady: 'Boshlash',
    statusError: 'Xatolik',
    outputPlaceholder: 'Tanish natijasi shu yerda chiqadi.',
    outputReady: 'Audio tilini tanlang, keyin «Boshlash» tugmasini bosing.',
    onlyAudio: 'Faqat mashhur audio formatlarni yuklash mumkin: MP3, WAV, M4A, AAC, OGG, FLAC.',
    audioTooLong: 'Audio uzunligi 30 soniyadan oshmasin.',
    audioTooLarge: 'Fayl juda katta. 15 MB gacha yoki 30 soniyagacha bo‘lgan audio ishlating.',
    processingText: 'Audio STT servisga yuborildi. Natija kutilmoqda...',
    failedText: 'Audioni tanib bo‘lmadi. Backend endpoint /api/stt ni tekshiring.',
    noText: 'Matn topilmadi.',
    micError: 'Bu yerda mikrofon mavjud emas. Sahifani HTTPS/localhost orqali oching yoki audio fayl yuklang.',
    copiedResult: 'Nusxalandi',
    downloadResult: 'Yuklab olish',
    copyResult: 'Nusxa olish',
    fontSize: 'Shrift',
    contrast: 'Kontrast',
    contrastOn: 'Yoqilgan',
    contrastOff: 'O‘chiq',
  },
};

const state = {
  lang: localStorage.getItem('lang') || 'en',
  theme: localStorage.getItem('theme') || 'light',
  fontPx: clamp(Number.parseInt(localStorage.getItem('a11yFontPx') || '14', 10), 14, 20),
  highContrast: localStorage.getItem('a11yHighContrast') === 'true',
  mode: 'upload',
  selectedFile: null,
  selectedAudioLang: null,
  objectUrl: null,
  knownDuration: null,
  resultText: '',
  isProcessing: false,
  isResultReady: false,
  recorder: null,
  chunks: [],
  recordStartedAt: 0,
  pausedAt: 0,
  pausedMs: 0,
  recordTimer: null,
  recordStopper: null,
};

function t(key) {
  return i18n[state.lang]?.[key] || i18n.en[key] || key;
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, index)).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function formatTime(seconds) {
  const safe = Math.max(0, Math.floor(seconds || 0));
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
}

function getExtension(filename = '') {
  const dot = filename.lastIndexOf('.');
  return dot === -1 ? '' : filename.slice(dot).toLowerCase();
}

function replaySoft(node) {
  if (!node) return;
  node.classList.remove('soft-enter');
  void node.offsetWidth;
  node.classList.add('soft-enter');
}

function setOutput(text, placeholder = false) {
  el.outputText.textContent = text;
  el.outputText.classList.toggle('placeholder', placeholder);
  replaySoft(el.outputText);
}


function setAction(kind, text, disabled = true) {
  el.transcribeBtn.className = `action-button status-mode action-${kind}`;
  el.transcribeBtn.disabled = disabled;
  el.status.textContent = text;
}

function showAction() {
  const wasHidden = el.actions?.classList.contains('is-hidden');
  el.actions?.classList.remove('is-hidden');
  if (wasHidden) replaySoft(el.actions);
}


function hideAction() {
  el.actions?.classList.add('is-hidden');
}

function updateAction() {
  if (state.isResultReady) {
    hideAction();
    return;
  }

  showAction();

  if (state.isProcessing) {
    setAction('processing', t('statusProcessing'), true);
    return;
  }

  if (!state.selectedFile) {
    const key = state.mode === 'record' ? 'statusWaitingRecording' : 'statusWaiting';
    setAction('waiting', t(key), true);
    return;
  }

  if (!state.selectedAudioLang) {
    setAction('waiting-lang', t('selectAudioLangStatus'), true);
    return;
  }

  setAction('ready', t('transcribeBtn'), false);
}

function resetResult() {
  state.resultText = '';
  state.isResultReady = false;
  setOutput(t('outputPlaceholder'), true);
  el.copyResultBtn.disabled = true;
  el.downloadResultBtn.disabled = true;
  showAction();
}

function resetAudioLang() {
  state.selectedAudioLang = null;
  el.audioLangButtons.forEach((btn) => btn.classList.remove('active'));
}

function setAudioLangVisible(isVisible) {
  const wasHidden = !el.audioLangSelector.classList.contains('active');
  el.audioLangSelector.classList.toggle('active', isVisible);
  if (isVisible && wasHidden) replaySoft(el.audioLangSelector);
}


function applyLanguage(lang) {
  state.lang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  el.langToggle.textContent = lang.toUpperCase();

  qsa('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (key) node.textContent = t(key);
  });

  el.langButtons.forEach((btn) => {
    btn.hidden = btn.dataset.lang === lang;
  });

  updateA11yLabels();
  updateAction();

  if (!state.resultText && !state.selectedFile) {
    setOutput(t('outputPlaceholder'), true);
  } else if (!state.resultText && state.selectedFile) {
    setOutput(t('outputReady'), true);
  }
}

function applyTheme(theme) {
  state.theme = theme;
  localStorage.setItem('theme', theme);
  document.documentElement.dataset.theme = theme;
  el.themeIcon.innerHTML = theme === 'dark'
    ? '<path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79z"></path>'
    : '<path d="M12 3v1"></path><path d="M12 20v1"></path><path d="M4.22 4.22l.7.7"></path><path d="M19.08 19.08l.7.7"></path><path d="M3 12h1"></path><path d="M20 12h1"></path><path d="M4.22 19.78l.7-.7"></path><path d="M19.08 4.92l.7-.7"></path><circle cx="12" cy="12" r="4"></circle>';
}

function updateA11yLabels() {
  el.fontSizeValue.textContent = `${state.fontPx}px`;
  el.contrastToggleText.textContent = state.highContrast ? t('contrastOn') : t('contrastOff');
}

function applyA11y() {
  document.documentElement.style.setProperty('--user-text-size', `${state.fontPx}px`);
  document.documentElement.dataset.a11yCustomFont = String(state.fontPx !== 14);
  document.documentElement.dataset.contrast = state.highContrast ? 'high' : 'normal';
  localStorage.setItem('a11yFontPx', String(state.fontPx));
  localStorage.setItem('a11yHighContrast', String(state.highContrast));
  updateA11yLabels();
}

function switchMode(mode) {
  if (state.mode === mode) return;
  state.mode = mode;
  el.uploadModeBtn.classList.toggle('active', mode === 'upload');
  el.recordModeBtn.classList.toggle('active', mode === 'record');
  el.uploadPanel.classList.toggle('panel-hidden', mode !== 'upload');
  el.recordPanel.classList.toggle('panel-hidden', mode !== 'record');

  if (!state.selectedFile && !state.resultText) {
    updateAction();
  }
}

function setSelectedFile(file, knownDuration = null) {
  if (!file) return;

  state.selectedFile = file;
  state.knownDuration = knownDuration;
  resetResult();
  resetAudioLang();
  setAudioLangVisible(true);

  if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
  state.objectUrl = URL.createObjectURL(file);

  el.fileName.textContent = file.name;
  el.fileSize.textContent = `${formatBytes(file.size)}${knownDuration ? ` · ${formatTime(knownDuration)}` : ''}`;
  el.fileInfo.classList.add('active');
  replaySoft(el.fileInfo);

  el.audioPlayer.src = state.objectUrl;
  el.downloadAudioBtn.disabled = false;
  updatePlayerTime();
  setOutput(t('outputReady'), true);
  updateAction();
}

function clearSelectedFile() {
  if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
  state.selectedFile = null;
  state.selectedAudioLang = null;
  state.objectUrl = null;
  state.knownDuration = null;
  state.resultText = '';
  state.isResultReady = false;

  el.fileInput.value = '';
  el.audioCaptureInput.value = '';
  el.fileInfo.classList.remove('active');
  setAudioLangVisible(false);
  resetAudioLang();
  el.audioPlayer.removeAttribute('src');
  el.audioPlayer.load();
  el.playerProgressFill.style.width = '0%';
  el.downloadAudioBtn.disabled = true;
  el.copyResultBtn.disabled = true;
  el.downloadResultBtn.disabled = true;

  setOutput(t('outputPlaceholder'), true);
  updateAction();
}

function readAudioDuration(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    const cleanup = () => URL.revokeObjectURL(url);

    audio.preload = 'metadata';
    audio.onloadedmetadata = () => {
      cleanup();
      resolve(Number.isFinite(audio.duration) ? audio.duration : null);
    };
    audio.onerror = () => {
      cleanup();
      reject(new Error('duration_unavailable'));
    };
    audio.src = url;
  });
}

async function handleFile(file, knownDuration = null) {
  if (!file) return;

  const extension = getExtension(file.name);
  const isAudio = file.type.startsWith('audio/') || ALLOWED_EXTENSIONS.has(extension);

  if (!isAudio || !ALLOWED_EXTENSIONS.has(extension)) {
    clearSelectedFile();
    setAction('error', t('statusError'), true);
    setOutput(t('onlyAudio'), true);
    return;
  }

  setAction('checking', t('statusChecking'), true);
  setOutput(t('statusChecking'), true);

  try {
    const duration = knownDuration ?? await readAudioDuration(file);
    if (duration && duration > MAX_SECONDS + 0.5) {
      clearSelectedFile();
      setAction('error', t('statusError'), true);
      setOutput(t('audioTooLong'), true);
      return;
    }
    setSelectedFile(file, duration);
  } catch {
    if (file.size > MAX_FALLBACK_SIZE) {
      clearSelectedFile();
      setAction('error', t('statusError'), true);
      setOutput(t('audioTooLarge'), true);
      return;
    }
    setSelectedFile(file, null);
  }
}

async function transcribe() {
  if (!state.selectedFile || !state.selectedAudioLang || state.isProcessing) return;

  state.isProcessing = true;
  updateAction();
  setOutput(t('processingText'), true);

  const formData = new FormData();
  formData.append('audio', state.selectedFile);
  formData.append('lang', state.selectedAudioLang);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.detail || payload.message || response.statusText);
    }

    const text = payload.text || payload.result || payload.transcription || payload.normalize || payload.original || '';
    state.resultText = text || t('noText');
    state.isResultReady = true;

    setOutput(state.resultText, false);
    setAudioLangVisible(false);
    hideAction();
    el.copyResultBtn.disabled = false;
    el.downloadResultBtn.disabled = false;
  } catch (error) {
    state.isResultReady = false;
    setOutput(error.message && error.message !== 'Failed to fetch' ? error.message : t('failedText'), true);
    setAction('error', t('statusError'), true);
    window.setTimeout(updateAction, 900);
  } finally {
    state.isProcessing = false;
  }
}

function updatePlayerIcon(isPlaying) {
  el.playerPlayIcon.innerHTML = isPlaying
    ? '<path d="M8 5h3v14H8z"></path><path d="M13 5h3v14h-3z"></path>'
    : '<path d="M8 5v14l11-7-11-7Z"></path>';
}

function updatePlayerTime() {
  const current = el.audioPlayer.currentTime || 0;
  const total = state.knownDuration || el.audioPlayer.duration || 0;
  el.playerTime.textContent = `${formatTime(current)} / ${formatTime(total)}`;
  el.playerProgressFill.style.width = total ? `${Math.min(100, (current / total) * 100)}%` : '0%';
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 300);
}

function animateDownload(button) {
  button.classList.remove('is-downloading');
  void button.offsetWidth;
  button.classList.add('is-downloading');
  window.setTimeout(() => button.classList.remove('is-downloading'), 620);
}

async function copyResult() {
  if (!state.resultText) return;
  await navigator.clipboard.writeText(state.resultText);
  el.copyResultBtn.classList.remove('is-copied');
  void el.copyResultBtn.offsetWidth;
  el.copyResultBtn.classList.add('is-copied');
  window.setTimeout(() => el.copyResultBtn.classList.remove('is-copied'), 620);
}

function downloadResult() {
  if (!state.resultText) return;
  animateDownload(el.downloadResultBtn);
  downloadBlob(new Blob([state.resultText], { type: 'text/plain;charset=utf-8' }), 'stt_result.txt');
}

function downloadAudio() {
  if (!state.selectedFile) return;
  animateDownload(el.downloadAudioBtn);
  downloadBlob(state.selectedFile, state.selectedFile.name || 'audio.webm');
}

function audioFileName() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `audio_${y}-${m}-${d}_${h}-${min}-${s}.webm`;
}

function updateRecordTimer() {
  const elapsed = (Date.now() - state.recordStartedAt - state.pausedMs) / 1000;
  const current = clamp(Math.floor(elapsed), 0, MAX_SECONDS);
  el.recordTimer.querySelector('.timer-current').textContent = formatTime(current);
}

async function startRecording() {
  if (state.recorder && state.recorder.state !== 'inactive') return;

  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    setOutput(t('micError'), true);
    el.audioCaptureInput.click();
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.chunks = [];
    state.recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    state.recordStartedAt = Date.now();
    state.pausedAt = 0;
    state.pausedMs = 0;

    state.recorder.ondataavailable = (event) => {
      if (event.data.size) state.chunks.push(event.data);
    };

    state.recorder.onstop = async () => {
      stream.getTracks().forEach((track) => track.stop());
      stopRecordUi();
      const duration = clamp(Math.round((Date.now() - state.recordStartedAt - state.pausedMs) / 1000), 1, MAX_SECONDS);
      const blob = new Blob(state.chunks, { type: 'audio/webm' });
      const file = new File([blob], audioFileName(), { type: 'audio/webm' });
      await handleFile(file, duration);
    };

    state.recorder.start();
    startRecordUi();
  } catch {
    setOutput(t('micError'), true);
    el.audioCaptureInput.click();
  }
}

function startRecordUi() {
  resetResult();
  el.recordZone.classList.add('is-recording');
  el.recordControls.classList.add('active');
  el.pauseRecordBtn.textContent = t('pauseRecordBtn');
  setAction('recording', t('statusRecording'), true);
  setOutput(t('statusRecording'), true);
  state.recordTimer = window.setInterval(updateRecordTimer, 250);
  state.recordStopper = window.setTimeout(stopRecording, MAX_SECONDS * 1000);
  updateRecordTimer();
}

function stopRecordUi() {
  window.clearInterval(state.recordTimer);
  window.clearTimeout(state.recordStopper);
  state.recordTimer = null;
  state.recordStopper = null;
  el.recordZone.classList.remove('is-recording');
  el.recordControls.classList.remove('active');
  el.recordTimer.querySelector('.timer-current').textContent = '00:00';
}

function pauseRecording(event) {
  event.stopPropagation();
  if (!state.recorder) return;

  if (state.recorder.state === 'recording') {
    state.recorder.pause();
    state.pausedAt = Date.now();
    el.pauseRecordBtn.textContent = t('resumeRecordBtn');
    setAction('recording', t('statusPaused'), true);
    return;
  }

  if (state.recorder.state === 'paused') {
    state.recorder.resume();
    state.pausedMs += Date.now() - state.pausedAt;
    state.pausedAt = 0;
    el.pauseRecordBtn.textContent = t('pauseRecordBtn');
    setAction('recording', t('statusRecording'), true);
  }
}

function stopRecording(event) {
  event?.stopPropagation();
  if (!state.recorder || state.recorder.state === 'inactive') return;
  state.recorder.stop();
}

function initEvents() {
  el.themeToggle.addEventListener('click', () => applyTheme(state.theme === 'dark' ? 'light' : 'dark'));
  el.langToggle.addEventListener('click', () => el.langMenu.classList.toggle('open'));
  el.langButtons.forEach((btn) => btn.addEventListener('click', () => {
    applyLanguage(btn.dataset.lang);
    el.langMenu.classList.remove('open');
  }));

  el.a11yToggle.addEventListener('click', () => {
    const isOpen = el.a11yWrap.classList.toggle('open');
    el.a11yToggle.setAttribute('aria-expanded', String(isOpen));
  });
  el.fontDecreaseBtn.addEventListener('click', () => { state.fontPx = clamp(state.fontPx - 1, 14, 20); applyA11y(); });
  el.fontIncreaseBtn.addEventListener('click', () => { state.fontPx = clamp(state.fontPx + 1, 14, 20); applyA11y(); });
  el.contrastToggleBtn.addEventListener('click', () => { state.highContrast = !state.highContrast; applyA11y(); });

  el.uploadModeBtn.addEventListener('click', () => switchMode('upload'));
  el.recordModeBtn.addEventListener('click', () => switchMode('record'));

  el.fileInput.addEventListener('change', () => handleFile(el.fileInput.files[0]));
  el.audioCaptureInput.addEventListener('change', () => handleFile(el.audioCaptureInput.files[0]));

  el.dropzone.addEventListener('dragover', (event) => { event.preventDefault(); el.dropzone.classList.add('dragover'); });
  el.dropzone.addEventListener('dragleave', () => el.dropzone.classList.remove('dragover'));
  el.dropzone.addEventListener('drop', (event) => {
    event.preventDefault();
    el.dropzone.classList.remove('dragover');
    handleFile(event.dataTransfer.files[0]);
  });

  el.audioLangButtons.forEach((btn) => btn.addEventListener('click', () => {
    state.selectedAudioLang = btn.dataset.audioLang;
    el.audioLangButtons.forEach((item) => item.classList.toggle('active', item === btn));
    updateAction();
  }));

  el.removeBtn.addEventListener('click', clearSelectedFile);
  el.transcribeBtn.addEventListener('click', transcribe);
  el.copyResultBtn.addEventListener('click', copyResult);
  el.downloadResultBtn.addEventListener('click', downloadResult);
  el.downloadAudioBtn.addEventListener('click', downloadAudio);

  el.playerPlayBtn.addEventListener('click', () => {
    if (!el.audioPlayer.src) return;
    el.audioPlayer.paused ? el.audioPlayer.play() : el.audioPlayer.pause();
  });
  el.audioPlayer.addEventListener('play', () => updatePlayerIcon(true));
  el.audioPlayer.addEventListener('pause', () => updatePlayerIcon(false));
  el.audioPlayer.addEventListener('ended', () => updatePlayerIcon(false));
  el.audioPlayer.addEventListener('timeupdate', updatePlayerTime);
  el.audioPlayer.addEventListener('loadedmetadata', updatePlayerTime);
  el.playerProgress.addEventListener('click', (event) => {
    const duration = state.knownDuration || el.audioPlayer.duration;
    if (!duration) return;
    const rect = el.playerProgress.getBoundingClientRect();
    el.audioPlayer.currentTime = ((event.clientX - rect.left) / rect.width) * duration;
  });

  el.recordZone.addEventListener('click', startRecording);
  el.recordZone.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      startRecording();
    }
  });
  el.pauseRecordBtn.addEventListener('click', pauseRecording);
  el.stopRecordBtn.addEventListener('click', stopRecording);
}

function init() {
  applyTheme(state.theme);
  applyA11y();
  applyLanguage(state.lang);
  setAudioLangVisible(false);
  clearSelectedFile();
  initEvents();
}

init();
