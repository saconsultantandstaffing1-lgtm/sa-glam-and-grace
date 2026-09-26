/**
 * ====================================================================
 * SA GLAM & GRACE (NAIRA FASHION) - SUPABASE CLIENT & CLOUD SYNC
 * ====================================================================
 * Connects directly to Supabase for:
 * 1. Authentication (Admin & Customer with Role Access)
 * 2. Database Sync (Products, Orders, Customers, Coupons)
 * 3. Supabase Storage (Product photos & banners)
 */

window.SUPABASE_CONFIG = {
  url: 'https://khynurlqvjfrsmeewmai.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoeW51cmxxdmpmcnNtZWV3bWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNjYxNTMsImV4cCI6MjEwNTg0MjE1M30.7LRnrnOYBzWbq0DE6ykq-7yM23dzRHIaC4uvpRNGtR0'
};

// Initialize Supabase Client Instance
(function () {
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    window.sb = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey);
    console.log('✅ Supabase Client Connected: SA Glam & Grace');
  } else {
    console.warn('⚠️ Supabase JS library not loaded yet.');
  }
})();

// Helper to ensure client is ready
function getSb() {
  if (!window.sb && typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    window.sb = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey);
  }
  return window.sb;
}

// -------------------------------------------------------------
// 1. AUTHENTICATION SERVICE (Admin & Customer)
// -------------------------------------------------------------
window.GlamAuth = {
  // Sign Up with full name, phone, and optional role
  async signUp(email, password, fullName = '', phone = '', role = 'customer') {
    const sb = getSb();
    if (!sb) throw new Error('Supabase client is not ready');

    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
          role: role
        }
      }
    });

    if (error) throw error;
    return data;
  },

  // Sign In
  async signIn(email, password) {
    const sb = getSb();
    if (!sb) throw new Error('Supabase client is not ready');

    const { data, error } = await sb.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  // Sign Out
  async signOut() {
    const sb = getSb();
    if (sb) {
      await sb.auth.signOut();
    }
    localStorage.removeItem('glam_current_user');
  },

  // Get current active user & profile
  async getCurrentUser() {
    const sb = getSb();
    if (!sb) return null;

    try {
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return null;

      // Query profile role
      const { data: profile } = await sb
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        ...user,
        profile: profile || { role: user.user_metadata?.role || 'customer', full_name: user.user_metadata?.full_name }
      };
    } catch (err) {
      console.warn('Error fetching current user:', err);
      return null;
    }
  },

  // Check if current user is admin
  async isAdmin() {
    const user = await this.getCurrentUser();
    if (!user) return false;
    return user.profile?.role === 'admin' || user.user_metadata?.role === 'admin' || user.email === 'admin@saglam.com';
  },

  // Listen for auth state changes
  onAuthStateChange(callback) {
    const sb = getSb();
    if (!sb) return;
    return sb.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
};

// -------------------------------------------------------------
// 2. PRODUCTS SERVICE (Cloud Catalog)
// -------------------------------------------------------------
window.GlamProducts = {
  async getAll() {
    const sb = getSb();
    if (!sb) return null;

    try {
      const { data, error } = await sb
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase products fetch fallback:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('Products network error:', err);
      return null;
    }
  },

  async upsert(product) {
    const sb = getSb();
    if (!sb) throw new Error('Supabase client not initialized');

    const { data, error } = await sb
      .from('products')
      .upsert(product, { onConflict: 'id' })
      .select();

    if (error) throw error;
    return data;
  },

  async delete(productId) {
    const sb = getSb();
    if (!sb) throw new Error('Supabase client not initialized');

    const { error } = await sb
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
    return true;
  }
};

// -------------------------------------------------------------
// 3. ORDERS SERVICE (Checkout & Status Updates)
// -------------------------------------------------------------
window.GlamOrders = {
  async getAll() {
    const sb = getSb();
    if (!sb) return null;

    try {
      const { data, error } = await sb
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Orders fetch error:', err.message);
      return null;
    }
  },

  async create(orderData, items = []) {
    const sb = getSb();
    if (!sb) throw new Error('Supabase client not initialized');

    // 1. Insert order
    const { data: order, error: orderErr } = await sb
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderErr) throw orderErr;

    // 2. Insert items if provided
    if (items.length > 0 && order) {
      const itemsToInsert = items.map(item => ({
        order_id: order.id,
        product_id: item.id || item.productId,
        name: item.title || item.name,
        price: item.price,
        qty: item.qty || 1,
        size: item.size || 'M',
        color: item.color || '',
        image: item.image || ''
      }));

      await sb.from('order_items').insert(itemsToInsert);
    }

    return order;
  },

  async updateStatus(orderId, status) {
    const sb = getSb();
    if (!sb) throw new Error('Supabase client not initialized');

    const { data, error } = await sb
      .from('orders')
      .update({ status: status })
      .eq('id', orderId)
      .select();

    if (error) throw error;
    return data;
  }
};

// -------------------------------------------------------------
// 4. CUSTOMERS SERVICE
// -------------------------------------------------------------
window.GlamCustomers = {
  async getAll() {
    const sb = getSb();
    if (!sb) return null;

    try {
      const { data, error } = await sb
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Customers fetch fallback:', err.message);
      return null;
    }
  },

  async upsert(customer) {
    const sb = getSb();
    if (!sb) throw new Error('Supabase client not initialized');

    const { data, error } = await sb
      .from('customers')
      .upsert(customer, { onConflict: 'id' })
      .select();

    if (error) throw error;
    return data;
  }
};

// -------------------------------------------------------------
// 5. COUPONS SERVICE
// -------------------------------------------------------------
window.GlamCoupons = {
  async getAll() {
    const sb = getSb();
    if (!sb) return null;

    try {
      const { data, error } = await sb
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Coupons fetch fallback:', err.message);
      return null;
    }
  },

  async upsert(coupon) {
    const sb = getSb();
    if (!sb) throw new Error('Supabase client not initialized');

    const { data, error } = await sb
      .from('coupons')
      .upsert(coupon, { onConflict: 'id' })
      .select();

    if (error) throw error;
    return data;
  },

  async deleteByCode(code) {
    const sb = getSb();
    if (!sb) return false;
    try {
      const { error } = await sb.from('coupons').delete().eq('code', code);
      if (error) throw error;
      return true;
    } catch(e) {
      console.warn('Supabase coupon deleteByCode err:', e);
      return false;
    }
  },

  async delete(couponId) {
    const sb = getSb();
    if (!sb) throw new Error('Supabase client not initialized');

    const { error } = await sb
      .from('coupons')
      .delete()
      .eq('id', couponId);

    if (error) throw error;
    return true;
  }
};

// -------------------------------------------------------------
// 6. STORAGE SERVICE (Direct Image Uploads to product-images Bucket)
// -------------------------------------------------------------
window.GlamStorage = {
  async uploadProductImage(file) {
    const sb = getSb();
    if (!sb) throw new Error('Supabase client not initialized');

    const fileExt = file.name.split('.').pop();
    const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await sb.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = sb.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};
