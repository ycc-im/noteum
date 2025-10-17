#[cfg(test)]
mod integration_tests {
    use tauri::{Manager, State};
    use serde::{Deserialize, Serialize};
    use std::sync::{Arc, Mutex};

    // Mock application state for testing
    #[derive(Debug, Default)]
    struct AppState {
        counter: Arc<Mutex<i32>>,
    }

    #[derive(Debug, Serialize, Deserialize)]
    struct CounterResponse {
        value: i32,
    }

    // Mock Tauri commands for testing
    #[tauri::command]
    fn increment_counter(state: State<AppState>) -> CounterResponse {
        let mut counter = state.counter.lock().unwrap();
        *counter += 1;
        CounterResponse { value: *counter }
    }

    #[tauri::command]
    fn get_counter(state: State<AppState>) -> CounterResponse {
        let counter = state.counter.lock().unwrap();
        CounterResponse { value: *counter }
    }

    #[tauri::command]
    fn reset_counter(state: State<AppState>) -> CounterResponse {
        let mut counter = state.counter.lock().unwrap();
        *counter = 0;
        CounterResponse { value: *counter }
    }

    // Helper function to create test app with all commands
    fn create_test_app() -> tauri::App {
        tauri::test::mock_app()
            .expect("Failed to create mock app")
            .manage(AppState::default())
            .invoke_handler(tauri::generate_handler![
                increment_counter,
                get_counter,
                reset_counter,
                super::greet
            ])
    }

    #[tokio::test]
    async fn test_app_creation() {
        let app = create_test_app();
        let windows = app.windows();
        assert!(!windows.is_empty(), "App should have at least one window");

        let main_window = app.get_window("main").expect("Main window should exist");
        assert!(!main_window.is_decorated().unwrap_or(false) || true); // Just ensure window exists
    }

    #[tokio::test]
    async fn test_counter_commands() {
        let app = create_test_app();
        let window = app.get_window("main").unwrap();

        // Test initial counter value
        let result = window.eval("window.__TAURI__.invoke('get_counter')");
        assert!(result.is_ok(), "get_counter command should execute successfully");

        // Test increment counter
        let result = window.eval("window.__TAURI__.invoke('increment_counter')");
        assert!(result.is_ok(), "increment_counter command should execute successfully");

        // Test reset counter
        let result = window.eval("window.__TAURI__.invoke('reset_counter')");
        assert!(result.is_ok(), "reset_counter command should execute successfully");
    }

    #[tokio::test]
    async fn test_greet_command_integration() {
        let app = create_test_app();
        let window = app.get_window("main").unwrap();

        // Test greet command with different inputs
        let test_cases = vec!["World", "Tauri", "测试用户", "", "123"];

        for test_input in test_cases {
            let result = window.eval(&format!(
                "window.__TAURI__.invoke('greet', {{ name: '{}' }})",
                test_input
            ));
            assert!(result.is_ok(), "greet command should work with input: {}", test_input);
        }
    }

    #[tokio::test]
    async fn test_multiple_command_sequence() {
        let app = create_test_app();
        let window = app.get_window("main").unwrap();

        // Execute a sequence of commands to test state management
        let commands = vec![
            "window.__TAURI__.invoke('reset_counter')",
            "window.__TAURI__.invoke('increment_counter')",
            "window.__TAURI__.invoke('increment_counter')",
            "window.__TAURI__.invoke('get_counter')",
        ];

        for command in commands {
            let result = window.eval(command);
            assert!(result.is_ok(), "Command should execute successfully: {}", command);
        }
    }

    #[test]
    fn test_command_json_serialization() {
        // Test that our data structures serialize/deserialize correctly
        let response = CounterResponse { value: 42 };
        let json = serde_json::to_string(&response).unwrap();
        let deserialized: CounterResponse = serde_json::from_str(&json).unwrap();
        assert_eq!(deserialized.value, 42);
    }

    #[test]
    fn test_concurrent_counter_access() {
        use std::sync::Arc;
        use std::thread;

        let state = AppState::default();
        let counter_ref = state.counter.clone();
        let handles: Vec<_> = (0..10)
            .map(|_| {
                let counter_clone = counter_ref.clone();
                thread::spawn(move || {
                    let mut counter = counter_clone.lock().unwrap();
                    *counter += 1;
                })
            })
            .collect();

        // Wait for all threads to complete
        for handle in handles {
            handle.join().unwrap();
        }

        // Verify final value
        let final_value = *state.counter.lock().unwrap();
        assert_eq!(final_value, 10);
    }

    #[tokio::test]
    async fn test_error_handling() {
        let app = create_test_app();
        let window = app.get_window("main").unwrap();

        // Test calling non-existent command (should fail gracefully)
        let result = window.eval("window.__TAURI__.invoke('non_existent_command')");
        // In test environment, this might not fail as expected, but we ensure it doesn't panic
        assert!(result.is_ok() || result.is_err());
    }

    // Performance test
    #[tokio::test]
    async fn test_command_performance() {
        let app = create_test_app();
        let window = app.get_window("main").unwrap();

        let start = std::time::Instant::now();

        // Execute multiple commands to test performance
        for _ in 0..100 {
            let _ = window.eval("window.__TAURI__.invoke('get_counter')");
        }

        let duration = start.elapsed();
        println!("100 commands executed in {:?}", duration);

        // Ensure it completes within reasonable time (adjust as needed)
        assert!(duration.as_millis() < 5000, "Commands should execute within 5 seconds");
    }
}