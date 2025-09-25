import { startServer } from './server';

// Wrap in an async IIFE to handle the async startServer function
(async () => {
  try {
    await startServer();
  } catch (error) {
    console.error('Failed to start monsoon analysis server:', error);
    process.exit(1);
  }
})();