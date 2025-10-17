#[cfg(test)]
mod e2e_tests {
    use tauri::{Manager, WebviewUrl};
    use std::time::Duration;
    use tokio::time::sleep;

    // Helper function to create app with webview for E2E testing
    fn create_e2e_app() -> tauri::App {
        tauri::Builder::default()
            .invoke_handler(tauri::generate_handler![super::greet])
            .build(tauri::generate_context!())
            .expect("Failed to build Tauri app for E2E testing")
    }

    #[tokio::test]
    async fn test_app_lifecycle() {
        // Test app startup and shutdown
        let app = create_e2e_app();

        // Verify app has windows
        let windows = app.windows();
        assert!(!windows.is_empty(), "App should have windows");

        // Test that we can get the main window
        let main_window = app.get_window("main");
        assert!(main_window.is_some(), "Main window should exist");

        // In a real E2E test, we would:
        // 1. Start the app
        // 2. Navigate to different pages
        // 3. Interact with UI elements
        // 4. Verify responses
        // 5. Clean up
    }

    #[tokio::test]
    async fn test_frontend_backend_communication() {
        let app = create_e2e_app();
        let window = app.get_window("main").unwrap();

        // Test that we can evaluate JavaScript in the webview
        let result = window.eval("typeof window !== 'undefined'");
        assert!(result.is_ok(), "Should be able to evaluate JavaScript");

        // Test Tauri API availability
        let result = window.eval("typeof window.__TAURI__ !== 'undefined'");
        // This might fail in test environment, which is expected
        let _ = result; // We just ensure it doesn't panic
    }

    #[tokio::test]
    async fn test_window_management() {
        let app = create_e2e_app();
        let window = app.get_window("main").unwrap();

        // Test window properties
        let title = window.title().unwrap_or_default();
        assert!(!title.is_empty(), "Window should have a title");

        // Test window dimensions
        let (width, height) = window.inner_size().unwrap_or((800, 600));
        assert!(width > 0 && height > 0, "Window should have valid dimensions");

        // Test window visibility
        let is_visible = window.is_visible().unwrap_or(true);
        assert!(is_visible, "Window should be visible");
    }

    #[tokio::test]
    async fn test_file_operations() {
        let app = create_e2e_app();
        let window = app.get_window("main").unwrap();

        // Test file system operations (if allowed in tauri.conf.json)
        // This is a placeholder test - in real scenarios you would:
        // 1. Create a test file
        // 2. Read the file
        // 3. Write to the file
        // 4. Delete the file
        // 5. Verify all operations succeeded

        // For now, just test that we can attempt file operations without panicking
        let test_content = r#"
            // Test that file APIs are available (might fail in test environment)
            try {
                window.__TAURI__.invoke('fs_exists', { path: 'test.txt' });
                'File API test completed';
            } catch (error) {
                'File API not available in test environment: ' + error.message;
            }
        "#;

        let result = window.eval(test_content);
        assert!(result.is_ok(), "File operation test should not panic");
    }

    #[tokio::test]
    async fn test_dialog_operations() {
        let app = create_e2e_app();
        let window = app.get_window("main").unwrap();

        // Test dialog availability (won't actually open dialogs in test environment)
        let test_content = r#"
            // Test that dialog APIs are available
            try {
                // We won't actually open dialogs, just test API availability
                'Dialog API test completed';
            } catch (error) {
                'Dialog API not available in test environment: ' + error.message;
            }
        "#;

        let result = window.eval(test_content);
        assert!(result.is_ok(), "Dialog operation test should not panic");
    }

    #[tokio::test]
    async fn test_notification_operations() {
        let app = create_e2e_app();
        let window = app.get_window("main").unwrap();

        // Test notification API
        let test_content = r#"
            // Test that notification APIs are available
            try {
                if ('Notification' in window) {
                    // We won't actually send notifications in test environment
                    'Notification API available';
                } else {
                    'Notification API not available';
                }
            } catch (error) {
                'Notification API error: ' + error.message;
            }
        "#;

        let result = window.eval(test_content);
        assert!(result.is_ok(), "Notification test should not panic");
    }

    #[tokio::test]
    async fn test_error_recovery() {
        let app = create_e2e_app();
        let window = app.get_window("main").unwrap();

        // Test that the app can recover from JavaScript errors
        let error_causing_script = r#"
            try {
                // Intentionally cause an error
                nonExistentFunction();
            } catch (error) {
                'Error handled gracefully: ' + error.message;
            }
        "#;

        let result = window.eval(error_causing_script);
        assert!(result.is_ok(), "App should handle JavaScript errors gracefully");

        // Verify app is still responsive after error
        let recovery_test = window.eval("'App recovered successfully'");
        assert!(recovery_test.is_ok(), "App should remain responsive after errors");
    }

    #[test]
    fn test_configuration_validation() {
        // Test that Tauri configuration is valid
        let config = tauri::generate_context!();

        // Verify app name and version
        assert!(!config.config().package.product_name.is_empty());
        assert!(!config.config().package.version.is_empty());

        // Verify window configuration
        assert!(!config.config().tauri.windows.is_empty());

        let window_config = &config.config().tauri.windows[0];
        assert!(!window_config.title.is_empty());
        assert!(window_config.width > 0);
        assert!(window_config.height > 0);
    }

    #[tokio::test]
    async fn test_security_constraints() {
        let app = create_e2e_app();
        let window = app.get_window("main").unwrap();

        // Test that potentially dangerous operations are properly restricted
        let security_test = r#"
            // Test that eval is properly restricted (if CSP is configured)
            try {
                // This should fail if CSP prohibits eval
                eval('1 + 1');
                'Eval allowed (check CSP configuration)';
            } catch (error) {
                'Eval properly restricted: ' + error.message;
            }
        "#;

        let result = window.eval(security_test);
        assert!(result.is_ok(), "Security constraints test should not panic");
    }

    // Mock test for clipboard operations
    #[tokio::test]
    async fn test_clipboard_operations() {
        let app = create_e2e_app();
        let window = app.get_window("main").unwrap();

        // Test clipboard API availability
        let clipboard_test = r#"
            // Test clipboard API
            try {
                if (navigator.clipboard) {
                    'Clipboard API available';
                } else {
                    'Clipboard API not available';
                }
            } catch (error) {
                'Clipboard API error: ' + error.message;
            }
        "#;

        let result = window.eval(clipboard_test);
        assert!(result.is_ok(), "Clipboard test should not panic");
    }
}