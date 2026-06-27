# Desktop Personality Analyzer

An AI-powered backend that analyzes a desktop screenshot and generates observations based on different personalities — serious, interview, or roast.

---

## What this app does

1. Accepts a **desktop screenshot** via a `POST /analyze` API
2. Converts the image to **Base64** and sends it to a **NVIDIA vision model**
3. Returns a personality-based analysis depending on the **mode** selected:
   - `serious` — professional productivity observations
   - `interview` — technical interviewer perspective
   - `roast` — savage but harmless internet-style roast

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- NVIDIA API key from [build.nvidia.com](https://build.nvidia.com)

---

## Setup

```bash
git clone <repo-url>
cd desktop-analyzer
npm install
```

Create a `.env` file in the root:

```
NVIDIA_API_KEY=your_api_key_here
PORT=3000
```

---

## Run

```bash
node app.js
```

Or using npm:

```bash
npm start
```

---

## API

### `POST /analyze`

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| image | File | Yes | Desktop screenshot (PNG, JPEG, WebP) |
| mode | Text | Yes | `serious`, `interview`, or `roast` |

**Success Response:**
```json
{
    "result": "Your desktop has more icons than..."
}
```

**Error Responses:**
```json
{ "message": "Image is required" }
{ "message": "Mode is required" }
{ "message": "Invalid mode. Must be serious, interview or roast" }
{ "message": "Invalid file type. Only PNG, JPEG, and WebP images are allowed!" }
```

---

## Project Structure

```
desktop-analyzer/
├── src/
│   ├── routes/
│   │   └── analyze.js         ← POST /analyze route with validation
│   ├── middlewares/
│   │   └── upload.js          ← Multer config (memory storage, file type filter)
│   ├── services/
│   │   ├── visionService.js   ← NVIDIA API call, Base64 conversion
│   │   └── promptService.js   ← Returns prompt based on mode
│   ├── prompts/
│   │   ├── serious.js         ← Serious mode prompt
│   │   ├── interview.js       ← Interview mode prompt
│   │   └── roast.js           ← Roast mode prompt
│   └── config/
├── app.js                     ← Express app entry point
├── .env                       ← API keys (not committed)
├── .gitignore
└── package.json
```

---

## How it works

### Upload & Validation
Multer intercepts the multipart request, stores the image in memory as a Buffer, and rejects non-image files before they reach the route.

### Base64 Conversion
```js
const image = imageBuffer.toString('base64');
// → sends as data:image/png;base64,<encoded string>
```

### Vision Model
The image and prompt are sent to NVIDIA's vision model:
```
model: meta/llama-3.2-11b-vision-instruct
```

### Prompt Service
Each mode has its own prompt file with a persona, style guidelines, and output format. The `promptService` selects the right one based on the `mode` field.

---

## Testing with Postman

1. Set method to `POST`
2. URL: `http://localhost:3000/analyze`
3. Body → `form-data`
4. Add key `image` (type: File) → attach a screenshot
5. Add key `mode` (type: Text) → `serious`, `interview`, or `roast`

---

## Analysis Modes

### Serious
Professional productivity consultant. Evaluates workspace organization, focus habits, and areas for improvement.

### Interview
Technical interviewer and career coach. Identifies signals of technical skills, learning habits, and career readiness.

### Roast
Sharp-witted internet comedian. Roasts the desktop mercilessly but harmlessly with punchlines and exaggerations.
