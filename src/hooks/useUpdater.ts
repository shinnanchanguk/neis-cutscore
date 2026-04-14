import { useState, useEffect, useCallback } from 'react';

interface UpdateInfo {
  version: string;
  date?: string;
  body?: string;
}

interface UpdaterState {
  checking: boolean;
  available: boolean;
  downloading: boolean;
  info: UpdateInfo | null;
  error: string | null;
}

export function useUpdater() {
  const [state, setState] = useState<UpdaterState>({
    checking: false,
    available: false,
    downloading: false,
    info: null,
    error: null,
  });

  const checkForUpdate = useCallback(async () => {
    setState(s => ({ ...s, checking: true, error: null }));
    try {
      const { check } = await import('@tauri-apps/plugin-updater');
      const update = await check();
      if (update) {
        setState(s => ({
          ...s,
          checking: false,
          available: true,
          info: {
            version: update.version,
            date: update.date ?? undefined,
            body: update.body ?? undefined,
          },
        }));
        return update;
      } else {
        setState(s => ({ ...s, checking: false, available: false }));
        return null;
      }
    } catch (e) {
      setState(s => ({
        ...s,
        checking: false,
        error: e instanceof Error ? e.message : String(e),
      }));
      return null;
    }
  }, []);

  const downloadAndInstall = useCallback(async () => {
    setState(s => ({ ...s, downloading: true, error: null }));
    try {
      const { check } = await import('@tauri-apps/plugin-updater');
      const update = await check();
      if (update) {
        await update.downloadAndInstall();
        // Clear WebView cache to prevent stale asset references
        try {
          const { getCurrentWebview } = await import('@tauri-apps/api/webview');
          await getCurrentWebview().clearAllBrowsingData();
        } catch {
          // Ignore if not available
        }
        // After install, relaunch
        const { relaunch } = await import('@tauri-apps/plugin-process');
        await relaunch();
      }
    } catch (e) {
      setState(s => ({
        ...s,
        downloading: false,
        error: e instanceof Error ? e.message : String(e),
      }));
    }
  }, []);

  // Auto-check on mount (only in Tauri context)
  useEffect(() => {
    const timer = setTimeout(() => {
      checkForUpdate().catch(() => {});
    }, 3000); // Check 3 seconds after launch
    return () => clearTimeout(timer);
  }, [checkForUpdate]);

  return { ...state, checkForUpdate, downloadAndInstall };
}
