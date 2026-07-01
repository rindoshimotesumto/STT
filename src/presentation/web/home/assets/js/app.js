const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("fileInput");
    const audioCaptureInput = document.getElementById("audioCaptureInput");
    const fileInfo = document.getElementById("fileInfo");
    const fileName = document.getElementById("fileName");
    const fileSize = document.getElementById("fileSize");
    const removeBtn = document.getElementById("removeBtn");
    const transcribeBtn = document.getElementById("transcribeBtn");
    const actionsWrap = transcribeBtn.closest(".actions");
    const statusEl = document.getElementById("status");
    const outputText = document.getElementById("outputText");
    const copyResultBtn = document.getElementById("copyResultBtn");
    const copyResultText = document.getElementById("copyResultText");
    const downloadResultBtn = document.getElementById("downloadResultBtn");
    const downloadResultText = document.getElementById("downloadResultText");
    const audioPlayer = document.getElementById("audioPlayer");
    const playerPlayBtn = document.getElementById("playerPlayBtn");
    const playerPlayIcon = document.getElementById("playerPlayIcon");
    const playerProgress = document.getElementById("playerProgress");
    const playerProgressFill = document.getElementById("playerProgressFill");
    const playerTime = document.getElementById("playerTime");
    const downloadAudioBtn = document.getElementById("downloadAudioBtn");

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const langMenu = document.getElementById("langMenu");
    const langToggle = document.getElementById("langToggle");
    const langButtons = document.querySelectorAll(".lang-btn");
    const audioLangButtons = document.querySelectorAll(".audio-lang-btn");
    const audioLangSelector = document.getElementById("audioLangSelector");
    const uploadModeBtn = document.getElementById("uploadModeBtn");
    const recordModeBtn = document.getElementById("recordModeBtn");
    const uploadPanel = document.getElementById("uploadPanel");
    const recordPanel = document.getElementById("recordPanel");
    const recordZone = document.getElementById("recordZone");
    const recordBtn = document.getElementById("recordBtn");
    const recordControls = document.getElementById("recordControls");
    const pauseRecordBtn = document.getElementById("pauseRecordBtn");
    const stopRecordBtn = document.getElementById("stopRecordBtn");
    const recordTimer = document.getElementById("recordTimer");
    const voiceBars = document.getElementById("voiceBars");
    const a11yWrap = document.getElementById("a11yWrap");
    const a11yToggle = document.getElementById("a11yToggle");
    const a11yPanel = document.getElementById("a11yPanel");
    const fontDecreaseBtn = document.getElementById("fontDecreaseBtn");
    const fontIncreaseBtn = document.getElementById("fontIncreaseBtn");
    const fontSizeValue = document.getElementById("fontSizeValue");
    const contrastToggleBtn = document.getElementById("contrastToggleBtn");
    const contrastToggleText = document.getElementById("contrastToggleText");

    let selectedFile = null;
    let selectedDisplayFileName = "";
    let currentLang = localStorage.getItem("lang") || "en";
    let selectedAudioLang = null;
    let mediaRecorder = null;
    let recordedChunks = [];
    let recordStartedAt = 0;
    let recordTimerInterval = null;
    let recordStopTimeout = null;
    let recordedDurationSeconds = 0;
    let pausedAt = 0;
    let totalPausedMs = 0;
    let previewObjectUrl = null;
    let previewKnownDuration = null;
    let currentStatusKey = "statusWaiting";
    let currentStatusText = "";
    let currentStatusType = "";
    let currentOutputKey = "outputPlaceholder";
    let currentOutputText = "";
    let currentOutputPlaceholder = true;
    let audioContext = null;
    let analyserNode = null;
    let analyserData = null;
    let voiceAnimationId = null;
    let currentFontPx = Number.parseInt(localStorage.getItem("a11yFontPx") || "14", 10);
    if (!Number.isFinite(currentFontPx)) currentFontPx = 14;
    let highContrastEnabled = localStorage.getItem("a11yHighContrast") === "true";
    let lastSttResponse = null;

    const translations = {
      en: {
        title: "Speech to Text",
        subtitle: "Upload an audio file to get a text transcription.",
        dropTitle: "Drop audio here",
        dropText: "or click to choose a file",
        uploadMode: "Upload file",
        recordMode: "Record audio",
        audioLangLabel: "Audio language",
        recordTitle: "Record in browser",
        recordText: "Maximum recording length is 30 seconds",
        recordBtn: "Record",
        recordHover: "Record",
        recordMaxTime: "max 30s",
        pauseRecordBtn: "Pause",
        resumeRecordBtn: "Resume",
        stopRecordBtn: "Stop",
        micPermissionDenied: "Microphone access denied or unavailable. Allow microphone access in browser settings and try again.",
        micSecureContextDenied: "Microphone recording is blocked here. Open this page through HTTPS or localhost in a normal browser.",
        micRequestStatus: "Microphone permission",
        micRequestText: "Allow microphone access in the browser permission popup.",
        micUnsupportedFallback: "Browser recording is not available here. Use the system audio recorder or open the page through HTTPS/localhost.",
        recordingStatus: "Recording...",
        recordingPausedStatus: "Recording paused",
        recordedReady: "Recording ready",
        recordingOutput: "Recording saved. Click “Start” to transcribe.",
        recordingFileName: "Browser recording",
        transcribeBtn: "Start",
        previewTitle: "Preview",
        outputTitle: "Output",
        statusWaiting: "Waiting for file",
        statusWaitingRecording: "Waiting for recording",
        statusReady: "File ready",
        selectAudioLangStatus: "Choose audio language",
        selectAudioLangOutput: "Choose the audio language, then click “Start”.",
        statusInvalid: "Invalid format",
        statusProcessing: "Transcribing...",
        statusChecking: "Checking file...",
        statusDone: "Done",
        statusError: "Error",
        outputPlaceholder: "The transcription result will appear here.",
        outputReady: "Click “Start” to begin transcription.",
        checkingText: "Checking file duration...",
        onlyAudio: "Only popular audio formats can be uploaded: MP3, WAV, M4A, AAC, OGG, FLAC.",
        audioTooLong: "Audio length must not exceed 30 seconds.",
        audioTooLarge: "Audio is too large. Use a file up to 15 MB or 30 seconds.",
        processingText: "Audio sent to STT service. Waiting for result...",
        noText: "No text found.",
        failedText: "Could not transcribe audio. Check backend endpoint /api/stt.",
        accessibilityTitle: "Accessibility",
        fontSize: "Text size",
        fontDefault: "Normal",
        fontLarge: "Large",
        contrast: "Contrast",
        contrastOn: "On",
        contrastOff: "Off",
        copyResult: "Copy",
        copiedResult: "Copied",
        downloadResult: "Download",
      },
      ru: {
        title: "Speech to Text",
        subtitle: "Загрузите аудио файл, чтобы получить текстовую расшифровку.",
        dropTitle: "Перетащите аудио сюда",
        dropText: "или нажмите, чтобы выбрать файл",
        uploadMode: "Загрузить файл",
        recordMode: "Записать звук",
        audioLangLabel: "Язык аудио",
        recordTitle: "Запись в браузере",
        recordText: "Максимальная длина записи — 30 секунд",
        recordBtn: "Записать",
        recordHover: "Запись",
        recordMaxTime: "макс. 30 сек",
        pauseRecordBtn: "Пауза",
        resumeRecordBtn: "Продолжить",
        stopRecordBtn: "Стоп",
        micPermissionDenied: "Доступ к микрофону запрещён или недоступен. Разрешите микрофон в настройках браузера и попробуйте снова.",
        micSecureContextDenied: "Запись с микрофона здесь заблокирована. Открой страницу через HTTPS или localhost в обычном браузере.",
        micRequestStatus: "Разрешение микрофона",
        micRequestText: "Разрешите доступ к микрофону во всплывающем окне браузера.",
        micUnsupportedFallback: "Запись в браузере здесь недоступна. Используйте системную запись аудио или откройте страницу через HTTPS/localhost.",
        recordingStatus: "Идёт запись...",
        recordingPausedStatus: "Запись на паузе",
        recordedReady: "Запись готова",
        recordingOutput: "Запись сохранена. Нажмите “Старт”, чтобы распознать.",
        recordingFileName: "Запись из браузера",
        transcribeBtn: "Начать",
        previewTitle: "Прослушать",
        outputTitle: "Результат",
        statusWaiting: "Ожидание файла",
        statusWaitingRecording: "Ожидание записи",
        statusReady: "Файл готов",
        selectAudioLangStatus: "Выберите язык аудио",
        selectAudioLangOutput: "Выберите язык аудио, затем нажмите “Старт”.",
        statusInvalid: "Неверный формат",
        statusProcessing: "Распознавание...",
        statusChecking: "Проверка файла...",
        statusDone: "Готово",
        statusError: "Ошибка",
        outputPlaceholder: "Здесь появится результат распознавания.",
        outputReady: "Нажмите “Старт”, чтобы начать распознавание.",
        checkingText: "Проверка длительности файла...",
        onlyAudio: "Можно загрузить только популярные аудио форматы: MP3, WAV, M4A, AAC, OGG, FLAC.",
        audioTooLong: "Длина аудио не должна превышать 30 секунд.",
        audioTooLarge: "Файл слишком большой. Используйте файл до 15 МБ или до 30 секунд.",
        processingText: "Аудио отправлено в STT сервис. Ожидание результата...",
        noText: "Текст не найден.",
        failedText: "Не удалось распознать аудио. Проверьте backend endpoint /api/stt.",
        accessibilityTitle: "Спец. возможности",
        fontSize: "Шрифт",
        fontDefault: "Обычный",
        fontLarge: "Крупный",
        contrast: "Контраст",
        contrastOn: "Вкл",
        contrastOff: "Выкл",
        copyResult: "Копировать",
        copiedResult: "Скопировано",
        downloadResult: "Скачать",
      },
      uz: {
        title: "Speech to Text",
        subtitle: "Audio fayl yuklang va uning matn ko‘rinishidagi transkripsiyasini oling.",
        dropTitle: "Audioni shu yerga tashlang",
        dropText: "yoki fayl tanlash uchun bosing",
        uploadMode: "Fayl yuklash",
        recordMode: "Ovoz yozish",
        audioLangLabel: "Audio tili",
        recordTitle: "Brauzerda yozish",
        recordText: "Yozuv uzunligi 30 soniyadan oshmasin",
        recordBtn: "Yozish",
        recordHover: "Yozuv",
        recordMaxTime: "maks. 30 soniya",
        pauseRecordBtn: "Pauza",
        resumeRecordBtn: "Davom etish",
        stopRecordBtn: "To‘xtatish",
        micPermissionDenied: "Mikrofonga ruxsat berilmagan yoki mavjud emas. Brauzer sozlamalarida mikrofonni yoqing va qayta urinib ko‘ring.",
        micSecureContextDenied: "Bu joyda mikrofon yozuvi bloklangan. Sahifani oddiy brauzerda HTTPS yoki localhost orqali oching.",
        micRequestStatus: "Mikrofon ruxsati",
        micRequestText: "Brauzer oynasida mikrofonga ruxsat bering.",
        micUnsupportedFallback: "Bu yerda brauzer orqali yozish mavjud emas. Tizim audio yozuvchisidan foydalaning yoki sahifani HTTPS/localhost orqali oching.",
        recordingStatus: "Yozilmoqda...",
        recordingPausedStatus: "Yozuv pauzada",
        recordedReady: "Yozuv tayyor",
        recordingOutput: "Yozuv saqlandi. Tanitish uchun “Start” tugmasini bosing.",
        recordingFileName: "Brauzer yozuvi",
        transcribeBtn: "Boshlash",
        previewTitle: "Eshitib ko‘rish",
        outputTitle: "Natija",
        statusWaiting: "Fayl kutilmoqda",
        statusWaitingRecording: "Yozuv kutilmoqda",
        statusReady: "Fayl tayyor",
        selectAudioLangStatus: "Audio tilini tanlang",
        selectAudioLangOutput: "Audio tilini tanlang, keyin “Start” tugmasini bosing.",
        statusInvalid: "Noto‘g‘ri format",
        statusProcessing: "Tanish jarayoni...",
        statusChecking: "Fayl tekshirilmoqda...",
        statusDone: "Tayyor",
        statusError: "Xatolik",
        outputPlaceholder: "Tanish natijasi shu yerda chiqadi.",
        outputReady: "Tanishni boshlash uchun “Start” tugmasini bosing.",
        checkingText: "Fayl davomiyligi tekshirilmoqda...",
        onlyAudio: "Faqat ommabop audio formatlarni yuklash mumkin: MP3, WAV, M4A, AAC, OGG, FLAC.",
        audioTooLong: "Audio uzunligi 30 soniyadan oshmasligi kerak.",
        audioTooLarge: "Fayl hajmi juda katta. 15 MB gacha yoki 30 soniyagacha bo‘lgan fayldan foydalaning.",
        processingText: "Audio STT servisiga yuborildi. Natija kutilmoqda...",
        noText: "Matn topilmadi.",
        failedText: "Audioni tanib bo‘lmadi. Backend endpoint /api/stt ni tekshiring.",
        accessibilityTitle: "Maxsus imkoniyat",
        fontSize: "Shrift",
        fontDefault: "Oddiy",
        fontLarge: "Katta",
        contrast: "Kontrast",
        contrastOn: "Yoqilgan",
        contrastOff: "O‘chirilgan",
        copyResult: "Nusxa olish",
        copiedResult: "Nusxa olindi",
        downloadResult: "Yuklab olish",
      }
    };

    function t(key) {
      return translations[currentLang][key] || translations.en[key] || key;
    }

    function applyAudioLanguage(lang) {
      selectedAudioLang = ["uz", "ru"].includes(lang) ? lang : null;
      audioLangButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.audioLang === selectedAudioLang);
      });

      if (selectedFile && selectedAudioLang && currentStatusKey === "selectAudioLangStatus") {
        transcribeBtn.disabled = false;
        setStatusKey("statusReady");
        setOutputKey("outputReady", true);
      }
    }


    function clampTextSize(value) {
      return Math.min(20, Math.max(14, Number.parseInt(value, 10) || 14));
    }

    function updateAccessibilityLabels() {
      if (fontSizeValue) {
        fontSizeValue.textContent = `${currentFontPx}px`;
      }
      if (contrastToggleText) {
        contrastToggleText.textContent = highContrastEnabled ? t("contrastOn") : t("contrastOff");
      }
    }

    function applyA11yFont(sizePx) {
      currentFontPx = clampTextSize(sizePx);
      localStorage.setItem("a11yFontPx", String(currentFontPx));
      document.documentElement.style.setProperty("--a11y-font-size", `${currentFontPx}px`);
      document.documentElement.dataset.a11yCustomFont = currentFontPx === 14 ? "false" : "true";
      updateAccessibilityLabels();
    }

    function applyHighContrast(enabled) {
      highContrastEnabled = Boolean(enabled);
      localStorage.setItem("a11yHighContrast", String(highContrastEnabled));
      document.documentElement.dataset.contrast = highContrastEnabled ? "high" : "normal";
      updateAccessibilityLabels();
    }

    function applyLanguage(lang) {
      currentLang = lang;
      localStorage.setItem("lang", lang);
      langToggle.textContent = lang.toUpperCase();
      langButtons.forEach((button) => {
        const isCurrent = button.dataset.lang === lang;
        button.classList.toggle("active", isCurrent);
        button.classList.toggle("is-hidden", isCurrent);
      });
      document.documentElement.lang = lang;

      document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.dataset.i18n;
        element.textContent = t(key);
      });

      if (currentStatusKey) {
        applyStatus(t(currentStatusKey), currentStatusType);
      } else {
        applyStatus(currentStatusText, currentStatusType);
      }

      if (currentOutputKey) {
        applyOutput(t(currentOutputKey), currentOutputPlaceholder);
      } else {
        applyOutput(currentOutputText, currentOutputPlaceholder);
      }

      updateAccessibilityLabels();
    }

    function applyTheme(theme) {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem("theme", theme);

      if (theme === "dark") {
        themeIcon.classList.add("moon-icon");
        themeIcon.innerHTML = `
          <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
        `;
      } else {
        themeIcon.classList.remove("moon-icon");
        themeIcon.innerHTML = `
          <path d="M12 3v1" />
          <path d="M12 20v1" />
          <path d="M4.22 4.22l.7.7" />
          <path d="M19.08 19.08l.7.7" />
          <path d="M3 12h1" />
          <path d="M20 12h1" />
          <path d="M4.22 19.78l.7-.7" />
          <path d="M19.08 4.92l.7-.7" />
          <circle cx="12" cy="12" r="4" />
        `;
      }
    }

    function formatBytes(bytes) {
      if (bytes === 0) return "0 B";

      const units = ["B", "KB", "MB", "GB"];
      const index = Math.floor(Math.log(bytes) / Math.log(1024));
      const size = bytes / Math.pow(1024, index);

      return `${size.toFixed(1)} ${units[index]}`;
    }

    function isStartReadyStatus() {
      return Boolean(
        selectedFile &&
        selectedAudioLang &&
        !transcribeBtn.disabled &&
        !["statusProcessing", "statusChecking", "statusInvalid", "recordingStatus", "recordingPausedStatus", "micRequestStatus"].includes(currentStatusKey)
      );
    }

    function applyStatus(text, type = "") {
      const isDone = currentStatusKey === "statusDone" && type === "success";
      const isReady = !isDone && isStartReadyStatus();
      statusEl.textContent = isReady ? t("transcribeBtn") : text;
      statusEl.className = "status";

      transcribeBtn.classList.toggle("status-mode", !isReady);
      transcribeBtn.classList.toggle("action-ready", isReady);
      transcribeBtn.classList.toggle("action-success", isDone);
      transcribeBtn.classList.toggle("action-error", type === "error" && !isReady);
      transcribeBtn.classList.toggle("action-recording", type === "recording" && !isReady);
      transcribeBtn.classList.toggle("action-processing", currentStatusKey === "statusProcessing" && !isReady);
      transcribeBtn.classList.toggle("action-checking", currentStatusKey === "statusChecking" && !isReady);
      transcribeBtn.classList.toggle("action-waiting-lang", currentStatusKey === "selectAudioLangStatus" && !isReady);
    }

    function setStatus(text, type = "") {
      currentStatusKey = null;
      currentStatusText = text;
      currentStatusType = type;
      applyStatus(text, type);
    }

    function setStatusKey(key, type = "") {
      currentStatusKey = key;
      currentStatusText = "";
      currentStatusType = type;
      applyStatus(t(key), type);
    }

