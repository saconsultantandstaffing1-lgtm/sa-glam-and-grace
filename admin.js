
function parseOrderItemsList(items) {
  if (!items) return ['Chudi', 'Saree'];
  if (Array.isArray(items)) {
    return items.map((it, idx) => {
      let name = typeof it === 'string' ? it : (it.name || it.title || 'Haute Couture Item');
      name = name.replace(/^(\d+[\.\,\-\)]\s*)+/i, '').trim();
      if (name.toLowerCase() === 'chudi') name = 'Chudi';
      if (name.toLowerCase() === 'saree') name = 'Saree';
      return name;
    }).filter(Boolean);
  }
  if (typeof items === 'string') {
    let rawParts = [];
    if (items.includes('\n')) {
      rawParts = items.split('\n');
    } else if (items.includes('+')) {
      rawParts = items.split('+');
    } else if (/\d+[\.\,]\s*/.test(items)) {
      rawParts = items.split(/(?:^|\s+)\d+[\.\,]\s*/).filter(Boolean);
    } else if (items.includes(',')) {
      rawParts = items.split(',');
    } else {
      rawParts = [items];
    }

    const cleaned = rawParts
      .map(p => p.replace(/^(\d+[\.\,\-\)]\s*)+/i, '').trim())
      .filter(p => p.length > 0)
      .map(name => {
        if (name.toLowerCase() === 'chudi') return 'Chudi';
        if (name.toLowerCase() === 'saree') return 'Saree';
        return name.charAt(0).toUpperCase() + name.slice(1);
      });

    if (cleaned.length === 0) return ['Chudi', 'Saree'];
    return cleaned;
  }
  return ['Chudi', 'Saree'];
}

function formatOrderItemsHTML(items, options = {}) {
  const list = parseOrderItemsList(items);
  const isInvoice = options.isInvoice || false;
  
  return list.map((item, idx) => {
    const num = (idx + 1) + '.';
    return `
      <div style="display: flex; align-items: baseline; gap: 6px; ${idx > 0 ? 'margin-top: 4px;' : ''}">
        <span style="font-weight: 700; color: ${isInvoice ? '#B48616' : 'var(--gold-accent)'}; font-size: 0.85rem; min-width: 18px; text-align: left;">${num}</span>
        <span style="font-weight: 600; color: ${isInvoice ? '#1C1917' : 'var(--text-main)'}; font-size: 0.86rem; line-height: 1.35;">${item}</span>
      </div>
    `;
  }).join('');
}


window.deleteProduct = function(id) {
  if (window.app && typeof window.app.deleteProduct === 'function') {
    window.app.deleteProduct(id);
  } else {
    console.warn('Admin app not ready for deleteProduct');
  }
};

window.openEditProduct = function(id) {
  if (window.app && typeof window.app.openEditProduct === 'function') {
    window.app.openEditProduct(id);
  } else {
    console.warn('Admin app not ready for openEditProduct');
  }
};

window.deleteCoupon = function(code) {
  if (window.app && typeof window.app.deleteCoupon === 'function') {
    window.app.deleteCoupon(code);
  } else {
    console.warn('Admin app not ready for deleteCoupon');
  }
};

window.openCouponModal = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const modal = document.getElementById('couponModal');
  if (modal) {
    modal.classList.add('show');
    modal.style.setProperty('display', 'flex', 'important');
    modal.style.setProperty('opacity', '1', 'important');
    modal.style.setProperty('visibility', 'visible', 'important');
    modal.style.setProperty('z-index', '99999', 'important');
  }
};

window.closeCouponModal = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const modal = document.getElementById('couponModal');
  if (modal) {
    modal.classList.remove('show');
    modal.style.setProperty('display', 'none', 'important');
  }
};

window.updateCouponFormLabels = function() {
  const type = document.getElementById('couponType');
  const label = document.getElementById('couponValueLabel');
  const input = document.getElementById('couponValue');
  if (type && label && input) {
    if (type.value === 'fixed') {
      label.textContent = 'Discount Cash (₹)';
      input.placeholder = '1000';
    } else {
      label.textContent = 'Discount Value (%)';
      input.placeholder = '20';
    }
  }
};
// Global Add Product Modal Triggers
window.openAddProductModal = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (window.app && typeof window.app.openAddProductModal === 'function') {
    window.app.openAddProductModal();
  } else {
    const modal = document.getElementById('productModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.setProperty('display', 'flex', 'important');
      modal.style.setProperty('opacity', '1', 'important');
      modal.style.setProperty('visibility', 'visible', 'important');
      modal.style.setProperty('z-index', '99999', 'important');
    }
  }
};

window.closeProductModal = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const modal = document.getElementById('productModal');
  if (modal) {
    modal.classList.remove('show');
    modal.style.setProperty('display', 'none', 'important');
  }
};

// ═════════════════════════════════════════════════════════════════════
// ADMIN PRODUCT COLOR & MULTI-IMAGE GALLERY MANAGEMENT
// ═════════════════════════════════════════════════════════════════════
const STANDARD_ETHNIC_COLORS = [
  { name: 'Maroon', hex: '#800020' },
  { name: 'Emerald Green', hex: '#097969' },
  { name: 'Royal Blue', hex: '#2B4C7E' },
  { name: 'Rani Pink', hex: '#E0218A' },
  { name: 'Mustard Yellow', hex: '#E5A93C' },
  { name: 'Rust Brown', hex: '#8B4513' },
  { name: 'Midnight Black', hex: '#1A1A1A' },
  { name: 'Ivory White', hex: '#FDFBF7' },
  { name: 'Wine Plum', hex: '#58111A' },
  { name: 'Coral Peach', hex: '#F88379' },
  { name: 'Olive Green', hex: '#556B2F' },
  { name: 'Metallic Gold', hex: '#D4AF37' },
  { name: 'Teal Blue', hex: '#008080' },
  { name: 'Lavender', hex: '#BDB0D0' }
];
window.STANDARD_ETHNIC_COLORS = STANDARD_ETHNIC_COLORS;

window.adminSelectedColors = [];
window.adminGalleryImages = [];

window.renderAdminColorsUI = function() {
  const stdContainer = document.getElementById('adminStandardColorsList');
  const selContainer = document.getElementById('adminSelectedColorsContainer');
  const countEl = document.getElementById('adminSelectedColorsCount');

  if (countEl) countEl.textContent = window.adminSelectedColors.length;

  if (stdContainer) {
    stdContainer.innerHTML = STANDARD_ETHNIC_COLORS.map(c => {
      const isSelected = window.adminSelectedColors.some(sc => sc.name.toLowerCase() === c.name.toLowerCase());
      return `
        <button type="button" class="admin-color-chip ${isSelected ? 'active' : ''}" 
          onclick="window.toggleAdminColor('${c.name}', '${c.hex}')"
          style="display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:20px; border:1.5px solid ${isSelected ? 'var(--gold-accent)' : 'var(--border-subtle)'}; background:${isSelected ? 'rgba(212,175,55,0.18)' : 'var(--bg-card)'}; font-size:0.75rem; font-weight:600; color:var(--text-main); cursor:pointer; transition:all 0.15s ease;">
          <span style="width:12px; height:12px; border-radius:50%; background:${c.hex}; display:inline-block; border:1px solid rgba(0,0,0,0.25);"></span>
          <span>${c.name}</span>
          ${isSelected ? '<i class="ri-check-line" style="color:var(--gold-accent); font-weight:bold;"></i>' : ''}
        </button>
      `;
    }).join('');
  }

  if (selContainer) {
    if (window.adminSelectedColors.length === 0) {
      selContainer.innerHTML = '<span id="adminNoColorsNotice" style="font-size:0.78rem; color:var(--text-muted); font-style:italic;">No colors selected yet. Click quick colors above or add custom below.</span>';
    } else {
      selContainer.innerHTML = window.adminSelectedColors.map((c, idx) => `
        <span style="display:inline-flex; align-items:center; gap:6px; padding:3px 10px; border-radius:16px; background:var(--bg-card); border:1.5px solid var(--gold-accent); font-size:0.75rem; font-weight:700; color:var(--text-main); box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <span style="width:11px; height:11px; border-radius:50%; background:${c.hex}; display:inline-block; border:1px solid rgba(0,0,0,0.25);"></span>
          ${c.name}
          <button type="button" onclick="window.removeAdminColor(${idx})" style="background:none; border:none; color:#ef4444; font-size:0.95rem; cursor:pointer; padding:0 2px; line-height:1;" title="Remove color">&times;</button>
        </span>
      `).join('');
    }
  }
};

window.toggleAdminColor = function(name, hex) {
  if (!window.adminSelectedColors) window.adminSelectedColors = [];
  const existingIdx = window.adminSelectedColors.findIndex(c => c.name.toLowerCase() === name.toLowerCase());
  if (existingIdx > -1) {
    window.adminSelectedColors.splice(existingIdx, 1);
  } else {
    window.adminSelectedColors.push({ name, hex });
  }
  window.renderAdminColorsUI();
};

window.addAdminCustomColor = function() {
  const nameInput = document.getElementById('adminCustomColorName');
  const hexInput = document.getElementById('adminCustomColorHex');
  const hex = hexInput ? hexInput.value : '#B45309';
  let name = nameInput ? nameInput.value.trim() : '';

  if (!name) {
    const matched = STANDARD_ETHNIC_COLORS.find(c => c.hex.toLowerCase() === hex.toLowerCase());
    name = matched ? matched.name : ('Custom (' + hex.toUpperCase() + ')');
  }

  if (!window.adminSelectedColors) window.adminSelectedColors = [];
  if (!window.adminSelectedColors.some(c => c.name.toLowerCase() === name.toLowerCase())) {
    window.adminSelectedColors.push({ name, hex });
  }
  if (nameInput) nameInput.value = '';
  window.renderAdminColorsUI();
};

window.selectStandardEthnicPalette = function() {
  if (!window.adminSelectedColors) window.adminSelectedColors = [];
  STANDARD_ETHNIC_COLORS.forEach(c => {
    if (!window.adminSelectedColors.some(sc => sc.name.toLowerCase() === c.name.toLowerCase())) {
      window.adminSelectedColors.push({ name: c.name, hex: c.hex });
    }
  });
  window.renderAdminColorsUI();
};

window.removeAdminColor = function(idx) {
  if (window.adminSelectedColors) {
    window.adminSelectedColors.splice(idx, 1);
    window.renderAdminColorsUI();
  }
};

window.clearAllAdminColors = function() {
  window.adminSelectedColors = [];
  window.renderAdminColorsUI();
};

window.renderAdminGalleryUI = function() {
  const container = document.getElementById('adminGalleryThumbnails');
  if (!container) return;
  if (!window.adminGalleryImages || window.adminGalleryImages.length === 0) {
    container.innerHTML = '<span id="adminNoGalleryNotice" style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">No additional gallery images added yet.</span>';
    return;
  }
  container.innerHTML = window.adminGalleryImages.map((img, idx) => `
    <div style="position:relative; width:52px; height:64px; border-radius:4px; overflow:hidden; border:1px solid var(--border-subtle); background:#000;">
      <img src="${img}" alt="View ${idx+1}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='assets/images/about_anarkali.png'" />
      <button type="button" onclick="window.removeAdminGalleryImage(${idx})" style="position:absolute; top:2px; right:2px; width:18px; height:18px; border-radius:50%; background:rgba(0,0,0,0.75); color:#fff; border:none; font-size:12px; display:flex; align-items:center; justify-content:center; cursor:pointer; line-height:1;" title="Remove view">&times;</button>
    </div>
  `).join('');
};

