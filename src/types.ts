export type AppState = 'HOME' | 'GAME' | 'RESULT';

export interface Question {
  id: string; // 題號
  text: string; // 題目
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

// 這是從後端拿到的格式（包含在執行時可能需要記錄解答）
// 實際上前端不一定需要解答，但如果由前端對答案，需要拿解答
// 根據需求："從指定 Google Sheets 的「題目」工作表隨機撈取 N 題（不包含解答欄位）"
// >> 這代表後端只會回題目，解答是在後端對？或者是對完之後才算分。
// 「將作答結果傳送到 Google Apps Script 計算成績」
// 因此作答時，前端只記錄選了哪個選項，之後全部傳給 GAS 計算分數。

export interface AnswerSubmit {
  questionId: string;
  selectedOption: 'A' | 'B' | 'C' | 'D';
}
