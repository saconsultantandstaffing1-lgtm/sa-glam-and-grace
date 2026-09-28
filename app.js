
  window.addCardProductToCart = function(prodId, prodObj) {
    const chosenSize = window.cardSelectedSizes[prodId] || (prodObj.sizes && prodObj.sizes.length > 0 ? (prodObj.sizes.includes('M') ? 'M' : prodObj.sizes[0]) : 'M');
    window.addToCart({
      ...prodObj,
      size: chosenSize
    });
  };
  

  window.cardSelectedSizes = {};
  window.selectCardSize = function(prodId, size, btn, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    window.cardSelectedSizes[prodId] = size;
    const card = btn.closest('.product-card') || btn.closest('.fancy-product-card');
    if (card) {
      card.querySelectorAll('.card-size-btn').forEach(b => b.classList.remove('active'));
    }
    btn.classList.add('active');
  };
  

  window.selectedQvSize = 'M';
  window.selectQuickViewSize = function(size, btn) {
    window.selectedQvSize = size;
    const container = document.getElementById('qvSizeSelector');
    if (container) {
      container.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    }
    if (btn) btn.classList.add('active');
  };
  
// Global Customer Auth Triggers
window.openCustomerAuth = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const modal = document.getElementById('customerAuthModal');
  if (modal) {
    modal.style.setProperty('display', 'flex', 'important');
    modal.style.setProperty('opacity', '1', 'important');
    modal.style.setProperty('visibility', 'visible', 'important');
    modal.style.setProperty('pointer-events', 'auto', 'important');
  }
  if (window.refreshCustomerAuthUI) {
    window.refreshCustomerAuthUI();
  }
};

window.closeCustomerAuth = function() {
  const modal = document.getElementById('customerAuthModal');
  if (modal) {
    modal.style.display = 'none';
  }
};
/* 
   SA Glam & Grace - Luxury Ethnic Fashion Interactive JavaScript App
*/

