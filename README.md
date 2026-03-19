# Pixel Q&A Arcade - 闖關問答遊戲

這是一個基於 React Vite 開發的 2000 年代街機像素風格闖關問答遊戲。遊戲題目與玩家成績皆透過 Google Apps Script 連接至 Google Sheets 進行雲端存取。

## 系統需求

- Node.js (建議 v18 以上)
- 一個 Google 帳號 (用於建立 Google Sheets 與 Apps Script)

## 專案安裝與執行

1. 進入專案目錄並安裝套件：

   ```bash
   npm install
   ```

2. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

---

## ☁️ Google Sheets 與 Google Apps Script 設定教學

為了讓遊戲能正確抓取題目並記錄成績，請照著以下步驟建立你的雲端資料庫。

### 步驟 1：建立 Google Sheets

1. 前往 [Google Sheets](https://docs.google.com/spreadsheets/) 並建立一份新的空白試算表。
2. 建立兩個工作表（點擊左下角的 `+` 新增），分別命名為：
   - `題目`
   - `回答`

### 步驟 2：設定工作表欄位

請**精確**在第一列 (A1 出發) 填入以下標題：

**在「題目」工作表：**
| A (題號) | B (題目) | C (A) | D (B) | E (C) | F (D) | G (解答) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |

**在「回答」工作表：**
| A (ID) | B (闖關次數) | C (總分) | D (最高分) | E (第一次通關分數) | F (花了幾次通關) | G (最近遊玩時間) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |

### 步驟 3：部署 Google Apps Script

1. 在剛剛建立的 Google Sheets 頂部選單，點擊 **擴充功能** > **Apps Script**。
2. 清空原本編輯器內的程式碼。
3. 將專案內 `GAS_Code.gs` 的所有程式碼複製並貼上到你的 Apps Script 編輯器中。
4. 點擊上方的「儲存」圖示 (或按 `Ctrl+S`) 儲存專案 (可以命名為 "Pixel Game Backend")。
5. 點擊右上角的藍色按鈕 **「部署」** > **「新增部署作業」**。
6. 在左上方點擊齒輪圖示，選擇 **「網頁應用程式」**。
7. 設定選項：
   - 執行身分：**「我」**
   - 誰可以存取：**「所有人」**
8. 點擊 **「部署」**。如果是第一次執行，Google 會要求授權，請點擊「授權存取」-> 選擇你的帳號 -> 點擊左下角的「進階」-> 點擊「前往 (專案名稱) (不安全)」並點擊「允許」。
9. 部署完成後，複製畫面上顯示的 **「網頁應用程式網址」 (Web App URL)**。

### 步驟 4：設定環境變數

在專案根目錄找到 `.env` 檔案，將剛剛複製的網址貼到 `VITE_GOOGLE_APP_SCRIPT_URL` 變數中。

```env
VITE_GOOGLE_APP_SCRIPT_URL=這裡貼上你的網址
VITE_PASS_THRESHOLD=3
VITE_QUESTION_COUNT=5
```

設定完成後，重新啟動一次 `npm run dev` 即可享受完整的遊戲體驗！

---

## 🚀 部署到 GitHub Pages

這份專案內建了透過 GitHub Actions 自動部署至 GitHub Pages 的設定（路徑為 `.github/workflows/deploy.yml`）。只要將專案上傳並推送程式碼到 `main` 分支，系統即會自動幫你進行編譯與部署。請依循以下步驟完成設定：

### 步驟 1：配置 GitHub Repository Secrets (環境變數)

在進行編譯部署時，Vite 會需要讀取你的環境變數設定。請前往你的 GitHub 專案頁面：

1. 點擊上方的 **Settings** 標籤。
2. 在左側選單中尋找並點擊 **Secrets and variables** > **Actions**。
3. 點擊畫面上的綠色按鈕 **New repository secret**，並依序新增與你的 `.env.example` 相對應的四個環境變數名稱與值：
   - `VITE_GOOGLE_APP_SCRIPT_URL` (貼上你在 GAS 部署的對應網址)
   - `VITE_QUESTION_COUNT` (測驗總題數，如 `10`)
   - `VITE_PASS_THRESHOLD` (通關門檻，如 `3`)
   - `VITE_API_TOKEN` (如有設定請填入)

### 步驟 2：開啟 GitHub Pages 權限

為了讓 Actions 可以部署到 Pages：

1. 一樣在 GitHub 專案中點擊 **Settings**。
2. 在左側選單點擊 **Pages**。
3. 找到 **Build and deployment** 區塊，將 **Source** 下拉選單改為 `GitHub Actions`。

> 💡 **提示**：我們已經在 `vite.config.ts` 內將 `base` 設為相對路徑 (`'./'`)，所以部署後資源載入（CSS、JS、圖片等）的 404 問題已自動解決。

### 步驟 3：推送程式碼自動觸發

當完成以上儲存庫設定後，只要你將本地改動推送到遠端 `main` 分支（或在 GitHub Actions 頁面手動觸發 `Deploy to GitHub Pages`），就可以坐等 GitHub 替你編譯並把網站上線囉！

---

## 📝 測試題庫：生成式 AI 基礎知識

你可以直接複製以下表格的內容，並在 Google Sheets 的**「題目」工作表**的 A2 格子點擊「貼上」，作為測試題庫！

| 題號 | 題目                                                                | A                                              | B                            | C                                                    | D                        | 解答 |
| :--- | :------------------------------------------------------------------ | :--------------------------------------------- | :--------------------------- | :--------------------------------------------------- | :----------------------- | :--- |
| Q01  | 生成式 AI（Generative AI）最主要的功能是什麼？                      | 提升電腦硬體效能                               | 建立關聯式資料庫             | 創造新的內容（如文字、圖片、音樂）                   | 自動過濾垃圾郵件         | C    |
| Q02  | 下列哪一個是常見的文字生成式 AI 模型？                              | ChatGPT                                        | Photoshop                    | Excel                                                | Spotify                  | A    |
| Q03  | 在輸入提示詞（Prompt）給 AI 時，哪種做法通常能得到更好的結果？      | 越短越好                                       | 提供明確的背景、角色與限制   | 全部用大寫字母                                       | 只提供一個單字           | B    |
| Q04  | LLM 在人工智慧領域代表什麼意思？                                    | Large Local Network                            | Limited Learning Machine     | Large Language Model                                 | Logical Linear Matrix    | C    |
| Q05  | AI 生成的內容有時候會出現似是而非的錯誤資訊，這種現象通常稱為什麼？ | 系統崩潰 (Crash)                               | 幻覺 (Hallucination)         | 緩存溢出 (Buffer Overflow)                           | 遞迴 (Recursion)         | B    |
| Q06  | 下列哪一種工具主要被設計用來透過文字提示詞「生成圖片」？            | Midjourney                                     | Microsoft Word               | Netflix                                              | Google Maps              | A    |
| Q07  | 訓練大型語言模型通常需要大量的什麼資源？                            | 音樂版權                                       | 實體印表機                   | 乾淨且多樣化的數據資料                               | 電池續航力               | C    |
| Q08  | 關於 AI 生成內容的著作權，目前世界上多數國家的初步共識傾向於？      | 全部屬於 AI 開發公司                           | 只要是電腦產出的都有完整版權 | 純 AI 生成、無人類創意介入的成品，通常不受著作權保護 | 版權屬於提供網路的電信商 | C    |
| Q09  | 下列哪一個不是生成式 AI 目前可以獨立穩定完成的任務？                | 撰寫一首短詩                                   | 摘要一份長文檔               | 負完全法律責任的醫療手術判斷                         | 生成一張科幻風格的桌布   | C    |
| Q10  | 當我們說一個 AI 具有「多模態 (Multimodal)」能力時，代表它能做什麼？ | 同時理解並處理文字、圖片甚至聲音等多種格式輸入 | 只能處理文字，但會多國語言   | 可以在不同的作業系統上安裝                           | 可以無限制的存取網路內容 | A    |