function applyOutput(text, placeholder = false) {
      outputText.classList.add("output-fade");

      window.setTimeout(() => {
        outputText.textContent = text;
        outputText.classList.toggle("placeholder", placeholder);
        outputText.classList.remove("output-fade");
      }, 90);

      const isEmpty = placeholder || !text.trim();
      copyResultBtn.disabled = isEmpty;
      downloadResultBtn.disabled = isEmpty;
      copyResultText.textContent = t("copyResult");
      downloadResultText.textContent = t("downloadResult");
      downloadResultBtn.setAttribute("aria-label", t("downloadResult"));
    }

    function setOutput(text, placeholder = false) {
      currentOutputKey = null;
      currentOutputText = text;
      currentOutputPlaceholder = placeholder;
      applyOutput(text, placeholder);
    }

    function getReadableRequestError(error) {
      const message = String(error?.message || "").trim();

      if (!message || message === "Failed to fetch" || error instanceof TypeError) {
        return t("failedText");
      }

      if (message === "STT request failed") {
        return t("failedText");
      }

      return message;
    }

    function setOutputKey(key, placeholder = false) {
      currentOutputKey = key;
      currentOutputText = "";
      currentOutputPlaceholder = placeholder;
      applyOutput(t(key), placeholder);
    }

    function getTimestampFileName() {
      const now = new Date();
      const dateParts = [
        now.getFullYear().toString(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
      ];
      const timeParts = [
        String(now.getHours()).padStart(2, "0"),
        String(now.getMinutes()).padStart(2, "0"),
        String(now.getSeconds()).padStart(2, "0")
      ];

      return `audio_${dateParts.join("-")}_${timeParts.join("-")}`;
    }

    function getUuidAudioFileName(extension = "webm") {
      const uuid = window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;

      return `audio_${uuid}.${extension}`;
    }

    function getDisplayAudioFileName(extension = "webm") {
      return `${getTimestampFileName()}.${extension}`;
    }

    function formatPlayerTime(seconds) {
      if (!Number.isFinite(seconds)) return "00:00";

      const safeSeconds = Math.max(0, Math.floor(seconds));
      const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
      const secs = String(safeSeconds % 60).padStart(2, "0");
      return `${minutes}:${secs}`;
    }

    function getDisplayDurationSeconds(seconds) {
      if (!Number.isFinite(seconds) || seconds <= 0) return null;
      return Math.max(1, Math.floor(seconds));
    }

    function formatFileDuration(seconds) {
      const displaySeconds = getDisplayDurationSeconds(seconds);
      return displaySeconds ? `${displaySeconds}s` : "";
    }

    function setPlayIcon(isPlaying) {
      playerPlayIcon.innerHTML = isPlaying
        ? `<path d="M8 5v14" /><path d="M16 5v14" />`
        : `<path d="M8 5v14l11-7-11-7Z" />`;
    }

    function getDisplayDuration() {
      if (Number.isFinite(previewKnownDuration) && previewKnownDuration > 0) return previewKnownDuration;

      const nativeDuration = audioPlayer.duration;
      if (Number.isFinite(nativeDuration) && nativeDuration > 0) return nativeDuration;
      return 0;
    }

    function updatePlayerUI() {
      const duration = getDisplayDuration();
      const current = audioPlayer.currentTime || 0;
      const progress = duration > 0 ? (current / duration) * 100 : 0;

      playerProgressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      playerTime.textContent = `${formatPlayerTime(current)} / ${formatPlayerTime(duration)}`;
    }

    function setAudioPreview(file, knownDuration = null) {
      if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
      }

      audioPlayer.pause();
      const displayDuration = getDisplayDurationSeconds(knownDuration);
      previewKnownDuration = displayDuration || null;
      previewObjectUrl = URL.createObjectURL(file);
      audioPlayer.src = previewObjectUrl;
      audioPlayer.load();
      downloadAudioBtn.disabled = false;
      downloadAudioBtn.setAttribute("download", file.name);
      setPlayIcon(false);
      playerProgressFill.style.width = "0%";
      playerTime.textContent = `00:00 / ${formatPlayerTime(getDisplayDuration())}`;
      setTimeout(updatePlayerUI, 0);
      setTimeout(updatePlayerUI, 300);
    }

    function clearAudioPreview() {
      audioPlayer.pause();
      audioPlayer.removeAttribute("src");
      audioPlayer.load();
      setPlayIcon(false);
      playerProgressFill.style.width = "0%";
      playerTime.textContent = "00:00 / 00:00";
      downloadAudioBtn.disabled = true;
      previewKnownDuration = null;

      if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
        previewObjectUrl = null;
      }
    }

    const allowedAudioExtensions = ["mp3", "wav", "m4a", "aac", "ogg", "flac", "webm"];
    const allowedAudioTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/mp4",
      "audio/aac",
      "audio/ogg",
      "application/ogg",
      "audio/flac",
      "audio/x-flac",
      "audio/webm"
    ];
    const maxAudioDurationSeconds = 30;
    const maxFallbackFileSizeBytes = 15 * 1024 * 1024;

    function resetSelectedFile() {
      selectedFile = null;
      selectedDisplayFileName = "";
      fileInput.value = "";
      if (audioCaptureInput) audioCaptureInput.value = "";
      fileInfo.classList.remove("active");
      audioLangSelector.classList.remove("active");
      actionsWrap.classList.remove("is-hidden");
      applyAudioLanguage(null);
      clearAudioPreview();
      transcribeBtn.disabled = true;
    }

    function isAllowedAudioFile(file) {
      const extension = file.name.split(".").pop().toLowerCase();
      return allowedAudioExtensions.includes(extension) || allowedAudioTypes.includes(file.type);
    }

    function getAudioDuration(file) {
      return new Promise((resolve) => {
        const audio = document.createElement("audio");
        const objectUrl = URL.createObjectURL(file);
        let resolved = false;

        function finish(duration) {
          if (resolved) return;
          resolved = true;
          URL.revokeObjectURL(objectUrl);
          audio.removeAttribute("src");
          resolve(duration);
        }

        audio.preload = "metadata";
        audio.onloadedmetadata = () => finish(audio.duration);
        audio.onerror = () => finish(null);
        audio.src = objectUrl;

        setTimeout(() => finish(null), 3000);
      });
    }

    async function handleFile(file) {
      if (!file) return;

      if (!isAllowedAudioFile(file)) {
        resetSelectedFile();
        setStatusKey("statusInvalid", "error");
        setOutputKey("onlyAudio", true);
        return;
      }

      setStatusKey("statusChecking");
      setOutputKey("checkingText", true);

      const duration = await getAudioDuration(file);

      if (Number.isFinite(duration) && duration > maxAudioDurationSeconds) {
        resetSelectedFile();
        setStatusKey("statusInvalid", "error");
        setOutputKey("audioTooLong", true);
        return;
      }

      if (!Number.isFinite(duration) && file.size > maxFallbackFileSizeBytes) {
        resetSelectedFile();
        setStatusKey("statusInvalid", "error");
        setOutputKey("audioTooLarge", true);
        return;
      }

      selectedFile = file;
      selectedDisplayFileName = file.name;
      fileName.textContent = selectedDisplayFileName;
      const durationLabel = formatFileDuration(duration);
      fileSize.textContent = `${formatBytes(file.size)}${durationLabel ? ` · ${durationLabel}` : ""}`;
      fileInfo.classList.add("active");
      audioLangSelector.classList.add("active");
      actionsWrap.classList.remove("is-hidden");
      applyAudioLanguage(null);
      setAudioPreview(file, Number.isFinite(duration) ? duration : null);
      transcribeBtn.disabled = true;

      setStatusKey("selectAudioLangStatus");
      setOutputKey("selectAudioLangOutput", true);
    }



    function showPanel(mode) {
      const isRecord = mode === "record";
      uploadPanel.classList.toggle("panel-hidden", isRecord);
      recordPanel.classList.toggle("panel-hidden", !isRecord);
      uploadModeBtn.classList.toggle("active", !isRecord);
      recordModeBtn.classList.toggle("active", isRecord);
    }

    function isRecordModeActive() {
      return !recordPanel.classList.contains("panel-hidden");
    }

    function setIdleStatusForCurrentMode() {
      setStatusKey(isRecordModeActive() ? "statusWaitingRecording" : "statusWaiting");
    }

    function getBestRecordingMimeType() {
      const candidates = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/mp4"
      ];

      if (!window.MediaRecorder) return "";
      return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
    }

    function getRecordingExtension(mimeType) {
      if (mimeType.includes("ogg")) return "ogg";
      if (mimeType.includes("mp4")) return "m4a";
      return "webm";
    }

    function formatRecordTime(seconds) {
      const safeSeconds = Math.max(0, Math.min(maxAudioDurationSeconds, Math.floor(seconds)));
      const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
      const secs = String(safeSeconds % 60).padStart(2, "0");
      return `${minutes}:${secs}`;
    }

    function formatRecordTimerLabel(seconds) {
      return `${formatRecordTime(seconds)} / ${formatRecordTime(maxAudioDurationSeconds)}`;
    }

    function setRecordTimer(seconds) {
      const current = recordTimer.querySelector(".timer-current");
      const total = recordTimer.querySelector(".timer-total");
      if (current && total) {
        current.textContent = formatRecordTime(seconds);
        total.textContent = `/ ${formatRecordTime(maxAudioDurationSeconds)}`;
      } else {
        recordTimer.textContent = formatRecordTimerLabel(seconds);
      }
    }

    function getCurrentRecordingSeconds() {
      if (!recordStartedAt) return recordedDurationSeconds;
      const now = mediaRecorder && mediaRecorder.state === "paused" && pausedAt ? pausedAt : Date.now();
      return Math.max(0, (now - recordStartedAt - totalPausedMs) / 1000);
    }

    function updateRecordTimer() {
      recordedDurationSeconds = getCurrentRecordingSeconds();
      setRecordTimer(recordedDurationSeconds);
    }


    function resetVoiceBars() {
      if (!voiceBars) return;
      voiceBars.querySelectorAll(".voice-bar").forEach((bar) => {
        bar.style.height = "5px";
        bar.style.opacity = "0.24";
      });
    }

    function stopVoiceMeter() {
      if (voiceAnimationId) {
        cancelAnimationFrame(voiceAnimationId);
        voiceAnimationId = null;
      }
      if (audioContext) {
        audioContext.close().catch(() => {});
        audioContext = null;
      }
      analyserNode = null;
      analyserData = null;
      resetVoiceBars();
    }

    function startVoiceMeter(stream) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx || !voiceBars) return;

        audioContext = new AudioCtx();
        analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 1024;
        analyserNode.smoothingTimeConstant = 0.45;
        analyserData = new Uint8Array(analyserNode.fftSize);

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyserNode);

        const bars = Array.from(voiceBars.querySelectorAll(".voice-bar"));
        const center = (bars.length - 1) / 2;
        let visualLevel = 0;

        const render = () => {
          if (!analyserNode || !analyserData) return;

          analyserNode.getByteTimeDomainData(analyserData);

          let sumSquares = 0;
          for (let i = 0; i < analyserData.length; i++) {
            const centered = (analyserData[i] - 128) / 128;
            sumSquares += centered * centered;
          }

          const rms = Math.sqrt(sumSquares / analyserData.length);
          const targetLevel = Math.min(1, Math.pow(rms * 5.6, 0.85));
          visualLevel += (targetLevel - visualLevel) * 0.45;

          bars.forEach((bar, index) => {
            const distance = Math.abs(index - center);
            const shape = Math.max(0.28, 1 - distance * 0.105);
            const height = 5 + visualLevel * 29 * shape;
            bar.style.height = `${Math.max(5, Math.min(34, height))}px`;
            bar.style.opacity = `${0.24 + visualLevel * 0.64}`;
          });

          voiceAnimationId = requestAnimationFrame(render);
        };

        render();
      } catch (error) {
        resetVoiceBars();
      }
    }

    function resetRecordingUI() {
      recordControls.classList.remove("active");
      recordZone.classList.remove("is-recording");
      pauseRecordBtn.textContent = t("pauseRecordBtn");
      setRecordTimer(0);
      stopVoiceMeter();
    }

    function stopRecording() {
      if (mediaRecorder && (mediaRecorder.state === "recording" || mediaRecorder.state === "paused")) {
        if (mediaRecorder.state === "paused" && pausedAt) {
          totalPausedMs += Date.now() - pausedAt;
          pausedAt = 0;
        }
        updateRecordTimer();
        mediaRecorder.stop();
      }
    }

    function toggleRecordingPause() {
      if (!mediaRecorder) return;

      if (mediaRecorder.state === "recording") {
        mediaRecorder.pause();
        pausedAt = Date.now();
        clearInterval(recordTimerInterval);
        clearTimeout(recordStopTimeout);
        recordTimerInterval = null;
        recordStopTimeout = null;
        pauseRecordBtn.textContent = t("resumeRecordBtn");
        setStatusKey("recordingPausedStatus");
        return;
      }

      if (mediaRecorder.state === "paused") {
        if (pausedAt) {
          totalPausedMs += Date.now() - pausedAt;
          pausedAt = 0;
        }
        mediaRecorder.resume();
        pauseRecordBtn.textContent = t("pauseRecordBtn");
        setStatusKey("recordingStatus", "recording");
        updateRecordTimer();
        recordTimerInterval = setInterval(updateRecordTimer, 250);
        const remainingMs = Math.max(0, (maxAudioDurationSeconds - recordedDurationSeconds) * 1000);
        recordStopTimeout = setTimeout(stopRecording, remainingMs);
      }
    }

    function canUseBrowserRecorder() {
      return Boolean(
        navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia &&
        window.MediaRecorder
      );
    }

    function openNativeAudioCapture() {
      if (!audioCaptureInput) {
        setStatusKey("statusWaitingRecording");
        setOutputKey("micSecureContextDenied", true);
        return;
      }

      setStatusKey("statusWaitingRecording");
      audioCaptureInput.click();
    }

    async function requestMicrophoneStream() {
      if (!canUseBrowserRecorder()) {
        setStatusKey("micRequestStatus");
        setOutputKey("micUnsupportedFallback", true);
        openNativeAudioCapture();
        return null;
      }

      setStatusKey("micRequestStatus");
      setOutputKey("micRequestText", true);

      try {
        if (navigator.permissions && navigator.permissions.query) {
          await navigator.permissions.query({ name: "microphone" }).catch(() => null);
        }

        return await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
      } catch (error) {
        const isBlockedByContext = !window.isSecureContext && location.protocol !== "http:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1";

        setStatusKey("statusWaitingRecording");

        if (isBlockedByContext) {
          setOutputKey("micSecureContextDenied", true);
        } else if (error && (error.name === "NotAllowedError" || error.name === "PermissionDeniedError")) {
          setOutputKey("micPermissionDenied", true);
        } else {
          setOutputKey("micPermissionDenied", true);
        }

        openNativeAudioCapture();
        return null;
      }
    }

    async function startRecording() {
      try {
        const stream = await requestMicrophoneStream();
        if (!stream) return;

        const mimeType = getBestRecordingMimeType();
        const options = mimeType ? { mimeType } : undefined;

        recordedChunks = [];
        recordedDurationSeconds = 0;
        pausedAt = 0;
        totalPausedMs = 0;
        mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.addEventListener("dataavailable", (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        });

        mediaRecorder.addEventListener("stop", () => {
          clearInterval(recordTimerInterval);
          clearTimeout(recordStopTimeout);
          recordTimerInterval = null;
          recordStopTimeout = null;

          stream.getTracks().forEach((track) => track.stop());

          recordedDurationSeconds = Math.max(recordedDurationSeconds, getCurrentRecordingSeconds());
          const finalMimeType = mediaRecorder.mimeType || mimeType || "audio/webm";
          const extension = getRecordingExtension(finalMimeType);
          const blob = new Blob(recordedChunks, { type: finalMimeType });
          const duration = Math.min(maxAudioDurationSeconds, getDisplayDurationSeconds(recordedDurationSeconds) || 1);
          const file = new File([blob], getUuidAudioFileName(extension), { type: finalMimeType });
          const displayFileName = getDisplayAudioFileName(extension);

          selectedFile = file;
          selectedDisplayFileName = displayFileName;
          fileName.textContent = selectedDisplayFileName;
          fileSize.textContent = `${formatBytes(file.size)} · ${duration}s`;
          fileInfo.classList.add("active");
          audioLangSelector.classList.add("active");
          actionsWrap.classList.remove("is-hidden");
          applyAudioLanguage(null);
          setAudioPreview(file, duration);
          transcribeBtn.disabled = true;

          resetRecordingUI();

          setStatusKey("selectAudioLangStatus");
          setOutputKey("selectAudioLangOutput", true);
          mediaRecorder = null;
        });

        recordStartedAt = Date.now();
        setRecordTimer(0);
        transcribeBtn.disabled = true;
        mediaRecorder.start();

        recordZone.classList.add("is-recording");
        recordControls.classList.add("active");
        startVoiceMeter(stream);
        pauseRecordBtn.textContent = t("pauseRecordBtn");
        setStatusKey("recordingStatus", "recording");
        setOutputKey("recordText", true);

        recordTimerInterval = setInterval(updateRecordTimer, 250);
        recordStopTimeout = setTimeout(stopRecording, maxAudioDurationSeconds * 1000);
      } catch (error) {
        resetRecordingUI();
        setStatusKey("statusWaitingRecording");
        setOutputKey("micPermissionDenied", true);
      }
    }

        fileInput.addEventListener("change", () => {
      handleFile(fileInput.files[0]);
    });

    if (audioCaptureInput) {
      audioCaptureInput.addEventListener("change", () => {
        handleFile(audioCaptureInput.files[0]);
      });
    }

    dropzone.addEventListener("dragover", (event) => {
      event.preventDefault();
      dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("dragover");
    });

    dropzone.addEventListener("drop", (event) => {
      event.preventDefault();
      dropzone.classList.remove("dragover");
      handleFile(event.dataTransfer.files[0]);
    });

    removeBtn.addEventListener("click", () => {
      resetSelectedFile();
      setIdleStatusForCurrentMode();
      setOutputKey("outputPlaceholder", true);
    });

    uploadModeBtn.addEventListener("click", () => {
      showPanel("upload");
      if (!selectedFile && (!mediaRecorder || mediaRecorder.state === "inactive")) {
        setStatusKey("statusWaiting");
      }
    });

    recordModeBtn.addEventListener("click", () => {
      showPanel("record");
      if (!mediaRecorder || mediaRecorder.state === "inactive") {
        setStatusKey("statusWaitingRecording");
      }
    });

    recordZone.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      if (mediaRecorder && (mediaRecorder.state === "recording" || mediaRecorder.state === "paused")) return;
      startRecording();
    });

    recordZone.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      if (mediaRecorder && (mediaRecorder.state === "recording" || mediaRecorder.state === "paused")) return;
      startRecording();
    });

    recordBtn.addEventListener("click", startRecording);
    pauseRecordBtn.addEventListener("click", toggleRecordingPause);
    stopRecordBtn.addEventListener("click", stopRecording);

    playerPlayBtn.addEventListener("click", () => {
      if (!audioPlayer.src) return;

      if (audioPlayer.paused) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
    });

    playerProgress.addEventListener("click", (event) => {
      const duration = getDisplayDuration();
      if (!Number.isFinite(duration) || duration <= 0) return;

      const rect = playerProgress.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      audioPlayer.currentTime = ratio * duration;
      updatePlayerUI();
    });

    audioPlayer.addEventListener("play", () => setPlayIcon(true));
    audioPlayer.addEventListener("pause", () => setPlayIcon(false));
    audioPlayer.addEventListener("ended", () => {
      setPlayIcon(false);
      audioPlayer.currentTime = 0;
      updatePlayerUI();
    });
    audioPlayer.addEventListener("timeupdate", updatePlayerUI);
    audioPlayer.addEventListener("loadedmetadata", updatePlayerUI);

    const FEEDBACK_DURATION_MS = 760;

    function runButtonFeedback(button, className) {
      if (!button) return;
      button.classList.remove(className, "instant-reset");
      void button.offsetWidth;
      button.classList.add(className);
      window.setTimeout(() => {
        if (className === "is-copied") {
          button.classList.add("instant-reset");
          button.classList.remove(className);
          requestAnimationFrame(() => {
            button.classList.remove("instant-reset");
          });
          return;
        }

        button.classList.remove(className);
      }, FEEDBACK_DURATION_MS);
    }

    function setCopySuccessFeedback() {
      copyResultText.textContent = t("copiedResult");
      runButtonFeedback(copyResultBtn, "is-copied");
      window.setTimeout(() => {
        copyResultText.textContent = t("copyResult");
      }, FEEDBACK_DURATION_MS);
    }

    copyResultBtn.addEventListener("click", async () => {
      const text = outputText.textContent.trim();
      if (!text || outputText.classList.contains("placeholder")) return;

      try {
        await navigator.clipboard.writeText(text);
        setCopySuccessFeedback();
      } catch (error) {
        const temp = document.createElement("textarea");
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
        setCopySuccessFeedback();
      }
    });



    function downloadSelectedAudio() {
      if (!selectedFile) return;
      runButtonFeedback(downloadAudioBtn, "is-downloading");

      const url = URL.createObjectURL(selectedFile);
      const link = document.createElement("a");
      link.href = url;
      link.download = selectedDisplayFileName && !selectedDisplayFileName.includes(".")
        ? `${selectedDisplayFileName}.${(selectedFile.name || "audio.webm").split(".").pop()}`
        : selectedDisplayFileName || selectedFile.name || `${getTimestampFileName()}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    downloadAudioBtn.addEventListener("click", downloadSelectedAudio);

    function downloadTextResult() {
      const text = outputText.textContent.trim();
      if (!text || outputText.classList.contains("placeholder")) return;
      runButtonFeedback(downloadResultBtn, "is-downloading");

      const now = new Date();
      const stamp = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
      ].join("-") + "_" + [
        String(now.getHours()).padStart(2, "0"),
        String(now.getMinutes()).padStart(2, "0"),
        String(now.getSeconds()).padStart(2, "0")
      ].join("-");

      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `stt_result_${stamp}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    downloadResultBtn.addEventListener("click", downloadTextResult);


    function extractNormalizedText(responseData) {
      if (!responseData || typeof responseData !== "object") return "";

      // Backend may return either:
      // 1) { data: { normalize: "...", original: "..." } }
      // 2) { normalize: "...", original: "..." }
      // 3) { text: "..." } / { result: "..." } for older endpoints
      const data = responseData.data && typeof responseData.data === "object"
        ? responseData.data
        : responseData;

      const candidates = [
        data.normalize,
        data.normalized,
        data.normalized_text,
        data.original,
        data.original_text,
        data.text,
        data.result,
        responseData.text,
        responseData.result,
      ];

      for (const candidate of candidates) {
        if (typeof candidate === "string" && candidate.trim()) {
          return candidate.trim();
        }
      }

      return "";
    }

transcribeBtn.addEventListener("click", async () => {
      if (!selectedFile) return;

      if (!selectedAudioLang) {
        transcribeBtn.disabled = true;
        setStatusKey("selectAudioLangStatus");
        setOutputKey("selectAudioLangOutput", true);
        return;
      }

      transcribeBtn.disabled = true;
      setStatusKey("statusProcessing");
      setOutputKey("processingText", true);

      const formData = new FormData();
      const safeDisplayFilename = selectedDisplayFileName || selectedFile.name || "audio.webm";

      formData.append("audio", selectedFile, selectedFile.name || "audio.webm");

      // Send both names so the frontend works with either backend version:
      // old backend: lang / display_filename
      // clean-architecture backend: audio_lang / display_name
      formData.append("lang", selectedAudioLang);
      formData.append("audio_lang", selectedAudioLang);
      formData.append("display_filename", safeDisplayFilename);
      formData.append("display_name", safeDisplayFilename);

      try {
        const response = await fetch("/api/stt", {
          method: "POST",
          body: formData
        });

        if (!response.ok) {
          let message = "STT request failed";
          try {
            const errorData = await response.json();
            message = errorData.detail || errorData.message || message;
          } catch (_) {}
          throw new Error(message);
        }

        const data = await response.json();
        const resultText = extractNormalizedText(data);

        lastSttResponse = {
          ...data,
          text: resultText,
          sourceFilename: selectedFile.name || null,
          displayFilename: selectedDisplayFileName || selectedFile.name || null,
          sourceSize: selectedFile.size || null,
          language: selectedAudioLang,
          interfaceLanguage: currentLang,
          createdAt: new Date().toISOString()
        };

        audioLangSelector.classList.remove("active");
        actionsWrap.classList.add("is-hidden");
        setStatusKey("statusDone", "success");
        if (resultText) {
          setOutput(resultText, false);
        } else {
          setOutputKey("noText", true);
        }
      } catch (error) {
        setStatusKey("statusError", "error");
        setOutput(getReadableRequestError(error), false);
      } finally {
        transcribeBtn.disabled = false;
      }
    });

    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.dataset.theme || "light";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
    });

    langToggle.addEventListener("click", () => {
      langMenu.classList.toggle("open");
    });

    langButtons.forEach((button) => {
      button.addEventListener("click", () => {
        applyLanguage(button.dataset.lang);
        langMenu.classList.remove("open");
      });
    });

    audioLangButtons.forEach((button) => {
      button.addEventListener("click", () => {
        applyAudioLanguage(button.dataset.audioLang);
      });
    });

    a11yToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = a11yPanel.classList.toggle("open");
      a11yToggle.setAttribute("aria-expanded", String(isOpen));
      langMenu.classList.remove("open");
    });


    fontDecreaseBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      applyA11yFont(currentFontPx - 1);
    });

    fontIncreaseBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      applyA11yFont(currentFontPx + 1);
    });

    contrastToggleBtn.addEventListener("click", () => {
      applyHighContrast(!highContrastEnabled);
    });

    document.addEventListener("click", (event) => {
      if (!langMenu.contains(event.target)) {
        langMenu.classList.remove("open");
      }
      if (!a11yWrap.contains(event.target)) {
        a11yPanel.classList.remove("open");
        a11yToggle.setAttribute("aria-expanded", "false");
      }
    });

    const savedTheme = localStorage.getItem("theme") || "light";
    applyA11yFont(currentFontPx);
    applyHighContrast(highContrastEnabled);
    applyTheme(savedTheme);
    applyAudioLanguage(null);
    applyLanguage(currentLang);
