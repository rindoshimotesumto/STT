const translations = {
      en: {
        title: "STT Admin",
        subtitle: "Draft dashboard for speech-to-text service monitoring",
        overviewTitle: "Today overview",
        overviewNote: "Core metrics for uploaded files, browser recordings and STT results.",
        serviceOnline: "Service online",
        totalRequests: "Requests",
        uploads: "Uploads",
        recordings: "Recordings",
        successRate: "Success rate",
        activityTitle: "Activity by hour",
        activityNote: "Demo data for the last 12 hours.",
        last12h: "Last 12h",
        statusTitle: "Processing status",
        statusNote: "Current pipeline health and queue state.",
        completed: "Completed",
        queue: "In queue",
        avgTime: "Avg. processing",
        failed: "Failed",
        formatsTitle: "Popular formats",
        formatsNote: "Accepted audio types used by clients.",
        languagesTitle: "Interface languages",
        languagesNote: "Client UI language distribution.",
        integrationNote: "Later this block can be connected to backend counters: uploads, recordings, duration limit errors, copy/download events and STT response times.",
        recentTitle: "Recent requests",
        recentNote: "Rough table structure for future API data.",
        demoData: "Demo data",
        colTime: "Time",
        colSource: "Source",
        colFile: "File",
        colDuration: "Duration",
        colLanguage: "Language",
        colStatus: "Status",
        sourceRecord: "Recording",
        sourceUpload: "Upload",
        ok: "Done",
        tooLong: "Too long",
        error: "Error"
      },
      ru: {
        title: "STT Admin",
        subtitle: "Черновой дашборд для мониторинга speech-to-text сервиса",
        overviewTitle: "Обзор за сегодня",
        overviewNote: "Основные метрики по загрузкам, записям в браузере и STT-результатам.",
        serviceOnline: "Сервис онлайн",
        totalRequests: "Запросы",
        uploads: "Загрузки",
        recordings: "Записи",
        successRate: "Успешность",
        activityTitle: "Активность по часам",
        activityNote: "Демо-данные за последние 12 часов.",
        last12h: "12 часов",
        statusTitle: "Статус обработки",
        statusNote: "Состояние пайплайна и очереди.",
        completed: "Готово",
        queue: "В очереди",
        avgTime: "Сред. обработка",
        failed: "Ошибки",
        formatsTitle: "Популярные форматы",
        formatsNote: "Аудиоформаты, которые чаще используют клиенты.",
        languagesTitle: "Языки интерфейса",
        languagesNote: "Распределение языка клиентского интерфейса.",
        integrationNote: "Позже этот блок можно подключить к backend-счетчикам: загрузки, записи, ошибки лимита длительности, copy/download события и время ответа STT.",
        recentTitle: "Последние запросы",
        recentNote: "Черновая структура таблицы для будущих API-данных.",
        demoData: "Демо-данные",
        colTime: "Время",
        colSource: "Источник",
        colFile: "Файл",
        colDuration: "Длина",
        colLanguage: "Язык",
        colStatus: "Статус",
        sourceRecord: "Запись",
        sourceUpload: "Загрузка",
        ok: "Готово",
        tooLong: "Длинный файл",
        error: "Ошибка"
      },
      uz: {
        title: "STT Admin",
        subtitle: "Speech-to-text servis monitoringi uchun dastlabki dashboard",
        overviewTitle: "Bugungi ko‘rsatkichlar",
        overviewNote: "Yuklangan fayllar, brauzer yozuvlari va STT natijalari bo‘yicha asosiy metrikalar.",
        serviceOnline: "Servis online",
        totalRequests: "So‘rovlar",
        uploads: "Yuklashlar",
        recordings: "Yozuvlar",
        successRate: "Muvaffaqiyat",
        activityTitle: "Soatlar bo‘yicha aktivlik",
        activityNote: "Oxirgi 12 soat uchun demo ma’lumotlar.",
        last12h: "12 soat",
        statusTitle: "Qayta ishlash holati",
        statusNote: "Pipeline va navbat holati.",
        completed: "Tayyor",
        queue: "Navbatda",
        avgTime: "O‘rtacha vaqt",
        failed: "Xatolar",
        formatsTitle: "Mashhur formatlar",
        formatsNote: "Mijozlar ko‘p ishlatadigan audio formatlar.",
        languagesTitle: "Interfeys tillari",
        languagesNote: "Mijoz interfeysi tillari taqsimoti.",
        integrationNote: "Keyin bu blokni backend hisoblagichlariga ulash mumkin: yuklashlar, yozuvlar, davomiylik limiti xatolari, copy/download hodisalari va STT javob vaqti.",
        recentTitle: "Oxirgi so‘rovlar",
        recentNote: "Kelajakdagi API ma’lumotlari uchun dastlabki jadval strukturasi.",
        demoData: "Demo ma’lumot",
        colTime: "Vaqt",
        colSource: "Manba",
        colFile: "Fayl",
        colDuration: "Davomiylik",
        colLanguage: "Til",
        colStatus: "Holat",
        sourceRecord: "Yozuv",
        sourceUpload: "Yuklash",
        ok: "Tayyor",
        tooLong: "Uzun fayl",
        error: "Xatolik"
      }
    };

    const langButtons = document.querySelectorAll(".lang-btn");
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    let currentLang = localStorage.getItem("adminLang") || "ru";

    function t(key) {
      return translations[currentLang][key] || translations.en[key] || key;
    }

    function applyLanguage(lang) {
      currentLang = lang;
      localStorage.setItem("adminLang", lang);
      document.documentElement.lang = lang;

      document.querySelectorAll("[data-i18n]").forEach((element) => {
        element.textContent = t(element.dataset.i18n);
      });

      langButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.lang === lang);
      });
    }

    function applyTheme(theme) {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem("adminTheme", theme);

      themeIcon.innerHTML = theme === "dark"
        ? `<path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79z" />`
        : `
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

    langButtons.forEach((button) => {
      button.addEventListener("click", () => applyLanguage(button.dataset.lang));
    });

    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.dataset.theme || "light";
      applyTheme(currentTheme === "dark" ? "light" : "dark");
    });

    applyTheme(localStorage.getItem("adminTheme") || "light");
    applyLanguage(currentLang);
