import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Chatbot from "./Chatbot";
import { AIProvider } from "../context/AIContext";
import { LanguageProvider } from "../context/LanguageContext";

function renderChatbot(route = "/visa-scoring") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <LanguageProvider>
        <AIProvider>
          <Chatbot />
        </AIProvider>
      </LanguageProvider>
    </MemoryRouter>,
  );
}

describe("Chatbot", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("shows visible user and assistant replies for suggestions, services, and typed questions", () => {
    renderChatbot();

    fireEvent.click(screen.getByRole("button", { name: /travel assistant/i }));

    expect(
      screen.getByText(
        "Hello, I can help you choose a service path, review preparation items, or understand your next step.",
      ),
    ).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "How does readiness review work?" }));
    expect(screen.getByText("How does readiness review work?")).toBeVisible();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(
      screen.getByText(
        "The readiness review checks the traveler profile, selected preparation items, detected issues, and route consistency. It provides a preparation score and recommendations before continuing on the dedicated portal.",
      ),
    ).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "How can I improve readiness?" }));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(
      screen.getByText(
        "To improve readiness, complete the missing preparation items, verify passport information, review travel purpose and duration, and follow the recommended next action before opening the dedicated portal.",
      ),
    ).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /^ESTA$/ }));

    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(
      screen.getByText(
        "ESTA is generally used for short U.S. tourism, business, or transit travel when the traveler matches the eligible route. Travel Mundo helps prepare the required information before continuing on the dedicated portal.",
      ),
    ).toBeVisible();

    const input = screen.getByPlaceholderText("Ask about services, preparation, or next steps...");
    fireEvent.change(input, { target: { value: "What preparation items are missing?" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter", charCode: 13 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.getByText("What preparation items are missing?")).toBeVisible();
    expect(
      screen.getByText(
        "Missing preparation items depend on the selected service. Open the Instructions page or complete the checklist in Readiness Review to see the items that still need attention.",
      ),
    ).toBeVisible();

    const widget = screen.getByRole("button", { name: /minimize chatbot/i }).closest(".tm-ai-widget");
    const messagesPanel = widget.querySelector(".tm-ai-messages");
    expect(messagesPanel).toBeInTheDocument();

    const panelText = within(messagesPanel).getByText(
      "Missing preparation items depend on the selected service. Open the Instructions page or complete the checklist in Readiness Review to see the items that still need attention.",
    );
    expect(panelText).toBeVisible();
  });
});
