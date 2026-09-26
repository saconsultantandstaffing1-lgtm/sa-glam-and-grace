
  // Global Customer Auth for Category Page
  window.openCustomerAuth = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const modal = document.getElementById('customerAuthModal');
    if (modal) {
      modal.style.setProperty('display', 'flex', 'important');
      modal.style.setProperty('opacity', '1', 'important');
      modal.style.setProperty('visibility', 'visible', 'important');
      modal.style.setProperty('pointer-events', 'auto', 'important');
    }
  };

  window.closeCustomerAuth = function() {
    const modal = document.getElementById('customerAuthModal');
    if (modal) {
      modal.style.display = 'none';
    }
  };

  function initCustomerAuthCategory() {
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

    let mode = 'signin';

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        window.closeCustomerAuth();
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) window.closeCustomerAuth();
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
          authMsg.textContent = 'Authenticating...';
        }

        try {
          if (window.GlamAuth) {
            if (mode === 'signup') {
              await window.GlamAuth.signUp(email, password, fullName, phone, 'customer');
            } else {
              await window.GlamAuth.signIn(email, password);
            }
          }
          localStorage.setItem('glam_customer_user', JSON.stringify({ email, fullName }));

          if (authMsg) {
            authMsg.style.background = '#dcfce7';
            authMsg.style.color = '#15803d';
            authMsg.textContent = 'Welcome back! Signed in successfully.';
          }

          setTimeout(() => {
            window.closeCustomerAuth();
            if (window.pendingCategoryAddToCart) {
              const pending = window.pendingCategoryAddToCart;
              window.pendingCategoryAddToCart = null;
              window.executeCategoryAddToCart(pending);
            }
          }, 400);
        } catch(err) {
          // Fallback demo local login
          localStorage.setItem('glam_customer_user', JSON.stringify({ email, fullName: fullName || email.split('@')[0] }));
          if (authMsg) {
            authMsg.style.background = '#dcfce7';
            authMsg.style.color = '#15803d';
            authMsg.textContent = 'Signed in successfully!';
          }
          setTimeout(() => {
            window.closeCustomerAuth();
            if (window.pendingCategoryAddToCart) {
              const pending = window.pendingCategoryAddToCart;
              window.pendingCategoryAddToCart = null;
              window.executeCategoryAddToCart(pending);
            }
          }, 400);
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
        window.closeCustomerAuth();
        if (window.pendingCategoryAddToCart) {
          const prod = window.pendingCategoryAddToCart;
          window.pendingCategoryAddToCart = null;
          window.executeCategoryAddToCart(prod);
        } else {
          window.openCartDrawer();
        }
      });
    }

    if (signOutBtn) {
      signOutBtn.addEventListener('click', async () => {
        if (window.GlamAuth) await window.GlamAuth.signOut();
        localStorage.removeItem('glam_customer_user');
        window.closeCustomerAuth();
      });
    }
  }

/* 
   SA Glam & Grace - Dedicated Category Showcase Engine
   Full live sync with Admin panel, sorting, cart & wishlist integration
*/