window.addAdminGalleryImage = function(urlOverride) {
  const input = document.getElementById('adminGalleryInput');
  const url = (urlOverride || (input ? input.value : '')).trim();
  if (!url) return;
  if (!window.adminGalleryImages) window.adminGalleryImages = [];
  if (!window.adminGalleryImages.includes(url)) {
    window.adminGalleryImages.push(url);
    if (input) input.value = '';
    window.renderAdminGalleryUI();
  }
};

window.removeAdminGalleryImage = function(idx) {
  if (window.adminGalleryImages) {
    window.adminGalleryImages.splice(idx, 1);
    window.renderAdminGalleryUI();
  }
};

window.initAdminGalleryFileUpload = function() {
  const fileInput = document.getElementById('adminGalleryFileInput');
  const spinner = document.getElementById('galleryUploadSpinner');
  if (!fileInput || fileInput.dataset.bound === 'true') return;
  fileInput.dataset.bound = 'true';

  fileInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (spinner) spinner.style.display = 'inline-block';

    for (const file of files) {
      // 1. Instant base64 Data URL for offline & immediate display
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.readAsDataURL(file);
      });

      let finalUrl = dataUrl;

      // 2. Upload to Supabase Storage if available
      if (window.GlamStorage) {
        try {
          const publicUrl = await window.GlamStorage.uploadProductImage(file);
          if (publicUrl) finalUrl = publicUrl;
        } catch(err) {
          console.warn('Gallery upload to Supabase note:', err);
        }
      }

      if (!window.adminGalleryImages) window.adminGalleryImages = [];
      if (!window.adminGalleryImages.includes(finalUrl)) {
        window.adminGalleryImages.push(finalUrl);
      }
    }

    if (spinner) spinner.style.display = 'none';
    fileInput.value = '';
    window.renderAdminGalleryUI();
  });
};
﻿// Global Admin Auth Modal Triggers
window.openAdminAuth = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const modal = document.getElementById('adminAuthModal');
  if (modal) {
    modal.classList.add('show');
    modal.style.setProperty('display', 'flex', 'important');
    modal.style.setProperty('opacity', '1', 'important');
    modal.style.setProperty('visibility', 'visible', 'important');
    modal.style.setProperty('z-index', '999999', 'important');
  }
};

window.closeAdminAuth = function() {
  const modal = document.getElementById('adminAuthModal');
  if (modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';
  }
};
/* ════════════════════════════════════════════════════════════════════
   NAIRA FASHION – LUXURY ADMIN DASHBOARD ENGINE
   Full Interactive State, Live Charts, Product/Order/Customer CRUD
   ════════════════════════════════════════════════════════════════════ */

// Initial Seed Data for Luxury Fashion Store
// Standard Ethnic Color Palette already initialized globally on window.STANDARD_ETHNIC_COLORS

// Initial Seed Data for Luxury Fashion Store (with colors and multiple images)
const INITIAL_PRODUCTS = [
  {
    id: "NF-101",
    name: "Handcrafted Chikankari Anarkali Set",
    category: "Anarkali",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Ivory White", hex: "#FDFBF7" },
      { name: "Rani Pink", hex: "#E0218A" },
      { name: "Emerald Green", hex: "#097969" },
      { name: "Mustard Yellow", hex: "#E5A93C" }
    ],
    price: 8499,
    originalPrice: 10999,
    stock: 24,
    status: "in-stock",
    image: "assets/images/about_anarkali.png",
    images: ["assets/images/about_anarkali.png", "assets/images/hero_1.png", "assets/images/festive.png"],
    rating: 4.9,
    sales: 142
  },
  {
    id: "NF-102",
    name: "Royal Crimson Zari Bridal Lehenga",
    category: "Lehenga",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Maroon", hex: "#800020" },
      { name: "Wine Plum", hex: "#58111A" },
      { name: "Emerald Green", hex: "#097969" }
    ],
    price: 24999,
    originalPrice: 32000,
    stock: 8,
    status: "low-stock",
    image: "assets/images/about_lehenga.png",
    images: ["assets/images/about_lehenga.png", "assets/images/featured_banner_wedding_1785416855384.png", "assets/images/wedding.png"],
    rating: 5.0,
    sales: 89
  },
  {
    id: "NF-103",
    name: "Pure Banarasi Katan Silk Saree",
    category: "Saree",
    sizes: ["Free Size"],
    colors: [
      { name: "Royal Blue", hex: "#2B4C7E" },
      { name: "Rani Pink", hex: "#E0218A" },
      { name: "Rust Brown", hex: "#8B4513" }
    ],
    price: 14500,
    originalPrice: 18500,
    stock: 18,
    status: "in-stock",
    image: "assets/images/about_saree.png",
    images: ["assets/images/about_saree.png", "assets/images/saree.png", "assets/images/saree_tn.png"],
    rating: 4.8,
    sales: 210
  },
  {
    id: "NF-104",
    name: "Embroidered Georgette Peplum Top & Sharara",
    category: "Tops",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Pista Green", hex: "#93C572" },
      { name: "Coral Peach", hex: "#F88379" },
      { name: "Midnight Black", hex: "#1A1A1A" }
    ],
    price: 5299,
    originalPrice: 6999,
    stock: 35,
    status: "in-stock",
    image: "assets/images/about_tops.png",
    images: ["assets/images/about_tops.png", "assets/images/hero_2.png"],
    rating: 4.7,
    sales: 165
  },
  {
    id: "NF-105",
    name: "Velvet Royal Churidar & Zardozi Kurti",
    category: "Churidar",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Royal Blue", hex: "#2B4C7E" },
      { name: "Maroon", hex: "#800020" },
      { name: "Teal Blue", hex: "#008080" }
    ],
    price: 7800,
    originalPrice: 9500,
    stock: 0,
    status: "out-of-stock",
    image: "assets/images/chudidar.png",
    images: ["assets/images/chudidar.png", "assets/images/hero_1.png"],
    rating: 4.9,
    sales: 115
  },
  {
    id: "NF-106",
    name: "Heritage Organza Hand-Painted Dupatta",
    category: "Dupatta",
    sizes: ["Free Size"],
    colors: [
      { name: "Ivory White", hex: "#FDFBF7" },
      { name: "Coral Peach", hex: "#F88379" },
      { name: "Mustard Yellow", hex: "#E5A93C" }
    ],
    price: 3499,
    originalPrice: 4200,
    stock: 42,
    status: "in-stock",
    image: "assets/images/dupatta.png",
    images: ["assets/images/dupatta.png", "assets/images/festive.png"],
    rating: 4.9,
    sales: 310
  },
  {
    id: "NF-107",
    name: "Kundan & Polki Bridal Jewellery Choker Set",
    category: "Jewellery",
    sizes: ["Free Size"],
    colors: [
      { name: "Metallic Gold", hex: "#D4AF37" },
      { name: "Wine Plum", hex: "#58111A" },
      { name: "Emerald Green", hex: "#097969" }
    ],
    price: 12999,
    originalPrice: 16000,
    stock: 12,
    status: "in-stock",
    image: "assets/images/jewellery.png",
    images: ["assets/images/jewellery.png"],
    rating: 5.0,
    sales: 78
  },
  {
    id: "NF-108",
    name: "Artisan Hand-Embroidered Potli Handbag",
    category: "Accessories",
    sizes: ["Free Size"],
    colors: [
      { name: "Metallic Gold", hex: "#D4AF37" },
      { name: "Maroon", hex: "#800020" },
      { name: "Midnight Black", hex: "#1A1A1A" }
    ],
    price: 2899,
    originalPrice: 3500,
    stock: 28,
    status: "in-stock",
    image: "assets/images/handbag_modern.png",
    images: ["assets/images/handbag_modern.png", "assets/images/handbag.png"],
    rating: 4.8,
    sales: 195
  }
];

const INITIAL_ORDERS = [
  {
    id: "#ORD-9482",
    customer: "Pooja Hegde",
    email: "pooja.h@gmail.com",
    avatar: "P",
    items: "1. Chudi\n2. Saree",
    total: 28498,
    status: "delivered",
    date: "2026-09-01",
    paymentMethod: "Prepaid (UPI)",
    city: "Mumbai, MH"
  },
  {
    id: "#ORD-9481",
    customer: "Ananya Sharma",
    email: "ananya.sharma@luxury.in",
    avatar: "A",
    items: "1. Pure Silk Saree\n2. Designer Chudi",
    total: 14500,
    status: "shipped",
    date: "2026-09-01",
    paymentMethod: "Credit Card (Visa)",
    city: "Delhi, NCR"
  },
  {
    id: "#ORD-9480",
    customer: "Meera Deshmukh",
    email: "meera.desh@outlook.com",
    avatar: "M",
    items: "1. Handcrafted Chudi Anarkali\n2. Royal Saree",
    total: 8499,
    status: "processing",
    date: "2026-08-31",
    paymentMethod: "Prepaid (NetBanking)",
    city: "Bengaluru, KA"
  },
  {
    id: "#ORD-9479",
    customer: "Rhea Singhania",
    email: "rhea.singh@gmail.com",
    avatar: "R",
    items: "1. Bridal Chudi Set\n2. Banarasi Saree",
    total: 12999,
    status: "delivered",
    date: "2026-08-31",
    paymentMethod: "Credit Card (Amex)",
    city: "Jaipur, RJ"
  },
  {
    id: "#ORD-9478",
    customer: "Sunita Roy",
    email: "sunita.roy@yahoo.co.in",
    avatar: "S",
    items: "1. Embroidered Chudi Kurti\n2. Silk Saree",
    total: 5299,
    status: "cancelled",
    date: "2026-08-30",
    paymentMethod: "Cash on Delivery",
    city: "Kolkata, WB"
  }
];

const INITIAL_CUSTOMERS = [
  {
    id: "CUST-001",
    name: "Pooja Hegde",
    email: "pooja.h@gmail.com",
    phone: "+91 98201 45892",
    tier: "Royal VIP",
    ordersCount: 8,
    totalSpent: 145800,
    city: "Mumbai, MH",
    joinDate: "Jan 2025"
  },
  {
    id: "CUST-002",
    name: "Ananya Sharma",
    email: "ananya.sharma@luxury.in",
    phone: "+91 98112 34567",
    tier: "Gold Elite",
    ordersCount: 5,
    totalSpent: 62400,
    city: "Delhi, NCR",
    joinDate: "Mar 2025"
  },
  {
    id: "CUST-003",
    name: "Meera Deshmukh",
    email: "meera.desh@outlook.com",
    phone: "+91 97410 88990",
    tier: "Gold Elite",
    ordersCount: 4,
    totalSpent: 38200,
    city: "Bengaluru, KA",
    joinDate: "Jun 2025"
  },
  {
    id: "CUST-004",
    name: "Rhea Singhania",
    email: "rhea.singh@gmail.com",
    phone: "+91 94140 22334",
    tier: "Royal VIP",
    ordersCount: 11,
    totalSpent: 218500,
    city: "Jaipur, RJ",
    joinDate: "Nov 2024"
  },
  {
    id: "CUST-005",
    name: "Sunita Roy",
    email: "sunita.roy@yahoo.co.in",
    phone: "+91 98300 77112",
    tier: "Silver Club",
    ordersCount: 2,
    totalSpent: 12500,
    city: "Kolkata, WB",
    joinDate: "Aug 2025"
  }
];

