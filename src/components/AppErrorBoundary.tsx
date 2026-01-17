import React from 'react';

type State = { hasError: boolean };

export default class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // log error
    // eslint-disable-next-line no-console
    console.error('AppErrorBoundary caught', error, info);
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2147483647, // ensure on top of overlays
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff',
            color: '#111',
            padding: 24,
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 720 }}>
            <h1>Something went wrong</h1>
            <p>Sorry — something crashed. You can try to reload or go back.</p>
            <div style={{ marginTop: 12 }}>
              <button onClick={this.reset}>Try again</button>
              <button style={{ marginLeft: 8 }} onClick={() => window.location.reload()}>
                Reload page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}