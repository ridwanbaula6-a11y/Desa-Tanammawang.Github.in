const DEFAULT_VILLAGE_HEAD_PROFILE = {
  sectionTitle: "Sambutan",
  title: "Kepala Desa Tanammawang",
  welcomeText:
    "Selamat datang di Portal Informasi Desa Tanammawang. Website ini hadir sebagai media informasi resmi untuk memperkenalkan potensi desa, budaya, UMKM, dan perkembangan desa kepada masyarakat luas.",
  name: "Andi Aso Manutungi Ambarala",
  position: "Kepala Desa Tanammawang",
  photoUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=700&q=80",
  stats: [
    { icon: "👥", value: "4.892", label: "Jumlah Penduduk", subLabel: "Jiwa" },
    { icon: "🏠", value: "1.420", label: "Jumlah KK", subLabel: "Kepala Keluarga" },
    { icon: "🗺️", value: "19.8", label: "Luas Wilayah", subLabel: "Km²" },
    { icon: "📍", value: "12", label: "Destinasi Wisata", subLabel: "Lokasi" }
  ]
};

const VILLAGE_HEAD_PROFILE_KEY = "tanammawang_village_head_profile";

function getVillageHeadProfile() {
  const fromStorage = localStorage.getItem(VILLAGE_HEAD_PROFILE_KEY);
  if (fromStorage) {
    try {
      return JSON.parse(fromStorage);
    } catch (error) {
      console.error("Gagal parsing data profil kepala desa:", error);
    }
  }
  return DEFAULT_VILLAGE_HEAD_PROFILE;
}

function saveVillageHeadProfile(data) {
  localStorage.setItem(VILLAGE_HEAD_PROFILE_KEY, JSON.stringify(data));
}

const DEFAULT_GALLERY = [
  {
    id: "g1",
    title: "Kegiatan Gotong Royong Warga",
    imageUrl: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1200&q=80",
    description: "Warga Desa Tanammawang bersama-sama membersihkan lingkungan dusun."
  },
  {
    id: "g2",
    title: "Pertemuan Masyarakat Desa",
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    description: "Diskusi terbuka tentang program prioritas pembangunan desa."
  },
  {
    id: "g3",
    title: "Peningkatan Jalan Lingkungan",
    imageUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80",
    description: "Dokumentasi proses perbaikan infrastruktur jalan lingkungan desa."
  }
];

const GALLERY_STORAGE_KEY = "tanammawang_gallery_data";
const VILLAGE_FINANCE_STORAGE_KEY = "tanammawang_village_finance";
const HERO_SETTINGS_STORAGE_KEY = "tanammawang_hero_settings";
const SOCIAL_LINKS_STORAGE_KEY = "tanammawang_social_links";

function getGalleryData() {
  const fromStorage = localStorage.getItem(GALLERY_STORAGE_KEY);
  if (fromStorage) {
    try {
      return JSON.parse(fromStorage);
    } catch (error) {
      console.error("Gagal parsing data galeri:", error);
    }
  }
  return DEFAULT_GALLERY;
}

function saveGalleryData(data) {
  localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(data));
}

const DEFAULT_VILLAGE_FINANCE = {
  year: "2026",
  totalIncome: 3250000000,
  totalSpent: 2480000000,
  remaining: 770000000,
  progressItems: [
    { label: "Infrastruktur Wisata", percent: 76 },
    { label: "Pemberdayaan UMKM", percent: 70 }
  ],
  note: "Realisasi pembangunan infrastruktur dan kawasan wisata desa tahun 2026."
};

function getVillageFinanceData() {
  const fromStorage = localStorage.getItem(VILLAGE_FINANCE_STORAGE_KEY);
  if (fromStorage) {
    try {
      return JSON.parse(fromStorage);
    } catch (error) {
      console.error("Gagal parsing data transparansi dana desa:", error);
    }
  }
  return DEFAULT_VILLAGE_FINANCE;
}

function saveVillageFinanceData(data) {
  localStorage.setItem(VILLAGE_FINANCE_STORAGE_KEY, JSON.stringify(data));
}

const DEFAULT_HERO_SETTINGS = {
  heroImageUrl: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1600&q=80"
};

function getHeroSettings() {
  const fromStorage = localStorage.getItem(HERO_SETTINGS_STORAGE_KEY);
  if (fromStorage) {
    try {
      return JSON.parse(fromStorage);
    } catch (error) {
      console.error("Gagal parsing data hero settings:", error);
    }
  }
  return DEFAULT_HERO_SETTINGS;
}

function saveHeroSettings(data) {
  localStorage.setItem(HERO_SETTINGS_STORAGE_KEY, JSON.stringify(data));
}

const DEFAULT_SOCIAL_LINKS = {
  youtube: "",
  instagram: "",
  facebook: ""
};

const DEFAULT_LOGO_SETTINGS = {
  // ditampilkan di header (lingkaran)
  logoUrl: ""
};

const LOGO_SETTINGS_STORAGE_KEY = "tanammawang_logo_settings";

function getSocialLinks() {
  const fromStorage = localStorage.getItem(SOCIAL_LINKS_STORAGE_KEY);
  if (fromStorage) {
    try {
      const parsed = JSON.parse(fromStorage);
      return {
        youtube: parsed?.youtube || "",
        instagram: parsed?.instagram || "",
        facebook: parsed?.facebook || ""
      };
    } catch (error) {
      console.error("Gagal parsing data social links:", error);
    }
  }
  return DEFAULT_SOCIAL_LINKS;
}

function saveSocialLinks(data) {
  localStorage.setItem(SOCIAL_LINKS_STORAGE_KEY, JSON.stringify({
    youtube: (data?.youtube || "").trim(),
    instagram: (data?.instagram || "").trim(),
    facebook: (data?.facebook || "").trim()
  }));
}

function getLogoSettings() {
  const fromStorage = localStorage.getItem(LOGO_SETTINGS_STORAGE_KEY);
  if (fromStorage) {
    try {
      const parsed = JSON.parse(fromStorage);
      return {
        logoUrl: parsed?.logoUrl || ""
      };
    } catch (error) {
      console.error("Gagal parsing data logo:", error);
    }
  }
  return DEFAULT_LOGO_SETTINGS;
}

function saveLogoSettings(data) {
  localStorage.setItem(
    LOGO_SETTINGS_STORAGE_KEY,
    JSON.stringify({
      logoUrl: (data?.logoUrl || "").trim()
    })
  );
}
