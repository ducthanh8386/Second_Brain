'use server';

import { GoogleGenerativeAI, GoogleGenerativeAIResponseError } from '@google/generative-ai';

interface AIInsights {
  summary: string;
  tags: string[];
}

const parseAIResponse = (text: string): AIInsights => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Không tìm thấy JSON trong phản hồi AI.');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.summary || typeof parsed.summary !== 'string') {
      throw new Error('Phản hồi AI thiếu trường summary hợp lệ.');
    }

    if (!Array.isArray(parsed.tags)) {
      throw new Error('Phản hồi AI thiếu trường tags hợp lệ.');
    }

    const tags = parsed.tags
      .filter((tag: unknown) => typeof tag === 'string')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0)
      .slice(0, 5);

    return {
      summary: parsed.summary.trim(),
      tags,
    };
  } catch (error) {
    console.error('AI parse error:', error);
    throw new Error('Không thể phân tích phản hồi AI. Vui lòng thử lại.');
  }
};

export const generateInsights = async (content: string): Promise<AIInsights> => {
  if (!content || typeof content !== 'string') {
    throw new Error('Nội dung phải là một chuỗi không rỗng.');
  }

  const trimmedContent = content.trim();
  if (trimmedContent.length === 0) {
    throw new Error('Vui lòng cung cấp nội dung ghi chú để phân tích.');
  }

  if (trimmedContent.length > 10000) {
    throw new Error('Nội dung quá dài. Tối đa 10.000 ký tự.');
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY chưa được cấu hình.');
    throw new Error('Dịch vụ AI chưa được cấu hình. Vui lòng liên hệ quản trị.');
  }

  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Bạn là một trợ lý phân tích ghi chú thông minh cho ứng dụng học tập tiếng Việt.

Phân tích nội dung ghi chú dưới đây và thực hiện 2 nhiệm vụ:

1. TÓM TẮT: Tạo một tóm tắt ngắn gọn (tối đa 3 câu), dễ hiểu bằng tiếng Việt chuẩn.
2. THẺ: Trích xuất 3-5 thẻ/chủ đề liên quan (bằng tiếng Việt), phù hợp cho tìm kiếm.

GHI CHÚ CẦN PHÂN TÍCH:
"""
${trimmedContent}
"""

TRẢ VỀ KẾT QUẢ DƯỚI DẠNG JSON (chỉ JSON, không giải thích thêm):
{
  "summary": "Tóm tắt nội dung ở đây",
  "tags": ["thẻ1", "thẻ2", "thẻ3"]
}

LƯU Ý:
- Tóm tắt phải bằng tiếng Việt chuẩn, giữ nguyên dấu, không viết tắt.
- Các thẻ phải là các từ hoặc cụm từ ngắn, bằng tiếng Việt.
- Chỉ trả về JSON cứng, không có văn bản khác.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const insights = parseAIResponse(responseText);

    if (insights.tags.length < 3) {
      throw new Error('AI không tạo đủ thẻ.');
    }

    return insights;
  } catch (error) {
    console.error('Gemini API error:', error);

    if (error instanceof GoogleGenerativeAIResponseError) {
      throw new Error(`AI bị chặn hoặc an toàn: ${error.message || 'Vui lòng thử lại với nội dung khác.'}`);
    }

    if (error instanceof Error) {
      const lowered = error.message.toLowerCase();
      if (lowered.includes('rate limit') || lowered.includes('quota')) {
        throw new Error('Quá nhiều yêu cầu AI. Vui lòng thử lại sau.');
      }
      if (lowered.includes('authentication') || lowered.includes('api key') || lowered.includes('x-goog-api-key')) {
        throw new Error('Xác thực AI thất bại. Vui lòng kiểm tra cấu hình.');
      }
      throw new Error(error.message || 'Không thể tạo phân tích AI.');
    }

    throw new Error('Không thể tạo phân tích AI.');
  }
};
