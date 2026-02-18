
/**
 * OpenClaw Bridge Service
 * Handles real-time communication with the local Linux shell via Node.js bridge.
 */

export async function executeCommand(
  command: string, 
  onChunk: (text: string) => void,
  onComplete: () => void,
  onError: (err: string) => void
): Promise<void> {
  try {
    const response = await fetch('http://localhost:3001/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
    
    onComplete();
  } catch (error: any) {
    onError(error.message || 'Failed to connect to OpenClaw Bridge');
    onComplete();
  }
}
