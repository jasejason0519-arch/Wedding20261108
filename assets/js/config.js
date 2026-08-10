/* =============================================================
   婚禮設定檔  —  只要改這一支檔案，全站文字/日期/連結都會跟著變
   ============================================================= */

window.WEDDING_CONFIG = {
  /* ---------- 新人 ---------- */
  couple: {
    groom: { name: '林顏琛', en: 'Jason' },
    bride: { name: '嚴思函', en: 'Yvonne' },
    monogram: 'J & Y'
  },

  /* ---------- 婚禮 logo ----------
     logo.png 是你提供的原圖，四周留白很多且字標只佔畫布 23%，
     所以另外產了兩個裁好邊、背景透明的版本：
       logo-mark.png   160px  給左上角導覽列
       logo-large.png  640px  給封面
     想換 logo 的話，換掉這兩個檔案即可（正方形、透明背景最佳）。 */
  brand: {
    logo: 'assets/img/logo-mark.png',
    logoLarge: 'assets/img/logo-large.png',
    // 淺色版，給頁尾上方深色的結語區用（深色底放墨色 logo 會看不見）
    logoLight: 'assets/img/logo-light.png',
    alt: '林顏琛 & 嚴思函'
  },

  /* ---------- 封面照片 ----------
     完整顯示不裁切（object-fit: contain），所以直幅橫幅都可以。
     src 留空的話封面會自動變成沒有照片的純文字版型。            */
  heroPhoto: {
    src: 'assets/img/hero.jpg',
    alt: '林顏琛與嚴思函'
  },

  /* ---------- 日期時間（ISO 8601，+08:00 為台灣時區）----------
     startAt = 開席時間，倒數計時、加入行事曆都以這個為準         */
  startAt: '2026-11-08T12:00:00+08:00',
  endAt: '2026-11-08T14:30:00+08:00',

  /* ---------- 場地 ---------- */
  venue: {
    name: '台北萬豪酒店',
    hall: '宜華廳 5F',
    address: '台北市中山區樂群二路 199 號',
    // Google 地圖連結：到地圖上按「分享」複製網址貼進來
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=台北萬豪酒店+台北市中山區樂群二路199號',
    // 飯店官方交通資訊頁
    transitUrl: 'https://www.taipeimarriott.com.tw/websev?cat=page&id=44'
  },

  /* ---------- Google 表單 ----------
     表單不嵌在頁面裡，而是用一顆按鈕開新視窗跳轉過去。
     取得網址：Google 表單 → 右上「傳送」→ 點鏈結圖示 →
               勾「縮短網址」→ 複製貼上。
     貼完整的 /viewform 網址、甚至整段 <iframe> 也可以，
     程式會自動抓出網址並清掉 embedded=true 這種嵌入專用參數。
     沒填的話 RSVP 區塊會顯示設定提示，不會壞掉。                 */
  googleForm: {
    formUrl: 'https://forms.gle/ewYUD29JHtf89YJA9'
  },

  /* ---------- 出席回覆截止日 ----------
     必須和 Google 表單裡寫的日期一致，不然賓客會看到兩個不同的期限。
     格式 YYYY-MM-DD。留空的話會自動用「婚期前 30 天」。          */
  rsvpDeadline: '2026-08-28'
};
