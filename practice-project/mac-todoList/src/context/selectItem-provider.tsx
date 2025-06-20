import { createContext, useContext, useState } from "react";

const SelectedItemContext = createContext<{
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}>({ selectedId: null, setSelectedId: () => {} });

export function SelectItemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <SelectedItemContext.Provider value={{ selectedId, setSelectedId }}>
      {children}
    </SelectedItemContext.Provider>
  );
}

export const useSelectedItem = () => {
  const context = useContext(SelectedItemContext);
  if (!context) {
    throw new Error("useSelectedItem must be used within a SelectItemProvider");
  }
  return context;
};
