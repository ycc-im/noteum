// Tauri API bindings and utilities for the desktop app
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";

export interface AppConfig {
  theme: string;
  auto_save: boolean;
  font_size: number;
}

export interface SystemInfo {
  platform: string;
  architecture: string;
  version: string;
}

// Tauri API wrapper functions
export class TauriAPI {
  // Configuration management
  static async getAppConfig(): Promise<AppConfig> {
    return await invoke("get_app_config");
  }

  static async saveAppConfig(config: AppConfig): Promise<void> {
    return await invoke("save_app_config", { config });
  }

  // Note management
  static async saveNote(content: string, path?: string): Promise<string> {
    return await invoke("save_note", { content, path });
  }

  static async loadNote(path: string): Promise<string> {
    return await invoke("load_note", { path });
  }

  // System information
  static async getSystemInfo(): Promise<SystemInfo> {
    return await invoke("get_system_info");
  }

  // Window management helpers
  static async minimizeWindow(): Promise<void> {
    return await getCurrentWindow().minimize();
  }

  static async maximizeWindow(): Promise<void> {
    return await getCurrentWindow().maximize();
  }

  static async closeWindow(): Promise<void> {
    return await getCurrentWindow().close();
  }

  // Event listeners
  static async onWindowEvent(
    callback: (event: any) => void,
  ): Promise<() => void> {
    return await listen("tauri://window-event", callback);
  }

  // Check if running in Tauri
  static isTauri(): boolean {
    return typeof window !== "undefined" && "__TAURI__" in window;
  }
}

// Initialize Tauri specific functionality
export function initializeTauri(): void {
  if (!TauriAPI.isTauri()) {
    console.log("Running in web mode, Tauri APIs not available");
    return;
  }

  console.log("Initializing Tauri desktop features...");

  // Set up window event listeners
  TauriAPI.onWindowEvent((event) => {
    console.log("Window event:", event);
  });

  // Load and apply saved configuration
  TauriAPI.getAppConfig()
    .then((config) => {
      console.log("Loaded app config:", config);
      // Apply configuration to the app
      if (config.theme) {
        document.documentElement.setAttribute("data-theme", config.theme);
      }
    })
    .catch((error) => {
      console.error("Failed to load app config:", error);
    });

  // Get system info
  TauriAPI.getSystemInfo()
    .then((info) => {
      console.log("System info:", info);
    })
    .catch((error) => {
      console.error("Failed to get system info:", error);
    });
}

// Auto-initialize if in Tauri environment
if (TauriAPI.isTauri()) {
  initializeTauri();
}

export default TauriAPI;
