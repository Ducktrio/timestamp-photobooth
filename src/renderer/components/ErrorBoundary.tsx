import { Component, ReactNode, ErrorInfo } from 'react';
interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error thrown to root');
    window.electron.logger.error(error.message, {
      stack: error.stack,
      componentStack: info.componentStack,
    });
  }

  public render() {
    if (this.state.hasError) return this.props.fallback;

    return this.props.children;
  }
}

export default ErrorBoundary;
