(function () {
  var PLACEHOLDER = "images/placeholder.svg";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function nl2br(str) {
    return escapeHtml(str).replace(/\n/g, "<br>");
  }

  function imgTag(src, alt, className) {
    var safeAlt = escapeHtml(alt || "");
    var cls = className ? ' class="' + className + '"' : "";
    return (
      '<img src="' +
      escapeHtml(src || PLACEHOLDER) +
      '" alt="' +
      safeAlt +
      '"' +
      cls +
      ' loading="lazy" onerror="this.onerror=null;this.src=\'' +
      PLACEHOLDER +
      "';\">"
    );
  }

  function categoryLabel(cat) {
    var map = window.SANJU_CATEGORIES || {};
    return map[cat] ? map[cat].label : cat;
  }

  function categoryPage(cat) {
    if (cat === "soap") return "soap.html";
    if (cat === "tea") return "tea.html";
    if (cat === "art") return "art.html";
    return "shop.html";
  }

  function productHref(id) {
    return "product.html?id=" + encodeURIComponent(id);
  }

  function buyLabel(product) {
    if (product.stock === 0) return "SOLD OUT";
    if (!window.SanjuStore.canPurchase(product)) return "準備中";
    return "カートに入れる";
  }

  function priceClass(price) {
    if (price === null || price === undefined || price === "") return "price is-pending";
    return "price";
  }

  function headerHTML() {
    var c = window.SANJU;
    var logoInner;
    if (c.logoImage) {
      logoInner =
        '<img src="' +
        escapeHtml(c.logoImage) +
        '" alt="' +
        escapeHtml(c.brand.name) +
        '" class="logo-image" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'inline\';">' +
        '<span class="logo-type" style="display:none">' +
        escapeHtml(c.brand.name) +
        "</span>";
    } else {
      logoInner = '<span class="logo-type">' + escapeHtml(c.brand.name) + "</span>";
    }
    return (
      '<div class="header-inner">' +
      '<a class="logo" href="index.html">' +
      '<span class="logo-mark" aria-hidden="true"><span></span><span></span><span></span></span>' +
      logoInner +
      "</a>" +
      '<nav class="nav" data-nav>' +
      '<a href="index.html">HOME</a>' +
      '<a href="about.html">ABOUT</a>' +
      '<a href="shop.html">SHOP</a>' +
      '<a href="soap.html">SOAP</a>' +
      '<a href="tea.html">TEA</a>' +
      '<a href="art.html">ART</a>' +
      '<a href="contact.html">CONTACT</a>' +
      "</nav>" +
      '<div class="header-tools">' +
      '<button type="button" class="icon-btn" data-open-search aria-label="検索">' +
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="6.5"/><path d="M16.5 16.5L21 21"/></svg>' +
      "</button>" +
      '<a class="icon-btn cart-link" href="cart.html" aria-label="カート">' +
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 8h12l-1 11H7L6 8z"/><path d="M9 8V7a3 3 0 016 0v1"/></svg>' +
      '<span class="cart-badge" data-cart-count hidden>0</span>' +
      "</a>" +
      '<button type="button" class="icon-btn hamburger" data-toggle-nav aria-label="メニュー" aria-expanded="false">' +
      '<span></span><span></span><span></span>' +
      "</button>" +
      "</div></div>"
    );
  }

  function footerHTML() {
    var b = window.SANJU.brand;
    var sns = window.SANJU.sns || {};
    var snsLinks = "";
    if (sns.instagram) {
      snsLinks +=
        '<a href="' +
        escapeHtml(sns.instagram) +
        '" target="_blank" rel="noopener noreferrer">Instagram</a>';
    }
    return (
      '<div class="footer-inner">' +
      '<p class="footer-brand">' +
      escapeHtml(b.name) +
      "</p>" +
      "<p>" +
      escapeHtml(b.atelier) +
      "<br>" +
      escapeHtml(b.address) +
      "<br>" +
      '<a href="' +
      escapeHtml(b.telHref) +
      '">' +
      escapeHtml(b.tel) +
      "</a><br>" +
      '<a href="mailto:' +
      escapeHtml(b.email) +
      '">' +
      escapeHtml(b.email) +
      "</a></p>" +
      (snsLinks ? '<p class="footer-sns">' + snsLinks + "</p>" : "") +
      '<nav class="footer-nav">' +
      '<a href="shop.html">SHOP</a>' +
      '<a href="about.html">ABOUT</a>' +
      '<a href="access.html">ACCESS</a>' +
      '<a href="contact.html">CONTACT</a>' +
      '<a href="legal.html">特定商取引法に基づく表記</a>' +
      '<a href="privacy.html">プライバシーポリシー</a>' +
      '<a href="terms.html">利用規約</a>' +
      "</nav></div>"
    );
  }

  function productCard(product) {
    var sold = product.stock === 0;
    var price = window.SanjuStore.formatPrice(product.price);
    var buyDisabled = !window.SanjuStore.canPurchase(product);
    return (
      '<article class="product-card reveal">' +
      '<a class="product-card-image" href="' +
      productHref(product.id) +
      '">' +
      imgTag(product.images && product.images[0], product.name) +
      (sold ? '<span class="sold-badge">SOLD OUT</span>' : "") +
      "</a>" +
      '<p class="eyebrow">' +
      escapeHtml(categoryLabel(product.category)) +
      "</p>" +
      "<h3>" +
      escapeHtml(product.name) +
      "</h3>" +
      '<p class="muted">' +
      escapeHtml(product.shortDescription || "") +
      "</p>" +
      '<p class="' +
      priceClass(product.price) +
      '">' +
      escapeHtml(price) +
      "</p>" +
      '<div class="card-actions">' +
      '<a class="btn btn-ghost" href="' +
      productHref(product.id) +
      '">詳細を見る</a>' +
      '<button type="button" class="btn" data-add-cart="' +
      escapeHtml(product.id) +
      '"' +
      (buyDisabled ? " disabled" : "") +
      ">" +
      escapeHtml(buyLabel(product)) +
      "</button>" +
      "</div></article>"
    );
  }

  function emptyNote(category) {
    if (category === "art") {
      return '<p class="empty-note">いま掲載中の作品はありません。作品名、写真、価格が決まり次第、こちらに並びます。</p>';
    }
    return '<p class="empty-note">現在、公開中の商品はありません。</p>';
  }

  function fillGrid(selector, category) {
    var el = $(selector);
    if (!el) return;
    var items = window.SanjuStore.publishedProducts().filter(function (p) {
      return !category || p.category === category;
    });
    el.innerHTML = items.length ? items.map(productCard).join("") : emptyNote(category);
  }

  function renderShop() {
    var grid = $("[data-product-grid]");
    if (!grid) return;
    var cat = new URLSearchParams(location.search).get("category") || "all";
    if (cat !== "soap" && cat !== "tea" && cat !== "art") cat = "all";
    var links = document.querySelectorAll("[data-filter]");
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute("data-filter") === cat) links[i].classList.add("is-current");
    }
    var items = window.SanjuStore.publishedProducts().filter(function (p) {
      return cat === "all" || p.category === cat;
    });
    grid.innerHTML = items.length ? items.map(productCard).join("") : emptyNote(cat === "all" ? "" : cat);
  }

  function specRow(label, value) {
    if (value === null || value === undefined || value === "") return "";
    return "<div><dt>" + escapeHtml(label) + "</dt><dd>" + escapeHtml(value) + "</dd></div>";
  }

  function stockText(product) {
    if (product.stock === 0) return "SOLD OUT";
    if (product.stock === null || product.stock === undefined || product.stock === "") return "要入力";
    return String(product.stock);
  }

  function renderProduct() {
    var root = $("#product-root");
    if (!root) return;
    var id = new URLSearchParams(location.search).get("id");
    if (!id) {
      root.innerHTML =
        '<p class="empty-note">商品が指定されていません。</p><p><a class="btn" href="shop.html">SHOPへ</a></p>';
      return;
    }
    var product = window.SanjuStore.getProduct(id);
    if (!product) {
      root.innerHTML =
        '<p class="empty-note">この商品は見つかりません。</p><p><a class="btn" href="shop.html">SHOPへ</a></p>';
      return;
    }
    document.title = product.name + "｜三寿";
    document.body.classList.add("has-buybar");
    var images = product.images && product.images.length ? product.images : [PLACEHOLDER];
    var thumbs = "";
    if (images.length > 1) {
      thumbs = '<div class="thumbs">' + images
        .map(function (src, index) {
          return (
            '<button type="button" class="' +
            (index === 0 ? "is-current" : "") +
            '" data-thumb="' +
            escapeHtml(src) +
            '" aria-label="写真' +
            (index + 1) +
            '">' +
            imgTag(src, product.name) +
            "</button>"
          );
        })
        .join("") + "</div>";
    }
    var howLabel = product.category === "tea" ? "飲み方" : "使い方";
    var disabled = !window.SanjuStore.canPurchase(product);
    var label = buyLabel(product);
    var note = "";
    if (product.stock === 0) {
      note = "この商品は SOLD OUT です。";
    } else if (disabled) {
      note = "価格の設定が済むと、カートに入れられるようになります。";
    } else {
      note = "ご購入手続きは Shopify の決済ページで行います。カード番号はこのサイトには残りません。";
    }
    var specs =
      specRow("作家名", product.artist) +
      specRow("制作年", product.year) +
      specRow("素材", product.material) +
      specRow("内容量", product.volume) +
      specRow("サイズ", product.size) +
      specRow("原材料", product.ingredients) +
      specRow(howLabel, product.howToUse) +
      specRow("使用上の注意", product.precautions) +
      specRow("保存方法", product.storage) +
      specRow("表示", product.originNote) +
      specRow("在庫", stockText(product)) +
      specRow("販売者", product.seller);
    root.innerHTML =
      '<article class="product-layout">' +
      '<div class="product-gallery">' +
      '<div class="product-gallery-main">' +
      '<img data-main-image src="' +
      escapeHtml(images[0]) +
      '" alt="' +
      escapeHtml(product.name) +
      '" onerror="this.onerror=null;this.src=\'' +
      PLACEHOLDER +
      "';\">" +
      "</div>" +
      thumbs +
      "</div>" +
      '<div class="product-info">' +
      '<p class="eyebrow"><a href="' +
      categoryPage(product.category) +
      '">' +
      escapeHtml(categoryLabel(product.category)) +
      "</a></p>" +
      "<h1>" +
      escapeHtml(product.name) +
      "</h1>" +
      '<p class="' +
      priceClass(product.price) +
      '">' +
      escapeHtml(window.SanjuStore.formatPrice(product.price)) +
      "</p>" +
      '<p class="muted">' +
      escapeHtml(product.shortDescription || "") +
      "</p>" +
      '<div class="prose">' +
      nl2br(product.description || "") +
      "</div>" +
      (specs ? '<dl class="spec">' + specs + "</dl>" : "") +
      '<div class="buy-row">' +
      '<label>数量<input id="product-qty" type="number" min="1" value="1" inputmode="numeric"' +
      (disabled ? " disabled" : "") +
      "></label>" +
      '<button type="button" class="btn" data-add-cart="' +
      escapeHtml(product.id) +
      '"' +
      (disabled ? " disabled" : "") +
      ">" +
      escapeHtml(label) +
      "</button>" +
      "</div>" +
      '<p class="fine">' +
      escapeHtml(note) +
      "</p>" +
      "</div></article>" +
      '<div class="mobile-buy">' +
      "<div>" +
      '<p class="mobile-buy-name">' +
      escapeHtml(product.name) +
      "</p>" +
      '<p class="' +
      priceClass(product.price) +
      '">' +
      escapeHtml(window.SanjuStore.formatPrice(product.price)) +
      "</p>" +
      "</div>" +
      '<button type="button" class="btn" data-add-cart="' +
      escapeHtml(product.id) +
      '"' +
      (disabled ? " disabled" : "") +
      ">" +
      escapeHtml(label) +
      "</button>" +
      "</div>";
    root.addEventListener("click", function (e) {
      var thumb = e.target.closest("[data-thumb]");
      if (!thumb) return;
      var main = $("[data-main-image]", root);
      if (main) main.src = thumb.getAttribute("data-thumb");
      var buttons = root.querySelectorAll("[data-thumb]");
      for (var i = 0; i < buttons.length; i++) buttons[i].classList.remove("is-current");
      thumb.classList.add("is-current");
    });
  }

  function renderCart() {
    var root = $("#cart-root");
    if (!root) return;
    var rows = window.SanjuStore.detailedCart();
    if (!rows.length) {
      root.innerHTML =
        '<p class="empty-note">カートに商品は入っていません。</p><p><a class="btn" href="shop.html">SHOPを見る</a></p>';
      return;
    }
    var pending = rows.some(function (row) {
      return !window.SanjuStore.canPurchase(row.product);
    });
    var totalText = pending
      ? "要入力"
      : window.SanjuStore.formatPrice(window.SanjuStore.cartTotal());
    var cfg = (window.SANJU && window.SANJU.shopify) || {};
    var ready = cfg.enabled && cfg.storeUrl;
    var lines = rows
      .map(function (row) {
        var p = row.product;
        var lineText =
          row.lineTotal === null ? "要入力" : window.SanjuStore.formatPrice(row.lineTotal);
        return (
          '<article class="cart-line">' +
          '<a class="cart-thumb" href="' +
          productHref(p.id) +
          '">' +
          imgTag(p.images && p.images[0], p.name) +
          "</a>" +
          "<div>" +
          '<p class="eyebrow">' +
          escapeHtml(categoryLabel(p.category)) +
          "</p>" +
          "<h2>" +
          '<a href="' +
          productHref(p.id) +
          '">' +
          escapeHtml(p.name) +
          "</a></h2>" +
          '<p class="' +
          priceClass(p.price) +
          '">' +
          escapeHtml(window.SanjuStore.formatPrice(p.price)) +
          "</p>" +
          '<label class="qty-label">数量<input type="number" min="1" value="' +
          escapeHtml(row.qty) +
          '" data-qty-set="' +
          escapeHtml(p.id) +
          '"></label>' +
          '<button type="button" class="text-btn" data-remove="' +
          escapeHtml(p.id) +
          '">削除</button>' +
          "</div>" +
          '<p class="cart-line-total ' +
          (row.lineTotal === null ? "is-pending" : "") +
          '">' +
          escapeHtml(lineText) +
          "</p>" +
          "</article>"
        );
      })
      .join("");
    root.innerHTML =
      lines +
      '<div class="cart-summary">' +
      "<p>小計 <strong class=\"" +
      (pending ? "is-pending" : "") +
      '">' +
      escapeHtml(totalText) +
      "</strong></p>" +
      '<p class="fine">送料は Shopify の決済ページで計算されます。送料・返品の条件は、特定商取引法に基づく表記の「要入力」を本番前に埋めてください。</p>' +
      '<p class="fine">' +
      (ready
        ? "ご購入手続きへ進むと、Shopifyの決済ページが開きます。カード番号はこのサイトには送信されません。"
        : "決済の接続はまだ準備中です。価格と Shopify の設定が済むと、ここからカード決済へ進めます。") +
      "</p>" +
      '<p data-cart-message class="cart-message" role="status"></p>' +
      '<button type="button" class="btn" data-checkout>ご購入手続きへ</button>' +
      "</div>";
  }

  function renderComplete() {
    var slot = $("#order-number");
    var page = document.querySelector('[data-page="complete"]');
    if (!slot || !page) return;
    var params = new URLSearchParams(location.search);
    var num = params.get("order") || params.get("order_number") || "";
    slot.textContent = num || "Shopifyの完了画面とメールが正式です";
    window.SanjuStore.clearCart();
  }

  function applyCopy() {
    var c = window.SANJU;
    var catchEl = $("#hero-catch");
    if (catchEl && c.hero && c.hero.catchphrase) catchEl.textContent = c.hero.catchphrase;
    var aboutH = $("#about-heading");
    if (aboutH && c.about && c.about.heading) aboutH.textContent = c.about.heading;
    var aboutB = $("#about-body");
    if (aboutB && c.about && c.about.body) aboutB.textContent = c.about.body;
    if (c.seo && c.seo.siteUrl) {
      var link = document.createElement("link");
      link.rel = "canonical";
      var file = location.pathname.split("/").pop() || "";
      link.href = String(c.seo.siteUrl).replace(/\/$/, "") + "/" + file + location.search;
      document.head.appendChild(link);
    }
  }

  function currentFile() {
    var file = location.pathname.split("/").pop();
    return file || "index.html";
  }

  function markCurrentNav() {
    var file = currentFile();
    var links = document.querySelectorAll("[data-nav] a");
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href");
      if (href === file || (file === "" && href === "index.html")) {
        links[i].classList.add("is-current");
        links[i].setAttribute("aria-current", "page");
      }
    }
  }

  function armImage(img) {
    function fail() {
      if (img.getAttribute("data-broken") === "1") return;
      var src = img.getAttribute("src") || "";
      if (src.indexOf("placeholder.svg") !== -1) return;
      img.setAttribute("data-broken", "1");
      if (img.id === "hero-image") {
        var wrap = img.closest(".hero-image-wrap");
        if (wrap) {
          wrap.classList.add("is-empty");
          wrap.setAttribute("aria-hidden", "true");
        }
        return;
      }
      img.src = PLACEHOLDER;
    }
    img.addEventListener("error", fail);
    if (img.complete && img.naturalWidth === 0) fail();
  }

  function fixImages(root) {
    var imgs = (root || document).querySelectorAll("img");
    for (var i = 0; i < imgs.length; i++) armImage(imgs[i]);
  }

  function showToast(message) {
    var el = $(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("is-on");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(function () {
      el.classList.remove("is-on");
    }, 2600);
  }

  function bindChrome() {
    var nav = $("[data-nav]");
    var toggle = $("[data-toggle-nav]");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    var modal = $("#search-modal");
    var input = $("#search-input");
    var results = $("#search-results");
    function openSearch() {
      if (!modal) return;
      modal.hidden = false;
      if (input) input.focus();
    }
    function closeSearch() {
      if (!modal) return;
      modal.hidden = true;
    }
    var openBtn = $("[data-open-search]");
    if (openBtn) openBtn.addEventListener("click", openSearch);
    var closeBtn = $("[data-close-search]");
    if (closeBtn) closeBtn.addEventListener("click", closeSearch);
    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) closeSearch();
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeSearch();
    });
    if (input && results) {
      input.addEventListener("input", function () {
        var q = input.value.trim().toLowerCase();
        if (!q) {
          results.innerHTML = "";
          return;
        }
        var list = window.SanjuStore.publishedProducts().filter(function (p) {
          var blob = (
            p.name +
            " " +
            (p.shortDescription || "") +
            " " +
            categoryLabel(p.category)
          ).toLowerCase();
          return blob.indexOf(q) !== -1;
        });
        results.innerHTML = list.length
          ? list
              .map(function (p) {
                return (
                  '<a class="search-hit" href="' +
                  productHref(p.id) +
                  '"><strong>' +
                  escapeHtml(p.name) +
                  "</strong><span>" +
                  escapeHtml(categoryLabel(p.category)) +
                  "</span></a>"
                );
              })
              .join("")
          : '<p class="muted">該当する商品がありません。</p>';
      });
    }
  }

  function bindActions() {
    document.addEventListener("click", function (e) {
      var add = e.target.closest("[data-add-cart]");
      if (add && !add.disabled) {
        var qtyInput = $("#product-qty");
        var qty = qtyInput ? qtyInput.value : 1;
        var result = window.SanjuStore.addToCart(add.getAttribute("data-add-cart"), qty);
        showToast(result.message);
        return;
      }
      var remove = e.target.closest("[data-remove]");
      if (remove) {
        window.SanjuStore.removeItem(remove.getAttribute("data-remove"));
        renderCart();
        return;
      }
      var checkout = e.target.closest("[data-checkout]");
      if (checkout) {
        var outcome = window.SanjuStore.checkoutToShopify();
        var msg = $("[data-cart-message]");
        if (outcome && !outcome.ok && msg) msg.textContent = outcome.message;
      }
    });
    document.addEventListener("change", function (e) {
      var qty = e.target.closest("[data-qty-set]");
      if (!qty) return;
      window.SanjuStore.setQty(qty.getAttribute("data-qty-set"), qty.value);
      renderCart();
    });
  }

  function bindContact() {
    var form = $("[data-contact-form]");
    if (!form || !window.SANJU) return;
    var endpoint = window.SANJU.contact && window.SANJU.contact.formEndpoint;
    if (endpoint) {
      form.action = endpoint;
      form.method = "POST";
      return;
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var subject = fd.get("subject") || "三寿へのお問い合わせ";
      var body =
        "お名前: " +
        (fd.get("name") || "") +
        "\nメール: " +
        (fd.get("email") || "") +
        "\n\n" +
        (fd.get("message") || "");
      window.location.href =
        "mailto:" +
        window.SANJU.brand.email +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
    });
  }

  function boot() {
    if (!window.SANJU || !window.SanjuStore) return;
    var header = $("#site-header");
    if (header) header.innerHTML = headerHTML();
    var footer = $("#site-footer");
    if (footer) footer.innerHTML = footerHTML();
    markCurrentNav();
    bindChrome();
    bindActions();
    applyCopy();
    fixImages();
    renderShop();
    fillGrid("[data-soap-grid]", "soap");
    fillGrid("[data-tea-grid]", "tea");
    fillGrid("[data-art-grid]", "art");
    renderProduct();
    renderCart();
    renderComplete();
    bindContact();
    window.SanjuStore.updateCartBadge();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
