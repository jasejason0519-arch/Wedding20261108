把婚紗／生活照放進這個資料夾。

【已完成】
  hero.jpg            封面照片，1467 x 2200，約 232KB
                      完整顯示不裁切，所以換成橫幅照片也不會壞。
  og.jpg              分享預覽圖，1200 x 630，約 67KB
                      LINE / Facebook 貼連結時會顯示這張。
  hero-original.jpeg  未壓縮原始照片，3072 x 4608，7MB
                      已在 .gitignore 排除，不會上傳到 GitHub。
                      確認網站沒問題後可以自行刪除。

  logo.png            你提供的 logo 原圖，3449 x 2481
                      字標只佔畫布 23% x 32%，四周都是透明留白，
                      直接用會顯得很小，所以裁出下面三個版本。
  logo-mark.png       160 x 160，墨色，給左上角導覽列
  logo-large.png      641 x 640，墨色，給封面
  logo-light.png      641 x 640，米白，給結語區
                      結語區是深墨色底，墨色 logo 放上去會看不見，
                      所以用 ColorMatrix 把 RGB 換成米白、保留透明度。

  換 logo 的時候：把新圖存成 logo.png，然後告訴我重新裁一次，
  或自己準備好裁邊、透明背景的正方形圖覆蓋 logo-mark / logo-large。

小提醒：
- 上傳前先壓到 400KB 以內（可用 squoosh.app），手機開啟會快很多。
  hero.jpg 是第一眼就要看到的圖，尤其重要。
- 檔名請用小寫英數，避免中文或空白。
- hero.jpg 還沒放進來時網站不會破圖，封面會維持純文字版型。
