import type { MessageType } from "./types";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

function Message({ message }: { message: MessageType }) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        pre: ({ node, children, ...props }) => (
          <pre
            className="rounded-[5px] overflow-auto bg-gray-400 p-4 text-sm"
            {...props}
          >
            {children}
          </pre>
        ),
      }}
    >
      {message.content}
    </Markdown>
  );
}

export function AssistantMessage({ message }: { message: MessageType }) {
  return (
    <section className="border-gray-600 border-1 w-full rounded-[10px] p-[10px]">
      <Message message={message} />
      <p className="text-[10px] text-purple-500">{`ttft: ${message.ttft}ms, response: ${message.responseTime}ms, ${message.tokenps} tokens/s`}</p>
    </section>
  );
}

export function UserMessage({ message }: { message: MessageType }) {
  return (
    <section className="w-full">
      <section className="bg-indigo-400 rounded-[10px] p-[10px] w-1/2 float-right">
        <Message message={message} />
      </section>
    </section>
  );
}
