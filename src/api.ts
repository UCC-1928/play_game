import type { Question, AnswerSubmit } from './types';

const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

// 開發階段 Mock 模式（如果未填入真正的 GAS URL 則回傳 Mock 數據）
const isMock = !GAS_URL || GAS_URL.includes('YOUR_SCRIPT_ID');

export async function fetchQuestions(count: number): Promise<Question[]> {
  if (isMock) {
    console.log('[Mock] Fetching questions...', count);
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockQs: Question[] = Array.from({ length: count }).map((_, i) => ({
          id: `Q${i + 1}`,
          text: `這是一道測試題目 ${i + 1}？`,
          options: {
            A: `選項 A-${i + 1}`,
            B: `選項 B-${i + 1}`,
            C: `選項 C-${i + 1}`,
            D: `選項 D-${i + 1}`,
          },
        }));
        resolve(mockQs);
      }, 1000);
    });
  }

  // 實際串接 GAS
  try {
    const url = new URL(GAS_URL);
    url.searchParams.append('action', 'getQuestions');
    url.searchParams.append('count', count.toString());
    url.searchParams.append('token', import.meta.env.VITE_API_TOKEN); // 加入這行

    const res = await fetch(url.toString(), { redirect: "follow" });
    const data = await res.json();
    if (data.status === 'success') {
      return data.questions as Question[];
    } else {
      throw new Error(data.message || 'Failed to fetch questions');
    }
  } catch (error) {
    console.error('Fetch questions error:', error);
    throw error;
  }
}

export async function submitScore(id: string, answers: AnswerSubmit[]): Promise<{ score: number, passed: boolean }> {
  if (isMock) {
    console.log('[Mock] Submitting score for ID:', id, answers);
    return new Promise((resolve) => {
      setTimeout(() => {
        // 隨便給個分數
        const score = answers.length; // 全對假裝
        const passed = score >= Number(import.meta.env.VITE_PASS_THRESHOLD || 3);
        resolve({ score, passed });
      }, 1500);
    });
  }

  // 實際串接 GAS
  try {
    const res = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      // 使用 JSON.stringify 送出
      body: JSON.stringify({
        action: 'submitScore',
        token: import.meta.env.VITE_API_TOKEN, // 加入這行
        id,
        answers
      }),
      redirect: "follow",
    });
    
    const data = await res.json();
    if (data.status === 'success') {
      return { score: data.score, passed: data.passed };
    } else {
      throw new Error(data.message || 'Failed to submit score');
    }
  } catch (error) {
    console.error('Submit score error:', error);
    throw error;
  }
}
