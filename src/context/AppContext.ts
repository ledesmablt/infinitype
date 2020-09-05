import { createContext } from 'react';

interface ContextType {
  theme: string;
}

const AppContext = createContext<ContextType | null>(null);

export default AppContext;
