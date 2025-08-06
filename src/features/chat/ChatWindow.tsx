import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import type { MessageType } from "./types";
import AppContext from "../../contexts/AppContext";

import AutoSizer from "react-virtualized-auto-sizer";
import {
  VariableSizeList,
  type ListChildComponentProps,
  type ListOnScrollProps,
} from "react-window";
import "./ChatWindow.css";
import { AssistantMessage, UserMessage } from "./Message";

const MODELS_URL = "https://api.fireworks.ai/inference/v1/chat/completions";

export default function ChatWindow() {
  const context = useContext(AppContext);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [model, setModel] = useState("");
  const [token, setToken] = useState("");

  const sizeMap = useRef<{ [index: number]: number }>({});
  const varListRef = useRef<VariableSizeList>(null);
  const bottomThreshold = 20;
  const outerRef = useRef<HTMLDivElement>(null);
  const bufferRef = useRef("");
  const timerRef = useRef<number | undefined>(undefined);
  const ttftRef = useRef(0); // time to first token
  const responseTimeRef = useRef(0);
  const totalTokensRef = useRef(0);

  // Track if user is scrolled to (or near) the bottom
  const [isAtBottom, setIsAtBottom] = useState(true);

  const setSize = useCallback((index: number, size: number) => {
    if (sizeMap.current[index] !== size) {
      sizeMap.current[index] = size;
      // Tell the list to recompute from this index onward
      varListRef.current?.resetAfterIndex(index);
    }
  }, []);

  const getSize = (index: number) => {
    // fallback to a default if not measured yet
    return sizeMap.current[index] ?? 80;
  };

  // flush buffer into the last message
  const flush = useCallback(() => {
    const chunk = bufferRef.current;
    if (chunk) {
      bufferRef.current = "";
      setMessages((prev) => {
        const copy = [...prev];
        const last = { ...copy[copy.length - 1] };
        last.content += chunk;
        last.ttft = ttftRef.current;
        last.responseTime = responseTimeRef.current;
        if (responseTimeRef.current) {
          last.tokenps = parseFloat(
            ((totalTokensRef.current * 1000) / responseTimeRef.current).toFixed(
              2
            )
          );
        }
        copy[copy.length - 1] = last;
        return copy;
      });
    } else {
      window.clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  const Row = ({ index, style }: ListChildComponentProps) => {
    const msg = messages[index];
    const ref = useRef<HTMLDivElement>(null);

    // After mount, measure and update
    useLayoutEffect(() => {
      if (ref.current) {
        const height = ref.current.getBoundingClientRect().height;
        setSize(index, height);
      }
    }, [index, msg.content]);

    const renderRow = () => {
      if (msg.role === "error") {
        return (
          <section className="w-full">
            <div className="p-[10px] rounded-[5px] bg-red-800 text-white">
              {msg.content}
            </div>
          </section>
        );
      }
      if (msg.role === "user") {
        return <UserMessage key={msg.id} message={msg} />;
      } else {
        if (msg.content === "") {
          return (
            <div className="h-[100px] w-full items-center bg-[#f0f0f0] pl-[60px]">
              <p className="loading-text text-[#333]">Loading...</p>
            </div>
          );
        }
        return <AssistantMessage key={msg.id} message={msg} />;
      }
    };

    return (
      <div style={style}>
        <div ref={ref} className={`px-4 py-2 flex`}>
          {renderRow()}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (context?.model) {
      setModel(context?.model);
    }

    if (context?.token) {
      setToken(context?.token);
    }
  }, [context?.model, context?.token]);

  // When messages change, if we were at bottom, scroll to the new last item
  useEffect(() => {
    if (!isAtBottom) return;
    const lastIndex = messages.length - 1;
    varListRef.current?.scrollToItem(lastIndex, "end");
  }, [messages, isAtBottom]);

  const onChangeNewMsgHandler = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const val = event.target.value;
      setNewMsg(val);
    },
    []
  );

  // Handle scroll events from the list
  const onScroll = (props: ListOnScrollProps) => {
    const { scrollOffset, scrollUpdateWasRequested } = props;
    if (scrollUpdateWasRequested) return; // ignore programmatic scrolls

    const el = outerRef.current;
    if (!el) return;

    const maxScroll = el.scrollHeight - el.clientHeight;
    setIsAtBottom(scrollOffset >= maxScroll - bottomThreshold);
  };

  const onSubmitHandler = useCallback(() => {
    setMessages((prev) => {
      return [
        ...prev,
        {
          id: prev.length,
          role: "user",
          content: newMsg,
        },
        {
          id: prev.length + 1,
          role: "assistant",
          content: "",
          ttft: 0,
          responseTime: 0,
          tokenps: 0,
        },
      ];
    });

    const postMessage = async (token: string, model: string) => {
      setNewMsg("");
      const url = MODELS_URL;
      const messagesPayload = [
        ...messages
          .filter((message) => message.role !== "error")
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        { role: "user", content: newMsg },
      ];

      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: messagesPayload,
          stream: true,
        }),
      };
      try {
        const start = window.performance.now();
        const response = await fetch(url, options);
        if (!response.ok) {
          const errorMsg = await response
            .text()
            .catch(() => response.statusText);
          throw errorMsg;
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            responseTimeRef.current = Math.round(
              window.performance.now() - start
            );
            break;
          }

          if (!ttftRef.current) {
            ttftRef.current = Math.round(window.performance.now() - start);
          }
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split(/\r?\ndata: /);
          buffer = lines.pop()!;
          if (lines.length > 0) {
            if (lines[0].startsWith("data: ")) {
              lines[0] = lines[0].slice(6);
            }
            for (const line of lines) {
              if (line.trim() === "[DONE]") {
                return;
              }

              const { choices, usage } = JSON.parse(line);
              const delta = choices[0].delta;

              if (delta.content) {
                bufferRef.current += delta.content;
                if (!timerRef.current) {
                  timerRef.current = window.setInterval(flush, 100);
                }
              }

              if (usage) {
                totalTokensRef.current = usage.completion_tokens;
              }
            }
          }
        }
      } catch (error) {
        const errorObj = JSON.parse(error as string);
        const errorMessage = errorObj?.error?.message || errorObj.error;

        setMessages((prev) => {
          const copy = [...prev];
          const last = { ...copy[copy.length - 1] };
          last.role = "error";
          last.content = errorMessage;
          copy[copy.length - 1] = last;
          return copy;
        });
      }
    };

    if (newMsg) {
      postMessage(token, model);
    }
  }, [flush, messages, model, newMsg, token]);

  const onKeyDownHandler = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (
        event.key === "Enter" &&
        !event.shiftKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        newMsg.trim()
      ) {
        event.preventDefault();
        onSubmitHandler();
      }
    },
    [newMsg, onSubmitHandler]
  );

  const renderMessages = () => {
    if (messages.length > 0) {
      return (
        <section className="h-full w-full overflow-y-auto">
          <AutoSizer>
            {({ height, width }) => (
              <VariableSizeList
                ref={varListRef}
                height={height}
                width={width}
                itemCount={messages.length}
                itemSize={getSize}
                overscanCount={10}
                style={{ overflowX: "hidden" }}
                outerRef={outerRef}
                onScroll={onScroll}
              >
                {Row}
              </VariableSizeList>
            )}
          </AutoSizer>
        </section>
      );
    }

    return <section className="flex-1"></section>;
  };

  return (
    <section className="flex flex-col gap-[10px] py-[10px] px-[20px] flex-1 overflow-hidden">
      {renderMessages()}
      <section className="flex flex-row border-gray-600 rounded-[5px] border-1 justify-between mx-4">
        <textarea
          id="new-msg"
          name="new-msg"
          value={newMsg}
          onChange={onChangeNewMsgHandler}
          onKeyDown={onKeyDownHandler}
          className="p-[5px] w-full focus:outline-none focus:border-transparent resize-none"
        />
        <button
          className={`focus:outline-none border-l border-l-gray-500 bg-[#1b75d0] 
            disabled:opacity-50 disabled:pointer-events-none disabled:bg-gray-400 disabled:text-gray-700`}
          onClick={() => onSubmitHandler()}
          disabled={!newMsg}
        >
          Send
        </button>
      </section>
    </section>
  );
}
