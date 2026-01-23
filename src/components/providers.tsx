'use client';

import { CopilotKit } from '@copilotkit/react-core';

// CopilotKit runtime connects to Railway Pydantic AI agent via AG-UI protocol
// The agent named "tracker" handles tractor insurance conversations
const RUNTIME_URL = '/api/copilotkit';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl={RUNTIME_URL} agent="tracker">
      {children}
    </CopilotKit>
  );
}
