// Library module for Noteum Tauri application
// Contains functions that can be unit tested

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GreetingMessage {
    pub name: String,
}

impl GreetingMessage {
    pub fn new(name: impl Into<String>) -> Self {
        Self {
            name: name.into(),
        }
    }

    pub fn greet(&self) -> String {
        format!("Hello, {}! You've been greeted from Rust!", self.name)
    }

    pub fn validate_name(&self) -> Result<(), String> {
        if self.name.trim().is_empty() {
            Err("Name cannot be empty".to_string())
        } else if self.name.len() > 100 {
            Err("Name is too long (max 100 characters)".to_string())
        } else {
            Ok(())
        }
    }
}


// Additional utility functions for testing
pub fn format_greeting(name: &str) -> String {
    let message = GreetingMessage::new(name);
    message.greet()
}

pub fn is_valid_name(name: &str) -> bool {
    let message = GreetingMessage::new(name);
    message.validate_name().is_ok()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_greeting_message_creation() {
        let message = GreetingMessage::new("World");
        assert_eq!(message.name, "World");
    }

    #[test]
    fn test_greeting_message_greet() {
        let message = GreetingMessage::new("Tauri");
        let result = message.greet();
        assert_eq!(result, "Hello, Tauri! You've been greeted from Rust!");
    }

    #[test]
    fn test_greeting_message_empty_name() {
        let message = GreetingMessage::new("");
        let result = message.greet();
        assert_eq!(result, "Hello, ! You've been greeted from Rust!");
    }

    #[test]
    fn test_validate_name_valid() {
        let message = GreetingMessage::new("Valid Name");
        assert!(message.validate_name().is_ok());
    }

    #[test]
    fn test_validate_name_empty() {
        let message = GreetingMessage::new("");
        let result = message.validate_name();
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Name cannot be empty");
    }

    #[test]
    fn test_validate_name_whitespace_only() {
        let message = GreetingMessage::new("   ");
        let result = message.validate_name();
        assert!(result.is_err());
    }

    #[test]
    fn test_validate_name_too_long() {
        let long_name = "a".repeat(101);
        let message = GreetingMessage::new(long_name);
        let result = message.validate_name();
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Name is too long (max 100 characters)");
    }

    #[test]
    fn test_format_greeting() {
        let result = format_greeting("Test");
        assert_eq!(result, "Hello, Test! You've been greeted from Rust!");
    }

    #[test]
    fn test_is_valid_name() {
        assert!(is_valid_name("Valid Name"));
        assert!(!is_valid_name(""));
        assert!(!is_valid_name("   "));
        assert!(!is_valid_name(&"a".repeat(101)));
    }

  
    #[test]
    fn test_unicode_characters() {
        let unicode_name = "测试用户";
        let result = format_greeting(unicode_name);
        assert_eq!(result, "Hello, 测试用户! You've been greeted from Rust!");
    }
}