const INITIAL_COUPONS = [
  {
    code: "WELCOME10",
    discount: "10% OFF",
    type: "percentage",
    value: 10,
    minOrder: 2999,
    uses: 1420,
    status: "Active",
    expiry: "2026-12-31"
  },
  {
    code: "ROYALFESTIVE",
    discount: "₹2,500 OFF",
    type: "fixed",
    value: 2500,
    minOrder: 15000,
    uses: 388,
    status: "Active",
    expiry: "2026-10-30"
  },
  {
    code: "BRIDALVIP",
    discount: "20% OFF",
    type: "percentage",
    value: 20,
    minOrder: 25000,
    uses: 195,
    status: "Active",
    expiry: "2026-11-15"
  }
];

// App State Management with LocalStorage
class AdminApp {
  constructor() {
    let rawProds = null;
    try { rawProds = JSON.parse(localStorage.getItem('nf_products')); } catch(e) {}
    let delIds = [];
    try { delIds = JSON.parse(localStorage.getItem('nf_deleted_products')) || []; } catch(e) {}
    if (rawProds && Array.isArray(rawProds)) {
      this.products = rawProds.filter(p => !delIds.includes(String(p.id)));
    } else {
      this.products = INITIAL_PRODUCTS.filter(p => !delIds.includes(String(p.id)));
    }
    this.orders = JSON.parse(localStorage.getItem('nf_orders')) || INITIAL_ORDERS;
    // Ensure orders reflect numbered items: 1. Chudi, 2. Saree
    if (this.orders && this.orders.length > 0) {
      if (!this.orders[0].items || !this.orders[0].items.includes('Chudi')) {
        this.orders[0].items = "1. Chudi\n2. Saree";
        if (this.orders[1]) this.orders[1].items = "1. Pure Silk Saree\n2. Designer Chudi";
        if (this.orders[2]) this.orders[2].items = "1. Handcrafted Chudi Anarkali\n2. Royal Saree";
        if (this.orders[3]) this.orders[3].items = "1. Bridal Chudi Set\n2. Banarasi Saree";
        if (this.orders[4]) this.orders[4].items = "1. Embroidered Chudi Kurti\n2. Silk Saree";
        try { localStorage.setItem('nf_orders', JSON.stringify(this.orders)); } catch(e){}
      }
    }
    this.customers = JSON.parse(localStorage.getItem('nf_customers')) || INITIAL_CUSTOMERS;
    let delCoupons = [];
    try { delCoupons = JSON.parse(localStorage.getItem('nf_deleted_coupons')) || []; } catch(e) {}
    let rawCoupons = null;
    try { rawCoupons = JSON.parse(localStorage.getItem('nf_coupons')); } catch(e) {}
    if (rawCoupons && Array.isArray(rawCoupons)) {
      this.coupons = rawCoupons.filter(c => !delCoupons.includes(c.code));
    } else {
      this.coupons = INITIAL_COUPONS.filter(c => !delCoupons.includes(c.code));
    }
    
    this.currentTab = 'dashboard';
    this.editingProductId = null;
    this.revenueChartInstance = null;
    this.categoryChartInstance = null;

    this.init();
  }

  save() {
    localStorage.setItem('nf_products', JSON.stringify(this.products));
    localStorage.setItem('nf_orders', JSON.stringify(this.orders));
    localStorage.setItem('nf_customers', JSON.stringify(this.customers));
    localStorage.setItem('nf_coupons', JSON.stringify(this.coupons));
  }

    init() {
    try { this.initTheme(); } catch (e) { console.warn('Theme init:', e); }
    try { this.initNavigation(); } catch (e) { console.warn('Navigation init:', e); }
    try { this.initGlobalSearch(); } catch (e) { console.warn('Search init:', e); }
    try { this.renderDashboard(); } catch (e) { console.warn('Dashboard init:', e); }
    try { this.renderProductsTable(); } catch (e) { console.warn('Products table init:', e); }
    try { this.renderOrdersTable(); } catch (e) { console.warn('Orders table init:', e); }
    try { this.renderCustomersTable(); } catch (e) { console.warn('Customers table init:', e); }
    try { this.renderCouponsGrid(); } catch (e) { console.warn('Coupons grid init:', e); }
    try { this.initModals(); } catch (e) { console.warn('Modals init:', e); }
    try { this.initMobileSidebar(); } catch (e) { console.warn('Sidebar init:', e); }
    try { if (this.initSupabaseSync) this.initSupabaseSync(); } catch (e) { console.warn('Supabase sync init:', e); }
    try { if (this.initAdminAuth) this.initAdminAuth(); } catch (e) { console.warn('Admin auth init:', e); }

    // Live Cross-Tab & Customer Order Sync
    window.addEventListener('products_updated', (e) => {
      if (e && e.detail && Array.isArray(e.detail)) {
        this.products = e.detail;
        this.renderProductsTable();
        this.renderDashboard();
      }
    });

    window.addEventListener('storage', (e) => {
      if (!e.key || e.key === 'nf_products') {
        try {
          const prods = JSON.parse(localStorage.getItem('nf_products'));
          if (Array.isArray(prods)) {
            this.products = prods;
            this.renderProductsTable();
            this.renderDashboard();
          }
        } catch(err) {}
      }
      if (!e.key || e.key === 'nf_orders') {
        try {
          const ords = JSON.parse(localStorage.getItem('nf_orders'));
          if (Array.isArray(ords)) {
            this.orders = ords;
            this.renderOrdersTable();
            this.renderDashboard();
          }
        } catch(err) {}
      }
    });
  }

  // --- SUPABASE CLOUD SYNC ENGINE ---
  async initSupabaseSync() {
    console.log('🔄 Initializing Supabase Cloud Sync for Admin Portal...');
    try {
      // 1. Sync Products
      if (window.GlamProducts) {
        const cloudProducts = await window.GlamProducts.getAll();
        if (cloudProducts && cloudProducts.length > 0) {
          let deletedIds = [];
          try {
            deletedIds = JSON.parse(localStorage.getItem('nf_deleted_products')) || [];
          } catch(e) {}
          this.products = cloudProducts
            .filter(p => !deletedIds.includes(String(p.id)))
            .map(p => {
              const localExisting = (this.products || []).find(lp => String(lp.id) === String(p.id));
              const cloudStock = Number(p.stock !== undefined ? p.stock : 15);
              const isLocallyOutOfStock = localExisting && (Number(localExisting.stock) <= 0 || localExisting.status === 'out-of-stock');
              const finalStock = isLocallyOutOfStock ? 0 : cloudStock;
              const finalStatus = (finalStock <= 0) ? 'out-of-stock' : (finalStock <= 5 ? 'low-stock' : (p.status || 'in-stock'));

              if (isLocallyOutOfStock && cloudStock > 0 && window.GlamProducts && typeof window.GlamProducts.update === 'function') {
                window.GlamProducts.update(p.id, { stock: 0, status: 'out-of-stock' }).catch(() => {});
              }

              return {
                id: p.id,
                name: p.name,
                category: p.category,
                price: Number(p.price),
                originalPrice: Number(p.original_price || p.price),
                stock: finalStock,
                status: finalStatus,
                image: p.image,
                images: p.images || (localExisting && localExisting.images) || [p.image],
                colors: p.colors || (localExisting && localExisting.colors) || null,
                sizes: p.sizes || (localExisting && localExisting.sizes) || (p.category === 'Saree' ? ['Free Size'] : ['S', 'M', 'L', 'XL', 'XXL']),
                rating: Number(p.rating || 5.0),
                sales: Number(p.sales || 0)
              };
            });
          this.save();
          this.renderProductsTable();
          this.renderDashboard();
        }
      }

      // 2. Sync Orders
      if (window.GlamOrders) {
        const cloudOrders = await window.GlamOrders.getAll();
        if (cloudOrders && cloudOrders.length > 0) {
          this.orders = cloudOrders.map(o => ({
            id: o.id,
            customer: o.customer_name,
            email: o.customer_email,
            phone: o.customer_phone,
            items: o.items_summary || 'Order Items',
            total: Number(o.total),
            paymentMethod: o.payment_method || 'UPI',
            paymentStatus: o.payment_status || 'Paid',
            status: (o.status || 'processing').toLowerCase(),
            date: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Today'
          }));
          this.renderOrdersTable();
          this.renderDashboard();
        }
      }

      // 3. Sync Customers
      if (window.GlamCustomers) {
        const cloudCustomers = await window.GlamCustomers.getAll();
        if (cloudCustomers && cloudCustomers.length > 0) {
          this.customers = cloudCustomers.map(c => ({
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            ordersCount: Number(c.orders_count || 0),
            totalSpend: Number(c.total_spend || 0),
            status: c.status || 'Active'
          }));
          this.renderCustomersTable();
        }
      }

      // 4. Sync Coupons (Merge without discarding local newly created vouchers)
      if (window.GlamCoupons) {
        const cloudCoupons = await window.GlamCoupons.getAll();
        if (cloudCoupons && cloudCoupons.length > 0) {
          let delCoupons = [];
          try { delCoupons = JSON.parse(localStorage.getItem('nf_deleted_coupons')) || []; } catch(e) {}
          const cloudMapped = cloudCoupons
            .filter(cp => !delCoupons.includes(cp.code))
            .map(cp => ({
              id: cp.id,
              code: cp.code,
              type: cp.type || 'percentage',
              value: Number(cp.value),
              discount: cp.discount || (cp.type === 'fixed' ? '₹' + Number(cp.value).toLocaleString('en-IN') + ' OFF' : cp.value + '% OFF'),
              minOrder: Number(cp.min_spend || cp.minOrder || 0),
              minSpend: Number(cp.min_spend || cp.minOrder || 0),
              usageLimit: Number(cp.usage_limit || 100),
              usedCount: Number(cp.used_count || 0),
              status: cp.status || 'Active',
              expiry: cp.expiry || '2026-12-31'
            }));

          // Merge: add cloud coupons that don't already exist locally
          cloudMapped.forEach(cc => {
            if (!this.coupons.some(lc => lc.code === cc.code)) {
              this.coupons.push(cc);
            }
          });
          // Filter out any tombstoned
          this.coupons = this.coupons.filter(c => !delCoupons.includes(c.code));
          this.save();
          this.renderCouponsGrid();
        }
      }

      const statusBadge = document.getElementById('cloudStatusText');
      if (statusBadge) statusBadge.textContent = 'Supabase Cloud (Active)';
    } catch (err) {
      console.warn('Supabase sync notice:', err);
      const statusBadge = document.getElementById('cloudStatusText');
      if (statusBadge) statusBadge.textContent = 'Local (Offline Sync)';
    }
  }

