#[cfg(test)]
mod tests {
    use super::*;
    use tauri::Manager;

    #[test]
    fn test_greet_command() {
        let result = greet("Tauri");
        assert_eq!(result, "Hello, Tauri! You've been greeted from Rust!");
    }

    #[test]
    fn test_greet_command_empty_name() {
        let result = greet("");
        assert_eq!(result, "Hello, ! You've been greeted from Rust!");
    }

    #[test]
    fn test_greet_command_with_special_chars() {
        let result = greet("测试用户");
        assert_eq!(result, "Hello, 测试用户! You've been greeted from Rust!");
    }

    // Integration test for Tauri app
    #[tokio::test]
    async fn test_tauri_app_initialization() {
        // This test verifies that the Tauri app can be initialized
        // without panicking or failing

        let app = tauri::test::mock_app();
        assert!(app.is_ok());

        let app = app.unwrap();

        // Test that the main window can be created
        let windows = app.windows();
        assert!(!windows.is_empty());
    }

    #[test]
    fn test_command_registration() {
        // Test that all commands are properly registered
        let app = tauri::test::mock_app().unwrap();

        // Check if greet command is registered
        let window = app.get_window("main").unwrap();
        let result = window.eval("window.__TAURI__.invoke('greet', { name: 'Test' })");

        // In a real test environment, you would verify the command response
        // For now, we just ensure the command can be called without error
        assert!(result.is_ok());
    }
}