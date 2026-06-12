const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "tanammawang123";
const ADMIN_CREDENTIALS_KEY = "tanammawang_admin_credentials";
const ADMIN_LOGIN_KEY = "tanammawang_admin_login";
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB agar aman untuk localStorage

function setLoginMessage(message, success = false) {
  const messageEl = document.getElementById("loginMessage");
  if (!messageEl) return;
  messageEl.textContent = message;
  messageEl.style.color = success ? "#2f6b3b" : "#b42318";
}

function setCredentialMessage(message, success = false) {
  const messageEl = document.getElementById("credentialMessage");
  if (!messageEl) return;
  messageEl.textContent = message;
  messageEl.style.color = success ? "#2f6b3b" : "#b42318";
}

function setSocialLinksMessage(message, success = false) {
  const messageEl = document.getElementById("socialLinksMessage");
  if (!messageEl) return;
  messageEl.textContent = message;
  messageEl.style.color = success ? "#2f6b3b" : "#b42318";
}

function ensureAdminCredentials() {
  const existing = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
  if (existing) return;

  localStorage.setItem(
    ADMIN_CREDENTIALS_KEY,
    JSON.stringify({
      username: DEFAULT_ADMIN_USERNAME,
      password: DEFAULT_ADMIN_PASSWORD
    })
  );
}

function getAdminCredentials() {
  ensureAdminCredentials();
  try {
    const parsed = JSON.parse(localStorage.getItem(ADMIN_CREDENTIALS_KEY));
    return {
      username: parsed?.username || DEFAULT_ADMIN_USERNAME,
      password: parsed?.password || DEFAULT_ADMIN_PASSWORD
    };
  } catch (error) {
    return {
      username: DEFAULT_ADMIN_USERNAME,
      password: DEFAULT_ADMIN_PASSWORD
    };
  }
}

function saveAdminCredentials(username, password) {
  localStorage.setItem(
    ADMIN_CREDENTIALS_KEY,
    JSON.stringify({
      username,
      password
    })
  );
}

function isLoggedIn() {
  return localStorage.getItem(ADMIN_LOGIN_KEY) === "true";
}

function setLoginState(state) {
  localStorage.setItem(ADMIN_LOGIN_KEY, state ? "true" : "false");
}

function forceLogoutOnPageLoad() {
  // paksa tampil form login setiap kali halaman admin dibuka
  setLoginState(false);
}

function toggleAdminView() {
  const loginSection = document.getElementById("loginSection");
  const adminPanel = document.getElementById("adminPanel");

  if (isLoggedIn()) {
    loginSection.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    renderGalleryTable();
  } else {
    loginSection.classList.remove("hidden");
    adminPanel.classList.add("hidden");
  }
}

function renderGalleryTable() {
  const body = document.getElementById("galleryTableBody");
  if (!body) return;

  const data = getGalleryData();
  body.innerHTML = "";

  if (data.length === 0) {
    body.innerHTML = `<tr><td colspan="4">Belum ada data galeri.</td></tr>`;
    return;
  }

  data.forEach((item) => {
    const tr = document.createElement("tr");
    const mediaType = item.mediaType || "image";
    const mediaPreview = mediaType === "video"
      ? `<video src="${item.imageUrl}" controls muted></video>`
      : `<img src="${item.imageUrl}" alt="${item.title}" />`;

    tr.innerHTML = `
      <td>${mediaPreview}</td>
      <td>${item.title}</td>
      <td>${item.description}</td>
      <td>
        <button class="btn-secondary" onclick="handleEdit('${item.id}')">Edit</button>
        <button class="btn-danger" onclick="handleDelete('${item.id}')">Hapus</button>
      </td>
    `;
    body.appendChild(tr);
  });
}