document.addEventListener('DOMContentLoaded', () => {
  initCustomerAuthCategory();
  // Category Metadata Configuration
  const CATEGORY_META = {
    kurtis: {
      key: 'kurtis',
      name: 'Kurtis',
      title: 'Royal <span>Kurtis &amp; Kurti Sets</span>',
      crumb: 'Kurtis &amp; Tunics',
      desc: 'Handcrafted pure Chanderi and mulberry silk weaves, fine zardozi embroidery, and timeless silhouettes for regal occasions.'
    },
    churidar: {
      key: 'churidar',
      name: 'Chudidar Sets',
      title: 'Churidar &amp; <span>Salwar Ensembles</span>',
      crumb: 'Chudidar Sets',
      desc: 'Flawless tailoring meets royal comfort with rich festive silks, gold borders, and delicate hand embroidery.'
    },
    anarkali: {
      key: 'anarkali',
      name: 'Anarkalis',
      title: 'Handcrafted <span>Anarkali Suits</span>',
      crumb: 'Anarkali Suits',
      desc: 'Flowing regal flares adorned with authentic Chikankari needlework, zari threadwork, and pure organza dupattas.'
    },
    saree: {
      key: 'saree',
      name: 'Sarees',
      title: 'Handloom &amp; <span>Banarasi Sarees</span>',
      crumb: 'Heritage Sarees',
      desc: 'Century-old Indian weaving heritage, opulent zari borders, and pure Katan silk drapes for unforgettable wedding moments.'
    },
    lehenga: {
      key: 'lehenga',
      name: 'Lehengas',
      title: 'Bridal &amp; <span>Heritage Lehengas</span>',
      crumb: 'Bridal Lehengas',
      desc: 'Heirloom wedding couture meticulously crafted with zardozi, gota patti, and royal velvets for the contemporary bride.'
    },
    tops: {
      key: 'tops',
      name: 'Tops & Peplum',
      title: 'Indo-Western <span>Tops &amp; Peplum</span>',
      crumb: 'Tops &amp; Peplum',
      desc: 'Contemporary silhouettes infused with rich Indian surface ornamentation, georgette shararas, and regal cuts.'
    },
    dupatta: {
      key: 'dupatta',
      name: 'Dupattas',
      title: 'Hand-Painted &amp; <span>Zari Dupattas</span>',
      crumb: 'Dupattas &amp; Stoles',
      desc: 'Ethereal organza, silk, and tissue dupattas hand-painted by master artisans with delicate border finishes.'
    },
    jewellery: {
      key: 'jewellery',
      name: 'Jewellery',
      title: 'Kundan &amp; <span>Polki Bridal Jewellery</span>',
      crumb: 'Fine Jewellery',
      desc: 'Heirloom choker sets, royal jhumkas, and handcrafted kundan necklaces inspired by Mughal architecture.'
    },
    handbags: {
      key: 'handbags',
      name: 'Handbags',
      title: 'Artisan Potlis &amp; <span>Luxury Clutches</span>',
      crumb: 'Potlis &amp; Handbags',
      desc: 'Exquisite velvet and silk evening potlis embellished with pearls, zardozi, and hand-embroidered motifs.'
    },
    footwear: {
      key: 'footwear',
      name: 'Footwear',
      title: 'Embroidered <span>Bridal Juttis &amp; Mojaris</span>',
      crumb: 'Footwear &amp; Juttis',
      desc: 'Handcrafted leather juttis with pure silk padding, dabka embroidery, and unmatched festive comfort.'
    },
    watches: {
      key: 'watches',
      name: 'Watches',
      title: 'Luxury <span>Timepieces &amp; Accessories</span>',
      crumb: 'Watches',
      desc: 'Finely crafted horological timepieces and regal ornaments designed to complete your luxury aesthetic.'
    }
  };

  // 1. Get Category from URL query ?cat=...
  const urlParams = new URLSearchParams(window.location.search);
  let activeCatKey = (urlParams.get('cat') || 'kurtis').toLowerCase().trim();
  if (!CATEGORY_META[activeCatKey]) {
    // If not exact key, find alias
    const found = Object.keys(CATEGORY_META).find(k => activeCatKey.includes(k) || k.includes(activeCatKey));
    activeCatKey = found || 'kurtis';
  }

  const currentMeta = CATEGORY_META[activeCatKey];

  // 2. Update Header & Breadcrumb
  const crumbEl = document.getElementById('crumbCategoryName');
  const titleEl = document.getElementById('pageCategoryTitle');
  const descEl = document.getElementById('pageCategoryDesc');
  const navLabelEl = document.getElementById('currentCatNavLabel');

  if (crumbEl) crumbEl.textContent = currentMeta.crumb;
  if (titleEl) titleEl.innerHTML = currentMeta.title;
  if (descEl) descEl.textContent = currentMeta.desc;
  if (navLabelEl) navLabelEl.textContent = currentMeta.name;
  document.title = `${currentMeta.name} Collection | SA Glam & Grace`;

  // Highlight Active Pill
  const pills = document.querySelectorAll('.cat-pill-btn');
  pills.forEach(p => {
    if (p.getAttribute('data-cat') === activeCatKey) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });

  // 3. Category Matcher
  function matchesThisCategory(prodCat) {
    if (!prodCat) return false;
    const p = String(prodCat).toLowerCase().trim();
    const target = activeCatKey;

    if (p === target) return true;
    if (p.includes(target) || target.includes(p)) return true;

    // Aliases
    if (target === 'kurtis' && (p.includes('kurti') || p.includes('kurta') || p.includes('chanderi') || p.includes('tunic'))) return true;
    if (target === 'churidar' && (p.includes('churidar') || p.includes('chudidar') || p.includes('salwar'))) return true;
    if (target === 'anarkali' && (p.includes('anarkali') || p.includes('suit'))) return true;
    if (target === 'saree' && (p.includes('saree') || p.includes('sari') || p.includes('handloom'))) return true;
    if (target === 'lehenga' && (p.includes('lehenga') || p.includes('bridal') || p.includes('ghagra'))) return true;
    if (target === 'tops' && (p.includes('top') || p.includes('peplum') || p.includes('shirt'))) return true;
    if (target === 'dupatta' && (p.includes('dupatta') || p.includes('shawl') || p.includes('stole'))) return true;
    if (target === 'jewellery' && (p.includes('jewel') || p.includes('choker') || p.includes('kundan') || p.includes('necklace'))) return true;
    if (target === 'handbags' && (p.includes('handbag') || p.includes('bag') || p.includes('potli') || p.includes('clutch'))) return true;
    if (target === 'footwear' && (p.includes('footwear') || p.includes('jutti') || p.includes('mojari') || p.includes('shoe'))) return true;
    if (target === 'watches' && (p.includes('watch') || p.includes('timepiece'))) return true;

    return false;
  }

  // 4. Products Data Loader
  function getStoredProducts() {
    let prods = [];
    try {
      const stored = localStorage.getItem('nf_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        let delIds = [];
        try { delIds = JSON.parse(localStorage.getItem('nf_deleted_products')) || []; } catch(e) {}
        if (Array.isArray(parsed) && parsed.length > 0) {
          prods = parsed.filter(p => !delIds.includes(String(p.id)));
        }
      }
    } catch (e) {}

    // Fallback seed catalog if empty
    if (prods.length === 0) {
      prods = [
        { id: "NF-100", name: "Amber Chanderi Handloom Kurti Set", category: "Kurtis", price: 3499, originalPrice: 4999, stock: 28, status: "in-stock", image: "./assets/images/hero_1.png", rating: 4.9, sales: 185 },
        { id: "NF-101", name: "Handcrafted Chikankari Anarkali Set", category: "Anarkali", price: 8499, originalPrice: 10999, stock: 24, status: "in-stock", image: "./assets/images/about_anarkali.png", rating: 4.9, sales: 142 },
        { id: "NF-102", name: "Royal Crimson Zari Bridal Lehenga", category: "Lehenga", price: 24999, originalPrice: 32000, stock: 8, status: "low-stock", image: "./assets/images/about_lehenga.png", rating: 5.0, sales: 89 },
        { id: "NF-103", name: "Pure Banarasi Katan Silk Saree", category: "Saree", price: 14500, originalPrice: 18500, stock: 18, status: "in-stock", image: "./assets/images/about_saree.png", rating: 4.8, sales: 210 },
        { id: "NF-104", name: "Embroidered Georgette Peplum Top & Sharara", category: "Tops", price: 5299, originalPrice: 6999, stock: 35, status: "in-stock", image: "./assets/images/about_tops.png", rating: 4.7, sales: 165 },
        { id: "NF-105", name: "Velvet Royal Churidar & Zardozi Kurti", category: "Churidar", price: 7800, originalPrice: 9500, stock: 15, status: "in-stock", image: "./assets/images/chudidar.png", rating: 4.9, sales: 115 },
        { id: "NF-106", name: "Heritage Organza Hand-Painted Dupatta", category: "Dupatta", price: 3499, originalPrice: 4200, stock: 42, status: "in-stock", image: "./assets/images/dupatta.png", rating: 4.9, sales: 310 },
        { id: "NF-107", name: "Kundan & Polki Bridal Jewellery Choker Set", category: "Jewellery", price: 12999, originalPrice: 16000, stock: 12, status: "in-stock", image: "./assets/images/jewellery.png", rating: 5.0, sales: 78 },
        { id: "NF-108", name: "Artisan Hand-Embroidered Potli Handbag", category: "Handbags", price: 2499, originalPrice: 3200, stock: 50, status: "in-stock", image: "./assets/images/handbag_modern.png", rating: 4.8, sales: 190 }
      ];
      localStorage.setItem('nf_products', JSON.stringify(prods));
    }
    return prods;
  }

  let currentSort = 'featured';

  // 5. Render Grid
  function renderCategoryProducts() {
    const grid = document.getElementById('categoryProductsGrid');
    const countDisplay = document.getElementById('catCountDisplay');
    if (!grid) return;

    const allProds = getStoredProducts();
    let matching = allProds.filter(p => matchesThisCategory(p.category));

    // Sort
    if (currentSort === 'price-low') {
      matching.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (currentSort === 'price-high') {
      matching.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (currentSort === 'rating') {
      matching.sort((a, b) => Number(b.rating || 5) - Number(a.rating || 5));
    } else if (currentSort === 'newest') {
      matching.reverse();
    }

    if (countDisplay) {
      countDisplay.innerHTML = `Showing <strong>${matching.length}</strong> luxury styles in ${currentMeta.name}`;
    }

    if (matching.length === 0) {
      grid.innerHTML = `
        <div class="cat-empty-box">
          <i class="ri-sparkle-line" style="font-size: 3.2rem; color: #D4AF37; display: block; margin-bottom: 0.8rem;"></i>
          <h3 style="font-family: var(--font-serif); font-size: 1.8rem; color: #111; margin-bottom: 0.5rem;">New ${currentMeta.name} Dropping Soon</h3>
          <p style="color: #666; font-size: 0.95rem; max-width: 480px; margin: 0 auto 1.8rem auto; line-height: 1.6;">
            Our artisans are weaving new pieces for this collection. Add a new item in the Admin portal or explore our other royal categories!
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="admin.html" class="btn-primary" style="padding: 10px 22px; border-radius: 25px; text-decoration: none; font-weight: 700;">
              <i class="ri-add-line"></i> Upload ${currentMeta.name} in Admin
            </a>
            <a href="index.html#categories" class="btn-primary" style="padding: 10px 22px; border-radius: 25px; text-decoration: none; font-weight: 700; background: #fff; color: #111; border: 1px solid #d4af37;">
              Browse All Categories
            </a>
          </div>
        </div>
      `;
      return;
    }

    grid.innerHTML = matching.map((prod, idx) => {
      const id = prod.id || idx + 1;
      const name = prod.name || prod.title || 'Luxury Garment';
      const price = Number(prod.price) || 0;
      const origPrice = Number(prod.originalPrice || prod.original_price || prod.price) || price;
      const image = prod.image || './assets/images/hero_1.png';
      const category = prod.category || currentMeta.name;
      const badge = prod.status === 'low-stock' ? 'LOW STOCK' : (prod.status === 'out-of-stock' ? 'SOLD OUT' : (idx === 0 ? 'NEW' : (idx === 1 ? 'BESTSELLER' : 'EXCLUSIVE')));

      const isWishlisted = (window.stateWishlist && window.stateWishlist.includes(id));

      const safeProdObj = JSON.stringify({
        id: id,
        title: name,
        price: price,
        image: image,
        category: category
      }).replace(/"/g, '&quot;');

      return `
        <div class="product-card" data-id="${id}">
          <div class="product-img-wrapper">
            <span class="product-badge">${badge}</span>
            <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="window.toggleCategoryWishlist('${id}', this)">
              <i class="${isWishlisted ? 'ri-heart-fill' : 'ri-heart-line'}"></i>
            </button>
            <img src="${image}" alt="${name}" class="product-img-primary" onerror="this.onerror=null; this.src='./assets/images/hero_1.png';" style="object-fit:cover; width:100%; height:100%;">
            
            <div class="product-hover-actions">
              <button class="btn-quick-add" onclick="window.categoryAddToCart(${safeProdObj})">
                Add to Cart
              </button>
              <button class="btn-quick-view" onclick="window.categoryQuickView(${safeProdObj})" title="Quick View">
                <i class="ri-eye-line"></i>
              </button>
            </div>
          </div>
          <div class="product-info">
            <span class="product-category-label">${category}</span>
            <h3 class="product-title">${name}</h3>
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
      `;
    }).join('');
  }

  window.handleSortChange = function(sortVal) {
    currentSort = sortVal;
    renderCategoryProducts();
  };

  // 6. Cart & Wishlist Integration
  let localCart = [];
  try {
    const saved = localStorage.getItem('glam_cart');
    if (saved) localCart = JSON.parse(saved);
  } catch(e) {}

  window.stateWishlist = [];
  try {
    const savedW = localStorage.getItem('glam_wishlist');
    if (savedW) window.stateWishlist = JSON.parse(savedW);
  } catch(e) {}

  function updateBadges() {
    const cartCount = localCart.reduce((sum, i) => sum + (i.qty || 1), 0);
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) cartBadge.textContent = cartCount;

    const wishBadge = document.getElementById('wishlistBadge');
    if (wishBadge) wishBadge.textContent = window.stateWishlist.length;
  }

  
  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORY PROMO & COUPON LIVE SYNC
  // ═══════════════════════════════════════════════════════════════════════════
  const INITIAL_COUPONS = [
    { code: "WELCOME10", discount: "10% OFF", type: "percentage", value: 10, minOrder: 2999, status: "Active" },
    { code: "ROYALFESTIVE", discount: "₹2,500 OFF", type: "fixed", value: 2500, minOrder: 15000, status: "Active" },
    { code: "BRIDALVIP", discount: "20% OFF", type: "percentage", value: 20, minOrder: 25000, status: "Active" }
  ];

  function getActiveCategoryCoupons() {
    let delCoupons = [];
    try { delCoupons = JSON.parse(localStorage.getItem('nf_deleted_coupons')) || []; } catch(e) {}
    let coupons = [];
    try {
      const raw = localStorage.getItem('nf_coupons');
      if (raw) coupons = JSON.parse(raw);
    } catch(e) {}

    const allCoupons = Array.isArray(coupons) ? [...coupons] : [];
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
  window.getActiveCategoryCoupons = getActiveCategoryCoupons;

  function getAppliedCategoryPromo() {
    try {
      const raw = localStorage.getItem('glam_applied_promo');
      if (!raw) return null;
      const promo = JSON.parse(raw);
      const activeList = getActiveCategoryCoupons();
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

  window.syncCategoryAnnouncementPromo = function syncCategoryAnnouncementPromo() {
    const promoEl = document.getElementById('categoryAnnouncementPromoText');
    const activeCoupons = getActiveCategoryCoupons();
    if (activeCoupons.length > 0) {
      const top = activeCoupons[0];
      if (promoEl) {
        promoEl.innerHTML = 'Use Code <strong style="color:#FFD700; text-decoration:underline;">' + top.code + '</strong> for ' + top.discount + (top.minOrder ? ' on orders over ₹' + (Number(top.minOrder)).toLocaleString('en-IN') : '');
      }
      const suggestionEl = document.getElementById('cartPromoSuggestion');
      if (suggestionEl) {
        suggestionEl.textContent = 'Try ' + top.code;
        suggestionEl.onclick = () => window.applyCategoryCartPromo(top.code);
      }
    } else {
      if (promoEl) {
        promoEl.innerHTML = 'Complimentary Express Luxury Delivery on all Indian Couture!';
      }
      const suggestionEl = document.getElementById('cartPromoSuggestion');
      if (suggestionEl) suggestionEl.textContent = '';
    }
  }

  // Immediately run on startup in category page and wire live sync
  try {
    window.syncCategoryAnnouncementPromo();
  } catch(e) {}
  window.addEventListener('storage', () => {
    try { window.syncCategoryAnnouncementPromo(); } catch(e) {}
    try { renderCartDrawer(); } catch(e) {}
  });
  window.addEventListener('coupons_updated', () => {
    try { window.syncCategoryAnnouncementPromo(); } catch(e) {}
    try { renderCartDrawer(); } catch(e) {}
  });

  window.applyCategoryCartPromo = function(codeOverride) {
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

    const activeList = getActiveCategoryCoupons();
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
    renderCartDrawer();
  };

  window.removeCategoryCartPromo = function() {
    localStorage.removeItem('glam_applied_promo');
    renderCartDrawer();
  };

function renderCartDrawer() {
    const list = document.getElementById('cartItemsList');
    const subtotalEl = document.getElementById('cartSubtotal');
    const discountRow = document.getElementById('cartDiscountRow');
    const discountAmountEl = document.getElementById('cartDiscountAmount');
    const discountLabelEl = document.getElementById('cartDiscountLabel');
    const finalTotalRow = document.getElementById('cartFinalTotalRow');
    const finalTotalEl = document.getElementById('cartFinalTotal');
    const promoSection = document.getElementById('cartPromoSection');
    const promoInputGroup = document.getElementById('cartPromoInputGroup');
    const promoFeedback = document.getElementById('cartPromoFeedback');

    if (!list) return;

    if (localCart.length === 0) {
      list.innerHTML = '<div style="text-align:center; padding:3rem 1rem; color:#888;"><i class="ri-shopping-bag-3-line" style="font-size:2.5rem; color:#ccc;"></i><p style="margin-top:0.5rem;">Your shopping bag is empty</p></div>';
      if (subtotalEl) subtotalEl.textContent = '₹0';
      if (discountRow) discountRow.style.display = 'none';
      if (finalTotalRow) finalTotalRow.style.display = 'none';
      if (promoSection) promoSection.style.display = 'none';
      return;
    }

    if (promoSection) promoSection.style.display = 'block';

    const subtotal = localCart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;

    list.innerHTML = localCart.map((item, idx) => `
      <div style="display:flex; gap:12px; padding:12px 0; border-bottom:1px solid #f0ece1; align-items:center;">
        <img src="${item.image}" alt="${item.title}" style="width:55px; height:70px; object-fit:cover; border-radius:4px;" />
        <div style="flex:1;">
          <h4 style="font-size:0.85rem; margin:0 0 4px 0; font-family:var(--font-serif); color:#181412;">${item.title}</h4>
          <span style="font-size:0.82rem; color:#b45309; font-weight:700;">₹${Number(item.price).toLocaleString('en-IN')}</span>
          <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
            <button onclick="window.changeCartQty(${idx}, -1)" style="padding:2px 8px; border:1px solid #ddd; background:#fff; cursor:pointer; border-radius:4px;">-</button>
            <span style="font-size:0.82rem; font-weight:600;">${item.qty || 1}</span>
            <button onclick="window.changeCartQty(${idx}, 1)" style="padding:2px 8px; border:1px solid #ddd; background:#fff; cursor:pointer; border-radius:4px;">+</button>
          </div>
        </div>
        <button onclick="window.removeCartItem(${idx})" style="background:none; border:none; color:#999; cursor:pointer; font-size:1.2rem;"><i class="ri-delete-bin-line"></i></button>
      </div>
    `).join('');

    // Handle Promo Discount
    const appliedPromo = getAppliedCategoryPromo();
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
              <button onclick="window.removeCategoryCartPromo()" style="background:none; border:none; color:#ef4444; font-size:0.75rem; cursor:pointer;">Remove</button>
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
              <button onclick="window.removeCategoryCartPromo()" style="background:none; border:none; color:#ef4444; font-size:0.75rem; font-weight:600; cursor:pointer;">Remove</button>
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
          <button id="cartPromoBtn" onclick="window.applyCategoryCartPromo && window.applyCategoryCartPromo()" style="padding:0.4rem 0.85rem; background:#181412; color:#D4AF37; border:1px solid #D4AF37; border-radius:5px; font-size:0.75rem; font-weight:700; cursor:pointer;">APPLY</button>
        `;
      }
    }
  }

  window.changeCartQty = function(idx, delta) {
    if (localCart[idx]) {
      localCart[idx].qty = (localCart[idx].qty || 1) + delta;
      if (localCart[idx].qty <= 0) localCart.splice(idx, 1);
      localStorage.setItem('glam_cart', JSON.stringify(localCart));
      updateBadges();
  renderCartDrawer();
    }
  };

  window.removeCartItem = function(idx) {
    localCart.splice(idx, 1);
    localStorage.setItem('glam_cart', JSON.stringify(localCart));
    updateBadges();
    renderCartDrawer();
  };

  window.executeCategoryAddToCart = function(product) {
    const existing = localCart.find(i => String(i.id) === String(product.id));
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      localCart.push({ ...product, qty: 1, size: 'M' });
    }
    localStorage.setItem('glam_cart', JSON.stringify(localCart));
    updateBadges();
    window.openCartDrawer();
  };

  window.categoryAddToCart = async function(product) {
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
      window.pendingCategoryAddToCart = product;
      const sub = document.getElementById('authModalSubtext');
      if (sub) sub.textContent = `Sign in to add "${product.title || product.name}" to your shopping bag`;
      window.openCustomerAuth();
      return;
    }

    window.executeCategoryAddToCart(product);
  };

  window.openCartDrawer = function() {
    renderCartDrawer();
    const d = document.getElementById('cartDrawer');
    const b = document.getElementById('overlayBackdrop');
    if (d) {
      d.classList.add('active');
      d.classList.add('open');
      d.style.setProperty('right', '0px', 'important');
    }
    if (b) {
      b.classList.add('active');
      b.style.setProperty('opacity', '1', 'important');
      b.style.setProperty('visibility', 'visible', 'important');
      b.style.setProperty('pointer-events', 'auto', 'important');
    }
  };
  window.openCart = window.openCartDrawer;

  window.openWishlistDrawer = function() {
    const d = document.getElementById('wishlistDrawer');
    const b = document.getElementById('overlayBackdrop');
    if (d) d.classList.add('active');
    if (b) b.classList.add('active');
    renderWishlistList();
  };

  function renderWishlistList() {
    const list = document.getElementById('wishlistItemsList');
    if (!list) return;
    const allProds = getStoredProducts();
    const wishItems = allProds.filter(p => window.stateWishlist.includes(p.id) || window.stateWishlist.includes(String(p.id)));

    if (wishItems.length === 0) {
      list.innerHTML = `<div style="text-align:center; padding:3rem 1rem; color:#888;"><i class="ri-heart-line" style="font-size:2.5rem; display:block; margin-bottom:0.5rem;"></i>Your wishlist is currently empty.</div>`;
      return;
    }

    list.innerHTML = wishItems.map(item => `
      <div style="display:flex; gap:1rem; padding:1rem 0; border-bottom:1px solid #f0f0f0; align-items:center;">
        <img src="${item.image}" style="width:65px; height:80px; object-fit:cover; border-radius:8px;" onerror="this.src='./assets/images/hero_1.png';">
        <div style="flex:1;">
          <h4 style="font-size:0.9rem; margin:0 0 4px 0; color:#111;">${item.name}</h4>
          <p style="font-size:0.85rem; color:#b45309; font-weight:700; margin:0 0 8px 0;">₹${Number(item.price).toLocaleString('en-IN')}</p>
          <button onclick="window.categoryAddToCart({id:'${item.id}', title:'${item.name}', price:${item.price}, image:'${item.image}'})" style="padding:6px 14px; background:#b45309; color:#fff; border:none; border-radius:20px; font-size:0.78rem; font-weight:700; cursor:pointer;">
            Move to Bag
          </button>
        </div>
        <button onclick="window.toggleCategoryWishlist('${item.id}')" style="background:none; border:none; color:#999; cursor:pointer; font-size:1.2rem;"><i class="ri-close-line"></i></button>
      </div>
    `).join('');
  }

  window.toggleCategoryWishlist = function(id, btn) {
    const idx = window.stateWishlist.findIndex(item => String(item) === String(id));
    if (idx > -1) {
      window.stateWishlist.splice(idx, 1);
      if (btn) btn.classList.remove('active');
    } else {
      window.stateWishlist.push(id);
      if (btn) btn.classList.add('active');
    }
    localStorage.setItem('glam_wishlist', JSON.stringify(window.stateWishlist));
    updateBadges();
    renderCategoryProducts();
    renderWishlistList();
  };

  window.closeAllDrawers = function() {
    const cd = document.getElementById('cartDrawer');
    const wd = document.getElementById('wishlistDrawer');
    const qv = document.getElementById('quickviewModal');
    const b = document.getElementById('overlayBackdrop');
    if (cd) {
      cd.classList.remove('active');
      cd.classList.remove('open');
      cd.style.removeProperty('right');
    }
    if (wd) wd.classList.remove('active');
    if (qv) qv.classList.remove('active');
    if (b) {
      b.classList.remove('active');
      b.style.removeProperty('opacity');
      b.style.removeProperty('visibility');
      b.style.removeProperty('pointer-events');
    }
  };

  window.categoryQuickView = function(prod) {
    const qvImg = document.getElementById('qvImg');
    const qvTitle = document.getElementById('qvTitle');
    const qvPrice = document.getElementById('qvPrice');
    const qvCat = document.getElementById('qvCat');
    const qvBtn = document.getElementById('qvAddToCartBtn');

    if (qvImg) qvImg.src = prod.image;
    if (qvTitle) qvTitle.textContent = prod.title;
    if (qvPrice) qvPrice.textContent = `₹${Number(prod.price).toLocaleString('en-IN')}`;
    if (qvCat) qvCat.textContent = (prod.category || currentMeta.name).toUpperCase();
    if (qvBtn) {
      qvBtn.onclick = () => {
        window.categoryAddToCart(prod);
        window.closeAllDrawers();
      };
    }

    const qv = document.getElementById('quickviewModal');
    const b = document.getElementById('overlayBackdrop');
    if (qv) qv.classList.add('active');
    if (b) b.classList.add('active');
  };

  // 7. Initial Run
  updateBadges();
  renderCategoryProducts();

  // 8. REAL-TIME ADMIN SYNC:
  // When an admin saves any product in /admin, update this category view immediately!
  window.addEventListener('storage', (e) => {
    if (e.key === 'nf_products') {
      renderCategoryProducts();
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
          renderCategoryProducts();
        }, 300);
      } else {
        renderCategoryProducts();
      }
    }
  });
  window.addEventListener('products_updated', () => {
    renderCategoryProducts();
  });

  // Supabase cloud sync
  if (window.GlamProducts) {
    window.GlamProducts.getAll().then(cloudProds => {
      if (cloudProds && cloudProds.length > 0) {
        let delIds = [];
        try { delIds = JSON.parse(localStorage.getItem('nf_deleted_products')) || []; } catch(e) {}
        const mapped = cloudProds
          .filter(p => !delIds.includes(String(p.id)))
          .map(p => ({
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
        renderCategoryProducts();
      }
    }).catch(err => console.warn('Supabase category fetch:', err));
  }
});
