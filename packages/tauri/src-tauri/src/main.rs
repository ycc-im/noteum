// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use serde::{Deserialize, Serialize};

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

// Custom command to greet from Rust
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust and Tauri v2!", name)
}

// Custom command to get app info
#[tauri::command]
async fn get_app_info() -> Result<serde_json::Value, String> {
    let info = serde_json::json!({
        "name": env!("CARGO_PKG_NAME"),
        "version": env!("CARGO_PKG_VERSION"),
        "description": env!("CARGO_PKG_DESCRIPTION"),
        "authors": env!("CARGO_PKG_AUTHORS").split(':').collect::<Vec<_>>(),
        "tauri_version": "2.0",
        "platform": std::env::consts::OS,
        "architecture": std::env::consts::ARCH,
    });
    Ok(info)
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
    Ok("# Sample Note\n\nThis is a sample note loaded from the Tauri v2 desktop app.".to_string())
}

fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .setup(|app| {
            // App setup logic here
            let window = app.get_window("main").unwrap();
            
            #[cfg(debug_assertions)]
            {
                window.open_devtools();
            }
            
            println!("Noteum Tauri v2 desktop app starting...");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            get_app_info,
            get_app_config,
            save_app_config,
            save_note,
            load_note
        ])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}

fn main() {
    run();
}