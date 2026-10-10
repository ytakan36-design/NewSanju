(function (window) {
  var STORAGE_KEY = "sanju-cart-v1";

  function publishedProducts() {
    return (window.SANJU_PRODUCTS || []).filter(function (p) {
      return p.published !== false;
    });
  }

  function getProduct(id) {
    return publishedProducts().filter(function (p) {
      return p.id === id;
    })[0];
  }

  function formatPrice(price) {
    if (price === null || price === undefined || price === "") {
      return "要入力";
    }
    var n = Number(price);
    if (!isFinite(n)) return "要入力";
    return "¥" + n.toLocaleString("ja-JP");
  }

  function canPurchase(product) {
    return (
      product &&
      product.price !== null &&
      product.price !== undefined &&
      product.price !== "" &&
      isFinite(Number(product.price)) &&
      product.stock !== 0
    );
  }

  function loadCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    updateCartBadge();
  }

  function cartCount() {
    return loadCart().reduce(function (sum, item) {
      return sum + Number(item.qty || 0);
    }, 0);
  }

  function updateCartBadge() {
    var nodes = document.querySelectorAll("[data-cart-count]");
    var n = cartCount();
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = String(n);
      nodes[i].hidden = n === 0;
    }
  }

  function addToCart(productId, qty) {
    var product = getProduct(productId);
    if (!product) return { ok: false, message: "商品が見つかりません。" };
    if (product.stock === 0) return { ok: false, message: "SOLD OUT です。" };
    if (!canPurchase(product)) {
      return {
        ok: false,
        message: "価格が未設定のため、まだカートに入れられません。",
      };
    }
    qty = Math.max(1, parseInt(qty, 10) || 1);
    var items = loadCart();
    var found = false;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === productId) {
        var next = items[i].qty + qty;
        if (typeof product.stock === "number" && next > product.stock) {
          return { ok: false, message: "在庫数を超えています。" };
        }
        items[i].qty = next;
        found = true;
      }
    }
    if (!found) {
      if (typeof product.stock === "number" && qty > product.stock) {
        return { ok: false, message: "在庫数を超えています。" };
      }
      items.push({ id: productId, qty: qty });
    }
    saveCart(items);
    return { ok: true, message: "カートに入れました。" };
  }

  function setQty(productId, qty) {
    qty = parseInt(qty, 10);
    var items = loadCart();
    if (!qty || qty < 1) {
      items = items.filter(function (item) {
        return item.id !== productId;
      });
    } else {
      var product = getProduct(productId);
      if (product && typeof product.stock === "number" && qty > product.stock) {
        qty = product.stock;
      }
      items.forEach(function (item) {
        if (item.id === productId) item.qty = qty;
      });
    }
    saveCart(items);
  }

  function removeItem(productId) {
    saveCart(
      loadCart().filter(function (item) {
        return item.id !== productId;
      })
    );
  }

  function clearCart() {
    saveCart([]);
  }

  function detailedCart() {
    return loadCart()
      .map(function (item) {
        var product = getProduct(item.id);
        if (!product) return null;
        var price = Number(product.price);
        var line = isFinite(price) ? price * Number(item.qty) : null;
        return { product: product, qty: item.qty, lineTotal: line };
      })
      .filter(Boolean);
  }

  function cartTotal() {
    return detailedCart().reduce(function (sum, row) {
      return sum + (row.lineTotal || 0);
    }, 0);
  }

  function variantId(product) {
    return String(product.shopifyVariantId || "").replace(/\D/g, "");
  }

  function checkoutToShopify() {
    var cfg = (window.SANJU && window.SANJU.shopify) || {};
    var rows = detailedCart();
    if (!rows.length) return { ok: false, message: "カートが空です。" };
    var missingPrice = rows.some(function (row) {
      return !canPurchase(row.product);
    });
    if (missingPrice) {
      return { ok: false, message: "価格未設定の商品が含まれています。" };
    }
    if (!cfg.enabled || !cfg.storeUrl) {
      return {
        ok: false,
        message: "ただいまオンライン決済の準備中です。",
      };
    }
    var missingVariant = rows.filter(function (row) {
      return !variantId(row.product);
    });
    if (missingVariant.length) {
      return {
        ok: false,
        message: "商品の登録が完了していないため、まだ決済に進めません。",
      };
    }
    var store = String(cfg.storeUrl).trim();
    var parsed;
    try {
      parsed = new URL(store);
    } catch (e) {
      return { ok: false, message: "ShopifyのストアURLの形式を確認してください。" };
    }
    if (parsed.protocol !== "https:" || parsed.username || parsed.password) {
      return { ok: false, message: "ShopifyのストアURLの形式を確認してください。" };
    }
    var path = rows
      .map(function (row) {
        return variantId(row.product) + ":" + row.qty;
      })
      .join(",");
    window.location.href = parsed.origin + "/cart/" + path;
    return { ok: true };
  }

  window.SanjuStore = {
    publishedProducts: publishedProducts,
    getProduct: getProduct,
    formatPrice: formatPrice,
    canPurchase: canPurchase,
    loadCart: loadCart,
    addToCart: addToCart,
    setQty: setQty,
    removeItem: removeItem,
    clearCart: clearCart,
    detailedCart: detailedCart,
    cartTotal: cartTotal,
    checkoutToShopify: checkoutToShopify,
    updateCartBadge: updateCartBadge,
  };
})(window);
