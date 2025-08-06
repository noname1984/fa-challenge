# React + TypeScript + Vite

Please make sure your node >= 20

## Install

```bash
# NPM
npm install
npm run dev

npm run test => to run unit tests
```

## Design decisions and potential improvements

1. Since I need a API token to make API calls, I decided to create a get-token page. This token will be stored on the app context so that other pages can access.
2. I decided to create an app context, which is available across all components. This app context has data/methods for the user token and selected model. By
   having this app context, I'll avoid props drilling.
3. I'm using couple of external libs:
   - React markdown and its related packages to parse and render the markdown string from the response of SSE
   - React window to handle rendering lots of messages. This will help to avoid slowness for the chat
4. I'm using throttling technique(setInterval) to render incoming streams every 100ms. This will make sure a smooth rendering for text from streaming response.
5. I also handled empty input and some API errors.
6. **Improvements**:
   - Handle more errors
   - Render markdown better, also support copy code blocks
   - Support upload files/drag and drop for the input
   - More unit tests
   - More testing to make sure the chat can render a large amount of messages smoothly.
