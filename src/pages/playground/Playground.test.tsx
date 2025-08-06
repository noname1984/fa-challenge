import React from "react";
import { render, screen } from "@testing-library/react";
import Playground from "./Playground";
import { vi } from "vitest";

vi.mock("../../features/models-dropdown/ModelsDropdown.tsx", () => {
  return {
    default: () => <div data-testid="models-dropdown" />,
  };
});
vi.mock("../../features/chat/ChatWindow", () => {
  return {
    default: () => <div data-testid="chat-window" />,
  };
});

describe("Playground component", () => {
  it("renders the models dropdown and chat window", () => {
    render(<Playground />);

    // assert that our mocks appear
    expect(screen.getByTestId("models-dropdown")).toBeInTheDocument();
    expect(screen.getByTestId("chat-window")).toBeInTheDocument();

    // also verify the <hr> is present
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });
});