function resetForm() {
  document.getElementById("galleryId").value = "";
  document.getElementById("title").value = "";
  document.getElementById("imageUrl").value = "";
  document.getElementById("description").value = "";
  document.getElementById("galleryFileInput").value = "";
  document.getElementById("galleryImagePreview").classList.add("hidden");
  document.getElementById("galleryVideoPreview").classList.add("hidden");
  document.getElementById("cancelEditBtn").classList.add("hidden");
}

function handleEdit(id) {
  const data = getGalleryData();
  const item = data.find((g) => g.id === id);
  if (!item) return;

  document.getElementById("galleryId").value = item.id;
  document.getElementById("title").value = item.title;
  document.getElementById("imageUrl").value = item.imageUrl;
  document.getElementById("description").value = item.description;
  document.getElementById("cancelEditBtn").classList.remove("hidden");
}

function handleDelete(id) {
  const data = getGalleryData();
  const newData = data.filter((g) => g.id !== id);
  saveGalleryData(newData);
  renderGalleryTable();
}

function initPasswordToggles() {
  const toggleLoginPassword = document.getElementById("toggleLoginPassword");
  const loginPasswordInput = document.getElementById("password");
  const toggleNewPassword = document.getElementById("toggleNewPassword");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  if (toggleLoginPassword && loginPasswordInput) {
    toggleLoginPassword.addEventListener("change", () => {
      loginPasswordInput.type = toggleLoginPassword.checked ? "text" : "password";
    });
  }

  if (toggleNewPassword && newPasswordInput && confirmPasswordInput) {
    toggleNewPassword.addEventListener("change", () => {
      const type = toggleNewPassword.checked ? "text" : "password";
      newPasswordInput.type = type;
      confirmPasswordInput.type = type;
    });
  }
}

function initCredentialForm() {
  const form = document.getElementById("credentialForm");
  if (!form) return;

  const credential = getAdminCredentials();
  const newUsernameInput = document.getElementById("newUsername");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  if (newUsernameInput) newUsernameInput.value = credential.username;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newUsername = newUsernameInput.value.trim();
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (!newUsername || !newPassword || !confirmPassword) {
      setCredentialMessage("Semua field wajib diisi.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setCredentialMessage("Konfirmasi password tidak cocok.");
      return;
    }

    saveAdminCredentials(newUsername, newPassword);
    setCredentialMessage("Username dan password berhasil diubah.", true);
    newPasswordInput.value = "";
    confirmPasswordInput.value = "";
  });
}

function initLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const credential = getAdminCredentials();

    if (username === credential.username && password === credential.password) {
      setLoginState(true);
      setLoginMessage("Login berhasil.", true);
      toggleAdminView();
      return;
    }

    setLoginMessage("Username atau password salah.");
  });
}

