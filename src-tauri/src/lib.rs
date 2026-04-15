use std::fs;
use tauri::Manager;

/// Clear WebView2 HTTP cache (Windows) or WebKit cache (macOS/Linux)
/// without touching localStorage or other user data.
fn clear_webview_cache_on_upgrade(app: &tauri::App) {
    let app_data = match app.path().app_data_dir() {
        Ok(p) => p,
        Err(_) => return,
    };

    let version_file = app_data.join(".last_version");
    let current_version = app.config().version.clone().unwrap_or_default();

    // Read previously recorded version
    let previous_version = fs::read_to_string(&version_file).unwrap_or_default();

    if previous_version.trim() == current_version.trim() && !previous_version.is_empty() {
        return; // Same version, no cache clear needed
    }

    log::info!(
        "Version change detected: '{}' -> '{}', clearing WebView cache",
        previous_version.trim(),
        current_version
    );

    // Windows: WebView2 stores cache under EBWebView/Default/Cache
    // We only delete Cache and Code Cache, preserving Local Storage
    #[cfg(target_os = "windows")]
    {
        let webview_base = app_data.join("EBWebView").join("Default");
        let cache_dirs = [
            "Cache",
            "Code Cache",
            "GPUCache",
            "DawnGraphiteCache",
            "DawnWebGPUCache",
            "Service Worker",
        ];
        for dir_name in &cache_dirs {
            let dir = webview_base.join(dir_name);
            if dir.exists() {
                let _ = fs::remove_dir_all(&dir);
                log::info!("Cleared cache dir: {:?}", dir);
            }
        }
    }

    // macOS: WebKit cache
    #[cfg(target_os = "macos")]
    {
        let cache_dir = match app.path().app_cache_dir() {
            Ok(p) => p,
            Err(_) => return,
        };
        if cache_dir.exists() {
            // Remove WebKit cache files but keep the directory
            if let Ok(entries) = fs::read_dir(&cache_dir) {
                for entry in entries.flatten() {
                    let path = entry.path();
                    if path.is_dir() {
                        let _ = fs::remove_dir_all(&path);
                    } else {
                        let _ = fs::remove_file(&path);
                    }
                }
            }
            log::info!("Cleared macOS cache dir: {:?}", cache_dir);
        }
    }

    // Linux: WebKitGTK cache
    #[cfg(target_os = "linux")]
    {
        let cache_dir = match app.path().app_cache_dir() {
            Ok(p) => p,
            Err(_) => return,
        };
        if cache_dir.exists() {
            if let Ok(entries) = fs::read_dir(&cache_dir) {
                for entry in entries.flatten() {
                    let path = entry.path();
                    if path.is_dir() {
                        let _ = fs::remove_dir_all(&path);
                    } else {
                        let _ = fs::remove_file(&path);
                    }
                }
            }
            log::info!("Cleared Linux cache dir: {:?}", cache_dir);
        }
    }

    // Record current version
    let _ = fs::create_dir_all(&app_data);
    let _ = fs::write(&version_file, &current_version);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_store::Builder::default().build())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_updater::Builder::new().build())
    .plugin(tauri_plugin_process::init())
    .plugin(tauri_plugin_shell::init())
    .setup(|app| {
      // Clear stale WebView cache when app version changes (prevents blank screen)
      clear_webview_cache_on_upgrade(app);

      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
