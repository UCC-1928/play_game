const API_TOKEN = "my_secret_123"; // 這是你的私密金鑰

function checkAuth(e) {
  // 檢查參數 (GET) 或 Post Data (POST) 是否帶有正確密碼
  let token = e.parameter.token;
  if (!token && e.postData && e.postData.contents) {
    try {
      token = JSON.parse(e.postData.contents).token;
    } catch (err) {}
  }
  return token === API_TOKEN;
}

// 處理讀取題目 (GET)
function doGet(e) {
  if (!checkAuth(e)) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Unauthorized: Missing or invalid token" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const action = e.parameter.action;
  if (action === "getQuestions") {
    const count = parseInt(e.parameter.count) || 5;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("題目");
    const data = sheet.getDataRange().getValues();
    data.shift(); // 移除標題

    // 洗牌並取出題目
    const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, count);
    const questions = shuffled.map((row) => ({
      id: row[0],
      text: row[1],
      options: { A: row[2], B: row[3], C: row[4], D: row[5] }
    }));

    return ContentService.createTextOutput(JSON.stringify({ status: "success", questions: questions }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Unknown action" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// 處理提交分數 (POST)
function doPost(e) {
  if (!checkAuth(e)) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Unauthorized" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const postData = JSON.parse(e.postData.contents);
    if (postData.action === "submitScore") {
      const id = postData.id;
      const answers = postData.answers;
      const ss = SpreadsheetApp.getActiveSpreadsheet();

      // 核對答案
      const qSheet = ss.getSheetByName("題目");
      const qData = qSheet.getDataRange().getValues();
      qData.shift();
      const answerMap = {};
      qData.forEach(row => answerMap[row[0]] = String(row[6]));

      let score = 0;
      answers.forEach(ans => {
        if (answerMap[ans.questionId] === String(ans.selectedOption)) score++;
      });

      const passThreshold = 3;
      const passed = score >= passThreshold;

      // 錄入成績
      const aSheet = ss.getSheetByName("回答");
      if (!aSheet) return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Sheet '回答' not found" })).setMimeType(ContentService.MimeType.JSON);
      
      const aData = aSheet.getDataRange().getValues();
      let rowIndex = -1;
      for (let i = 1; i < aData.length; i++) {
        if (aData[i][0] == id) { rowIndex = i + 1; break; }
      }

      const now = new Date();
      if (rowIndex === -1) {
        aSheet.appendRow([id, 1, score, score, (passed ? score : ""), (passed ? 1 : ""), now]);
      } else {
        const rowData = aData[rowIndex - 1];
        const playCount = Number(rowData[1] || 0) + 1;
        const totalScore = Number(rowData[2] || 0) + score;
        let highestScore = Math.max(Number(rowData[3] || 0), score);
        let firstPassScore = rowData[4];
        let triesToClear = rowData[5];
        if (passed && !firstPassScore) { firstPassScore = score; triesToClear = playCount; }

        aSheet.getRange(rowIndex, 2, 1, 6).setValues([[playCount, totalScore, highestScore, firstPassScore, triesToClear, now]]);
      }

      return ContentService.createTextOutput(JSON.stringify({ status: "success", score: score, passed: passed }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
