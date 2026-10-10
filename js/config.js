/**
 * 三寿のサイト設定（キャッチコピー、Shopify、SNS）
 *
 * 価格・原材料・在庫は js/products.js を編集してください。
 * 未定の項目は空のままにします。架空のURLや金額は入れません。
 */
window.SANJU = {
  brand: {
    name: "三寿",
    atelier: "アトリエライブ",
    address: "〒270-0222 千葉県野田市木間ケ瀬2640-13",
    tel: "070-1519-5757",
    telHref: "tel:07015195757",
    email: "atelierlive264013@gmail.com",
  },
  // 画像ロゴを使うときだけ "images/logo.png" のように入れる。空なら文字の「三寿」。
  logoImage: "",
  hero: {
    catchphrase: "暮らしに、やさしいものを。",
  },
  about: {
    heading: "三寿について",
    body:
      "三寿では、毎日の暮らしの中で使うものだからこそ、素材や手仕事を大切にし、一つひとつ丁寧に作っています。肌に触れる石鹸、日々の時間を楽しむブレンドティー、そして暮らしや心を彩るアート。自然の恵みと作り手の想いを、一つひとつの品に込めてお届けします。",
  },
  sns: {
    // URLが決まるまで空。架空のアカウントは入れない。
    instagram: "",
  },
  shopify: {
    // STEP 7: ストア公開と商品登録のあと true にし、storeUrl を入れる。
    enabled: false,
    storeUrl: "",
  },
  seo: {
    // GitHub Pages の公開URL。例: "https://example.github.io/sanju-shop"
    siteUrl: "",
  },
  contact: {
    // Formspree などの送信先。空のときはメールアプリが開く。
    formEndpoint: "",
  },
};