document.addEventListener('DOMContentLoaded', () => {

  // State Management (Elevated to top of DOMContentLoaded to prevent TDZ ReferenceError)
  const state = window.state = {
    cart: (() => {
      try {
        const saved = localStorage.getItem('glam_cart');
        return saved ? JSON.parse(saved) : [
          {
            id: 1,
            title: 'Amber Chanderi Silk Kurti Set',
            price: 3499,
            size: 'M',
            color: 'Yellow',
            image: './assets/images/hero_1.png',
            qty: 1
          }
        ];
      } catch(e) { return []; }
    })(),
    wishlist: (function() {
      try {
        const saved = localStorage.getItem('glam_wishlist');
        window.stateWishlist = saved ? JSON.parse(saved) : [1, 3];
      } catch(e) {
        window.stateWishlist = [1, 3];
      }
      return window.stateWishlist;
    })(),
    currentHeroSlide: 0,
    heroSlides: [
      {
        tag: 'NEW FESTIVE COLLECTION 2026',
        title: 'Your Style.<br><span class="italic-gold">Your Celebration.</span>',
        desc: 'Immerse yourself in handcrafted luxury ethnic wear. Designed with regal silk weaves, authentic zardozi embroidery, and timeless Indian grace.',
        image: './assets/images/hero_1.png',
        badgeTitle: 'Royal Chanderi Silk',
        badgeDesc: 'Hand-woven Kurti Set'
      },
      {
        tag: 'BRIDAL & WEDDING SPECIAL',
        title: 'Regal Elegance.<br><span class="pink-text">Timeless Grace.</span>',
        desc: 'Experience pure opulence with our heritage Zardozi lehengas and wedding silks, inspired by royal Indian architecture and grand traditions.',
        image: './assets/images/hero_2.png',
        badgeTitle: 'Heritage Lehengas',
        badgeDesc: 'Pure Silk & Zardozi'
      }
    ]
  };
  window.glamState = state;


  
  // -------------------------------------------------------------
  // DYNAMIC CATEGORY FILTERING & LIVE STOREFRONT ENGINE
  // -------------------------------------------------------------
  window.currentSelectedCategory = 'all';

  function matchesCategory(prodCategory, targetCategory) {
    if (!targetCategory || targetCategory === 'all') return true;
    if (!prodCategory) return false;
    const p = String(prodCategory).toLowerCase().trim();
    const t = String(targetCategory).toLowerCase().trim();

    if (p === t) return true;
    if (p.includes(t) || t.includes(p)) return true;

    // Rich aliases
    if (t === 'kurtis' && (p.includes('kurti') || p.includes('kurta') || p.includes('chanderi') || p.includes('tunic'))) return true;
    if (t === 'churidar' && (p.includes('churidar') || p.includes('chudidar') || p.includes('salwar'))) return true;
    if (t === 'anarkali' && (p.includes('anarkali') || p.includes('suit'))) return true;
    if (t === 'saree' && (p.includes('saree') || p.includes('sari') || p.includes('handloom'))) return true;
    if (t === 'lehenga' && (p.includes('lehenga') || p.includes('bridal') || p.includes('ghagra'))) return true;
    if (t === 'tops' && (p.includes('top') || p.includes('peplum') || p.includes('shirt'))) return true;
    if (t === 'dupatta' && (p.includes('dupatta') || p.includes('shawl') || p.includes('stole'))) return true;
    if (t === 'jewellery' && (p.includes('jewel') || p.includes('choker') || p.includes('kundan') || p.includes('necklace'))) return true;
    if (t === 'handbags' && (p.includes('handbag') || p.includes('bag') || p.includes('potli') || p.includes('clutch'))) return true;
    if (t === 'footwear' && (p.includes('footwear') || p.includes('jutti') || p.includes('mojari') || p.includes('shoe'))) return true;
    if (t === 'watches' && (p.includes('watch') || p.includes('timepiece'))) return true;

    return false;
  }

  const DEFAULT_INITIAL_CATALOG = [
    {
      id: "NF-100",
      name: "Amber Chanderi Handloom Kurti Set",
      category: "Kurtis",
      sizes: ["S", "M", "L", "XL", "XXL"],
      price: 3499,
      originalPrice: 4999,
      stock: 28,
      status: "in-stock",
      image: "./assets/images/hero_1.png",
      rating: 4.9,
      sales: 185
    },
    {
      id: "NF-101",
      name: "Handcrafted Chikankari Anarkali Set",
      category: "Anarkali",
      sizes: ["S", "M", "L", "XL", "XXL"],
      price: 8499,
      originalPrice: 10999,
      stock: 24,
      status: "in-stock",
      image: "./assets/images/about_anarkali.png",
      rating: 4.9,
      sales: 142
    },
    {
      id: "NF-102",
      name: "Royal Crimson Zari Bridal Lehenga",
      category: "Lehenga",
      sizes: ["S", "M", "L", "XL", "XXL"],
      price: 24999,
      originalPrice: 32000,
      stock: 8,
      status: "low-stock",
      image: "./assets/images/about_lehenga.png",
      rating: 5.0,
      sales: 89
    },
    {
      id: "NF-103",
      name: "Pure Banarasi Katan Silk Saree",
      category: "Saree",
      sizes: ["Free Size"],
      price: 14500,
      originalPrice: 18500,
      stock: 18,
      status: "in-stock",
      image: "./assets/images/about_saree.png",
      rating: 4.8,
      sales: 210
    },
    {
      id: "NF-104",
      name: "Embroidered Georgette Peplum Top & Sharara",
      category: "Tops",
      sizes: ["S", "M", "L", "XL", "XXL"],
      price: 5299,
      originalPrice: 6999,
      stock: 35,
      status: "in-stock",
      image: "./assets/images/about_tops.png",
      rating: 4.7,
      sales: 165
    },
    {
      id: "NF-105",
      name: "Velvet Royal Churidar & Zardozi Kurti",
      category: "Churidar",
      sizes: ["S", "M", "L", "XL", "XXL"],
      price: 7800,
      originalPrice: 9500,
      stock: 15,
      status: "in-stock",
      image: "./assets/images/chudidar.png",
      rating: 4.9,
      sales: 115
    },
    {
      id: "NF-106",
      name: "Heritage Organza Hand-Painted Dupatta",
      category: "Dupatta",
      price: 3499,
      originalPrice: 4200,
      stock: 42,
      status: "in-stock",
      image: "./assets/images/dupatta.png",
      rating: 4.9,
      sales: 310
    },
    {
      id: "NF-107",
      name: "Kundan & Polki Bridal Jewellery Choker Set",
      category: "Jewellery",
      price: 12999,
      originalPrice: 16000,
      stock: 12,
      status: "in-stock",
      image: "./assets/images/jewellery.png",
      rating: 5.0,
      sales: 78
    },
    {
      id: "NF-108",
      name: "Artisan Hand-Embroidered Potli Handbag",
      category: "Handbags",
      price: 2499,
      originalPrice: 3200,
      stock: 50,
      status: "in-stock",
      image: "./assets/images/handbag_modern.png",
      rating: 4.8,
      sales: 190
    }
  ];

  function getAllCatalogProducts() {
    let prods = [];
    try {
      const stored = localStorage.getItem('nf_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        let delIds = [];
        try { delIds = JSON.parse(localStorage.getItem('nf_deleted_products')) || []; } catch(e) {}
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach(p => {
            if (!p.sizes || !Array.isArray(p.sizes) || p.sizes.length === 0) {
              p.sizes = (p.category === 'Saree' || p.category === 'Dupatta' || p.category === 'Accessories')
                ? ['Free Size']
                : ['S', 'M', 'L', 'XL', 'XXL'];
            }
          });
          prods = parsed.filter(p => !delIds.includes(String(p.id)));
        }
      }
    } catch (e) {}

    if (prods.length === 0) {
      prods = DEFAULT_INITIAL_CATALOG;
      try { localStorage.setItem('nf_products', JSON.stringify(prods)); } catch (e) {}
    }
    return prods;
  }

  function renderCategoryGrid(targetCategory = window.currentSelectedCategory) {
    const mainGrid = document.querySelector('.products-grid');
    if (!mainGrid) return;

    const allProducts = getAllCatalogProducts();
    const filtered = allProducts.filter(p => matchesCategory(p.category, targetCategory));

    if (filtered.length === 0) {
      mainGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: #fafafa; border-radius: 18px; border: 1px dashed #d4af37;">
          <i class="ri-t-shirt-line" style="font-size: 3rem; color: #d4af37; display: block; margin-bottom: 0.8rem;"></i>
          <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: #111; margin-bottom: 0.4rem;">No ${targetCategory} items found yet</h3>
          <p style="color: #666; font-size: 0.9rem; max-width: 450px; margin: 0 auto 1.5rem auto;">
            New haute couture is added regularly. Upload in Admin or explore all other luxury collections!
          </p>
          <button onclick="window.clearCategoryFilter()" class="btn-primary" style="padding: 10px 24px; border-radius: 25px; font-weight: 700;">
            View All Collections
          </button>
        </div>
      `;
      return;
    }

    mainGrid.innerHTML = filtered.map((prod, idx) => {
      const id = prod.id || idx + 1;
      const name = prod.name || prod.title || 'Luxury Garment';
      const price = Number(prod.price) || 0;
      const origPrice = Number(prod.originalPrice || prod.original_price || prod.price) || price;
      const image = prod.image || './assets/images/hero_1.png';
      const category = prod.category || 'Luxury Collection';
      const badge = prod.status === 'low-stock' ? 'LOW STOCK' : (prod.status === 'out-of-stock' ? 'SOLD OUT' : (idx === 0 ? 'NEW' : (idx === 1 ? 'BESTSELLER' : 'EXCLUSIVE')));
      const isWishlisted = (window.stateWishlist && (window.stateWishlist.includes(id) || window.stateWishlist.includes(Number(id)))) || (state.wishlist && state.wishlist.includes(id));

      if (typeof WISHLIST_CATALOG !== 'undefined') {
        const exists = WISHLIST_CATALOG.find(w => String(w.id) === String(id));
        if (!exists) {
          WISHLIST_CATALOG.push({ id, title: name, price, originalPrice: origPrice, category, image });
        } else {
          exists.title = name;
          exists.price = price;
          exists.image = image;
        }
      }

      const availSizes = prod.sizes && prod.sizes.length > 0 ? prod.sizes : (prod.category === 'Saree' || prod.category === 'Dupatta' ? ['Free Size'] : ['S', 'M', 'L', 'XL', 'XXL']);
      const defaultSize = availSizes.includes('M') ? 'M' : availSizes[0];
      if (!window.cardSelectedSizes[id]) {
        window.cardSelectedSizes[id] = defaultSize;
      }
      const activeSize = window.cardSelectedSizes[id] || defaultSize;

      const safeProdObj = JSON.stringify({
        id: id,
        title: name,
        price: price,
        image: image,
        sizes: availSizes
      }).replace(/"/g, '&quot;');

      return `
        <div class="product-card" data-id="${id}" data-category="${category}">
          <div class="product-img-wrapper">
            <span class="product-badge">${badge}</span>
            <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${id}', this)">
              <i class="${isWishlisted ? 'ri-heart-fill' : 'ri-heart-line'}"></i>
            </button>
            <img src="${image}" alt="${name}" class="product-img-primary" onerror="this.onerror=null; this.src='./assets/images/hero_1.png';" style="object-fit:cover; width:100%; height:100%;">
            
            <div class="product-hover-actions">
              <button class="btn-quick-add" onclick="window.addCardProductToCart('${id}', ${safeProdObj})">
                Add to Cart
              </button>
              <button class="btn-quick-view" onclick="openQuickView(${safeProdObj})" title="Quick View">
                <i class="ri-eye-line"></i>
              </button>
            </div>
          </div>
          <div class="product-info">
            <span class="product-category-label">${category}</span>
            <h3 class="product-title">${name}</h3>
            
            <!-- Selectable Sizes (S, M, L, XL, XXL) -->
            <div class="product-sizes-selector-row">
              <span style="font-size:0.72rem; font-weight:700; text-transform:uppercase; color:#78716c; letter-spacing:0.5px; margin-right:3px;">Size:</span>
              ${availSizes.map(s => `
                <button type="button" class="card-size-btn ${s === activeSize ? 'active' : ''}" onclick="window.selectCardSize('${id}', '${s}', this, event)">
                  ${s}
                </button>
              `).join('')}
            </div>

            <div class="product-price-row">
              <div class="price-box">
                <span class="current-price">₹${price.toLocaleString('en-IN')}</span>
                ${origPrice > price ? `<span class="original-price">₹${origPrice.toLocaleString('en-IN')}</span>` : ''}
              </div>
              <div class="color-swatches">
                <span class="swatch active" style="background: #F8C146;"></span>
                <span class="swatch" style="background: #F43F7E;"></span>
              </div>
            </div>
          </div>
        </div>
      `;;
    }).join('');
  }

  window.selectCategory = function(catName, event) {
    if (event && event.preventDefault) event.preventDefault();
    window.currentSelectedCategory = catName;

    // Update pill active styles
    const pills = document.querySelectorAll('.cat-pill');
    pills.forEach(p => {
      const match = (catName === 'all' && p.textContent.toLowerCase().includes('all')) ||
                    (catName !== 'all' && p.textContent.toLowerCase().includes(catName.toLowerCase()));
      p.classList.toggle('active', match);
    });

    // Update Banner Header
    const banner = document.getElementById('categoryActiveBanner');
    const crumb = document.getElementById('activeCategoryCrumb');
    const title = document.getElementById('activeCategoryTitle');
    const desc = document.getElementById('activeCategoryDesc');

    if (catName === 'all') {
      if (banner) banner.style.display = 'none';
      if (history.pushState) history.pushState(null, null, '#new-arrivals');
    } else {
      if (banner) banner.style.display = 'block';
      if (crumb) crumb.textContent = catName;
      if (title) title.textContent = `${catName} Collection`;
      if (desc) desc.textContent = `Showing handcrafted luxury ${catName} designed for regal celebrations.`;
      if (history.pushState) history.pushState(null, null, `#category=${encodeURIComponent(catName.toLowerCase())}`);
    }

    renderCategoryGrid(catName);

    // Smooth scroll to showcase
    const showcaseSection = document.getElementById('new-arrivals');
    if (showcaseSection) {
      showcaseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  window.clearCategoryFilter = function() {
    window.selectCategory('all');
  };

  // Initial products render
  renderCategoryGrid('all');

  // Supabase sync
  if (window.GlamProducts) {
    window.GlamProducts.getAll().then(cloudProducts => {
      if (cloudProducts && cloudProducts.length > 0) {
        const mapped = cloudProducts.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: Number(p.price),
          originalPrice: Number(p.original_price || p.price),
          stock: Number(p.stock),
          status: p.status,
          image: p.image,
          rating: Number(p.rating || 5.0),
          sales: Number(p.sales || 0)
        }));
        localStorage.setItem('nf_products', JSON.stringify(mapped));
        renderCategoryGrid(window.currentSelectedCategory);
      }
    }).catch(err => console.warn('Supabase fetch note:', err));
  }

  // Cross-tab and live admin sync
  window.addEventListener('storage', (e) => {
    if (e.key === 'nf_products') {
      renderCategoryGrid(window.currentSelectedCategory);
    }
  });
  
  window.addEventListener('product_deleted', (e) => {
    if (e.detail && e.detail.id) {
      const card = document.querySelector(`.product-card[data-id="${e.detail.id}"]`);
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        card.style.transition = 'all 0.3s ease';
        setTimeout(() => {
          if (typeof renderCategoryGrid === 'function') renderCategoryGrid(window.currentSelectedCategory);
        }, 300);
      } else {
        if (typeof renderCategoryGrid === 'function') renderCategoryGrid(window.currentSelectedCategory);
      }
    }
  });
  window.addEventListener('products_updated', () => {
    renderCategoryGrid(window.currentSelectedCategory);
  });

  // URL Hash Deep Linking
  if (window.location.hash && window.location.hash.includes('category=')) {
    const rawCat = window.location.hash.split('category=')[1];
    if (rawCat) {
      const decoded = decodeURIComponent(rawCat).replace(/[^a-zA-Z]/g, '');
      setTimeout(() => window.selectCategory(decoded), 200);
    }
  }


  // State was moved to top of DOMContentLoaded

  // DOM Elements
  const cartDrawer = document.getElementById('cartDrawer');
  const overlayBackdrop = document.getElementById('overlayBackdrop');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartTriggerBtns = document.querySelectorAll('.cart-trigger');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartBadge = document.getElementById('cartBadge');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  
  const quickviewModal = document.getElementById('quickviewModal');
  const qvCloseBtn = document.getElementById('qvCloseBtn');
  const qvImg = document.getElementById('qvImg');
  const qvTitle = document.getElementById('qvTitle');
  const qvPrice = document.getElementById('qvPrice');

  const wishlistBadge = document.getElementById('wishlistBadge');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  // --- Cart Drawer Logic ---
  
  // ═══════════════════════════════════════════════════════════════════════════
  // LUXURY COUPONS LIVE SYNC & PROMO APPLICATION
  // ═══════════════════════════════════════════════════════════════════════════
  const INITIAL_COUPONS = [
    { code: "WELCOME10", discount: "10% OFF", type: "percentage", value: 10, minOrder: 2999, status: "Active" },
    { code: "ROYALFESTIVE", discount: "₹2,500 OFF", type: "fixed", value: 2500, minOrder: 15000, status: "Active" },
    { code: "BRIDALVIP", discount: "20% OFF", type: "percentage", value: 20, minOrder: 25000, status: "Active" }
  ];

  function getActiveCoupons() {
    let delCoupons = [];
    try { delCoupons = JSON.parse(localStorage.getItem('nf_deleted_coupons')) || []; } catch(e) {}
    let coupons = [];
    try {
      const raw = localStorage.getItem('nf_coupons');
      if (raw) coupons = JSON.parse(raw);
    } catch(e) {}

    // Read custom coupons first so newly created ones are at the front
    let allCoupons = [];
    if (Array.isArray(coupons)) {
      allCoupons = [...coupons];
    }
    INITIAL_COUPONS.forEach(ic => {
      if (!allCoupons.some(c => c.code === ic.code)) {
        allCoupons.push(ic);
      }
    });

    return allCoupons
      .filter(c => !delCoupons.includes(c.code) && (!c.status || c.status === 'Active' || c.status === 'active'))
      .map(c => ({
        ...c,
        minOrder: Number(c.minOrder != null ? c.minOrder : (c.minSpend != null ? c.minSpend : 0)) || 0,
        discount: c.discount || (c.type === 'fixed' ? '₹' + Number(c.value).toLocaleString('en-IN') + ' OFF' : c.value + '% OFF')
      }));
  }
  window.getActiveCoupons = getActiveCoupons;

  function getAppliedPromo() {
    try {
      const raw = localStorage.getItem('glam_applied_promo');
      if (!raw) return null;
      const promo = JSON.parse(raw);
      const activeList = getActiveCoupons();
      const stillActive = activeList.find(c => c.code === promo.code);
      if (!stillActive) {
        localStorage.removeItem('glam_applied_promo');
        return null;
      }
      return stillActive;
    } catch(e) {
      return null;
    }
  }

  window.syncAnnouncementPromo = function syncAnnouncementPromo() {
    const promoEl = document.getElementById('announcementPromoText');
    const activeCoupons = getActiveCoupons();
    if (activeCoupons.length > 0) {
      const top = activeCoupons[0];
      if (promoEl) {
        promoEl.innerHTML = 'Use Code <strong style="color:#FFD700; text-decoration:underline;">' + top.code + '</strong> for ' + top.discount + (top.minOrder ? ' on orders over ₹' + (Number(top.minOrder)).toLocaleString('en-IN') : '');
      }
      const suggestionEl = document.getElementById('cartPromoSuggestion');
      if (suggestionEl) {
        suggestionEl.textContent = 'Try ' + top.code;
        suggestionEl.onclick = () => window.applyCartPromo(top.code);
      }
    } else {
      if (promoEl) {
        promoEl.innerHTML = 'Complimentary Express Luxury Delivery on all Indian Couture!';
      }
      const suggestionEl = document.getElementById('cartPromoSuggestion');
      if (suggestionEl) suggestionEl.textContent = '';
    }
  }

  // Immediately run on startup and wire live cross-tab sync
  try {
    window.syncAnnouncementPromo();
  } catch(e) {
    console.warn('syncAnnouncementPromo run:', e);
  }
  window.addEventListener('storage', () => {
    try { window.syncAnnouncementPromo(); } catch(e) {}
    try { updateCartUI(); } catch(e) {}
  });
  window.addEventListener('coupons_updated', () => {
    try { window.syncAnnouncementPromo(); } catch(e) {}
    try { updateCartUI(); } catch(e) {}
  });

  window.applyCartPromo = function(codeOverride) {
    const input = document.getElementById('cartPromoInput');
    const feedback = document.getElementById('cartPromoFeedback');
    const code = (codeOverride || (input ? input.value : '')).trim().toUpperCase();

    if (!code) {
      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.color = '#ef4444';
        feedback.textContent = 'Please enter a coupon code.';
      }
      return;
    }

    const activeList = getActiveCoupons();
    const found = activeList.find(c => c.code === code);

    if (!found) {
      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.color = '#ef4444';
        feedback.textContent = 'Coupon "' + code + '" is invalid or expired.';
      }
      return;
    }

    localStorage.setItem('glam_applied_promo', JSON.stringify(found));
    updateCartUI();
  };

  window.removeCartPromo = function() {
    localStorage.removeItem('glam_applied_promo');
    updateCartUI();
  };

  function updateCartUI() {
    try {
      localStorage.setItem('glam_cart', JSON.stringify(state.cart));
    } catch(e) {}
    // Count total items
    const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.textContent = totalCount;

    const discountRow = document.getElementById('cartDiscountRow');
    const discountAmountEl = document.getElementById('cartDiscountAmount');
    const discountLabelEl = document.getElementById('cartDiscountLabel');
    const finalTotalRow = document.getElementById('cartFinalTotalRow');
    const finalTotalEl = document.getElementById('cartFinalTotal');
    const promoSection = document.getElementById('cartPromoSection');
    const promoInputGroup = document.getElementById('cartPromoInputGroup');
    const promoFeedback = document.getElementById('cartPromoFeedback');

    // Render items
    if (state.cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: #777;">
          <i class="ri-shopping-bag-line" style="font-size: 3rem; color: #ccc;"></i>
          <p style="margin-top: 1rem; font-size: 1.1rem;">Your shopping bag is empty.</p>
        </div>
      `;
      cartSubtotalEl.textContent = '₹0';
      if (discountRow) discountRow.style.display = 'none';
      if (finalTotalRow) finalTotalRow.style.display = 'none';
      if (promoSection) promoSection.style.display = 'none';
      return;
    }

    if (promoSection) promoSection.style.display = 'block';

    let subtotal = 0;
    cartItemsList.innerHTML = state.cart.map(item => {
      const itemSubtotal = item.price * item.qty;
      subtotal += itemSubtotal;
      return `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.title}">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.title}</h4>
            <div style="margin: 3px 0;">
              <span style="display:inline-block; font-size:0.75rem; font-weight:700; color:#8c733e; background:rgba(212,175,55,0.12); border:1px solid rgba(212,175,55,0.3); padding:2px 7px; border-radius:4px;">
                Size: ${item.size || 'M'}
              </span>
            </div>
            <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
            <div class="qty-btn-group">
              <button type="button" onclick="window.changeCartQty('${item.id}', -1)">-</button>
              <span>${item.qty}</span>
              <button type="button" onclick="window.changeCartQty('${item.id}', 1)">+</button>
            </div>
          </div>
          <button type="button" onclick="window.removeFromCart('${item.id}')" style="color: #999; font-size: 1.2rem; align-self: flex-start;">
            <i class="ri-close-line"></i>
          </button>
        </div>
      `;
    }).join('');

    cartSubtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;

    // Handle Promo Discount
    const appliedPromo = getAppliedPromo();
    if (appliedPromo) {
      const minOrder = Number(appliedPromo.minOrder) || 0;
      if (subtotal < minOrder) {
        if (discountRow) discountRow.style.display = 'none';
        if (finalTotalRow) finalTotalRow.style.display = 'none';
        if (promoFeedback) {
          promoFeedback.style.display = 'block';
          promoFeedback.style.color = '#b45309';
          promoFeedback.textContent = `Add ₹${(minOrder - subtotal).toLocaleString('en-IN')} more to activate ${appliedPromo.code} (${appliedPromo.discount})`;
        }
        if (promoInputGroup) {
          promoInputGroup.innerHTML = `
            <div style="flex:1; display:flex; justify-content:space-between; align-items:center; background:#fff; border:1px dashed #d1d5db; border-radius:5px; padding:0.35rem 0.6rem;">
              <span style="font-size:0.8rem; font-weight:700; color:#374151;">${appliedPromo.code} (Need ₹${minOrder.toLocaleString('en-IN')})</span>
              <button onclick="window.removeCartPromo()" style="background:none; border:none; color:#ef4444; font-size:0.75rem; cursor:pointer;">Remove</button>
            </div>
          `;
        }
      } else {
        let discount = 0;
        if (appliedPromo.type === 'fixed') {
          discount = Math.min(appliedPromo.value, subtotal);
        } else {
          discount = Math.round(subtotal * (appliedPromo.value / 100));
        }

        if (discountRow) {
          discountRow.style.display = 'flex';
          discountLabelEl.textContent = `Discount (${appliedPromo.code})`;
          discountAmountEl.textContent = `-₹${discount.toLocaleString('en-IN')}`;
        }
        if (finalTotalRow) {
          finalTotalRow.style.display = 'flex';
          finalTotalEl.textContent = `₹${(subtotal - discount).toLocaleString('en-IN')}`;
        }
        if (promoFeedback) {
          promoFeedback.style.display = 'block';
          promoFeedback.style.color = '#10b981';
          promoFeedback.textContent = `Voucher applied: You saved ₹${discount.toLocaleString('en-IN')}!`;
        }
        if (promoInputGroup) {
          promoInputGroup.innerHTML = `
            <div style="flex:1; display:flex; justify-content:space-between; align-items:center; background:#ecfdf5; border:1px solid #10b981; border-radius:5px; padding:0.35rem 0.6rem;">
              <span style="font-size:0.8rem; font-weight:700; color:#065f46;"><i class="ri-checkbox-circle-fill" style="color:#10b981;"></i> ${appliedPromo.code} (${appliedPromo.discount})</span>
              <button onclick="window.removeCartPromo()" style="background:none; border:none; color:#ef4444; font-size:0.75rem; font-weight:600; cursor:pointer;">Remove</button>
            </div>
          `;
        }
      }
    } else {
      if (discountRow) discountRow.style.display = 'none';
      if (finalTotalRow) finalTotalRow.style.display = 'none';
      if (promoFeedback) promoFeedback.style.display = 'none';
      if (promoInputGroup) {
        promoInputGroup.innerHTML = `
          <input type="text" id="cartPromoInput" placeholder="ENTER CODE" style="flex:1; padding:0.4rem 0.6rem; border:1px solid #d1d5db; border-radius:5px; font-size:0.8rem; font-family:monospace; font-weight:700; text-transform:uppercase; letter-spacing:1px;" />
          <button id="cartPromoBtn" onclick="window.applyCartPromo && window.applyCartPromo()" style="padding:0.4rem 0.85rem; background:#181412; color:#D4AF37; border:1px solid #D4AF37; border-radius:5px; font-size:0.75rem; font-weight:700; cursor:pointer;">APPLY</button>
        `;
      }
    }
  }

  window.changeCartQty = function(id, delta) {
    if (!state.cart || !Array.isArray(state.cart)) return;
    const item = state.cart.find(i => String(i.id) === String(id));
    if (!item) {
      console.warn('changeCartQty item not found for id:', id);
      return;
    }
    const currentQty = Number(item.qty) || 1;
    const newQty = currentQty + Number(delta);
    if (newQty <= 0) {
      state.cart = state.cart.filter(i => String(i.id) !== String(id));
      if (typeof showToast === 'function') showToast('Item removed from bag');
    } else {
      item.qty = newQty;
    }
    try {
      localStorage.setItem('glam_cart', JSON.stringify(state.cart));
    } catch(e) {}
    updateCartUI();
  };

  window.removeFromCart = function(id) {
    if (!state.cart || !Array.isArray(state.cart)) return;
    state.cart = state.cart.filter(i => String(i.id) !== String(id));
    try {
      localStorage.setItem('glam_cart', JSON.stringify(state.cart));
    } catch(e) {}
    updateCartUI();
    if (typeof showToast === 'function') showToast('Item removed from bag');
  };

  // Actual execution to append item to bag
  window.executeAddToCart = function(product) {
    const chosenSize = product.size || (product.sizes && product.sizes.length > 0 ? (product.sizes.includes('M') ? 'M' : product.sizes[0]) : 'M');
    const cartKey = String(product.id) + '_' + chosenSize;

    const existing = state.cart.find(i => (i.cartKey ? i.cartKey === cartKey : (String(i.id) === String(product.id) && i.size === chosenSize)));
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({
        ...product,
        cartKey: cartKey,
        qty: 1,
        size: chosenSize
      });
    }
    localStorage.setItem('glam_cart', JSON.stringify(state.cart));
    updateCartUI();
    openCart();
    showToast(`Added "${product.title || product.name}" (Size: ${chosenSize}) to bag! 🛍️`);
  };

  // Add to Cart with Mandatory Sign In Guard
  window.addToCart = async function(product) {
    let isLoggedIn = false;
    if (window.GlamAuth) {
      try {
        const u = await window.GlamAuth.getCurrentUser();
        if (u) isLoggedIn = true;
      } catch(e) {}
    }
    if (!isLoggedIn) {
      const savedUser = localStorage.getItem('glam_customer_user');
      if (savedUser) isLoggedIn = true;
    }

    if (!isLoggedIn) {
      window.pendingAddToCartProduct = product;
      const sub = document.getElementById('authModalSubtext');
      if (sub) sub.textContent = `Sign in to add "${product.title || product.name}" to your shopping bag`;
      window.openCustomerAuth();
      return;
    }

    window.executeAddToCart(product);
  };

  function openCart() {
    if (typeof updateCartUI === 'function') updateCartUI();
    if (cartDrawer) {
      cartDrawer.classList.add('active');
      cartDrawer.classList.add('open');
      cartDrawer.style.setProperty('right', '0px', 'important');
    }
    if (overlayBackdrop) {
      overlayBackdrop.classList.add('active');
      overlayBackdrop.style.setProperty('opacity', '1', 'important');
      overlayBackdrop.style.setProperty('visibility', 'visible', 'important');
      overlayBackdrop.style.setProperty('pointer-events', 'auto', 'important');
    }
  }
  window.openCart = openCart;
  window.openCartDrawer = openCart;

  function closeAllOverlays() {
    if (cartDrawer) {
      cartDrawer.classList.remove('active');
      cartDrawer.classList.remove('open');
      cartDrawer.style.removeProperty('right');
    }
    if (quickviewModal) quickviewModal.classList.remove('active');
    if (overlayBackdrop) {
      overlayBackdrop.classList.remove('active');
      overlayBackdrop.style.removeProperty('opacity');
      overlayBackdrop.style.removeProperty('visibility');
      overlayBackdrop.style.removeProperty('pointer-events');
    }
    if (window.closeWishlistDrawer) window.closeWishlistDrawer();
  }
  window.closeAllDrawers = closeAllOverlays;

  cartTriggerBtns.forEach(btn => btn.addEventListener('click', openCart));
  cartCloseBtn.addEventListener('click', closeAllOverlays);
  overlayBackdrop.addEventListener('click', closeAllOverlays);

  // --- Wishlist Synchronization ---
  if (typeof window.updateWishlistUI === 'function') {
    window.updateWishlistUI();
  }

  // --- Quick View Modal Logic ---
  window.openQuickView = (product) => {
    qvImg.src = product.image;
    qvTitle.textContent = product.title;
    qvPrice.textContent = `₹${product.price.toLocaleString('en-IN')}`;
    
    // Store active product for quick add
    quickviewModal.dataset.productId = product.id;
    quickviewModal.dataset.productTitle = product.title;
    quickviewModal.dataset.productPrice = product.price;
    quickviewModal.dataset.productImage = product.image;

    // Populate dynamic size buttons
    const qvSizeSelector = document.getElementById('qvSizeSelector');
    if (qvSizeSelector) {
      const availSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL', 'XXL'];
      window.selectedQvSize = availSizes.includes('M') ? 'M' : availSizes[0];
      qvSizeSelector.innerHTML = availSizes.map(s => `
        <button type="button" class="size-btn ${s === window.selectedQvSize ? 'active' : ''}" onclick="window.selectQuickViewSize('${s}', this)">${s}</button>
      `).join('');
    }

    quickviewModal.classList.add('active');
    overlayBackdrop.classList.add('active');
  };

  if (qvCloseBtn) qvCloseBtn.addEventListener('click', closeAllOverlays);

  // Modal Add to Cart Button
  const qvAddToCartBtn = document.getElementById('qvAddToCartBtn');
  if (qvAddToCartBtn) {
    qvAddToCartBtn.addEventListener('click', () => {
      const id = parseInt(quickviewModal.dataset.productId);
      const title = quickviewModal.dataset.productTitle;
      const price = parseInt(quickviewModal.dataset.productPrice);
      const image = quickviewModal.dataset.productImage;

      addToCart({ id, title, price, image, size: window.selectedQvSize || 'M' });
      closeAllOverlays();
    });
  }

  // --- Hero Slider Logic ---
  const heroImg = document.getElementById('heroImg');
  const heroTag = document.getElementById('heroTag');
  const heroHeading = document.getElementById('heroHeading');
  const heroDesc = document.getElementById('heroDesc');
  const heroDots = document.querySelectorAll('.hero-controls .dot');
  const badgeTitle = document.getElementById('badgeTitle');
  const badgeDesc = document.getElementById('badgeDesc');

  function renderHeroSlide(index) {
    state.currentHeroSlide = index;
    const slide = state.heroSlides[index];

    heroImg.style.opacity = 0;
    setTimeout(() => {
      heroImg.src = slide.image;
      heroTag.innerHTML = `<i class="ri-sparkling-fill"></i> ${slide.tag}`;
      heroHeading.innerHTML = slide.title;
      heroDesc.textContent = slide.desc;
      if (badgeTitle) badgeTitle.textContent = slide.badgeTitle;
      if (badgeDesc) badgeDesc.textContent = slide.badgeDesc;
      heroImg.style.opacity = 1;
    }, 250);

    heroDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  heroDots.forEach((dot, index) => {
    dot.addEventListener('click', () => renderHeroSlide(index));
  });

  const heroPrevBtn = document.getElementById('heroPrevBtn');
  const heroNextBtn = document.getElementById('heroNextBtn');

  if (heroPrevBtn) {
    heroPrevBtn.addEventListener('click', () => {
      const prevIndex = (state.currentHeroSlide - 1 + state.heroSlides.length) % state.heroSlides.length;
      renderHeroSlide(prevIndex);
    });
  }

  if (heroNextBtn) {
    heroNextBtn.addEventListener('click', () => {
      const nextIndex = (state.currentHeroSlide + 1) % state.heroSlides.length;
      renderHeroSlide(nextIndex);
    });
  }

  // Auto rotate hero slides every 7 seconds
  setInterval(() => {
    const nextIndex = (state.currentHeroSlide + 1) % state.heroSlides.length;
    renderHeroSlide(nextIndex);
  }, 7000);

  // --- Newsletter Form Submission ---
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input').value;
      if (email) {
        showToast('Welcome to SA Glam and Grace! Check your inbox for 10% off code.');
        newsletterForm.reset();
      }
    });
  }

  // --- Helper Toast Notification ---
  function showToast(msg) {
    toastMessage.textContent = msg;
    toastNotification.classList.add('active');
    setTimeout(() => {
      toastNotification.classList.remove('active');
    }, 3500);
  }

  // --- Navbar Dropdown Toggle Support ---
  const dropdownNavItems = document.querySelectorAll('.has-mega, .has-dropdown');
  dropdownNavItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const wasActive = item.classList.contains('active-dropdown');
        dropdownNavItems.forEach(other => other.classList.remove('active-dropdown'));
        if (!wasActive) item.classList.add('active-dropdown');
      });
    }

    // Close when clicking internal links
    const internalLinks = item.querySelectorAll('.mega-menu a, .dropdown-menu a');
    internalLinks.forEach(subLink => {
      subLink.addEventListener('click', () => {
        item.classList.remove('active-dropdown');
      });
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.main-nav')) {
      dropdownNavItems.forEach(item => item.classList.remove('active-dropdown'));
    }
  });

  // --- Fancy Dresses Atelier Dataset & State ---
  state.fancyProducts = [
    {
      id: 101,
      title: 'Midnight Sequined Star Gown',
      category: 'sequin',
      categoryName: 'Sequined & Glitter',
      price: 8999,
      origPrice: 12999,
      tag: 'BESTSELLER',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      colors: ['#0B0C10', '#1F2937', '#3B82F6'],
      sizes: ['S', 'M', 'L', 'XL'],
      desc: 'Hand-sewn micro crystal sequins on deep navy velvet fabric with a dramatic flare.'
    },
    {
      id: 102,
      title: 'Emerald Velvet High-Slit Dress',
      category: 'satin-velvet',
      categoryName: 'Satin & Velvet',
      price: 7499,
      origPrice: 10500,
      tag: 'COUTURE',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      colors: ['#064E3B', '#111827'],
      sizes: ['XS', 'S', 'M', 'L'],
      desc: 'Royal emerald green velvet sheath gown with a side cowl slit and corset ribbing.'
    },
    {
      id: 103,
      title: 'Royal Rose Indo-Western Cape Gown',
      category: 'indo-western',
      categoryName: 'Indo-Western Fusion',
      price: 11999,
      origPrice: 16999,
      tag: 'LIMITED EDITION',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
      colors: ['#E11D48', '#D4AF37', '#4C1D95'],
      sizes: ['S', 'M', 'L', 'Custom'],
      desc: 'Fusion floor-length gown featuring an embroidered sheer cape with zardozi borders.'
    },
    {
      id: 104,
      title: 'Champagne Satin Backless Cocktail Dress',
      category: 'cocktail',
      categoryName: 'Cocktail Gowns',
      price: 6499,
      origPrice: 8999,
      tag: 'TRENDING NOW',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      colors: ['#F3E5AB', '#D4AF37', '#9CA3AF'],
      sizes: ['XS', 'S', 'M'],
      desc: 'Fluid champagne silk satin slip dress with criss-cross delicate straps.'
    },
    {
      id: 105,
      title: 'Celestial Glitter Promenade Gown',
      category: 'prom',
      categoryName: 'Prom & Red Carpet',
      price: 9999,
      origPrice: 14500,
      tag: 'RED CARPET',
      image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
      colors: ['#312E81', '#111827', '#E11D48'],
      sizes: ['S', 'M', 'L', 'XL'],
      desc: 'Tiered tulle ballgown adorned with galaxy shimmer dust and sweetheart neckline.'
    },
    {
      id: 106,
      title: 'Ruby Wine Corset Evening Dress',
      category: 'cocktail',
      categoryName: 'Cocktail Gowns',
      price: 8299,
      origPrice: 11999,
      tag: 'EXCLUSIVE',
      image: 'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&w=800&q=80',
      colors: ['#881337', '#000000'],
      sizes: ['S', 'M', 'L'],
      desc: 'Structured boned corset top with draped satin skirt in deep ruby burgundy.'
    },
    {
      id: 107,
      title: 'Silver Starlight Sequin Midi',
      category: 'sequin',
      categoryName: 'Sequined & Glitter',
      price: 5999,
      origPrice: 7999,
      tag: 'PARTY FAV',
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
      colors: ['#E5E7EB', '#9CA3AF'],
      sizes: ['XS', 'S', 'M', 'L'],
      desc: 'Sparkling silver bodycon midi dress with bell sleeves and metallic foil stretch.'
    },
    {
      id: 108,
      title: 'Sapphire Velvet Fusion Anarkali Gown',
      category: 'indo-western',
      categoryName: 'Indo-Western Fusion',
      price: 10499,
      origPrice: 14999,
      tag: 'COUTURE',
      image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
      colors: ['#1E3A8A', '#0F172A'],
      sizes: ['S', 'M', 'L', 'Custom'],
      desc: 'Plunging V-neck velvet Gown with embroidered gold belt and sheer net sleeves.'
    }
  ];

  // --- Portal DOM Elements ---
  const fancyPortalSection = document.getElementById('fancyDressesPortal');
  const fancyNavBtn = document.getElementById('fancyNavBtn');
  const fancyCategoryCard = document.getElementById('fancyCategoryCard');
  const closeFancyPortalBtn = document.getElementById('closeFancyPortalBtn');
  const fancyBottomReturnBtn = document.getElementById('fancyBottomReturnBtn');
  const fancyProductGrid = document.getElementById('fancyProductGrid');
  const fancySearchInput = document.getElementById('fancySearchInput');
  const fancySortSelect = document.getElementById('fancySortSelect');
  const fancyFilterTabs = document.querySelectorAll('.fancy-tab');

  // --- Portal Open / Close Logic ---
  function openFancyPortal() {
    if (!fancyPortalSection) return;
    document.body.classList.add('fancy-portal-active');
    fancyPortalSection.classList.remove('hidden');
    fancyPortalSection.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderFancyProducts();
    showToast('Welcome to SA Couture Atelier — Fancy Dresses!');
  }

  function closeFancyPortal() {
    if (!fancyPortalSection) return;
    document.body.classList.remove('fancy-portal-active');
    fancyPortalSection.classList.add('hidden');
    fancyPortalSection.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (fancyNavBtn) fancyNavBtn.addEventListener('click', (e) => { e.preventDefault(); openFancyPortal(); });
  if (fancyCategoryCard) fancyCategoryCard.addEventListener('click', (e) => { e.preventDefault(); openFancyPortal(); });
  if (closeFancyPortalBtn) closeFancyPortalBtn.addEventListener('click', closeFancyPortal);
  if (fancyBottomReturnBtn) fancyBottomReturnBtn.addEventListener('click', closeFancyPortal);

  // Check URL Hash on load
  if (window.location.hash === '#fancy-dresses') {
    openFancyPortal();
  }

  // Global category filter handler
  window.filterFancyCategory = function(catKey) {
    fancyFilterTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.filter === catKey);
    });
    renderFancyProducts(catKey);
  };

  // --- Render Fancy Products ---
  let currentFancyFilter = 'all';

  function renderFancyProducts(filter = currentFancyFilter, search = '', sort = 'featured') {
    if (!fancyProductGrid) return;
    currentFancyFilter = filter;

    let items = [...state.fancyProducts];

    // Filter
    if (filter !== 'all') {
      items = items.filter(item => item.category === filter);
    }

    // Search
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      items = items.filter(item => item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q));
    }

    // Sort
    if (sort === 'price-low') {
      items.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      items.sort((a, b) => b.price - a.price);
    }

    if (items.length === 0) {
      fancyProductGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: #888;">
          <i class="ri-search-eye-line" style="font-size: 3rem; color: #D4AF37;"></i>
          <h3 style="color: #FFF; margin-top: 1rem;">No fancy dresses matched your search.</h3>
          <p>Try switching categories or searching for 'sequin', 'satin', or 'velvet'.</p>
        </div>
      `;
      return;
    }

    fancyProductGrid.innerHTML = items.map(item => {
      const isWish = state.wishlist.includes(item.id);
      return `
        <div class="fancy-product-card" data-id="${item.id}">
          <div class="fancy-card-img-box">
            <img src="${item.image}" alt="${item.title}">
            <span class="fancy-badge-tag">${item.tag}</span>
            <button class="fancy-wishlist-btn ${isWish ? 'active' : ''}" onclick="toggleFancyWishlist(${item.id}, this)">
              <i class="ri-heart-${isWish ? 'fill' : 'line'}"></i>
            </button>
            <div class="fancy-quickview-hover">
              <button class="fancy-btn-qv" onclick="openFancyQuickview(${item.id})">
                <i class="ri-eye-line"></i> Quick View
              </button>
            </div>
          </div>
          <div class="fancy-card-details">
            <span class="fancy-card-cat">${item.categoryName}</span>
            <h3 class="fancy-card-title">${item.title}</h3>
            <div class="fancy-card-prices">
              <span class="fancy-price-curr">₹${item.price.toLocaleString('en-IN')}</span>
              <span class="fancy-price-orig">₹${item.origPrice.toLocaleString('en-IN')}</span>
            </div>
            <div class="fancy-color-swatches">
              ${item.colors.map(c => `<span class="swatch-dot" style="background: ${c};"></span>`).join('')}
            </div>
            <button class="fancy-btn-add" onclick="addFancyToCart(${item.id})">
              Add to Bag <i class="ri-shopping-bag-line"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- Filter Tabs Click Listener ---
  fancyFilterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      fancyFilterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderFancyProducts(tab.dataset.filter, fancySearchInput ? fancySearchInput.value : '', fancySortSelect ? fancySortSelect.value : 'featured');
    });
  });

  if (fancySearchInput) {
    fancySearchInput.addEventListener('input', (e) => {
      renderFancyProducts(currentFancyFilter, e.target.value, fancySortSelect ? fancySortSelect.value : 'featured');
    });
  }

  if (fancySortSelect) {
    fancySortSelect.addEventListener('change', (e) => {
      renderFancyProducts(currentFancyFilter, fancySearchInput ? fancySearchInput.value : '', e.target.value);
    });
  }

  // --- Helper Cart & Wishlist Functions for Fancy Dresses ---
  window.addFancyToCart = function(id) {
    const item = state.fancyProducts.find(p => p.id === id);
    if (!item) return;

    const existing = state.cart.find(c => c.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({
        id: item.id,
        title: item.title,
        price: item.price,
        size: 'M',
        color: 'Default',
        image: item.image,
        qty: 1
      });
    }

    updateCartUI();
    
    // Sync badge in fancy top bar
    const fancyCartBadges = document.querySelectorAll('.cart-badge-sync');
    const total = state.cart.reduce((s, i) => s + i.qty, 0);
    fancyCartBadges.forEach(b => b.textContent = total);

    showToast(`"${item.title}" added to your bag!`);
  };

  window.toggleFancyWishlist = function(id, btn) {
    if (typeof window.toggleWishlist === 'function') {
      window.toggleWishlist(id, btn);
    }
  };

  window.openFancyQuickview = function(id) {
    const item = state.fancyProducts.find(p => p.id === id);
    if (!item) return;
    qvImg.src = item.image;
    qvTitle.textContent = item.title;
    qvPrice.textContent = `₹${item.price.toLocaleString('en-IN')}`;
    quickviewModal.classList.add('active');
    overlayBackdrop.classList.add('active');
  };

  // --- Style Quiz Logic ---
  const quizSubmitBtn = document.getElementById('quizSubmitBtn');
  const quizOccasionOptions = document.querySelectorAll('#quizOccasionOptions .quiz-opt-btn');
  const quizFabricOptions = document.querySelectorAll('#quizFabricOptions .quiz-opt-btn');
  const quizResultBox = document.getElementById('quizResultBox');
  const quizResultContent = document.getElementById('quizResultContent');

  let selectedOccasion = 'cocktail';
  let selectedFabric = 'sequin';

  quizOccasionOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      quizOccasionOptions.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedOccasion = btn.dataset.val;
    });
  });

  quizFabricOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      quizFabricOptions.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedFabric = btn.dataset.val;
    });
  });

  if (quizSubmitBtn) {
    quizSubmitBtn.addEventListener('click', () => {
      // Find match
      let match = state.fancyProducts.find(p => p.category.includes(selectedFabric) || p.category.includes(selectedOccasion));
      if (!match) match = state.fancyProducts[0];

      quizResultContent.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1.5rem; justify-content: center; flex-wrap: wrap; text-align: left;">
          <img src="${match.image}" style="width: 110px; height: 130px; object-fit: cover; border-radius: 12px; border: 2px solid var(--primary-pink);">
          <div>
            <span style="font-size: 0.75rem; color: var(--primary-pink); font-weight: 700; letter-spacing: 1px;">YOUR STYLIST RECOMMENDATION</span>
            <h4 style="font-family: var(--font-serif); font-size: 1.3rem; color: var(--dark-text); margin: 4px 0;">${match.title}</h4>
            <p style="font-size: 0.85rem; color: var(--secondary-text); margin-bottom: 0.8rem;">${match.desc}</p>
            <button class="fancy-btn-add" style="width: auto; padding: 0.6rem 1.4rem;" onclick="addFancyToCart(${match.id})">
              Shop Recommendation — ₹${match.price.toLocaleString('en-IN')}
            </button>
          </div>
        </div>
      `;
      quizResultBox.classList.remove('hidden');
    });
  }

  // Initialize UI
  updateCartUI();
});

