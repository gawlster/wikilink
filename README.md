# WikiLink Client

> This is the Chrome Extension frontend for WikiLink. It renders the popup UI, handles user input, and tracks user navigation until the final article is reached. The server counterpart is available here: [wikilink-server](https://github.com/gawlster/wikilink-server).

- [Privacy Policy](https://github.com/gawlster/wikilink-privacy)
- [Available on the Chrome Web Store](https://chromewebstore.google.com/detail/wikilink/emkinglnjogipkbdaolejamloekkjboj)
- To provide feedback, report bugs, or suggest features, please fill out [this form](https://forms.gle/4xWNBD1PoE6n5qwz8)

## 🛠️ Development Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/wikilink-client.git
   ```

2. Go to the Chrome Extensions page (`chrome://extensions/`), enable Developer Mode.

3. Click **Load Unpacked**, and choose the root of this repo.

4. Make code changes.

5. Run the build command:
   ```bash
   npm run build
   ```

6. To see your changes, **close and reopen** the extension popup.

> Note: If you've changed the background script, you may need to **manually restart the extension** from the Extensions page.

7. Ensure `communications.ts` has the API root set to `http://localhost:3000`.

## 🚀 Deploying to Production

1. Run:
   ```bash
   npm run build
   ```

2. Zip the build folder:
   ```bash
   zip -r build.zip .
   ```

3. Upload `build.zip` to the [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole/3260724f-6e88-4207-ad12-0f236ed216b1).

4. Update metadata, re-use prior version's info if applicable.

5. Take new screenshots if UI changed.

6. Set production API URL in `communications.ts`.
