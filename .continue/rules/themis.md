# Project Rules — Themis Online Judge

## Stack
- Vanilla HTML/CSS/JS (single-page app, no framework)
- Firebase Realtime Database + Authentication
- CodeMirror 5 for code editor
- Pyodide for Python execution in browser

## Coding Style
- Minified class methods (single line per method)
- Vietnamese comments and UI text
- Use `this._` prefix for private methods
- Callbacks use arrow functions
- DOM elements accessed by `document.getElementById()`

## Architecture
- `GeminiHelper` — AI API calls
- `PyodideEngine` — Python code execution  
- `FirebaseHelper` — Database operations
- `UIController` — Main UI logic (all rendering, events)

## Important Patterns
- Listeners must use `ref.off('value', specificCallback)` not `ref.off()`
- Exercise results stored at `exerciseResults/{exerciseId}/{studentName}`
- Contest rooms at `rooms/{roomCode}`
- Always use `this._toast(msg, type)` for user feedback
