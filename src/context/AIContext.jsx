import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AIContext = createContext(null);

const INITIAL_STATE = {
  currentPage: "",
  recommendedService: "",
  destination: "",
  journeyStep: "",
  readinessScore: null,
  riskLevel: "",
  checklistProgress: null,
  activeService: "",
  warnings: [],
  missingDocuments: [],
};

export function AIProvider({ children }) {
  const [assistantContext, setAssistantContextState] = useState(INITIAL_STATE);

  const setAssistantContext = useCallback((nextContext) => {
    setAssistantContextState((current) => ({
      ...current,
      ...INITIAL_STATE,
      ...nextContext,
    }));
  }, []);

  const resetAssistantContext = useCallback(() => {
    setAssistantContextState(INITIAL_STATE);
  }, []);

  const value = useMemo(
    () => ({
      assistantContext,
      setAssistantContext,
      resetAssistantContext,
    }),
    [assistantContext, resetAssistantContext, setAssistantContext],
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export function useAIContext() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAIContext must be used inside AIProvider");
  }
  return context;
}
