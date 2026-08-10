# 喜帖網站 · Wedding Invitation

美式簡潔風的單頁喜帖，純 HTML / CSS / JS，沒有任何建置步驟，直接丟上 GitHub Pages 就能用。
出席回覆（RSVP）走 Google 表單。

```
marry/
├── index.html              ← 頁面內容（文案在這裡改）
├── .nojekyll               ← 讓 GitHub Pages 不要用 Jekyll 處理
└── assets/
    ├── css/style.css       ← 樣式（配色在檔案最上方 :root）
    ├── js/config.js        ← ★ 姓名、日期、場地、表單網址都改這支
    ├── js/main.js          ← 倒數、選單、動畫、行事曆（不用動）
    └── img/                ← hero.jpg、og.jpg、logo
```

## 1. 改成你們的資訊

打開 `assets/js/config.js`，改新人姓名、日期時間、場地、電話。
改完存檔重新整理就會全站同步（倒數計時、加入行事曆、頁尾也會跟著變）。

比較長的文案（邀請信、當日流程、貼心提醒）在 `index.html` 裡，
每一段都有中文註解標示，照著改就好。

## 2. 接上 Google 表單

1. 到 [Google 表單](https://docs.google.com/forms) 建一份新表單，建議欄位：
   - 姓名（簡答，必填）
   - 是否出席（單選：會出席 / 無法出席）
   - 出席人數（簡答）
   - 是否有素食或飲食需求（簡答）
   - 想坐在哪一桌／認識哪一方（單選：男方 / 女方）
   - 給新人的話（段落）
2. 右上角 **傳送** → 點鏈結圖示 → 勾「縮短網址」→ 複製。
3. 貼到 `config.js` 的 `googleForm.formUrl`。
   貼完整的 `/viewform` 網址、甚至整段 `<iframe>` 也可以，程式會自動處理。
4. 把表單裡寫的回覆期限，同步填到 `config.js` 的 `rsvpDeadline`（格式 `YYYY-MM-DD`）。
   **兩邊日期必須一致**，不然賓客會看到兩個不同的期限。

表單**不嵌在頁面裡**，出席回覆區塊是一顆按鈕，點了會開新視窗跳到 Google 表單。
沒填網址的時候頁面不會壞，該區塊會顯示設定步驟提示。

回覆結果在表單的「回覆」分頁，可以按綠色圖示匯出成 Google 試算表方便排座位。

## 3. 放照片

**封面照片**：`assets/img/hero.jpg`。用 `object-fit: contain` 完整顯示，
**不做任何裁切**，所以直幅、橫幅都可以直接換。桌機是「左文字、右照片」，
手機則是「上文字、下照片」，照片會自動吃掉剩下的高度。

**Logo**：`assets/img/logo.png` 是原圖，另外裁出 `logo-mark.png`（導覽列）
和 `logo-large.png`（封面）兩個去邊、透明背景的版本，路徑寫在 `config.js`
的 `brand`。導覽列 logo 若載入失敗會自動退回文字縮寫。

**封面版面**：用 CSS Grid 的 `grid-template-areas` 做響應式重排，
HTML 只有一份，手機和桌機共用：

```
手機（單欄）        桌機（雙欄）
  head              head   photo
  photo             info   photo
  info
```

`head` 是 logo 與名字，`photo` 是全身照，`info` 是日期場地與按鈕。
手機刻意把 `head` 壓矮，讓全身照能落在第一個螢幕裡先被看到。

**封面高度**：`.cover` 用 `min-height: 100svh`，並且刻意**不設** `overflow: hidden`、
也不鎖死高度。內容需要更多空間時整段會自然往下長，任何螢幕尺寸都不會裁到資訊。
照片用 `max-height` 搭配 `width: auto` 控制，天生不裁切。
想調整照片大小，改 `style.css` 裡 `.cover__photo img` 的 `max-height`
（手機 `56svh`、矮螢幕 `50svh`、桌機 `70svh`）。

`hero.jpg` 沒放也不會破圖，封面會自動退回純文字版型。

## 4. 部署到 GitHub Pages

```bash
git init
git add .
git commit -m "Wedding invitation site"
git branch -M main
git remote add origin https://github.com/<你的帳號>/<repo 名稱>.git
git push -u origin main
```

接著在 GitHub 上：

1. 進 repo 的 **Settings** → 左邊選 **Pages**
2. Source 選 **Deploy from a branch**
3. Branch 選 `main`、資料夾選 `/ (root)`，按 **Save**
4. 等一兩分鐘，網址是 `https://<你的帳號>.github.io/<repo 名稱>/`

Repo 必須是 **Public**（免費帳號的 Pages 只支援公開 repo）。

### 想用自己的網域

在專案根目錄建一個 `CNAME` 檔案，內容寫網域（例如 `jason-and-yvonne.com`），
再到網域商把 DNS 指到 GitHub Pages，然後在 Settings → Pages 填入 Custom domain。

## 5. 本機預覽

因為有 `iframe` 與相對路徑，建議用簡易伺服器而不是直接雙擊開檔：

```powershell
# 有 Python
python -m http.server 5173

# 或有 Node
npx serve .
```

然後開 http://localhost:5173

## 已內建的功能

- 倒數計時（以台灣時區為準，全世界的賓客看到的都是台灣婚期時間）
- 加入行事曆（下載 `.ics`，iPhone / Google 日曆 / Outlook 都可匯入）
- Google 地圖導航按鈕，以及連到飯店官方交通資訊頁的按鈕（`venue.transitUrl`）
- 手機版漢堡選單、捲動時導覽列自動標亮目前段落
- 捲動進場動畫，並尊重系統的「減少動態效果」設定
- 分享到 LINE / Facebook 的預覽卡片（Open Graph）
- 列印樣式：直接 Ctrl+P 就是一張乾淨的紙本喜帖
