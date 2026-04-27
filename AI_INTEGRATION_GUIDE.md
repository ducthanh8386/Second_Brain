# PHASE 2 - TASK 6: Gemini AI Integration — Setup & Usage Guide

## Overview

The AI Second Brain app now has integrated Gemini 1.5 Flash for intelligent note analysis. The system automatically generates summaries and tags from note content using AI.

---

## Files Created

### 1. `app/actions/ai.actions.ts` (Server Action)

**Purpose**: Server-side AI processing for note analysis

**Function**: `generateNoteInsights(content: string)`
- Accepts raw note content (max 10,000 characters)
- Calls Gemini 1.5 Flash API
- Returns AI insights as JSON: `{ summary: string, tags: string[] }`

**Key Features**:
- Vietnamese-optimized prompts (strictly enforces Vietnamese output)
- Robust JSON parsing with error recovery
- Input validation and length checking
- Comprehensive error handling for API failures
- Rate limit handling
- Auth key validation

**Prompt Strategy**:
- Instructs AI to generate 3-sentence max summary
- Extracts 3-5 relevant tags
- Enforces Vietnamese language with diacritics
- Uses role-based context ("trợ lý phân tích ghi chú")

### 2. `components/notes/AIAssistantButton.tsx` (Client Component)

**Purpose**: UI trigger for AI analysis in note editor

**Features**:
- Beautiful gradient button with sparkle icon (✨ Tự động phân tích)
- Loading spinner during analysis
- Error display with dismissal after 3 seconds
- Disabled state when content is empty
- Passes results to NoteEditor via callbacks

**Props**:
```typescript
interface AIAssistantButtonProps {
  content: string;                    // Current note content
  onSummaryChange: (summary: string) => void;  // Update summary
  onTagsChange: (tags: string[]) => void;     // Update tags
}
```

### 3. Updated `components/notes/NoteEditor.tsx`

**Changes**:
- Added `summary` state management
- Integrated `AIAssistantButton` component after content textarea
- Displays AI-generated summary in a purple highlight box
- Summary included when saving notes to Firestore
- AI results merge with existing tags (no duplication)

**Visual Flow**:
```
Content Textarea
    ↓
[✨ Tự động phân tích] button
    ↓
AI generates summary + tags
    ↓
Summary box appears (purple)
Tags auto-populate in tags section
    ↓
User can review/edit before saving
```

---

## Environment Setup

### Required Variables

Add to `.env.local`:

```bash
GEMINI_API_KEY=your_api_key_from_google_ai_studio
```

### Getting Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key
4. Paste into `.env.local`

### Dependencies

Already installed:
```bash
npm install @google/generative-ai
```

---

## How It Works

### User Flow

1. User opens Note Editor (create or edit)
2. Writes note content
3. Clicks "✨ Tự động phân tích" button
4. Loading spinner appears
5. Server Action sends to Gemini:
   - Vietnamese-optimized prompt
   - Note content
6. Gemini returns JSON response
7. Client parses response
8. Summary populates in purple box
9. Tags auto-add to tags section
10. User can edit summary/tags before saving
11. Clicks "Save Note" → all data saved to Firestore

### Server-Side Processing

```
Client sends content
    ↓
Server Action: generateNoteInsights()
    ↓
Initialize GoogleGenerativeAI client
    ↓
Call Gemini 1.5 Flash API
    ↓
Parse AI response (JSON extraction)
    ↓
Validate structure and content
    ↓
Return { summary, tags } to client
```

### Error Handling

**Errors caught and handled**:
- Empty/whitespace content
- Content > 10,000 characters
- Missing GEMINI_API_KEY
- Invalid API key
- Rate limiting
- Invalid JSON response
- Network failures
- Missing required fields in response

**User sees**:
- Red error box with message
- Helpful guidance (e.g., "Please write some content first")
- Button re-enabled for retry

---

## Vietnamese Language Optimization

### Prompt Design

The prompt is crafted to:
1. Declare language as Vietnamese: "tiếng Việt chuẩn"
2. Preserve diacritics: "giữ nguyên dấu, không viết tắt"
3. Use role-based context: "trợ lý phân tích ghi chú"
4. Provide clear JSON format requirement
5. Limit summary to 3 sentences
6. Request 3-5 tags

### Example

**Input**:
```
Blockchain là công nghệ phân tán cho phép lưu trữ dữ liệu bất biến.
Ứng dụng: tiền điện tử, hợp đồng thông minh, chuỗi cung ứng.
```