/* ── About Us Image Carousel ── */
let aboutCurrentSlide = 0;
const aboutImages = document.querySelectorAll('.about-carousel-img');
const aboutDots = document.querySelectorAll('.about-dot');

function goToAboutSlide(index) {
  aboutImages[aboutCurrentSlide].classList.remove('active');
  aboutDots[aboutCurrentSlide].classList.remove('active');
  aboutCurrentSlide = index;
  aboutImages[aboutCurrentSlide].classList.add('active');
  aboutDots[aboutCurrentSlide].classList.add('active');
}

function nextAboutSlide() {
  const next = (aboutCurrentSlide + 1) % aboutImages.length;
  goToAboutSlide(next);
}

// Auto-slide every 3 seconds
setInterval(nextAboutSlide, 3000);

// -------------------------------------------------------------
// SUPABASE CUSTOMER AUTH & LIVE CHECKOUT ENGINE
// -------------------------------------------------------------
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initCustomerAuth();
    initSupabaseCheckout();
  });
} else {
  initCustomerAuth();
  initSupabaseCheckout();
}

function initCustomerAuth() {
  const accountBtn = document.getElementById('accountBtn');
  const modal = document.getElementById('customerAuthModal');
  const closeBtn = document.getElementById('closeCustomerAuthBtn');
  const tabSignIn = document.getElementById('tabSignIn');
  const tabSignUp = document.getElementById('tabSignUp');
  const signUpFields = document.getElementById('signUpFields');
  const form = document.getElementById('customerAuthForm');
  const submitBtn = document.getElementById('custSubmitBtn');
  const authMsg = document.getElementById('custAuthMsg');
  const loggedOutView = document.getElementById('authLoggedOutView');
  const loggedInView = document.getElementById('authLoggedInView');
  const signOutBtn = document.getElementById('custSignOutBtn');

  let mode = 'signin'; // 'signin' or 'signup'

  // Update Auth Modal Views
  async function refreshAuthUI() {
    window.refreshCustomerAuthUI = refreshAuthUI;
    if (!window.GlamAuth) return;
    try {
      const user = await window.GlamAuth.getCurrentUser();
      if (user) {
        if (loggedOutView) loggedOutView.style.display = 'none';
        if (loggedInView) loggedInView.style.display = 'block';
        const nameEl = document.getElementById('loggedInUserName');
        const emailEl = document.getElementById('loggedInUserEmail');
        const roleEl = document.getElementById('loggedInUserRole');
        if (nameEl) nameEl.textContent = user.profile?.full_name || user.email.split('@')[0];
        if (emailEl) emailEl.textContent = user.email;
        if (roleEl) roleEl.textContent = user.profile?.role === 'admin' ? 'Store Administrator' : 'Luxury VIP Member';
        
        // Auto-fill checkout fields if empty
        const orderName = document.getElementById('orderCustName');
        const orderEmail = document.getElementById('orderCustEmail');
        const orderPhone = document.getElementById('orderCustPhone');
        if (orderName && !orderName.value) orderName.value = user.profile?.full_name || '';
        if (orderEmail && !orderEmail.value) orderEmail.value = user.email;
        if (orderPhone && !orderPhone.value) orderPhone.value = user.profile?.phone || '';
      } else {
        if (loggedOutView) loggedOutView.style.display = 'block';
        if (loggedInView) loggedInView.style.display = 'none';
      }
    } catch (e) {
      console.warn('Auth UI update:', e);
    }
  }

  const forgotPassBtn = document.getElementById('custForgotPassBtn');
  const forgotPassView = document.getElementById('authForgotPassView');
  const forgotPassForm = document.getElementById('customerForgotPassForm');
  const forgotEmail = document.getElementById('custForgotEmail');
  const newPassword = document.getElementById('custNewPassword');
  const forgotMsg = document.getElementById('custForgotMsg');
  const sendEmailLinkBtn = document.getElementById('custSendEmailLinkBtn');
  const backToSignInBtn = document.getElementById('custBackToSignInBtn');

  function showForgotMsg(msg, type) {
    if (!forgotMsg) return;
    forgotMsg.style.display = 'block';
    if (type === 'error') {
      forgotMsg.style.background = '#fee2e2';
      forgotMsg.style.border = '1px solid #fca5a5';
      forgotMsg.style.color = '#991b1b';
      forgotMsg.innerHTML = `<i class="ri-error-warning-line"></i> ${msg}`;
    } else if (type === 'success') {
      forgotMsg.style.background = '#dcfce7';
      forgotMsg.style.border = '1px solid #86efac';
      forgotMsg.style.color = '#15803d';
      forgotMsg.innerHTML = `<i class="ri-checkbox-circle-fill"></i> ${msg}`;
    } else {
      forgotMsg.style.background = '#fef3c7';
      forgotMsg.style.border = '1px solid #fde68a';
      forgotMsg.style.color = '#92400e';
      forgotMsg.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> ${msg}`;
    }
  }

  // Password visibility eye toggles
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

  // Switch to Forgot Password view
  if (forgotPassBtn) {
    forgotPassBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (loggedOutView) loggedOutView.style.display = 'none';
      if (loggedInView) loggedInView.style.display = 'none';
      if (forgotPassView) {
        forgotPassView.style.display = 'block';
        if (forgotEmail) {
          const currentEmail = document.getElementById('custEmail')?.value?.trim();
          if (currentEmail) forgotEmail.value = currentEmail;
        }
        if (newPassword) newPassword.value = '';
        if (forgotMsg) forgotMsg.style.display = 'none';
      }
    });
  }

  // Switch back to Sign In view
  if (backToSignInBtn) {
    backToSignInBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (forgotPassView) forgotPassView.style.display = 'none';
      if (loggedOutView) loggedOutView.style.display = 'block';
      if (authMsg) authMsg.style.display = 'none';
    });
  }

  // Submit Password Reset & Update Form
  if (forgotPassForm) {
    forgotPassForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (forgotEmail?.value || '').trim();
      const newPass = (newPassword?.value || '').trim();

      if (!email) {
        showForgotMsg('Please enter your registered email address.', 'error');
        return;
      }

      if (newPass && newPass.length < 6) {
        showForgotMsg('New password must be at least 6 characters long.', 'error');
        return;
      }

      showForgotMsg('Processing password recovery...', 'loading');

      try {
        if (newPass) {
          localStorage.setItem('glam_customer_pass_' + email.toLowerCase(), newPass);
          if (window.GlamAuth) {
            try {
              await window.GlamAuth.updatePassword(newPass);
            } catch(upErr) {
              console.warn('Supabase update fallback:', upErr.message);
            }
          }
          showForgotMsg('Password updated successfully! Returning to sign in...', 'success');
          const emailInput = document.getElementById('custEmail');
          const passInput = document.getElementById('custPassword');
          if (emailInput) emailInput.value = email;
          if (passInput) passInput.value = newPass;

          setTimeout(() => {
            if (forgotPassView) forgotPassView.style.display = 'none';
            if (loggedOutView) loggedOutView.style.display = 'block';
            if (authMsg) {
              authMsg.style.display = 'block';
              authMsg.style.background = '#dcfce7';
              authMsg.style.color = '#15803d';
              authMsg.textContent = 'Password reset complete! Please click Sign In.';
            }
          }, 1200);
        } else {
          if (window.GlamAuth) {
            await window.GlamAuth.resetPasswordForEmail(email);
          }
          showForgotMsg(`Recovery link sent to ${email}! Please check your email inbox to reset your password.`, 'success');
        }
      } catch(err) {
        if (newPass) {
          localStorage.setItem('glam_customer_pass_' + email.toLowerCase(), newPass);
          showForgotMsg('Password updated successfully! Returning to sign in...', 'success');
          setTimeout(() => {
            if (forgotPassView) forgotPassView.style.display = 'none';
            if (loggedOutView) loggedOutView.style.display = 'block';
          }, 1200);
        } else {
          showForgotMsg(err.message || 'Error processing reset request. Please check email address.', 'error');
        }
      }
    });
  }

  // Send Recovery Email Link Button
  if (sendEmailLinkBtn) {
    sendEmailLinkBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = (forgotEmail?.value || '').trim();
      if (!email) {
        showForgotMsg('Please enter your registered email address first.', 'error');
        return;
      }
      showForgotMsg(`Sending recovery email to ${email}...`, 'loading');
      try {
        if (window.GlamAuth) {
          await window.GlamAuth.resetPasswordForEmail(email);
        }
        showForgotMsg(`Password reset instructions sent to ${email}. Please check your inbox or spam folder.`, 'success');
      } catch(err) {
        showForgotMsg(`Recovery link simulated for ${email}. You can also enter a new password above to reset instantly.`, 'success');
      }
    });
  }

  // Handle Supabase password recovery hash on page load
  if (window.location.hash && (window.location.hash.includes('type=recovery') || window.location.hash.includes('access_token'))) {
    if (window.openCustomerAuth) window.openCustomerAuth();
    if (loggedOutView) loggedOutView.style.display = 'none';
    if (forgotPassView) {
      forgotPassView.style.display = 'block';
      showForgotMsg('Recovery session active! Please enter your new password below.', 'success');
    }
  }

  if (accountBtn && modal) {
    accountBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.style.display = 'flex';
      refreshAuthUI();
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  if (tabSignIn && tabSignUp) {
    tabSignIn.addEventListener('click', () => {
      mode = 'signin';
      tabSignIn.style.color = '#b45309';
      tabSignIn.style.borderBottom = '2px solid #b45309';
      tabSignUp.style.color = '#6b7280';
      tabSignUp.style.borderBottom = '2px solid transparent';
      if (signUpFields) signUpFields.style.display = 'none';
      if (submitBtn) submitBtn.textContent = 'Sign In to Account';
      if (authMsg) authMsg.style.display = 'none';
    });

    tabSignUp.addEventListener('click', () => {
      mode = 'signup';
      tabSignUp.style.color = '#b45309';
      tabSignUp.style.borderBottom = '2px solid #b45309';
      tabSignIn.style.color = '#6b7280';
      tabSignIn.style.borderBottom = '2px solid transparent';
      if (signUpFields) signUpFields.style.display = 'block';
      if (submitBtn) submitBtn.textContent = 'Register Luxury Account';
      if (authMsg) authMsg.style.display = 'none';
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('custEmail').value.trim();
      const password = document.getElementById('custPassword').value;
      const fullName = document.getElementById('custFullName')?.value?.trim() || '';
      const phone = document.getElementById('custPhone')?.value?.trim() || '';

      if (authMsg) {
        authMsg.style.display = 'block';
        authMsg.style.background = '#fef3c7';
        authMsg.style.color = '#92400e';
        authMsg.textContent = 'Authenticating with Supabase...';
      }

      try {
        if (!window.GlamAuth) throw new Error('Supabase client not loaded');
        if (mode === 'signup') {
          await window.GlamAuth.signUp(email, password, fullName, phone, 'customer');
          localStorage.setItem('glam_customer_user', JSON.stringify({ email, fullName }));
          localStorage.setItem('glam_customer_pass_' + email.toLowerCase(), password);
          authMsg.style.background = '#dcfce7';
          authMsg.style.color = '#15803d';
          authMsg.textContent = 'Account created successfully! You are now logged in.';
        } else {
          const savedPass = localStorage.getItem('glam_customer_pass_' + email.toLowerCase());
          let authPassed = false;
          try {
            await window.GlamAuth.signIn(email, password);
            authPassed = true;
          } catch(authErr) {
            // Only allow if password matches the user's previously set/updated password
            if (savedPass && savedPass === password) {
              authPassed = true;
            } else {
              throw new Error('Incorrect password or email. Please verify your credentials or use Forgot Password.');
            }
          }

          if (!authPassed) {
            throw new Error('Incorrect password or email. Please verify your credentials or use Forgot Password.');
          }

          localStorage.setItem('glam_customer_user', JSON.stringify({ email }));
          authMsg.style.background = '#dcfce7';
          authMsg.style.color = '#15803d';
          authMsg.textContent = 'Welcome back! Signed in successfully.';
        }
        setTimeout(() => {
          refreshAuthUI();
          if (window.pendingAddToCartProduct) {
            const p = window.pendingAddToCartProduct;
            window.pendingAddToCartProduct = null;
            window.closeCustomerAuth();
            window.executeAddToCart(p);
          } else {
            window.closeCustomerAuth();
          }
        }, 400);
      } catch (err) {
        if (authMsg) {
          authMsg.style.display = 'block';
          authMsg.style.background = '#fee2e2';
          authMsg.style.border = '1px solid #fca5a5';
          authMsg.style.color = '#991b1b';
          authMsg.innerHTML = `<i class="ri-error-warning-line"></i> ${err.message || 'Incorrect password or email. Please verify your credentials or use Forgot Password.'}`;
        }
      }
    });
  }

  
  const quickVipBtn = document.getElementById('quickVipSignInBtn');
  if (quickVipBtn) {
    quickVipBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.setItem('glam_customer_user', JSON.stringify({
        email: 'vip.member@saglam.com',
        fullName: 'VIP Royalty Member'
      }));
      if (typeof refreshAuthUI === 'function') refreshAuthUI();
      window.closeCustomerAuth();
      if (window.pendingAddToCartProduct) {
        const prod = window.pendingAddToCartProduct;
        window.pendingAddToCartProduct = null;
        window.executeAddToCart(prod);
      } else {
        openCart();
      }
    });
  }

  if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
      if (window.GlamAuth) {
        await window.GlamAuth.signOut();
        localStorage.removeItem('glam_customer_user');
        refreshAuthUI();
      }
    });
  }

  refreshAuthUI();
}


window.openCheckoutModal = function(e) {
  if (e && e.preventDefault) e.preventDefault();

  // 1. Check if shopping bag has items
  const cart = window.state ? window.state.cart : (JSON.parse(localStorage.getItem('glam_cart') || '[]'));
  if (!cart || cart.length === 0) {
    if (typeof showToast === 'function') showToast('Your shopping bag is empty. Please select a luxury garment first.');
    else alert('Your shopping bag is empty. Please select a luxury garment first.');
    return;
  }

  // 2. Close shopping bag drawer
  const cartDrawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('overlayBackdrop');
  if (cartDrawer) {
    cartDrawer.classList.remove('open', 'active');
    cartDrawer.style.setProperty('transform', 'translateX(100%)', 'important');
  }
  if (backdrop) {
    backdrop.classList.remove('show', 'active');
    backdrop.style.display = 'none';
  }

  // 3. Calculate final payable total
  const finalTotalEl = document.getElementById('cartFinalTotal');
  const subtotalEl = document.getElementById('cartSubtotal');
  const totalDisplay = document.getElementById('checkoutTotalDisplay');

  let payableText = '₹0';
  if (finalTotalEl && finalTotalEl.offsetParent !== null && finalTotalEl.textContent) {
    payableText = finalTotalEl.textContent;
  } else if (subtotalEl && subtotalEl.textContent) {
    payableText = subtotalEl.textContent;
  }
  if (totalDisplay) totalDisplay.textContent = payableText;

  // 4. Pre-fill customer details if logged in
  try {
    const cust = JSON.parse(localStorage.getItem('glam_customer_user') || 'null');
    if (cust) {
      if (document.getElementById('orderCustName') && cust.name) document.getElementById('orderCustName').value = cust.name;
      if (document.getElementById('orderCustEmail') && cust.email) document.getElementById('orderCustEmail').value = cust.email;
      if (document.getElementById('orderCustPhone') && cust.phone) document.getElementById('orderCustPhone').value = cust.phone;
    }
  } catch(e) {}

  // 5. Reset to Form View (hide success view)
  const formView = document.getElementById('checkoutFormView');
  const successView = document.getElementById('checkoutSuccessView');
  if (formView) formView.style.display = 'block';
  if (successView) successView.style.display = 'none';

  // 6. Reveal the Big Modal directly
  const modal = document.getElementById('checkoutOrderModal');
  if (modal) {
    modal.style.setProperty('display', 'flex', 'important');
    modal.style.setProperty('opacity', '1', 'important');
    modal.style.setProperty('visibility', 'visible', 'important');
  }
};

window.closeCheckoutModal = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const modal = document.getElementById('checkoutOrderModal');
  if (modal) {
    modal.style.setProperty('display', 'none', 'important');
  }
};

function initSupabaseCheckout() {
  const checkoutModal = document.getElementById('checkoutOrderModal');
  const checkoutForm = document.getElementById('checkoutOrderForm');

  if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) window.closeCheckoutModal();
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('orderCustName').value.trim();
      const email = document.getElementById('orderCustEmail').value.trim();
      const phone = document.getElementById('orderCustPhone').value.trim();
      const address = document.getElementById('orderCustAddress').value.trim();
      const paymentInput = document.querySelector('input[name="orderPayment"]:checked');
      const paymentMethod = paymentInput ? paymentInput.value : 'UPI / Card';

      const totalDisplay = document.getElementById('checkoutTotalDisplay');
      const totalText = totalDisplay ? totalDisplay.textContent : '₹3,499';
      const cleanTotal = Number(totalText.replace(/[^0-9]/g, '')) || 3499;

      const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);

      const submitBtn = document.getElementById('confirmOrderBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Processing Order...';
      }

      // 1. Build order item summary
      const cartItems = (window.state && window.state.cart) ? window.state.cart : (JSON.parse(localStorage.getItem('glam_cart') || '[]'));
      const itemsDesc = cartItems.map(i => `${i.title || i.name} (Size: ${i.size || 'M'}) (x${i.qty || 1})`).join(', ') || 'Luxury Ethnic Couture';

      // 2. Save order to Admin Portal orders in localStorage
      try {
        let adminOrders = JSON.parse(localStorage.getItem('nf_orders') || '[]');
        adminOrders.unshift({
          id: orderId,
          customer: name,
          email: email,
          phone: phone,
          city: address.split(',').pop().trim() || 'India',
          address: address,
          items: itemsDesc,
          total: cleanTotal,
          paymentMethod: paymentMethod,
          paymentStatus: 'Paid',
          status: 'Processing',
          date: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
        });
        localStorage.setItem('nf_orders', JSON.stringify(adminOrders));
      } catch(err) {
        console.warn('Admin local orders save:', err);
      }

      // 3. Save to Supabase Cloud
      if (window.GlamOrders) {
        try {
          await window.GlamOrders.create({
            id: orderId,
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            shipping_address: address,
            total: cleanTotal,
            payment_method: paymentMethod,
            payment_status: 'Paid',
            status: 'Processing',
            items_summary: itemsDesc
          });
        } catch(err) {
          console.warn('Supabase cloud order create notice:', err);
        }
      }

      // 4. Save Customer profile
      if (window.GlamCustomers) {
        try {
          await window.GlamCustomers.upsert({
            id: "CUST-" + Math.floor(100 + Math.random() * 900),
            name: name,
            email: email,
            phone: phone,
            orders_count: 1,
            total_spend: cleanTotal,
            status: 'Active'
          });
        } catch(e) {}
      }

      // 5. Empty Shopping Bag & Clear Applied Promo
      if (window.state) window.state.cart = [];
      localStorage.setItem('glam_cart', JSON.stringify([]));
      localStorage.removeItem('glam_applied_promo');
      if (typeof updateCartUI === 'function') updateCartUI();

      // 6. Transition to "Order Received!" Confirmation Screen
      const formView = document.getElementById('checkoutFormView');
      const successView = document.getElementById('checkoutSuccessView');
      const sOrderId = document.getElementById('successOrderId');
      const sOrderCust = document.getElementById('successOrderCust');
      const sOrderAddress = document.getElementById('successOrderAddress');
      const sOrderPayment = document.getElementById('successOrderPayment');
      const sOrderTotal = document.getElementById('successOrderTotal');

      if (sOrderId) sOrderId.textContent = orderId;
      if (sOrderCust) sOrderCust.textContent = name;
      if (sOrderAddress) sOrderAddress.textContent = address;
      if (sOrderPayment) sOrderPayment.textContent = paymentMethod;
      if (sOrderTotal) sOrderTotal.textContent = totalText;

      const trackBtn = document.getElementById('trackInDashboardBtn');
      if (trackBtn) {
        trackBtn.href = 'dashboard.html?orderId=' + encodeURIComponent(orderId) + '&email=' + encodeURIComponent(email);
      }

      // Notify any active user dashboard tabs of newly placed order
      window.dispatchEvent(new CustomEvent('orders_updated', { detail: { orderId, email, customer: name } }));

      if (formView) formView.style.display = 'none';
      if (successView) successView.style.display = 'block';

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="ri-check-double-line"></i> Place Luxury Order';
      }
    });
  }
}

// -------------------------------------------------------------
// COMPREHENSIVE LUXURY WISHLIST ENGINE & DRAWER LOGIC
// -------------------------------------------------------------
const WISHLIST_CATALOG = [
  { id: 1, title: 'Amber Chanderi Silk Kurti Set', price: 3499, originalPrice: 4999, category: 'Kurti Set', image: './assets/images/hero_1.png' },
  { id: 2, title: 'Gulabi Magenta Handloom Suit', price: 4899, originalPrice: 6200, category: 'Anarkali Suit', image: './assets/images/festive.png' },
  { id: 3, title: 'Mint Blossom Organza Anarkali', price: 5999, originalPrice: 7500, category: 'Wedding Wear', image: './assets/images/wedding.png' },
  { id: 4, title: 'Rose Zardozi Heritage Lehenga', price: 12999, originalPrice: 16000, category: 'Bridal Lehenga', image: './assets/images/hero_2.png' },
  { id: 5, title: 'Kashmiri Floral Embroidered Set', price: 4299, originalPrice: 5499, category: 'Chudidar Set', image: './assets/images/hero_1.png' },
  { id: 6, title: 'Banarasi Silk Brocade Dupatta Set', price: 6499, originalPrice: 8000, category: 'Silk Ensemble', image: './assets/images/festive.png' },
  { id: 101, title: 'Nocturne Velvet Evening Gown', price: 16999, originalPrice: 22000, category: 'Velvet Gown', image: './assets/images/hero_2.png' },
  { id: 102, title: 'Crimson Mughal Rose Lehenga', price: 34999, originalPrice: 45000, category: 'Bridal Lehenga', image: './assets/images/festive.png' },
  { id: 103, title: 'Champagne Gold Zari Saree', price: 21500, originalPrice: 28000, category: 'Heritage Saree', image: './assets/images/hero_1.png' },
  { id: 104, title: 'Emerald Silk Sharara Ensemble', price: 14800, originalPrice: 19500, category: 'Sharara Set', image: './assets/images/wedding.png' }
];

// Initialize global wishlist
(function initWishlist() {
  try {
    const saved = localStorage.getItem('glam_wishlist');
    window.stateWishlist = saved ? JSON.parse(saved) : [1, 3];
  } catch (e) {
    window.stateWishlist = [1, 3];
  }
  if (window.glamState) {
    window.glamState.wishlist = window.stateWishlist;
  }
})();

function getProductForWishlist(id) {
  const sId = String(id).trim();
  // 1. Check WISHLIST_CATALOG
  let found = WISHLIST_CATALOG.find(p => String(p.id) === sId);
  if (found) return found;

  // 2. Check fancy products in state
  if (window.glamState && Array.isArray(window.glamState.fancyProducts)) {
    found = window.glamState.fancyProducts.find(p => String(p.id) === sId);
    if (found) {
      return {
        id: found.id,
        title: found.title,
        price: found.price,
        originalPrice: found.origPrice || found.price,
        category: found.categoryName || 'Party Wear',
        image: found.image
      };
    }
  }

  // 3. Check localStorage nf_products
  try {
    const raw = localStorage.getItem('nf_products');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        found = parsed.find(p => String(p.id) === sId);
        if (found) {
          return {
            id: found.id,
            title: found.name || found.title || 'Luxury Garment',
            price: Number(found.price) || 0,
            originalPrice: Number(found.originalPrice || found.price) || 0,
            category: found.category || 'Luxury Collection',
            image: found.image || './assets/images/hero_1.png'
          };
        }
      }
    }
  } catch(e) {}

  // 4. Check DOM for matching card
  const domCard = document.querySelector(`.product-card[data-id="${id}"], .product-card[data-id="${sId}"]`);
  if (domCard) {
    const titleEl = domCard.querySelector('.product-title');
    const priceEl = domCard.querySelector('.current-price');
    const imgEl = domCard.querySelector('.product-img-primary') || domCard.querySelector('img');
    const catEl = domCard.querySelector('.product-category-label');
    const priceNum = priceEl ? parseInt(priceEl.textContent.replace(/[^\d]/g, ''), 10) : 4999;
    return {
      id: id,
      title: titleEl ? titleEl.textContent.trim() : ('Luxury Garment #' + id),
      price: priceNum || 4999,
      originalPrice: priceNum ? Math.round(priceNum * 1.25) : 5999,
      category: catEl ? catEl.textContent.trim() : 'Luxury Collection',
      image: imgEl ? imgEl.getAttribute('src') : './assets/images/hero_1.png'
    };
  }

  // 5. Default Fallback
  return {
    id: id,
    title: 'Luxury Ethnic Wear #' + id,
    price: 4999,
    originalPrice: 6200,
    category: 'Ethnic Wear',
    image: './assets/images/hero_1.png'
  };
}

function saveWishlist() {
  try {
    localStorage.setItem('glam_wishlist', JSON.stringify(window.stateWishlist));
  } catch (e) {
    console.warn('Could not save wishlist to localStorage:', e);
  }
  if (window.glamState) {
    window.glamState.wishlist = window.stateWishlist;
  }
  updateWishlistUI();
}

function updateWishlistBadges() {
  const count = Array.isArray(window.stateWishlist) ? window.stateWishlist.length : 0;
  const badges = document.querySelectorAll('#wishlistBadge, .wishlist-badge-count, span#wishlistBadge');
  badges.forEach(b => {
    if (b) b.textContent = count;
  });
}

window.updateWishlistUI = function() {
  updateWishlistBadges();

  if (!Array.isArray(window.stateWishlist)) {
    window.stateWishlist = [];
  }

  // Synchronize all wishlist heart buttons across the page
  const allBtns = document.querySelectorAll('.wishlist-btn, .fancy-wishlist-btn');
  allBtns.forEach(btn => {
    let btnId = btn.dataset.productId || btn.dataset.id;
    if (!btnId) {
      const parentCard = btn.closest('.product-card');
      if (parentCard && parentCard.dataset.id) {
        btnId = parentCard.dataset.id;
      }
    }
    if (!btnId) {
      const onclickAttr = btn.getAttribute('onclick') || '';
      const match = onclickAttr.match(/toggle(?:Fancy|Category)?Wishlist\s*\(\s*['"]?([^,'"\)]+)['"]?/);
      if (match) {
        btnId = match[1];
      }
    }

    if (btnId !== undefined && btnId !== null) {
      const isSaved = window.stateWishlist.some(item => String(item) === String(btnId));
      if (isSaved) {
        btn.classList.add('active');
        const icon = btn.querySelector('i');
        if (icon) icon.className = 'ri-heart-fill';
      } else {
        btn.classList.remove('active');
        const icon = btn.querySelector('i');
        if (icon) icon.className = 'ri-heart-line';
      }
    }
  });
};

window.renderWishlistUI = function() {
  const listEl = document.getElementById('wishlistItemsList');
  if (!listEl) return;

  if (!Array.isArray(window.stateWishlist) || window.stateWishlist.length === 0) {
    listEl.innerHTML = `
      <div style="text-align:center; padding:3.5rem 1rem; color:#777;">
        <i class="ri-heart-line" style="font-size:3.5rem; color:#d1d5db; display:block; margin-bottom:1rem;"></i>
        <h4 style="font-family:var(--font-serif, 'Cinzel', serif); font-size:1.35rem; margin:0 0 0.5rem; color:#181412;">Your Wishlist is Empty</h4>
        <p style="font-size:0.85rem; color:#6b7280; max-width:260px; margin:0 auto 1.5rem; line-height:1.5;">Explore our luxury collections and tap the heart icon on any outfit to save your favorites.</p>
        <a href="#new-arrivals" onclick="window.closeWishlistDrawer()" class="btn-primary" style="display:inline-flex; padding:0.65rem 1.4rem; font-size:0.85rem; justify-content:center; text-decoration:none;">Discover Collections</a>
      </div>`;
    const moveAllBtn = document.getElementById('addAllWishlistToCartBtn');
    if (moveAllBtn) moveAllBtn.style.display = 'none';
    return;
  }

  const moveAllBtn = document.getElementById('addAllWishlistToCartBtn');
  if (moveAllBtn) moveAllBtn.style.display = 'flex';

  listEl.innerHTML = window.stateWishlist.map(id => {
    const item = getProductForWishlist(id);
    return `
      <div class="cart-item" style="display:flex; gap:1rem; align-items:center; padding:1rem 0; border-bottom:1px solid #f3f4f6;">
        <img src="${item.image}" alt="${item.title}" style="width:72px; height:90px; object-fit:cover; border-radius:8px; border:1px solid #eee; flex-shrink:0;" onerror="this.onerror=null; this.src='./assets/images/hero_1.png';">
        <div style="flex:1; min-width:0;">
          <span style="font-size:0.75rem; text-transform:uppercase; color:var(--primary-pink, #b45309); font-weight:700; letter-spacing:0.5px; display:block;">${item.category || 'Luxury Couture'}</span>
          <h4 style="font-size:0.92rem; font-weight:600; color:var(--dark-text, #111); margin:2px 0 6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.title}</h4>
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:8px;">
            <strong style="color:#b45309; font-size:1rem;">₹${Number(item.price).toLocaleString('en-IN')}</strong>
            ${item.originalPrice ? `<span style="text-decoration:line-through; font-size:0.8rem; color:#9ca3af;">₹${Number(item.originalPrice).toLocaleString('en-IN')}</span>` : ''}
          </div>
          <button onclick="window.moveWishlistItemToCart('${item.id}')" style="background:#b45309; color:#fff; border:none; padding:6px 14px; border-radius:6px; font-size:0.75rem; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:4px; transition:all 0.2s;">
            <i class="ri-shopping-bag-line"></i> Move to Bag
          </button>
        </div>
        <button onclick="window.removeWishlistItem('${item.id}')" style="background:none; border:none; color:#9ca3af; cursor:pointer; font-size:1.25rem; padding:6px; transition:color 0.2s;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#9ca3af'" title="Remove from Wishlist">
          <i class="ri-delete-bin-line"></i>
        </button>
      </div>`;
  }).join('');
};

window.openWishlistDrawer = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  
  // Close other open drawers / modals first
  const cartDrawer = document.getElementById('cartDrawer');
  if (cartDrawer) {
    cartDrawer.classList.remove('active', 'open');
    cartDrawer.style.removeProperty('right');
  }
  const qv = document.getElementById('quickviewModal');
  if (qv) qv.classList.remove('active');

  const drawer = document.getElementById('wishlistDrawer');
  const backdrop = document.getElementById('overlayBackdrop');

  if (drawer) {
    drawer.classList.add('active', 'open');
    drawer.style.setProperty('transform', 'translateX(0)', 'important');
    drawer.style.setProperty('right', '0', 'important');
  }
  if (backdrop) {
    backdrop.classList.add('active');
    backdrop.style.setProperty('opacity', '1', 'important');
    backdrop.style.setProperty('visibility', 'visible', 'important');
    backdrop.style.setProperty('pointer-events', 'auto', 'important');
  }

  window.renderWishlistUI();
};

window.closeWishlistDrawer = function() {
  const drawer = document.getElementById('wishlistDrawer');
  const backdrop = document.getElementById('overlayBackdrop');
  if (drawer) {
    drawer.classList.remove('active', 'open');
    drawer.style.removeProperty('transform');
    drawer.style.removeProperty('right');
  }
  
  // Only remove backdrop if cartDrawer is not open
  const cartDrawer = document.getElementById('cartDrawer');
  const isCartOpen = cartDrawer && (cartDrawer.classList.contains('active') || cartDrawer.classList.contains('open'));
  if (backdrop && !isCartOpen) {
    backdrop.classList.remove('active');
    backdrop.style.removeProperty('opacity');
    backdrop.style.removeProperty('visibility');
    backdrop.style.removeProperty('pointer-events');
  }
};

window.toggleWishlist = function(id, btn) {
  if (id === undefined || id === null) return;
  const sId = String(id);
  const idx = window.stateWishlist.findIndex(item => String(item) === sId);

  if (idx > -1) {
    window.stateWishlist.splice(idx, 1);
    if (typeof showToast === 'function') showToast('Removed from Wishlist');
  } else {
    const cleanId = !isNaN(Number(id)) && String(id).trim() !== '' ? Number(id) : id;
    window.stateWishlist.push(cleanId);
    if (typeof showToast === 'function') showToast('Saved to Wishlist! ❤️');
  }

  saveWishlist();

  // If drawer is currently visible, update it immediately
  const drawer = document.getElementById('wishlistDrawer');
  if (drawer && (drawer.classList.contains('open') || drawer.classList.contains('active'))) {
    window.renderWishlistUI();
  }
};

window.toggleCategoryWishlist = function(id, btn) {
  window.toggleWishlist(id, btn);
};

window.toggleFancyWishlist = function(id, btn) {
  window.toggleWishlist(id, btn);
};

window.removeWishlistItem = function(id) {
  const sId = String(id);
  const idx = window.stateWishlist.findIndex(item => String(item) === sId);
  if (idx > -1) {
    window.stateWishlist.splice(idx, 1);
    saveWishlist();
    window.renderWishlistUI();
    if (typeof showToast === 'function') showToast('Removed from Wishlist');
  }
};

window.moveWishlistItemToCart = function(id) {
  const item = getProductForWishlist(id);
  const cartProduct = {
    id: item.id,
    title: item.title,
    price: Number(item.price) || 0,
    image: item.image || './assets/images/hero_1.png'
  };

  if (typeof window.executeAddToCart === 'function') {
    window.executeAddToCart(cartProduct);
  } else if (typeof window.addToCart === 'function') {
    window.addToCart(cartProduct);
  }

  // Remove from wishlist
  const sId = String(id);
  const idx = window.stateWishlist.findIndex(item => String(item) === sId);
  if (idx > -1) {
    window.stateWishlist.splice(idx, 1);
    saveWishlist();
    window.renderWishlistUI();
  }
  if (typeof showToast === 'function') showToast(`Added "${item.title}" to Shopping Bag! 🛍️`);
};

window.moveAllWishlistToCart = function() {
  if (!Array.isArray(window.stateWishlist) || window.stateWishlist.length === 0) return;
  const ids = [...window.stateWishlist];
  ids.forEach(id => {
    const item = getProductForWishlist(id);
    const cartProduct = {
      id: item.id,
      title: item.title,
      price: Number(item.price) || 0,
      image: item.image || './assets/images/hero_1.png'
    };
    if (typeof window.executeAddToCart === 'function') {
      window.executeAddToCart(cartProduct);
    } else if (typeof window.addToCart === 'function') {
      window.addToCart(cartProduct);
    }
  });

  window.stateWishlist = [];
  saveWishlist();
  window.renderWishlistUI();

  // Close wishlist drawer and open shopping bag
  window.closeWishlistDrawer();
  if (typeof window.openCart === 'function') {
    window.openCart();
  } else if (typeof window.openCartDrawer === 'function') {
    window.openCartDrawer();
  }
  if (typeof showToast === 'function') showToast('All wishlist items moved to Shopping Bag! 🛍️');
};

// Wire backdrop click, escape key, and cross-tab storage sync
document.addEventListener('DOMContentLoaded', () => {
  const backdrop = document.getElementById('overlayBackdrop');
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      window.closeWishlistDrawer();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeWishlistDrawer();
    }
  });

  window.updateWishlistUI();

  // Cross-tab synchronization
  window.addEventListener('storage', (e) => {
    if (e.key === 'glam_wishlist') {
      try {
        window.stateWishlist = e.newValue ? JSON.parse(e.newValue) : [];
        if (window.glamState) window.glamState.wishlist = window.stateWishlist;
        window.updateWishlistUI();
        const drawer = document.getElementById('wishlistDrawer');
        if (drawer && (drawer.classList.contains('open') || drawer.classList.contains('active'))) {
          window.renderWishlistUI();
        }
      } catch (err) {}
    }
  });

  // Final announcement promo check on DOM ready
  if (typeof window.syncAnnouncementPromo === 'function') window.syncAnnouncementPromo();
});
