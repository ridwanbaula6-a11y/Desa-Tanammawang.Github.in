function renderHeroSettings() {
  const heroSection = document.getElementById("beranda");
  if (!heroSection) return;

  const heroSettings = getHeroSettings();
  const heroImageUrl = (heroSettings.heroImageUrl || "").trim();

  const heroVideo = heroSection.querySelector(".hero-video");

  if (heroImageUrl) {
    heroSection.style.background = `
      linear-gradient(to right, rgba(8, 14, 28, 0.72), rgba(8, 14, 28, 0.36)),
      url('${heroImageUrl}')
    `;
    heroSection.style.backgroundRepeat = "no-repeat";
    heroSection.style.backgroundPosition = "center top";
    heroSection.style.backgroundSize = "contain";

    // agar background hero yang dipilih admin terlihat (video default kalau tetap aktif bisa menutupi background)
    if (heroVideo) {
      heroVideo.style.display = "none";
    }
  } else {
    // reset ke style default dari CSS jika belum ada setting
    heroSection.style.background = "";
    heroSection.style.backgroundRepeat = "";
    heroSection.style.backgroundPosition = "";
    heroSection.style.backgroundSize = "";

    if (heroVideo) {
      heroVideo.style.display = "";
    }
  }
}

function renderVillageHeadProfile() {
  const profile = getVillageHeadProfile();

  try {
    const raw = localStorage.getItem("tanammawang_village_head_profile");
    console.log("[DEBUG app] loaded leader profile raw:", raw);
    console.log("[DEBUG app] loaded photoUrl:", profile?.photoUrl || "");
  } catch (e) {
    console.warn("[DEBUG app] failed to read localStorage leader profile:", e);
  }

  const leaderPhoto = document.getElementById("leaderPhoto");
  const leaderSectionTitle = document.getElementById("leaderSectionTitle");
  const leaderMainTitle = document.getElementById("leaderMainTitle");
  const leaderWelcomeText = document.getElementById("leaderWelcomeText");
  const leaderName = document.getElementById("leaderName");
  const leaderPosition = document.getElementById("leaderPosition");
  const leaderStatsGrid = document.getElementById("leaderStatsGrid");

  if (!leaderPhoto || !leaderSectionTitle || !leaderMainTitle || !leaderWelcomeText || !leaderName || !leaderPosition || !leaderStatsGrid) {
    return;
  }

  leaderPhoto.src = profile.photoUrl || "";
  leaderSectionTitle.textContent = profile.sectionTitle || "Sambutan";
  leaderMainTitle.textContent = profile.title || "Kepala Desa Tanammawang";
  leaderWelcomeText.textContent = profile.welcomeText || "";
  const nameValue = (profile.name || "").trim();
  const positionValue = profile.position || "";

  leaderName.textContent = nameValue;
  leaderPosition.textContent = positionValue;

  if (!nameValue || /ridwan/i.test(nameValue)) {
    leaderName.style.display = "none";
  } else {
    leaderName.style.display = "";
  }

  leaderStatsGrid.innerHTML = "";
  (profile.stats || []).forEach((stat) => {
    const card = document.createElement("article");
    card.className = "leader-stat-card";
    card.innerHTML = `
      <div class="leader-stat-icon">${stat.icon || "•"}</div>
      <strong>${stat.value || "-"}</strong>
      <h4>${stat.label || "-"}</h4>
      <span>${stat.subLabel || ""}</span>
    `;
    leaderStatsGrid.appendChild(card);
  });
}

function renderGallery() {
  const galleryGrid = document.getElementById("galleryGrid");
  if (!galleryGrid) return;

  const galleryItems = getGalleryData();
  galleryGrid.innerHTML = "";

  galleryItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "gallery-item";

    const mediaType = item.mediaType || "image";
    const mediaHtml = mediaType === "video"
      ? `<video src="${item.imageUrl}" controls preload="metadata"></video>`
      : `<img src="${item.imageUrl}" alt="${item.title}" loading="lazy" />`;

    card.innerHTML = `
      ${mediaHtml}
      <div class="gallery-content">
        <h4>${item.title}</h4>
        <p>${item.description}</p>
      </div>
    `;
    galleryGrid.appendChild(card);
  });
}

function renderSocialLinks() {
  const socialGrid = document.getElementById("socialLinksGrid");
  if (!socialGrid) return;

  const socialLinks = getSocialLinks();
  const items = [
    {
      key: "youtube",
      label: "YouTube",
      icon: "▶️",
      url: socialLinks.youtube
    },
    {
      key: "instagram",
      label: "Instagram",
      icon: "📸",
      url: socialLinks.instagram
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: "📘",
      url: socialLinks.facebook
    }
  ];

  socialGrid.innerHTML = "";

  items.forEach((item) => {
    const isConnected = !!(item.url || "").trim();
    const card = document.createElement("a");

    card.className = `social-link-card ${isConnected ? "is-connected" : "is-disconnected"}`;
    card.href = isConnected ? item.url : "javascript:void(0)";
    card.target = isConnected ? "_blank" : "";
    card.rel = isConnected ? "noopener noreferrer" : "";
    card.setAttribute("aria-label", `${item.label} Desa Tanammawang`);

    if (!isConnected) {
      card.setAttribute("aria-disabled", "true");
      card.addEventListener("click", (e) => e.preventDefault());
    }

    card.innerHTML = `
      <span class="social-icon">${item.icon}</span>
      <div class="social-meta">
        <strong>${item.label}</strong>
        <small>${isConnected ? "Tersambung" : "Belum tersambung"}</small>
      </div>
    `;

    socialGrid.appendChild(card);
  });
}

function initRevealAnimation() {
  const elements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("active");
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
}

function initYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function renderLogoSettings() {
  const siteLogo = document.getElementById("siteLogo");
  const siteLogoFallback = document.getElementById("siteLogoFallback");
  if (!siteLogo || !siteLogoFallback) return;

  const logoSettings = getLogoSettings?.();
  const logoUrl = (logoSettings?.logoUrl || "").trim();

  if (logoUrl) {
    siteLogo.src = logoUrl;
    siteLogo.style.display = "";
    siteLogoFallback.style.display = "none";
  } else {
    siteLogo.src = "";
    siteLogo.style.display = "none";
    siteLogoFallback.style.display = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeroSettings();
  renderLogoSettings();
  renderVillageHeadProfile();
  renderGallery();
  renderSocialLinks();
  initRevealAnimation();
  initYear();
});