function fillLeaderProfileForm() {
  const profile = getVillageHeadProfile();

  const leaderSectionTitleInput = document.getElementById("leaderSectionTitleInput");
  const leaderMainTitleInput = document.getElementById("leaderMainTitleInput");
  const leaderNameInput = document.getElementById("leaderNameInput");
  const leaderPositionInput = document.getElementById("leaderPositionInput");
  const leaderWelcomeInput = document.getElementById("leaderWelcomeInput");
  const leaderPhotoPreview = document.getElementById("leaderPhotoPreview");
  const leaderPhotoFileInput = document.getElementById("leaderPhotoFileInput");

  if (leaderSectionTitleInput) leaderSectionTitleInput.value = profile.sectionTitle || "";
  if (leaderMainTitleInput) leaderMainTitleInput.value = profile.title || "";
  if (leaderNameInput) leaderNameInput.value = profile.name || "";
  if (leaderPositionInput) leaderPositionInput.value = profile.position || "";
  if (leaderWelcomeInput) leaderWelcomeInput.value = profile.welcomeText || "";

  if (leaderPhotoFileInput) leaderPhotoFileInput.value = "";

  if (leaderPhotoPreview) {
    if (profile.photoUrl) {
      leaderPhotoPreview.src = profile.photoUrl;
      leaderPhotoPreview.classList.remove("hidden");
    } else {
      leaderPhotoPreview.src = "";
      leaderPhotoPreview.classList.add("hidden");
    }
  }

  const stats = profile.stats || [];
  const safeStats = [
    stats[0] || { value: "", label: "", subLabel: "" },
    stats[1] || { value: "", label: "", subLabel: "" },
    stats[2] || { value: "", label: "", subLabel: "" },
    stats[3] || { value: "", label: "", subLabel: "" }
  ];

  document.getElementById("stat1Value").value = safeStats[0].value || "";
  document.getElementById("stat1Label").value = safeStats[0].label || "";
  document.getElementById("stat1SubLabel").value = safeStats[0].subLabel || "";

  document.getElementById("stat2Value").value = safeStats[1].value || "";
  document.getElementById("stat2Label").value = safeStats[1].label || "";
  document.getElementById("stat2SubLabel").value = safeStats[1].subLabel || "";

  document.getElementById("stat3Value").value = safeStats[2].value || "";
  document.getElementById("stat3Label").value = safeStats[2].label || "";
  document.getElementById("stat3SubLabel").value = safeStats[2].subLabel || "";

  document.getElementById("stat4Value").value = safeStats[3].value || "";
  document.getElementById("stat4Label").value = safeStats[3].label || "";
  document.getElementById("stat4SubLabel").value = safeStats[3].subLabel || "";
}

function initLeaderProfileForm() {
  const form = document.getElementById("leaderProfileForm");
  const leaderPhotoFileInput = document.getElementById("leaderPhotoFileInput");
  const leaderPhotoPreview = document.getElementById("leaderPhotoPreview");
  if (!form) return;

  fillLeaderProfileForm();

  if (leaderPhotoFileInput && leaderPhotoPreview) {
    leaderPhotoFileInput.addEventListener("change", async (e) => {
      const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;

      if (!file) {
        // tidak ada file dipilih: kembalikan preview sesuai photoUrl yang tersimpan
        const profile = getVillageHeadProfile?.() || {};
        const currentUrl = (profile.photoUrl || "").trim();
        if (currentUrl) {
          leaderPhotoPreview.src = currentUrl;
          leaderPhotoPreview.classList.remove("hidden");
        } else {
          leaderPhotoPreview.src = "";
          leaderPhotoPreview.classList.add("hidden");
        }
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        alert("Ukuran file foto kepala desa terlalu besar. Maksimal 3MB.");
        leaderPhotoFileInput.value = "";
        return;
      }

      try {
        const previewDataUrl = await readFileAsDataUrl(file);
        leaderPhotoPreview.src = previewDataUrl;
        leaderPhotoPreview.classList.remove("hidden");
      } catch (error) {
        alert("Gagal membaca file foto kepala desa.");
      }
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // photoUrl hanya bisa berubah jika ada upload file
    const selectedLeaderPhoto = leaderPhotoFileInput && leaderPhotoFileInput.files
      ? leaderPhotoFileInput.files[0]
      : null;

    const existingProfile = getVillageHeadProfile?.() || {};
    let finalPhotoUrl = (existingProfile?.photoUrl || "").trim();

    if (selectedLeaderPhoto) {
      if (selectedLeaderPhoto.size > MAX_FILE_SIZE) {
        alert("Ukuran file foto kepala desa terlalu besar. Maksimal 3MB.");
        return;
      }

      try {
        finalPhotoUrl = await readFileAsDataUrl(selectedLeaderPhoto);
      } catch (error) {
        alert("Upload foto kepala desa gagal diproses.");
        return;
      }
    }

    const existingStats = (existingProfile && Array.isArray(existingProfile.stats))
      ? existingProfile.stats
      : [];

    const leaderSectionTitleInput = document.getElementById("leaderSectionTitleInput");
    const leaderMainTitleInput = document.getElementById("leaderMainTitleInput");
    const leaderNameInput = document.getElementById("leaderNameInput");
    const leaderPositionInput = document.getElementById("leaderPositionInput");
    const leaderWelcomeInput = document.getElementById("leaderWelcomeInput");

    const updatedProfile = {
      sectionTitle: (leaderSectionTitleInput ? leaderSectionTitleInput.value.trim() : (existingProfile.sectionTitle || "")),
      title: (leaderMainTitleInput ? leaderMainTitleInput.value.trim() : (existingProfile.title || "")),
      name: (leaderNameInput ? leaderNameInput.value.trim() : (existingProfile.name || "")),
      position: (leaderPositionInput ? leaderPositionInput.value.trim() : (existingProfile.position || "")),
      photoUrl: finalPhotoUrl,
      welcomeText: (leaderWelcomeInput ? leaderWelcomeInput.value.trim() : (existingProfile.welcomeText || "")),
      stats: existingStats
    };

    saveVillageHeadProfile(updatedProfile);
    try {
      const raw = localStorage.getItem("tanammawang_village_head_profile");
      console.log("[DEBUG admin] saved leader profile raw:", raw);
      const parsed = raw ? JSON.parse(raw) : null;
      console.log("[DEBUG admin] saved photoUrl:", parsed?.photoUrl || "");
    } catch (e) {
      console.warn("[DEBUG admin] failed to read localStorage leader profile:", e);
    }
    fillLeaderProfileForm();

    // paksa refresh preview agar terlihat perubahan langsung di halaman admin
    if (leaderPhotoPreview) {
      leaderPhotoPreview.src = updatedProfile.photoUrl || "";
      if (updatedProfile.photoUrl) leaderPhotoPreview.classList.remove("hidden");
      else leaderPhotoPreview.classList.add("hidden");
    }

    alert("Profil kepala desa berhasil disimpan.");
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Gagal membaca file upload."));
    reader.readAsDataURL(file);
  });
}

function detectMediaTypeFromFile(file) {
  if (!file || !file.type) return "image";
  return file.type.startsWith("video/") ? "video" : "image";
}

function detectMediaTypeFromUrl(url) {
  const lower = (url || "").toLowerCase();
  const videoExt = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];
  return videoExt.some((ext) => lower.includes(ext)) ? "video" : "image";
}

