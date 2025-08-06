import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AssistantMessage, UserMessage } from "./Message";
import type { MessageType } from "./types";

describe("AssistantMessage & UserMessage", () => {
  const plain: MessageType = {
    id: 42,
    role: "assistant",
    content: "Just a test message",
  };

  it("AssistantMessage wraps content in a bordered section", () => {
    render(<AssistantMessage message={plain} />);
    // The text appears
    expect(screen.getByText("Just a test message")).toBeInTheDocument();
    // The outer <section> should have your border class
    const wrapper = screen.getByText("Just a test message").closest("section");
    expect(wrapper).toHaveClass("border-gray-600");
  });

  it("UserMessage wraps content in a stone background section", () => {
    render(<UserMessage message={plain} />);
    expect(screen.getByText("Just a test message")).toBeInTheDocument();
    const wrapper = screen.getByText("Just a test message").closest("section");
    expect(wrapper).toHaveClass(
      "bg-indigo-400 rounded-[10px] p-[10px] w-1/2 float-right"
    );
  });
});
