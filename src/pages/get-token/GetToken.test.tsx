import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AppContext from "../../contexts/AppContext";
import GetToken from "./GetToken";
import { vi } from "vitest";

// 1. Mock useNavigate from react-router
const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

describe("GetToken component", () => {
  const setToken = vi.fn();

  beforeEach(() => {
    mockNavigate.mockReset();
    setToken.mockReset();
  });

  function renderWithContext() {
    return render(
      <AppContext.Provider
        value={{ token: "", model: "", setToken, setSelectedModel: () => {} }}
      >
        <GetToken />
      </AppContext.Provider>,
    );
  }

  it("updates input value on change", () => {
    renderWithContext();
    const input = screen.getByLabelText(
      /please enter your token/i,
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "my-secret-token" } });
    expect(input.value).toBe("my-secret-token");
  });

  it("calls setToken and navigates on Send click", () => {
    renderWithContext();
    const input = screen.getByLabelText(
      /please enter your token/i,
    ) as HTMLInputElement;
    const button = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "abc123" } });
    fireEvent.click(button);

    expect(setToken).toHaveBeenCalledWith("abc123");
    expect(mockNavigate).toHaveBeenCalledWith("/playground");
  });

  it("calls setToken and navigates on Enter keypress", () => {
    renderWithContext();
    const input = screen.getByLabelText(
      /please enter your token/i,
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "xyz789" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter", charCode: 13 });

    expect(setToken).toHaveBeenCalledWith("xyz789");
    expect(mockNavigate).toHaveBeenCalledWith("/playground");
  });
});