function fillSocialLinksForm() {
  const links = getSocialLinks();
  const youtubeInput = document.getElementById("youtubeLinkInput");
  const instagramInput = document.getElementById("instagramLinkInput");
  const facebookInput = document.getElementById("facebookLinkInput");

  if (youtubeInput) youtubeInput.value = links.youtube || "";
  if (instagramInput) instagramInput.value = links.instagram || "";
  if (facebookInput) facebookInput.value = links.facebook || "";
}

function initSocialLinksForm() {
  const form = document.getElementById("socialLinksForm");
  if (!form) return;

  fillSocialLinksForm();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const prev = getSocialLinks?.() || {};

    const youtube = document.getElementById("youtubeLinkInput").value.trim();
    const instagram = document.getElementById("instagramLinkInput").value.trim();
    const facebook = document.getElementById("facebookLinkInput").value.trim();

    // agar bisa simpan satu-satu: field yang kosong tidak menghapus data lama
    const next = {
      youtube: youtube || prev.youtube || "",
      instagram: instagram || prev.instagram || "",
      facebook: facebook || prev.facebook || ""
    };

    saveSocialLinks(next);
    setSocialLinksMessage("Media sosial berhasil disimpan.", true);
  });
}

function initGalleryForm() {
  const form = document.getElementById("galleryForm");
  const cancelBtn = document.getElementById("cancelEditBtn");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("galleryId").value.trim();
    const title = document.getElementById("title").value.trim();
    const imageUrlInput = document.getElementById("imageUrl").value.trim();
    const description = document.getElementById("description").value.trim();
    const galleryFileInput = document.getElementById("galleryFileInput");
    const selectedFile = galleryFileInput && galleryFileInput.files ? galleryFileInput.files[0] : null;

    const data = getGalleryData();

    let finalImageUrl = imageUrlInput;
    let finalMediaType = detectMediaTypeFromUrl(imageUrlInput);

    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        alert("Ukuran file terlalu besar. Maksimal 3MB.");
        return;
      }

      try {
        finalImageUrl = await readFileAsDataUrl(selectedFile);
        finalMediaType = detectMediaTypeFromFile(selectedFile);
      } catch (error) {
        alert("File upload gagal dibaca. Silakan coba file lain.");
        return;
      }
    }

    if (id) {
      const index = data.findIndex((item) => item.id === id);
      if (index !== -1) {
        const existing = data[index];
        data[index] = {
          ...existing,
          title,
          imageUrl: finalImageUrl || existing.imageUrl,
          mediaType: finalImageUrl ? finalMediaType : (existing.mediaType || "image"),
          description
        };
      }
    } else {
      if (!finalImageUrl) {
        alert("Masukkan URL gambar/video atau upload file terlebih dahulu.");
        return;
      }

      data.unshift({
        id: `g${Date.now()}`,
        title,
        imageUrl: finalImageUrl,
        mediaType: finalMediaType,
        description
      });
    }

    saveGalleryData(data);
    renderGalleryTable();
    resetForm();
  });

  if (cancelBtn) {
    cancelBtn.addEventListener("click", resetForm);
  }
}

function initLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {
    setLoginState(false);
    toggleAdminView();
  });
}

function initClearButtons() {
  const clearHeroBtn = document.getElementById("clearHeroBtn");
  const heroPreview = document.getElementById("heroBackgroundPreview");
  const heroFileInput = document.getElementById("heroBackgroundFileInput");
  const heroMsg = document.getElementById("heroSettingsMessage");

  const clearLogoBtn = document.getElementById("clearLogoBtn");
  const logoPreview = document.getElementById("logoPreview");
  const logoMsg = document.getElementById("logoSettingsMessage");
  const logoFileInput = document.getElementById("logoFileInput");

  const clearLeaderPhotoBtn = document.getElementById("clearLeaderPhotoBtn");
  const leaderPhotoPreview = document.getElementById("leaderPhotoPreview");
  const leaderPhotoUrlInput = document.getElementById("leaderPhotoInput");
  const leaderPhotoFileInput = document.getElementById("leaderPhotoFileInput");

  const setMsg = (el, text, success = true) => {
    if (!el) return;
    el.textContent = text;
    el.style.color = success ? "#2f6b3b" : "#b42318";
  };

  // localStorage keys (duplikat dari assets/js/data.js)
  const HERO_SETTINGS_STORAGE_KEY = "tanammawang_hero_settings";
  const LOGO_SETTINGS_STORAGE_KEY = "tanammawang_logo_settings";
  const VILLAGE_HEAD_PROFILE_KEY = "tanammawang_village_head_profile";

  if (clearHeroBtn) {
    clearHeroBtn.addEventListener("click", () => {
      localStorage.removeItem(HERO_SETTINGS_STORAGE_KEY);

      if (heroFileInput) heroFileInput.value = "";
      if (heroPreview) {
        heroPreview.src = "";
        heroPreview.classList.add("hidden");
      }
      setMsg(heroMsg, "Background hero dihapus. Refresh website utama untuk melihat perubahan.", true);
    });
  }

  if (clearLogoBtn) {
    clearLogoBtn.addEventListener("click", () => {
      localStorage.removeItem(LOGO_SETTINGS_STORAGE_KEY);

      if (logoFileInput) logoFileInput.value = "";
      if (logoPreview) {
        logoPreview.src = "";
        logoPreview.classList.add("hidden");
      }
      setMsg(logoMsg, "Logo header dihapus. Refresh website utama untuk melihat perubahan.", true);
    });
  }

  if (clearLeaderPhotoBtn) {
    clearLeaderPhotoBtn.addEventListener("click", () => {
      const profileRaw = localStorage.getItem(VILLAGE_HEAD_PROFILE_KEY);
      let profile = null;

      if (profileRaw) {
        try {
          profile = JSON.parse(profileRaw);
        } catch {
          profile = null;
        }
      }

      // hapus foto saja (biar text lain tetap ada)
      if (profile) {
        profile.photoUrl = "";
        localStorage.setItem(VILLAGE_HEAD_PROFILE_KEY, JSON.stringify(profile));
      } else {
        // kalau belum ada custom profile, hapus storage biar kembali default (default juga punya photo, tapi foto custom tidak ada)
        // agar "hapus total foto" benar-benar membuat foto kosong, kita set photoUrl="".
        localStorage.setItem(
          VILLAGE_HEAD_PROFILE_KEY,
          JSON.stringify({ ...(getVillageHeadProfile?.() || {}), photoUrl: "" })
        );
      }

      if (leaderPhotoFileInput) leaderPhotoFileInput.value = "";

      if (leaderPhotoPreview) {
        leaderPhotoPreview.src = "";
        leaderPhotoPreview.classList.add("hidden");
      }

      setMsg(null, "Foto kepala desa dihapus. Refresh website utama untuk melihat perubahan.", true);
    });
  }
}

