// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};

#[cfg(debug_assertions)]
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize)]
struct AppConfig {
    theme: String,
    auto_save: bool,
    font_size: u32,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            theme: "dark".to_string(),
            auto_save: true,
            font_size: 14,
        }
    }
}

// Tauri command to handle app configuration
#[tauri::command]
async fn get_app_config() -> Result<AppConfig, String> {
    // In a real app, this would load from a config file or database
    Ok(AppConfig::default())
}

#[tauri::command]
async fn save_app_config(config: AppConfig) -> Result<(), String> {
    // In a real app, this would save to a config file or database
    println!("Saving config: {:?}", config);
    Ok(())
}

// Tauri command for file operations
#[tauri::command]
async fn save_note(content: String, path: Option<String>) -> Result<String, String> {
    // Placeholder for note saving logic
    let save_path = path.unwrap_or_else(|| {
        format!("note_{}.md", chrono::Utc::now().timestamp())
    });
    
    println!("Saving note to: {}", save_path);
    println!("Content: {}", content);
    
    Ok(save_path)
}

#[tauri::command]
async fn load_note(path: String) -> Result<String, String> {
    // Placeholder for note loading logic
    println!("Loading note from: {}", path);
    
    // Return dummy content for now
    Ok("# Sample Note\n\nThis is a sample note loaded from the desktop app.".to_string())
}

// System info command
#[tauri::command]
async fn get_system_info() -> Result<serde_json::Value, String> {
    let info = serde_json::json!({
        "platform": std::env::consts::OS,
        "architecture": std::env::consts::ARCH,
        "version": env!("CARGO_PKG_VERSION")
    });
    
    Ok(info)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|_app| {
            // App setup logic here
            #[cfg(debug_assertions)]
            {
                let window = _app.get_webview_window("main").unwrap();
                window.open_devtools();
            }

            println!("Noteum desktop app starting...");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_app_config,
            save_app_config,
            save_note,
            load_note,
            get_system_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}