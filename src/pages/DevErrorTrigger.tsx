import React, { useEffect } from 'react';

export default function DevErrorTrigger(): React.ReactElement {
  useEffect(() => {
    // Throw on mount to test the AppErrorBoundary
    throw new Error('Dev error trigger');
  }, []);
  return <div>Dev Error Trigger (should not be visible)</div>;
}