function fillLogoSettingsForm() {
  const form = document.getElementById("logoSettingsForm");
  if (!form) return;

  const fileInput = document.getElementById("logoFileInput");
  const preview = document.getElementById("logoPreview");

  const settings = getLogoSettings();
  const currentLogoUrl = (settings?.logoUrl || "").trim();

  if (fileInput) fileInput.value = "";

  if (preview) {
    if (currentLogoUrl) {
      preview.src = currentLogoUrl;
      preview.classList.remove("hidden");
    } else {
      preview.src = "";
      preview.classList.add("hidden");
    }
  }
}

function initLogoSettingsForm() {
  const form = document.getElementById("logoSettingsForm");
  if (!form) return;

  const fileInput = document.getElementById("logoFileInput");
  const preview = document.getElementById("logoPreview");
  const messageEl = document.getElementById("logoSettingsMessage");

  const setMessage = (msg, success = false) => {
    if (!messageEl) return;
    messageEl.textContent = msg;
    messageEl.style.color = success ? "#2f6b3b" : "#b42318";
  };

  fillLogoSettingsForm();

  if (fileInput && preview) {
    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
      if (!file) {
        fillLogoSettingsForm();
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        alert("Ukuran file terlalu besar. Maksimal 3MB.");
        fileInput.value = "";
        return;
      }

      try {
        const previewDataUrl = await readFileAsDataUrl(file);
        preview.src = previewDataUrl;
        preview.classList.remove("hidden");
      } catch (error) {
        alert("Gagal membaca file logo.");
      }
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedFile = fileInput && fileInput.files ? fileInput.files[0] : null;
    if (!selectedFile) {
      setMessage("Pilih file logo terlebih dahulu.", false);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setMessage("Ukuran file terlalu besar. Maksimal 3MB.", false);
      return;
    }

    try {
      const logoDataUrl = await readFileAsDataUrl(selectedFile);
      saveLogoSettings({ logoUrl: logoDataUrl });
      setMessage("Logo header berhasil disimpan. Refresh website utama untuk melihat hasilnya.", true);
      if (preview) {
        preview.src = logoDataUrl;
        preview.classList.remove("hidden");
      }
      if (fileInput) fileInput.value = "";
    } catch (error) {
      setMessage("Upload logo gagal diproses.", false);
    }
  });
}

