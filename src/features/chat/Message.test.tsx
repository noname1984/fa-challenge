import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AssistantMessage, UserMessage } from "./Message";
import type { MessageType } from "./types";

describe("Message components", () => {
  const sample: MessageType = {
    id: 1,
    role: "assistant",
    content: "Hello **world**\n\n- item1\n- item2",
  };

  it("AssistantMessage renders markdown content inside a bordered section", () => {
    render(<AssistantMessage message={sample} />);

    // The "Hello" text and the bold "world" should both appear
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("world")).toBeInTheDocument();

    // List items should render
    expect(screen.getByText("item1")).toBeInTheDocument();
    expect(screen.getByText("item2")).toBeInTheDocument();

    // The outer section has the border class
    const section = screen.getByText("Hello").closest("section");
    expect(section).toHaveClass("border-gray-600");
  });

  it("UserMessage renders markdown content inside a colored background", () => {
    render(<UserMessage message={sample} />);

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("world")).toBeInTheDocument();

    const section = screen.getByText("Hello").closest("section");
    expect(section).toHaveClass("bg-stone-600");
  });
});