**Output** (via AI):
```json
{
  "summary": "Blockchain là công nghệ phân tán cho phép lưu trữ dữ liệu bất biến và được sử dụng rộng rãi trong các ứng dụng như tiền điện tử và hợp đồng thông minh.",
  "tags": ["blockchain", "công nghệ phân tán", "tiền điện tử", "hợp đồng thông minh", "chuỗi cung ứng"]
}
```

---

## Firestore Integration

### Note Schema (Updated)

```typescript
{
  id: string;
  userId: string;
  title: string;
  content: string;
  summary?: string;          // AI-generated summary
  tags: string[];            // Include AI-generated tags
  language: 'vi';
  sourceType: 'text';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  archived: boolean;
}
```

### Database Cost Optimization

- **Read**: 1 read when fetching note for analysis (optional)
- **Write**: 1 write when saving note with AI data (included in normal save)
- **No extra API calls**: Summary stored with note, no repeated analysis

---

## Testing Checklist

### Prerequisites
- [ ] Gemini API key in `.env.local`
- [ ] `npm run dev` is running
- [ ] User is logged in

### Test Cases

1. **Basic Analysis**
   - [ ] Open Note Editor
   - [ ] Write test content in Vietnamese
   - [ ] Click "✨ Tự động phân tích"
   - [ ] Loading spinner appears
   - [ ] Summary populates in purple box
   - [ ] Tags auto-add below

2. **Error Handling**
   - [ ] Click button with empty content → "Please write some content first"
   - [ ] Retry after writing → works
   - [ ] Invalid API key → "AI service authentication failed"

3. **Tag Management**
   - [ ] AI adds tags automatically
   - [ ] Manual tag additions still work
   - [ ] Can remove any tag (AI or manual)
   - [ ] Duplicates are not added

4. **Save & Persistence**
   - [ ] Click "Save Note" after AI analysis
   - [ ] Note appears in list
   - [ ] Refresh page
   - [ ] Note loads with AI-generated summary and tags

5. **Edit Existing Note**
   - [ ] Edit note with existing summary
   - [ ] Summary displays in purple box
   - [ ] Click "✨ Tự động phân tích" again → regenerates
   - [ ] New summary replaces old one

---

## Performance Metrics

### API Latency
- Gemini API: ~2-5 seconds per request
- Network round trip: ~0.5-1 second
- **Total**: Expect 2-6 seconds for AI analysis

### Cost Estimation (Gemini API)
- Gemini 1.5 Flash: Very cheap (free tier available)
- Estimate: ~1 credit per analysis
- For 100 analyses: negligible cost

### Next.js Server Action Performance
- Zero cold start in dev mode
- Compiled and cached in production
- Minimal overhead (~50ms)

---

## Troubleshooting

### "AI service is not configured"
**Cause**: `GEMINI_API_KEY` not in `.env.local`
**Fix**:
```bash
# Add to .env.local
GEMINI_API_KEY=your_key_here
# Restart dev server
npm run dev
```

### "AI service authentication failed"
**Cause**: Invalid or expired API key
**Fix**:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Generate new key
3. Update `.env.local`
4. Restart dev server

### "Too many requests"
**Cause**: Rate limited by Gemini
**Fix**: Wait a few seconds and retry

### "AI returned invalid response format"
**Cause**: Gemini returned non-JSON or malformed response
**Fix**: Usually temporary; retry the request

### Summary not appearing but no error
**Cause**: Response parsed but validation failed
**Check**: Browser console for error details

---

## Future Enhancements

1. **Image OCR**: Send images to Gemini, extract text + tags
2. **Batch Analysis**: Analyze multiple notes at once
3. **Custom Prompts**: User-defined AI instructions
4. **Caching**: Store analyses to avoid redundant calls
5. **Feedback Loop**: Learn which summaries/tags users prefer
6. **Streaming**: Real-time streaming of AI responses

---

## Code Examples

### Using the Server Action Directly

```typescript
import { generateNoteInsights } from '@/app/actions/ai.actions';

const insights = await generateNoteInsights('Your note content here');
console.log(insights.summary);  // AI-generated summary
console.log(insights.tags);     // Array of tags
```

### Manual Error Handling

```typescript
try {
  const insights = await generateNoteInsights(content);
  setSummary(insights.summary);
  setTags(insights.tags);
} catch (error) {
  setError(error instanceof Error ? error.message : 'Failed to analyze');
}
```

---

## Security Notes

- API key is **server-only** (in `GEMINI_API_KEY`, not `NEXT_PUBLIC_`)
- Firestore security rules prevent unauthorized access
- Content is sent to Google's servers (Gemini API)
- No local storage of content (stateless)

---

## References

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google Generative AI SDK](https://github.com/google/generative-ai-js)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
