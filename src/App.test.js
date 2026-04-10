import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders navbar brand", () => {
  render(<App />);
  const brandElement = screen.getByText(/TravelMundo/i);
  expect(brandElement).toBeInTheDocument();
});