function fillHeroSettingsForm() {
  const form = document.getElementById("heroSettingsForm");
  if (!form) return;

  const preview = document.getElementById("heroBackgroundPreview");
  const fileInput = document.getElementById("heroBackgroundFileInput");

  const settings = getHeroSettings();
  const currentUrl = (settings.heroImageUrl || "").trim();

  if (fileInput) fileInput.value = "";

  if (preview) {
    if (currentUrl) {
      preview.src = currentUrl;
      preview.classList.remove("hidden");
    } else {
      preview.src = "";
      preview.classList.add("hidden");
    }
  }
}

function initHeroSettingsForm() {
  const form = document.getElementById("heroSettingsForm");
  if (!form) return;

  const fileInput = document.getElementById("heroBackgroundFileInput");
  const preview = document.getElementById("heroBackgroundPreview");
  const messageEl = document.getElementById("heroSettingsMessage");

  const setMessage = (msg, success = false) => {
    if (!messageEl) return;
    messageEl.textContent = msg;
    messageEl.style.color = success ? "#2f6b3b" : "#b42318";
  };

  fillHeroSettingsForm();

  if (fileInput && preview) {
    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;

      if (!file) {
        fillHeroSettingsForm();
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        alert("Ukuran file terlalu besar. Maksimal 3MB.");
        fileInput.value = "";
        return;
      }

      try {
        const previewDataUrl = await readFileAsDataUrl(file);
        preview.src = previewDataUrl;
        preview.classList.remove("hidden");
      } catch (error) {
        alert("Gagal membaca file background hero.");
      }
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!fileInput || !preview) return;

    const selectedFile = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
    if (!selectedFile) {
      setMessage("Pilih file gambar background hero terlebih dahulu.", false);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setMessage("Ukuran file terlalu besar. Maksimal 3MB.", false);
      return;
    }

    let finalUrl;
    try {
      finalUrl = await readFileAsDataUrl(selectedFile);
    } catch (error) {
      setMessage("Upload gagal diproses.", false);
      return;
    }

    saveHeroSettings({ heroImageUrl: finalUrl });

    const latestHero = getHeroSettings?.();
    const latestHeroUrl = (latestHero?.heroImageUrl || "").trim();

    setMessage("Background hero berhasil disimpan. Mengalihkan ke website utama...", true);

    preview.src = latestHeroUrl || finalUrl;
    preview.classList.remove("hidden");

    // pastikan data benar tersimpan sebelum redirect + cache buster agar beranda benar-benar reload
    try {
      const rawAfter = localStorage.getItem("tanammawang_hero_settings");
      console.log("[DEBUG admin] hero_settings after save raw:", rawAfter);
    } catch (e) {
      console.warn("[DEBUG admin] failed to read hero settings after save:", e);
    }

    // paksa reload beranda agar background hero langsung mengikuti data terbaru di localStorage
    window.location.href = `index.html?reload=${Date.now()}`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    // jangan paksa logout setiap kali admin dibuka,
    // supaya setelah login 1x, saat kembali ke beranda/admin tetap login.
    ensureAdminCredentials();
    initLoginForm();
    initPasswordToggles();
    initCredentialForm();
    initHeroSettingsForm();
    initLogoSettingsForm();
    initLeaderProfileForm();
    // initStatsSaveBtn bisa error bila fungsi/DOM belum cocok—guard biar hero/gambar lain tidak ikut gagal
    try {
      initStatsSaveBtn();
    } catch (e) {
      console.error("initStatsSaveBtn error:", e);
    }
    initSocialLinksForm();
    initGalleryForm();
    initLogout();
    toggleAdminView();
  } catch (error) {
    console.error("Gagal inisialisasi halaman admin:", error);

    const loginSection = document.getElementById("loginSection");
    const adminPanel = document.getElementById("adminPanel");

    if (loginSection) loginSection.classList.remove("hidden");
    if (adminPanel) adminPanel.classList.add("hidden");

    setLoginMessage("Terjadi kesalahan saat memuat halaman admin. Silakan refresh halaman.");
  }
});
