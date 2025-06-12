import { Provider } from 'react-redux';
import { store } from '../store';

/**
 * Redux Provider component for wrapping the application
 * Provides Redux store to all child components
 */
interface ReduxProviderProps {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
} 