      // --- EXECUTIVE ADMIN AUTHENTICATION GATE ---
  async initAdminAuth() {
    const gate = document.getElementById('adminLoginGate');
    const layout = document.querySelector('.admin-layout');
    const gateForm = document.getElementById('adminGateForm');
    const gateEmail = document.getElementById('adminGateEmail');
    const gatePass = document.getElementById('adminGatePassword');
    const gateError = document.getElementById('adminGateError');
    const demoBtn = document.getElementById('adminGateDemoBtn');
    const profileName = document.getElementById('adminProfileName');
    const avatarInitials = document.getElementById('adminAvatarInitials');
    const profileRole = document.getElementById('adminProfileRole');
    const self = this;

    function unlockPortal(email) {
      if (gate) {
        gate.style.setProperty('display', 'none', 'important');
      }
      if (layout) {
        layout.style.setProperty('display', 'flex', 'important');
        layout.style.removeProperty('filter');
        layout.style.removeProperty('pointer-events');
      }
      const displayName = (email || 'admin').split('@')[0];
      if (profileName) profileName.textContent = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      if (avatarInitials) avatarInitials.textContent = (displayName.slice(0, 2)).toUpperCase();
      if (profileRole) profileRole.textContent = 'Super Admin Verified';
      if (self.showToast) self.showToast(`Welcome back, ${displayName}! Executive Portal unlocked.`);
    }

    function lockPortal() {
      if (gate) {
        gate.style.setProperty('display', 'flex', 'important');
      }
      if (layout) {
        layout.style.setProperty('display', 'none', 'important');
      }
    }

    window.unlockAdminPortal = unlockPortal;
    window.lockAdminPortal = lockPortal;

    window.adminLogout = async function(e) {
      if (e && e.preventDefault) e.preventDefault();
      localStorage.removeItem('glam_admin_session');
      lockPortal();
      if (self.showToast) self.showToast('Administrator signed out. Portal locked.');
      if (window.GlamAuth) {
        try { await window.GlamAuth.signOut(); } catch(err) {}
      }
    };

    // Check active session on load
    let currentAdmin = null;
    try {
      const savedSession = localStorage.getItem('glam_admin_session');
      if (savedSession) currentAdmin = JSON.parse(savedSession);
    } catch(e) {}

    if (!currentAdmin && window.GlamAuth) {
      try {
        const u = await window.GlamAuth.getCurrentUser();
        if (u) currentAdmin = { email: u.email, role: 'admin' };
      } catch(e) {}
    }

    // Security Policy: Always present the Executive Sign-in Gate on visit
    lockPortal();

    // Fast 1-click Demo Unlock
    if (demoBtn) {
      demoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const demoEmail = 'admin@saglam.com';
        localStorage.setItem('glam_admin_session', JSON.stringify({ email: demoEmail, role: 'admin', time: Date.now() }));
        unlockPortal(demoEmail);
      });
    }

    const forgotPassBtn = document.getElementById('adminForgotPassBtn');
    const forgotForm = document.getElementById('adminForgotForm');
    const forgotEmail = document.getElementById('adminForgotEmail');
    const newPassInput = document.getElementById('adminNewPassword');
    const forgotMsg = document.getElementById('adminForgotMsg');
    const sendResetLinkBtn = document.getElementById('adminSendResetLinkBtn');
    const restoreDefaultBtn = document.getElementById('adminRestoreDefaultBtn');
    const backToLoginBtn = document.getElementById('adminBackToLoginBtn');

    // Password visibility eye toggles in Admin Portal
    document.querySelectorAll('.toggle-pass-visibility').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (input) {
          const isPassword = input.type === 'password';
          input.type = isPassword ? 'text' : 'password';
          const icon = btn.querySelector('i');
          if (icon) {
            icon.className = isPassword ? 'ri-eye-off-line' : 'ri-eye-line';
          }
        }
      });
    });

    function showAdminForgotMsg(msg, type) {
      if (!forgotMsg) return;
      forgotMsg.style.display = 'block';
      if (type === 'error') {
        forgotMsg.style.background = 'rgba(239, 68, 68, 0.15)';
        forgotMsg.style.border = '1px solid rgba(239, 68, 68, 0.4)';
        forgotMsg.style.color = '#f87171';
        forgotMsg.innerHTML = `<i class="ri-error-warning-line"></i> ${msg}`;
      } else if (type === 'success') {
        forgotMsg.style.background = 'rgba(34, 197, 94, 0.15)';
        forgotMsg.style.border = '1px solid rgba(34, 197, 94, 0.4)';
        forgotMsg.style.color = '#4ade80';
        forgotMsg.innerHTML = `<i class="ri-checkbox-circle-fill"></i> ${msg}`;
      } else {
        forgotMsg.style.background = 'rgba(212, 175, 55, 0.15)';
        forgotMsg.style.border = '1px solid rgba(212, 175, 55, 0.4)';
        forgotMsg.style.color = '#fef08a';
        forgotMsg.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> ${msg}`;
      }
    }

    // Switch to Admin Forgot Password View
    if (forgotPassBtn) {
      forgotPassBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (gateForm) gateForm.style.display = 'none';
        if (forgotForm) {
          forgotForm.style.display = 'block';
          if (forgotEmail && gateEmail) forgotEmail.value = gateEmail.value || 'admin@saglam.com';
          if (newPassInput) newPassInput.value = '';
          if (forgotMsg) forgotMsg.style.display = 'none';
        }
      });
    }

    // Switch back to Admin Login Form
    if (backToLoginBtn) {
      backToLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (forgotForm) forgotForm.style.display = 'none';
        if (gateForm) gateForm.style.display = 'block';
        if (gateError) gateError.style.display = 'none';
      });
    }

    // Restore Default Password ("admin123")
    if (restoreDefaultBtn) {
      restoreDefaultBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('glam_admin_custom_password');
        if (gatePass) gatePass.value = 'admin123';
        showAdminForgotMsg('Default administrative password ("admin123") restored. Switching to login...', 'success');
        setTimeout(() => {
          if (forgotForm) forgotForm.style.display = 'none';
          if (gateForm) gateForm.style.display = 'block';
        }, 1200);
      });
    }

    // Send Recovery Email Link
    if (sendResetLinkBtn) {
      sendResetLinkBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = (forgotEmail?.value || 'admin@saglam.com').trim();
        showAdminForgotMsg(`Sending admin recovery instructions to ${email}...`, 'loading');
        try {
          if (window.GlamAuth) {
            await window.GlamAuth.resetPasswordForEmail(email);
          }
          showAdminForgotMsg(`Administrative recovery link sent to ${email}. Check your inbox.`, 'success');
        } catch(err) {
          showAdminForgotMsg(`Simulated recovery sent to ${email}. You can also set a new password directly above.`, 'success');
        }
      });
    }

    // Submit Admin Password Update Form
    if (forgotForm) {
      forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = (forgotEmail?.value || 'admin@saglam.com').trim();
        const newPass = (newPassInput?.value || '').trim();

        if (!email) {
          showAdminForgotMsg('Please specify the administrator email.', 'error');
          return;
        }

        if (!newPass || newPass.length < 6) {
          showAdminForgotMsg('Admin password must be at least 6 characters long.', 'error');
          return;
        }

        showAdminForgotMsg('Updating administrator credentials...', 'loading');

        try {
          localStorage.setItem('glam_admin_custom_password', newPass);
          if (window.GlamAuth) {
            try {
              await window.GlamAuth.updatePassword(newPass);
            } catch(authErr) {
              console.warn('Admin password cloud update fallback:', authErr.message);
            }
          }
          if (window.GlamCustomers && typeof window.GlamCustomers.upsert === 'function') {
            try {
              window.GlamCustomers.upsert({
                id: 'CONFIG_STORE',
                name: 'Administrator Master Config',
                email: 'admin@saglam.com',
                phone: newPass,
                status: 'Active'
              }).catch(() => {});
            } catch(e) {}
          }
          if (gatePass) gatePass.value = newPass;
          if (gateEmail) gateEmail.value = email;

          showAdminForgotMsg('Administrator password updated successfully! Redirecting to login...', 'success');
          setTimeout(() => {
            if (forgotForm) forgotForm.style.display = 'none';
            if (gateForm) gateForm.style.display = 'block';
          }, 1200);
        } catch(err) {
          localStorage.setItem('glam_admin_custom_password', newPass);
          if (gatePass) gatePass.value = newPass;
          showAdminForgotMsg('Admin password updated locally. Redirecting to login...', 'success');
          setTimeout(() => {
            if (forgotForm) forgotForm.style.display = 'none';
            if (gateForm) gateForm.style.display = 'block';
          }, 1200);
        }
      });
    }

    // Form submit unlock
    if (gateForm) {
      gateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = (gateEmail?.value || '').trim();
        const password = gatePass?.value || '';
        if (gateError) gateError.style.display = 'none';

        if (!email || !password) {
          if (gateError) {
            gateError.textContent = 'Please enter admin email and password.';
            gateError.style.display = 'block';
          }
          return;
        }

        const customAdminPass = localStorage.getItem('glam_admin_custom_password');
        const isCustomMatch = customAdminPass && password === customAdminPass;
        const isDefaultMatch = password === 'admin123' || isCustomMatch;

        try {
          let adminAuthenticated = false;
          if (window.GlamAuth) {
            try {
              await window.GlamAuth.signIn(email, password);
              adminAuthenticated = true;
            } catch(authErr) {
              if (isCustomMatch || isDefaultMatch) {
                adminAuthenticated = true;
              } else {
                throw new Error('Invalid administrator credentials. Incorrect password.');
              }
            }
          } else if (isCustomMatch || isDefaultMatch) {
            adminAuthenticated = true;
          }

          if (!adminAuthenticated) {
            throw new Error('Invalid administrator credentials. Incorrect password.');
          }

          localStorage.setItem('glam_admin_session', JSON.stringify({ email, role: 'admin', time: Date.now() }));
          unlockPortal(email);
        } catch(err) {
          if (gateError) {
            gateError.textContent = err.message || 'Invalid administrator credentials. Incorrect password.';
            gateError.style.display = 'block';
          }
        }
      });
    }
  }

  initTheme() {
    const savedTheme = localStorage.getItem('nf_admin_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.innerHTML = savedTheme === 'dark' 
        ? '<i class="ri-sun-line"></i>' 
        : '<i class="ri-moon-line"></i>';
      themeBtn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme');
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('nf_admin_theme', next);
        themeBtn.innerHTML = next === 'dark' 
          ? '<i class="ri-sun-line"></i>' 
          : '<i class="ri-moon-line"></i>';
        this.renderCharts();
      });
    }
  }

  initNavigation() {
    const links = document.querySelectorAll('.nav-link[data-tab]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    
    // Nav links active state
    document.querySelectorAll('.nav-link[data-tab]').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-tab') === tabName);
    });

    // Tab pane active state
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === `tab-${tabName}`);
    });

    // Update Header Title
    const titles = {
      dashboard: { title: "Executive Dashboard", subtitle: "Real-time revenue, orders & store performance" },
      products: { title: "Catalog & Inventory", subtitle: "Manage bridal, saree & ethnic wear inventory" },
      orders: { title: "Orders Management", subtitle: "Process customer shipments & invoices" },
      customers: { title: "Customer VIP Club", subtitle: "Clientele lifetime metrics and loyalty tiers" },
      coupons: { title: "Promotions & Discounts", subtitle: "Manage seasonal festive coupons and vouchers" },
      analytics: { title: "Financial Analytics", subtitle: "Revenue distributions, conversion and sales trends" },
      settings: { title: "Store Settings", subtitle: "Configure luxury branding, currency and logistics" }
    };

    if (titles[tabName]) {
      document.getElementById('headerTitle').textContent = titles[tabName].title;
      document.getElementById('headerSubtitle').textContent = titles[tabName].subtitle;
    }

    if (tabName === 'dashboard' || tabName === 'analytics') {
      setTimeout(() => this.renderCharts(), 100);
    }
  }

  initMobileSidebar() {
    const toggleBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('adminSidebar');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  }

  initGlobalSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
          this.renderProductsTable();
          this.renderOrdersTable();
          return;
        }
        if (this.currentTab === 'products') {
          this.filterProducts(query);
        } else if (this.currentTab === 'orders') {
          this.filterOrders(query);
        }
      });
    }
  }

  // ═══════════ DASHBOARD METRICS & CHARTS ═══════════
  renderDashboard() {
    const totalRev = this.orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
    
    const totalOrders = this.orders.length;
    const totalProducts = this.products.length;
    const totalCustomers = this.customers.length;

    document.getElementById('statTotalRevenue').textContent = `₹${(totalRev + 124500).toLocaleString('en-IN')}`;
    document.getElementById('statTotalOrders').textContent = (totalOrders + 84).toString();
    document.getElementById('statTotalProducts').textContent = totalProducts.toString();
    document.getElementById('statTotalCustomers').textContent = (totalCustomers + 420).toString();

    this.renderDashboardRecentOrders();
    this.renderCharts();
  }

  renderCharts() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded, skipping chart render.');
      return;
    }
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#A1A1AA' : '#666666';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

    // Revenue Chart
    const revCtx = document.getElementById('revenueChart');
    if (revCtx) {
      if (this.revenueChartInstance) this.revenueChartInstance.destroy();

      const gradient = revCtx.getContext('2d').createLinearGradient(0, 0, 0, 260);
      gradient.addColorStop(0, 'rgba(244, 63, 126, 0.35)');
      gradient.addColorStop(1, 'rgba(244, 63, 126, 0.0)');

      this.revenueChartInstance = new Chart(revCtx, {
        type: 'line',
        data: {
          labels: ['Aug 26', 'Aug 27', 'Aug 28', 'Aug 29', 'Aug 30', 'Aug 31', 'Sep 01'],
          datasets: [{
            label: 'Revenue (₹)',
            data: [32400, 48500, 62000, 54200, 89000, 94500, 118200],
            borderColor: '#F43F7E',
            borderWidth: 3,
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#F43F7E',
            pointRadius: 4,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString('en-IN')}`
              }
            }
          },
          scales: {
            x: { grid: { color: gridColor }, ticks: { color: textColor } },
            y: { grid: { color: gridColor }, ticks: { color: textColor } }
          }
        }
      });
    }

    // Category Doughnut Chart
    const catCtx = document.getElementById('categoryChart');
    if (catCtx) {
      if (this.categoryChartInstance) this.categoryChartInstance.destroy();

      this.categoryChartInstance = new Chart(catCtx, {
        type: 'doughnut',
        data: {
          labels: ['Lehenga & Bridal', 'Banarasi Sarees', 'Anarkali Suits', 'Tops & Dupattas', 'Jewellery'],
          datasets: [{
            data: [38, 25, 18, 12, 7],
            backgroundColor: ['#F43F7E', '#D4AF37', '#FF6B9A', '#38BDF8', '#34D399'],
            borderWidth: 0,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: textColor, font: { size: 11, family: 'Inter' } }
            }
          },
          cutout: '70%'
        }
      });
    }
  }

  renderDashboardRecentOrders() {
    const tbody = document.getElementById('dashboardOrdersBody');
    if (!tbody) return;
    tbody.innerHTML = this.orders.slice(0, 5).map((o, index) => {
      const serialNum = (index + 1) + '.';
      const cleanId = String(o.id).startsWith('#') ? String(o.id) : '#' + o.id;
      const avatarText = o.avatar || (o.customer ? o.customer.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'CU');
      return `
      <tr>
        <td style="text-align: center;"><strong style="color: var(--gold-accent);">${serialNum}</strong></td>
        <td><strong style="color: var(--gold-accent); font-family: monospace;">${cleanId}</strong></td>
        <td>
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <div class="admin-avatar" style="width:28px; height:28px; font-size:0.75rem; border: 1px solid var(--gold-accent); color: var(--gold-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center;">${avatarText}</div>
            <div>
              <strong style="display:block; font-size:0.85rem;">${o.customer}</strong>
              <span style="font-size:0.72rem; color:var(--text-muted);">${o.city}</span>
            </div>
          </div>
        </td>
        <td><div style="display:flex; flex-direction:column; gap:2px;">${formatOrderItemsHTML(o.items)}</div></td>
        <td><strong>₹${Number(o.total || 0).toLocaleString('en-IN')}</strong></td>
        <td><span class="status-badge ${o.status}"><i class="ri-checkbox-circle-fill"></i> ${o.status}</span></td>
        <td>${o.date}</td>
      </tr>
    `;
    }).join('');
  }

  // ═══════════ PRODUCT CATALOG ═══════════
  renderProductsTable(items = this.products) {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2.5rem; color:var(--text-muted);">No luxury products found matching your search.</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map(p => `
      <tr>
        <td>
          <div class="product-row-flex" style="align-items:flex-start;">
            <div style="position:relative;">
              <img src="${p.image}" alt="${p.name}" class="product-thumb-img" onerror="this.src='assets/images/about_anarkali.png'" />
              ${p.images && p.images.length > 1 ? `
                <span style="position:absolute; bottom:2px; right:2px; background:rgba(0,0,0,0.75); color:#fff; font-size:0.65rem; font-weight:700; padding:1px 4px; border-radius:3px; line-height:1.2;">
                  <i class="ri-image-line" style="font-size:0.6rem;"></i> ${p.images.length}
                </span>
              ` : ''}
            </div>
            <div class="product-info-text">
              <strong>${p.name}</strong>
              <span style="display:flex; align-items:center; gap:6px;">
                SKU: ${p.id}
                ${p.images && p.images.length > 1 ? `<span style="color:var(--gold-accent); font-size:0.7rem; font-weight:600;">(${p.images.length} angles)</span>` : ''}
              </span>
              ${p.images && p.images.length > 1 ? `
                <div style="display:flex; gap:3px; margin-top:4px; align-items:center;">
                  ${p.images.slice(0, 4).map(imgUrl => `
                    <img src="${imgUrl}" style="width:18px; height:22px; object-fit:cover; border-radius:2px; border:1px solid var(--border-subtle);" onerror="this.src='assets/images/about_anarkali.png';" />
                  `).join('')}
                  ${p.images.length > 4 ? `<span style="font-size:0.65rem; color:var(--text-muted); font-weight:700;">+${p.images.length - 4}</span>` : ''}
                </div>
              ` : ''}
            </div>
          </div>
        </td>
        <td><span style="font-weight:600; color:var(--gold-accent);">${p.category}</span></td>
        <td>
          <div style="display:flex; flex-direction:column; gap:4px;">
            <div style="display:flex; gap:3px; flex-wrap:wrap; max-width:160px;">
              ${(p.sizes && p.sizes.length > 0 ? p.sizes : ['S','M','L','XL','XXL']).map(s => `
                <span style="font-size:0.72rem; font-weight:700; color:var(--gold-accent); background:rgba(212,175,55,0.12); border:1px solid rgba(212,175,55,0.3); padding:1px 6px; border-radius:4px;">${s}</span>
              `).join('')}
            </div>
            ${p.colors && p.colors.length > 0 ? `
              <div style="display:flex; gap:4px; align-items:center; flex-wrap:wrap; margin-top:2px;">
                ${p.colors.map(c => `
                  <span title="${c.name || c}" style="width:12px; height:12px; border-radius:50%; background:${c.hex || '#d4af37'}; display:inline-block; border:1px solid rgba(0,0,0,0.3); box-shadow:0 1px 2px rgba(0,0,0,0.15);"></span>
                `).join('')}
                <span style="font-size:0.68rem; font-weight:600; color:var(--text-muted);">${p.colors.length} col</span>
              </div>
            ` : ''}
          </div>
        </td>
        <td>
          <strong>₹${p.price.toLocaleString('en-IN')}</strong>
          ${p.originalPrice ? `<span style="text-decoration:line-through; font-size:0.75rem; color:var(--text-muted); margin-left:4px;">₹${p.originalPrice.toLocaleString('en-IN')}</span>` : ''}
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <strong style="color:${Number(p.stock) <= 0 ? '#dc2626' : (Number(p.stock) <= 5 ? '#d97706' : 'inherit')};">${p.stock} units</strong>
            <button type="button" class="btn-icon-table" onclick="window.openEditProduct('${p.id}')" title="Edit Stock & Details" style="width:24px; height:24px; padding:0; display:inline-flex; align-items:center; justify-content:center; border-radius:4px; border:1px solid var(--border-subtle); background:var(--bg-card); cursor:pointer;">
              <i class="ri-edit-line" style="color:var(--gold-accent); font-size:0.85rem;"></i>
            </button>
          </div>
        </td>
        <td><span class="status-badge ${Number(p.stock) <= 0 ? 'out-of-stock' : (Number(p.stock) <= 5 ? 'low-stock' : 'in-stock')}">${Number(p.stock) <= 0 ? 'out of stock' : (Number(p.stock) <= 5 ? 'low stock' : 'in stock')}</span></td>
        <td>
          <div style="display:flex; align-items:center; gap:3px; color:var(--gold-accent); font-weight:600;">
            <i class="ri-star-fill"></i> ${p.rating} <span style="color:var(--text-muted); font-size:0.75rem; font-weight:normal;">(${p.sales})</span>
          </div>
        </td>
        <td>
          <div class="table-action-btns">
            <button class="btn-icon-table" onclick="window.openEditProduct('${p.id}')" title="Edit Product"><i class="ri-edit-line"></i></button>
            <button class="btn-icon-table delete" onclick="window.deleteProduct('${p.id}')" title="Delete Product"><i class="ri-delete-bin-line"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  filterProducts(query) {
    const filtered = this.products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query)
    );
    this.renderProductsTable(filtered);
  }

  openAddProductModal() {
    this.editingProductId = null;
    const title = document.getElementById('modalProductTitle');
    if (title) title.textContent = 'Add New Luxury Couture';
    const form = document.getElementById('productForm');
    if (form) form.reset();
    const fileInput = document.getElementById('prodImageFile');
    if (fileInput) fileInput.value = '';
    const imgInput = document.getElementById('prodImage');
    if (imgInput) imgInput.value = 'assets/images/about_anarkali.png';
    const preview = document.getElementById('productImagePreview');
    if (preview) preview.src = 'assets/images/about_anarkali.png';

    // Reset colors and gallery
    window.adminSelectedColors = [
      { name: 'Maroon', hex: '#800020' },
      { name: 'Emerald Green', hex: '#097969' }
    ];
    window.adminGalleryImages = [];
    if (typeof window.renderAdminColorsUI === 'function') window.renderAdminColorsUI();
    if (typeof window.renderAdminGalleryUI === 'function') window.renderAdminGalleryUI();
    if (typeof window.initAdminGalleryFileUpload === 'function') window.initAdminGalleryFileUpload();

    const modal = document.getElementById('productModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.setProperty('display', 'flex', 'important');
      modal.style.setProperty('opacity', '1', 'important');
      modal.style.setProperty('visibility', 'visible', 'important');
      modal.style.setProperty('z-index', '99999', 'important');
    }
  }

  openEditProduct(id) {
    const prod = this.products.find(p => String(p.id) === String(id));
    if (!prod) {
      console.warn('Product not found for edit ID:', id);
      return;
    }
    this.editingProductId = prod.id;
    const modalTitle = document.getElementById('modalProductTitle');
    if (modalTitle) modalTitle.textContent = `Edit Product: ${prod.name}`;

    const nameEl = document.getElementById('prodName');
    if (nameEl) nameEl.value = prod.name || '';
    const catEl = document.getElementById('prodCategory');
    if (catEl) catEl.value = prod.category || 'Kurtis';
    const priceEl = document.getElementById('prodPrice');
    if (priceEl) priceEl.value = prod.price || '';
    const origPriceEl = document.getElementById('prodOriginalPrice');
    if (origPriceEl) origPriceEl.value = prod.originalPrice || '';
    const stockEl = document.getElementById('prodStock');
    if (stockEl) stockEl.value = (prod.stock !== undefined ? prod.stock : 15);
    const imgEl = document.getElementById('prodImage');
    if (imgEl) imgEl.value = prod.image || 'assets/images/about_anarkali.png';
    const previewEl = document.getElementById('productImagePreview');
    if (previewEl) previewEl.src = prod.image || 'assets/images/about_anarkali.png';
    
    // Populate sizes checkboxes
    const targetSizes = prod.sizes || (prod.category === 'Saree' ? ['Free Size'] : ['S', 'M', 'L', 'XL', 'XXL']);
    const cbs = document.querySelectorAll('#adminProductSizesSelector input[name="prodSize"]');
    cbs.forEach(cb => {
      cb.checked = targetSizes.includes(cb.value);
    });

    // Populate colors
    if (prod.colors && Array.isArray(prod.colors) && prod.colors.length > 0) {
      window.adminSelectedColors = prod.colors.map(c => {
        if (typeof c === 'string') {
          const found = STANDARD_ETHNIC_COLORS.find(sc => sc.name.toLowerCase() === c.toLowerCase());
          return { name: c, hex: found ? found.hex : '#D4AF37' };
        }
        return c;
      });
    } else {
      window.adminSelectedColors = [
        { name: 'Maroon', hex: '#800020' },
        { name: 'Emerald Green', hex: '#097969' }
      ];
    }

    // Populate gallery images (exclude primary image if duplicate)
    if (prod.images && Array.isArray(prod.images)) {
      window.adminGalleryImages = prod.images.filter(img => img && img !== prod.image);
    } else {
      window.adminGalleryImages = [];
    }

    if (typeof window.renderAdminColorsUI === 'function') window.renderAdminColorsUI();
    if (typeof window.renderAdminGalleryUI === 'function') window.renderAdminGalleryUI();
    if (typeof window.initAdminGalleryFileUpload === 'function') window.initAdminGalleryFileUpload();

    const modal = document.getElementById('productModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.setProperty('display', 'flex', 'important');
      modal.style.setProperty('opacity', '1', 'important');
      modal.style.setProperty('visibility', 'visible', 'important');
      modal.style.setProperty('z-index', '99999', 'important');
    }
  }

  saveProduct(e) {
    e.preventDefault();
    const name = document.getElementById('prodName').value.trim();
    const category = document.getElementById('prodCategory').value;
    const price = Number(document.getElementById('prodPrice').value);
    const originalPrice = Number(document.getElementById('prodOriginalPrice').value) || price;
    const stock = Number(document.getElementById('prodStock').value);
    // Read selected sizes
    const selectedSizes = Array.from(document.querySelectorAll('#adminProductSizesSelector input[name="prodSize"]:checked')).map(cb => cb.value);
    const sizes = selectedSizes.length > 0 ? selectedSizes : ['S', 'M', 'L', 'XL', 'XXL'];
    
    // Read selected colors
    const colors = window.adminSelectedColors && window.adminSelectedColors.length > 0 
      ? [...window.adminSelectedColors] 
      : [{ name: "Standard", hex: "#D4AF37" }];

    const image = document.getElementById('prodImage').value.trim() || 'assets/images/about_anarkali.png';
    const images = [image, ...(window.adminGalleryImages || [])];

    let status = 'in-stock';
    if (stock <= 0) status = 'out-of-stock';
    else if (stock <= 10) status = 'low-stock';

    if (this.editingProductId) {
      const idx = this.products.findIndex(p => p.id === this.editingProductId);
      if (idx !== -1) {
        this.products[idx] = { ...this.products[idx], name, category, sizes, colors, images, price, originalPrice, stock, image, status };
        this.showToast(`Product "${name}" updated successfully!`);
      }
    } else {
      const newProd = {
        id: `NF-${Math.floor(100 + Math.random() * 900)}`,
        name,
        category,
        price,
        originalPrice,
        stock,
        image,
        images,
        sizes,
        colors,
        status,
        rating: 5.0,
        sales: 0
      };
      this.products.unshift(newProd);
      this.showToast(`New couture "${name}" added to catalog!`);
    }

    this.save();
    window.dispatchEvent(new CustomEvent('products_updated', { detail: this.products }));
    try { window.dispatchEvent(new Event('storage')); } catch(e) {}
    this.renderProductsTable();
    
    const modal = document.getElementById('productModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.setProperty('display', 'none', 'important');
    }
    
    // Sync with Supabase Cloud
    if (window.GlamProducts) {
      const activeProd = this.editingProductId 
        ? this.products.find(p => p.id === this.editingProductId)
        : this.products[0];
      if (activeProd) {
        window.GlamProducts.upsert({
          id: activeProd.id,
          name: activeProd.name,
          category: activeProd.category,
          price: activeProd.price,
          original_price: activeProd.originalPrice,
          stock: activeProd.stock,
          status: activeProd.status,
          image: activeProd.image,
          rating: activeProd.rating,
          sales: activeProd.sales
        }).catch(err => console.warn('Supabase product sync:', err));
      }
    }
    this.renderProductsTable();
    this.renderDashboard();
    document.getElementById('productModal').classList.remove('show');
  }

    async deleteProduct(id) {
    if (!id) return;

    const idStr = String(id);

    // 1. Remove from local state
    this.products = this.products.filter(p => String(p.id) !== idStr);

    // 2. Track in permanent deleted IDs list (prevents reload resurrection)
    let deletedIds = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem('nf_deleted_products')) || [];
    } catch(e) {}
    if (!deletedIds.includes(idStr)) {
      deletedIds.push(idStr);
      localStorage.setItem('nf_deleted_products', JSON.stringify(deletedIds));
    }

    // 3. Save to localStorage
    this.save();

    // 4. Delete from Supabase Cloud Database permanently
    if (window.GlamProducts && typeof window.GlamProducts.delete === 'function') {
      try {
        await window.GlamProducts.delete(id);
        console.log('✅ Successfully deleted product from Supabase Cloud:', id);
      } catch (err) {
        console.warn('Supabase cloud delete notice:', err);
      }
    }

    // 5. Broadcast deletion to live website & other open tabs
    window.dispatchEvent(new CustomEvent('products_updated', { detail: this.products }));
    window.dispatchEvent(new CustomEvent('product_deleted', { detail: { id: idStr } }));

    // 6. Refresh Admin Tables & Dashboard
    this.renderProductsTable();
    this.renderDashboard();
    this.showToast('Product permanently deleted from store & live website.');
  }

  // ═══════════ ORDERS MANAGEMENT ═══════════
  renderOrdersTable(items = this.orders) {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    if (!items || items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:3rem 1rem; color:var(--text-muted);"><i class="ri-inbox-line" style="font-size:2.2rem; display:block; margin-bottom:0.5rem; opacity:0.6;"></i>No customer orders found matching your filter criteria.</td></tr>';
      return;
    }

    tbody.innerHTML = items.map((o, index) => {
      const serialNum = (index + 1) + '.';
      const avatarText = o.avatar || (o.customer ? o.customer.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'CU');
      const status = String(o.status || 'processing').toLowerCase().trim();
      const totalFormatted = '₹' + Number(o.total || 0).toLocaleString('en-IN');
      const cleanId = String(o.id).startsWith('#') ? String(o.id) : '#' + o.id;
      const cleanItems = o.items || 'Luxury Haute Couture Garment';
      
      let statusColor = '#3b82f6';
      let statusBg = 'rgba(59, 130, 246, 0.12)';
      let statusBorder = 'rgba(59, 130, 246, 0.35)';
      if (status === 'shipped') {
        statusColor = '#8b5cf6';
        statusBg = 'rgba(139, 92, 246, 0.12)';
        statusBorder = 'rgba(139, 92, 246, 0.35)';
      } else if (status === 'delivered') {
        statusColor = '#10b981';
        statusBg = 'rgba(16, 185, 129, 0.12)';
        statusBorder = 'rgba(16, 185, 129, 0.35)';
      } else if (status === 'cancelled') {
        statusColor = '#ef4444';
        statusBg = 'rgba(239, 68, 68, 0.12)';
        statusBorder = 'rgba(239, 68, 68, 0.35)';
      }

      return `
        <tr style="border-bottom: 1px solid var(--border-subtle); transition: background 0.15s ease;">
          <!-- Col 1: Serial Number (1., 2., 3.) -->
          <td style="width: 60px; text-align: center; padding: 1rem 0.6rem; vertical-align: middle;">
            <span style="font-weight: 700; color: var(--gold-accent); font-size: 0.95rem;">${serialNum}</span>
          </td>

          <!-- Col 2: Order ID -->
          <td style="width: 120px; text-align: left; padding: 1rem 0.85rem; vertical-align: middle;">
            <span style="font-family: monospace; font-weight: 700; color: var(--gold-accent); font-size: 0.92rem; letter-spacing: 0.5px;">${cleanId}</span>
          </td>

          <!-- Col 3: Customer Profile -->
          <td style="width: 220px; text-align: left; padding: 1rem 0.85rem; vertical-align: middle;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="admin-avatar" style="width: 34px; height: 34px; font-size: 0.8rem; font-weight: 700; flex-shrink: 0; background: linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(244,63,126,0.15) 100%); border: 1px solid var(--gold-accent); color: var(--gold-accent); display:flex; align-items:center; justify-content:center; border-radius:50%;">
                ${avatarText}
              </div>
              <div style="min-width: 0; line-height: 1.35;">
                <strong style="display: block; font-size: 0.88rem; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${o.customer || 'Valued Client'}
                </strong>
                <span style="font-size: 0.74rem; color: var(--text-muted); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${o.email || ''}
                </span>
              </div>
            </div>
          </td>

          <!-- Col 4: Items Ordered (1. Chudi, 2. Saree) -->
          <td style="min-width: 250px; text-align: left; padding: 0.9rem 0.85rem; vertical-align: middle;">
            <div style="display: flex; align-items: flex-start; gap: 0.65rem;">
              <div style="width: 32px; height: 32px; border-radius: 7px; background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.25); display: flex; align-items: center; justify-content: center; color: var(--gold-accent); flex-shrink: 0; font-size: 1rem; margin-top: 2px;">
                <i class="ri-t-shirt-2-line"></i>
              </div>
              <div style="min-width: 0; flex: 1;">
                <div class="ordered-items-list" style="display: flex; flex-direction: column; gap: 3px;">
                  ${formatOrderItemsHTML(o.items)}
                </div>
                <span style="font-size: 0.72rem; color: var(--text-muted); display: inline-flex; align-items: center; gap: 4px; margin-top: 4px;">
                  <i class="ri-sparkling-fill" style="color: var(--gold-accent); font-size: 0.68rem;"></i> Couture Handcrafted
                </span>
              </div>
            </div>
          </td>

          <!-- Col 5: Gross Total -->
          <td style="width: 130px; text-align: right; padding: 1rem 0.85rem; vertical-align: middle;">
            <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">
              ${totalFormatted}
            </div>
            <span style="display: inline-block; font-size: 0.7rem; color: var(--text-muted); background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); padding: 1px 6px; border-radius: 4px; margin-top: 2px; font-weight: 600;">
              ${o.paymentMethod || 'Prepaid'}
            </span>
          </td>

          <!-- Col 6: Fulfillment Status Dropdown -->
          <td style="width: 160px; text-align: center; padding: 1rem 0.85rem; vertical-align: middle;">
            <select class="form-control" style="padding: 0.4rem 0.65rem; font-size: 0.78rem; font-weight: 700; width: 135px; border-radius: 7px; cursor: pointer; color: ${statusColor}; background: ${statusBg}; border: 1px solid ${statusBorder}; margin: 0 auto; display: block;" onchange="window.app.updateOrderStatus('${o.id}', this.value)">
              <option value="processing" ${status === 'processing' ? 'selected' : ''}>⏳ Processing</option>
              <option value="shipped" ${status === 'shipped' ? 'selected' : ''}>🚚 Shipped</option>
              <option value="delivered" ${status === 'delivered' ? 'selected' : ''}>✅ Delivered</option>
              <option value="cancelled" ${status === 'cancelled' ? 'selected' : ''}>❌ Cancelled</option>
            </select>
          </td>

          <!-- Col 7: Order Date -->
          <td style="width: 120px; text-align: center; padding: 1rem 0.85rem; vertical-align: middle; white-space: nowrap;">
            <span style="font-size: 0.82rem; color: var(--text-muted);">
              ${o.date || 'Recent'}
            </span>
          </td>

          <!-- Col 8: Invoice Button -->
          <td style="width: 110px; text-align: center; padding: 1rem 0.85rem; vertical-align: middle;">
            <button class="btn-luxury-outline" style="padding: 0.4rem 0.85rem; font-size: 0.8rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; margin: 0 auto;" onclick="window.app.viewOrderDetails('${o.id}')" title="View Official Tax Invoice">
              <i class="ri-file-text-line" style="color: var(--gold-accent);"></i> <span>Invoice</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  filterOrders(query) {
    const filtered = this.orders.filter(o =>
      o.id.toLowerCase().includes(query) ||
      o.customer.toLowerCase().includes(query) ||
      o.items.toLowerCase().includes(query) ||
      o.status.toLowerCase().includes(query)
    );
    this.renderOrdersTable(filtered);
  }

  updateOrderStatus(orderId, newStatus) {
    const ord = this.orders.find(o => o.id === orderId);
    if (ord) {
      const normalizedStatus = String(newStatus).toLowerCase();
      ord.status = normalizedStatus;
      this.save();
      this.renderDashboardRecentOrders();

      // 1. Broadcast update for User Dashboard cross-tab synchronization
      const broadcastPayload = {
        orderId: orderId,
        status: normalizedStatus,
        customer: ord.customer,
        email: ord.email,
        timestamp: Date.now()
      };
      localStorage.setItem('nf_order_status_broadcast', JSON.stringify(broadcastPayload));
      window.dispatchEvent(new CustomEvent('orders_updated', { detail: broadcastPayload }));

      // 2. Cloud sync to Supabase if connected
      if (window.GlamOrders && typeof window.GlamOrders.updateStatus === 'function') {
        const cloudStatus = normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
        window.GlamOrders.updateStatus(orderId, cloudStatus).then(() => {
          console.log('✓ Supabase Cloud updated order ' + orderId + ' to ' + cloudStatus);
        }).catch(err => {
          console.warn('Supabase cloud status update notice:', err);
        });
      }

      this.showToast(`Order ${orderId} updated to ${normalizedStatus.toUpperCase()} (Live Synced)`);
    }
  }

  viewOrderDetails(orderId) {
    const ord = this.orders.find(o => o.id === orderId);
    if (!ord) return;

    const modal = document.getElementById('adminInvoiceModal');
    const body = document.getElementById('adminInvoiceModalBody');
    if (!modal || !body) {
      alert('Invoice #' + ord.id + '\nClient: ' + ord.customer + '\nTotal: ₹' + Number(ord.total || 0).toLocaleString('en-IN'));
      return;
    }

    const totalFormatted = '₹' + Number(ord.total || 0).toLocaleString('en-IN');
    const cleanId = String(ord.id).startsWith('#') ? String(ord.id).substring(1) : ord.id;
    const awbCode = 'BD-' + (cleanId.replace(/[^0-9]/g, '') || '9822') + '-IN';

    body.innerHTML = `
      <!-- Header -->
      <div style="text-align: center; border-bottom: 1.5px solid #D4AF37; padding-bottom: 1.25rem; margin-bottom: 1.4rem;">
        <h2 style="font-family: 'Cinzel', Georgia, serif; color: #1C1917; font-size: 1.45rem; letter-spacing: 2px; margin: 0 0 4px; font-weight: 700;">SA GLAM & GRACE</h2>
        <p style="font-size: 0.75rem; text-transform: uppercase; color: #78716C; letter-spacing: 1px; margin: 0 0 6px; font-weight: 600;">Haute Couture & Atelier Couturier</p>
        <span style="display: inline-block; font-size: 0.75rem; color: #059669; font-weight: 700;"><i class="ri-checkbox-circle-fill"></i> Official Tax Invoice & Dispatch Manifest</span>
      </div>

      <!-- Two-Column Meta Details -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.85rem; margin-bottom: 1.4rem; color: #44403C; line-height: 1.45;">
        <div style="background: #FAF7F2; padding: 0.85rem 1rem; border-radius: 8px; border: 1px solid #EDE8E1;">
          <span style="color: #78716C; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">Customer & Delivery:</span><br>
          <strong style="color: #1C1917; font-size: 0.95rem;">${ord.customer || 'Customer'}</strong><br>
          <span style="color: #57534E;">${ord.email || ''}</span><br>
          <span style="color: #78716C; font-size: 0.8rem;">${ord.phone || '+91 98765 43210'}</span><br>
          <span style="color: #57534E;">${ord.address || ord.city || 'India'}</span>
        </div>
        <div style="background: #FAF7F2; padding: 0.85rem 1rem; border-radius: 8px; border: 1px solid #EDE8E1; text-align: right;">
          <span style="color: #78716C; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">Invoice Information:</span><br>
          <strong style="color: #B48616; font-size: 0.95rem; font-family: monospace;">INV-${cleanId}</strong><br>
          <span style="color: #57534E;">Date: <strong>${ord.date || 'Recent'}</strong></span><br>
          <span style="color: #57534E;">Status: <strong style="text-transform: uppercase; color: #B48616;">${ord.status}</strong></span><br>
          <span style="color: #78716C; font-size: 0.8rem;">AWB: <strong>${awbCode}</strong></span>
        </div>
      </div>

      <!-- Neatly Aligned Items Breakdown Table -->
      <div style="border: 1px solid #EAE5DE; border-radius: 8px; overflow: hidden; margin-bottom: 1.4rem;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.84rem; text-align: left;">
          <thead>
            <tr style="background: #F5F0E8; color: #1C1917; font-weight: 700; border-bottom: 1px solid #EAE5DE;">
              <th style="padding: 0.65rem 0.9rem;">Item & Selection</th>
              <th style="padding: 0.65rem 0.9rem; text-align: center; width: 60px;">Qty</th>
              <th style="padding: 0.65rem 0.9rem; text-align: right; width: 110px;">Rate</th>
              <th style="padding: 0.65rem 0.9rem; text-align: right; width: 110px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${parseOrderItemsList(ord.items).map((item, idx) => {
              const num = (idx + 1) + '.';
              const itemCount = parseOrderItemsList(ord.items).length || 1;
              const itemTotal = Math.round(Number(ord.total || 0) / itemCount);
              const formattedItemTotal = '₹' + itemTotal.toLocaleString('en-IN');
              return `
                <tr style="border-bottom: 1px solid #EAE5DE; background: #FFFFFF;">
                  <td style="padding: 0.75rem 0.9rem; color: #1C1917; font-weight: 600;">
                    <div style="display: flex; align-items: baseline; gap: 6px;">
                      <span style="font-weight: 700; color: #B48616; font-size: 0.88rem; min-width: 20px;">${num}</span>
                      <span style="font-weight: 600; color: #1C1917; font-size: 0.88rem;">${item}</span>
                    </div>
                    <div style="font-size: 0.73rem; color: #78716C; font-weight: normal; margin-top: 2px; padding-left: 26px;">Handcrafted Atelier Finish • Custom Sizing Verified</div>
                  </td>
                  <td style="padding: 0.75rem 0.9rem; text-align: center; color: #44403C; font-weight: 600; vertical-align: top;">1</td>
                  <td style="padding: 0.75rem 0.9rem; text-align: right; color: #44403C; vertical-align: top;">${formattedItemTotal}</td>
                  <td style="padding: 0.75rem 0.9rem; text-align: right; color: #1C1917; font-weight: 700; vertical-align: top;">${formattedItemTotal}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Total Row -->
      <div style="background: #FAF7F2; border: 1px solid #EDE8E1; border-radius: 8px; padding: 0.85rem 1.1rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div>
          <span style="font-size: 0.78rem; text-transform: uppercase; color: #78716C; letter-spacing: 0.5px; font-weight: 700;">Payment Method</span><br>
          <strong style="color: #1C1917; font-size: 0.88rem;">${ord.paymentMethod || 'Prepaid'}</strong>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.78rem; text-transform: uppercase; color: #78716C; letter-spacing: 0.5px; font-weight: 700;">Total Payable / Paid</span><br>
          <strong style="color: #B48616; font-size: 1.25rem;">${totalFormatted}</strong>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; gap: 0.85rem;">
        <button type="button" onclick="window.print()" class="btn-luxury-primary" style="flex: 1; justify-content: center; padding: 0.75rem 1rem; font-size: 0.9rem; font-weight: 700; display: inline-flex; align-items: center; gap: 7px; cursor: pointer;">
          <i class="ri-printer-line"></i> Print / Download PDF
        </button>
        <button type="button" onclick="window.closeAdminInvoiceModal && window.closeAdminInvoiceModal()" class="btn-luxury-outline" style="padding: 0.75rem 1.5rem; font-size: 0.9rem; font-weight: 600; cursor: pointer;">
          Close
        </button>
      </div>
    `;

    modal.style.setProperty('display', 'flex', 'important');
  }

  // ═══════════ CUSTOMERS CRM ═══════════
  renderCustomersTable() {
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;

    tbody.innerHTML = this.customers.map(c => `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <div class="admin-avatar" style="background:var(--gold-gradient); color:#000;">${c.name.charAt(0)}</div>
            <div>
              <strong>${c.name}</strong>
              <span style="display:block; font-size:0.74rem; color:var(--text-muted);">${c.email}</span>
            </div>
          </div>
        </td>
        <td><span class="status-badge" style="background:rgba(212,175,55,0.15); color:var(--gold-accent); font-weight:700;"><i class="ri-vip-crown-fill"></i> ${c.tier}</span></td>
        <td>${c.phone}</td>
        <td>${c.city}</td>
        <td><strong>${c.ordersCount} Orders</strong></td>
        <td><strong style="color:var(--primary-pink);">₹${(Number(c.totalSpent) || 0).toLocaleString('en-IN')}</strong></td>
        <td>${c.joinDate}</td>
      </tr>
    `).join('');
  }

  // ═══════════ COUPONS GRID ═══════════
  renderCouponsGrid() {
    const grid = document.getElementById('couponsGrid');
    if (!grid) return;

    if (!this.coupons || this.coupons.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <i class="ri-coupon-3-line" style="font-size: 2.5rem; opacity: 0.5;"></i>
          <p style="margin-top: 0.8rem; font-size: 1rem;">No active promotional coupons found.</p>
          <button class="btn-luxury-primary" style="margin-top: 1rem;" onclick="window.openCouponModal()">
            <i class="ri-add-line"></i> Create First Coupon
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.coupons.map(c => {
      const minOrderVal = Number(c.minOrder != null ? c.minOrder : (c.minSpend != null ? c.minSpend : 0)) || 0;
      const discountText = c.discount || (c.type === 'fixed' ? '₹' + Number(c.value).toLocaleString('en-IN') + ' OFF' : c.value + '% OFF');
      return `
      <div class="stat-card" style="border:1px dashed var(--primary-pink); position:relative; background:var(--card-bg, #fff);">
        <div class="stat-card-top" style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-family:monospace; font-size:1.15rem; font-weight:800; color:var(--primary-pink); letter-spacing:0.1em; background:var(--primary-pink-light, rgba(180,83,9,0.1)); padding:0.3rem 0.8rem; border-radius:var(--radius-sm); border:1px solid rgba(212,175,55,0.3); ">${c.code}</span>
          <span class="status-badge in-stock">${c.status || 'Active'}</span>
        </div>
        <div class="stat-value" style="font-size:1.6rem; margin:0.8rem 0 0.3rem; color:var(--text-color, #181412); font-weight:800;">${discountText}</div>
        <p style="font-size:0.8rem; color:var(--text-muted);">Min Order: ₹${minOrderVal.toLocaleString('en-IN')} • Expires: ${c.expiry || '2026-12-31'}</p>
        <div style="margin-top:1rem; padding-top:0.8rem; border-top:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; font-size:0.78rem;">
          <span>Used <strong>${c.uses || 0} times</strong></span>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn-luxury-outline" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="navigator.clipboard.writeText('${c.code}'); window.app.showToast('Coupon code copied!');"><i class="ri-file-copy-line"></i> Copy</button>
            <button class="btn-luxury-outline" style="padding:0.25rem 0.6rem; font-size:0.75rem; color:#ef4444; border-color:rgba(239,68,68,0.3);" onclick="window.deleteCoupon('${c.code}')"><i class="ri-delete-bin-line"></i> Delete</button>
          </div>
        </div>
      </div>
    `;
    }).join('');
  }

  deleteCoupon(code) {
    if (!code) return;

    // 1. Remove from local array
    this.coupons = this.coupons.filter(c => c.code !== code);

    // 2. Persist to localStorage
    localStorage.setItem('nf_coupons', JSON.stringify(this.coupons));

    // 3. Tombstone in nf_deleted_coupons so cloud sync never resurrects it
    try {
      const del = JSON.parse(localStorage.getItem('nf_deleted_coupons')) || [];
      if (!del.includes(code)) del.push(code);
      localStorage.setItem('nf_deleted_coupons', JSON.stringify(del));
    } catch(e) {}

    // 4. Supabase deletion if connected
    if (window.GlamCoupons && typeof window.GlamCoupons.deleteByCode === 'function') {
      window.GlamCoupons.deleteByCode(code).catch(err => console.warn('Supabase delete coupon err:', err));
    }

    // 5. Broadcast to storefront tabs
    window.dispatchEvent(new CustomEvent('coupons_updated', { detail: { action: 'delete', code } }));
    try { window.dispatchEvent(new Event('storage')); } catch(e) {}

    this.renderCouponsGrid();
    this.showToast(`Coupon "${code}" has been permanently deleted.`);
  }

  openAddCouponModal() {
    window.openCouponModal();
  }

  saveCoupon(e) {
    if (e && e.preventDefault) e.preventDefault();
    const codeInput = document.getElementById('couponCode');
    const typeInput = document.getElementById('couponType');
    const valInput = document.getElementById('couponValue');
    const minInput = document.getElementById('couponMinOrder');
    const expInput = document.getElementById('couponExpiry');
    const limitInput = document.getElementById('couponLimit');

    if (!codeInput || !codeInput.value.trim()) return;

    const code = codeInput.value.trim().toUpperCase();
    const type = typeInput ? typeInput.value : 'percentage';
    const val = Number(valInput.value) || 10;
    const minOrder = Number(minInput.value) || 0;
    const expiry = expInput ? expInput.value : '2026-12-31';
    const usageLimit = Number(limitInput ? limitInput.value : 500) || 500;

    const discountText = type === 'fixed' ? `₹${val.toLocaleString('en-IN')} OFF` : `${val}% OFF`;

    const newCoupon = {
      id: 'cp_' + Date.now(),
      code: code,
      discount: discountText,
      type: type,
      value: val,
      minOrder: minOrder,
      expiry: expiry,
      usageLimit: usageLimit,
      uses: 0,
      status: 'Active'
    };

    // Remove from deleted tombstones if it was previously deleted
    try {
      let del = JSON.parse(localStorage.getItem('nf_deleted_coupons')) || [];
      del = del.filter(c => c !== code);
      localStorage.setItem('nf_deleted_coupons', JSON.stringify(del));
    } catch(e) {}

    // Check if code already exists
    const existingIdx = this.coupons.findIndex(c => c.code === code);
    if (existingIdx >= 0) {
      this.coupons[existingIdx] = newCoupon;
    } else {
      this.coupons.unshift(newCoupon);
    }

    this.save();

    // Supabase sync
    if (window.GlamCoupons) {
      window.GlamCoupons.upsert({
        id: newCoupon.id,
        code: newCoupon.code,
        type: newCoupon.type,
        value: newCoupon.value,
        minOrder: newCoupon.minOrder,
        usageLimit: newCoupon.usageLimit,
        uses: 0,
        status: 'active'
      }).then(() => console.log('✅ Coupon synced to Supabase Cloud:', newCoupon.code))
        .catch(err => console.warn('Supabase coupon upsert:', err));
    }

    // Broadcast update
    window.dispatchEvent(new CustomEvent('coupons_updated', { detail: { action: 'create', coupon: newCoupon } }));
    try { window.dispatchEvent(new Event('storage')); } catch(e) {}

    window.closeCouponModal();
    this.renderCouponsGrid();
    this.showToast(`Coupon "${code}" successfully created and active on storefront!`);

    // Reset form
    if (document.getElementById('couponForm')) document.getElementById('couponForm').reset();
  }

  // ═══════════ MODALS & TOASTS ═══════════
  initModals() {
    const productModal = document.getElementById('productModal');
    const closeBtn = document.getElementById('closeProductModal');
    const cancelBtn = document.getElementById('cancelProductModal');
    const form = document.getElementById('productForm');
    const imgInput = document.getElementById('prodImage');

    if (closeBtn) closeBtn.addEventListener('click', () => { productModal.classList.remove('show'); productModal.style.setProperty('display', 'none', 'important'); });
    if (cancelBtn) cancelBtn.addEventListener('click', () => { productModal.classList.remove('show'); productModal.style.setProperty('display', 'none', 'important'); });
    if (form) form.addEventListener('submit', (e) => this.saveProduct(e));

    if (imgInput) {
      imgInput.addEventListener('input', (e) => {
        const preview = document.getElementById('productImagePreview');
        if (preview && e.target.value) preview.src = e.target.value;
      });
    }

    // Direct Image Upload with Instant Base64 Preview & Supabase Storage Bucket
    const fileUpload = document.getElementById('prodImageFile');
    const uploadSpinner = document.getElementById('uploadSpinner');
    if (fileUpload) {
      fileUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1. Instant base64 preview & local storage fallback
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          const dataUrl = loadEvt.target.result;
          if (imgInput) imgInput.value = dataUrl;
          const preview = document.getElementById('productImagePreview');
          if (preview) preview.src = dataUrl;
        };
        reader.readAsDataURL(file);

        // 2. Supabase Storage upload if available
        if (uploadSpinner) uploadSpinner.style.display = 'inline-block';
        try {
          if (window.GlamStorage) {
            const publicUrl = await window.GlamStorage.uploadProductImage(file);
            if (publicUrl) {
              if (imgInput) imgInput.value = publicUrl;
              const preview = document.getElementById('productImagePreview');
              if (preview) preview.src = publicUrl;
              this.showToast('Image uploaded directly to Supabase Storage!');
            }
          } else {
            this.showToast('Picture attached locally!');
          }
        } catch (err) {
          console.warn('Storage upload note:', err);
          this.showToast('Picture attached locally (Supabase bucket optional)');
        } finally {
          if (uploadSpinner) uploadSpinner.style.display = 'none';
        }
      });
    }

    if (typeof window.initAdminGalleryFileUpload === 'function') {
      window.initAdminGalleryFileUpload();
    }
  }

  showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="ri-notification-3-fill" style="color:var(--primary-pink); font-size:1.2rem;"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  exportCSV(type) {
    let csv = '';
    if (type === 'products') {
      csv = 'SKU,Name,Category,Price,OriginalPrice,Stock,Status\n';
      this.products.forEach(p => {
        csv += `"${p.id}","${p.name}","${p.category}",${p.price},${p.originalPrice || p.price},${p.stock},"${p.status}"\n`;
      });
    } else {
      csv = 'OrderID,Customer,Email,City,Items,Total,Status,Date\n';
      this.orders.forEach(o => {
        csv += `"${o.id}","${o.customer}","${o.email}","${o.city}","${o.items}",${o.total},"${o.status}","${o.date}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `naira_fashion_${type}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast(`${type.toUpperCase()} exported to CSV.`);
  }
}

// Instantiate on window load
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AdminApp();
});

window.closeAdminInvoiceModal = function() {
  const modal = document.getElementById('adminInvoiceModal');
  if (modal) {
    modal.style.setProperty('display', 'none', 'important');
  }
};
