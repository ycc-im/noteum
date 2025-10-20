## ADDED Requirements

### Requirement: Remove @noteum/ui dependency

The system SHALL remove all dependencies on the @noteum/ui package from the client application.

#### Scenario: Remove @noteum/ui dependency

- **WHEN** developer removes @noteum/ui from package.json
- **THEN** the application no longer imports from @noteum/ui
- **AND** all existing components are replaced with shadcn/ui equivalents
- **AND** build process succeeds without @noteum/ui package

### Requirement: shadcn/ui CLI Setup

The system SHALL provide shadcn/ui CLI and configuration for component management.

#### Scenario: Initialize shadcn/ui

- **WHEN** developer runs `npx shadcn-ui@latest init`
- **THEN** components.json configuration file is created
- **AND** required dependencies are installed
- **AND** CLI commands work correctly for adding components

#### Scenario: Add shadcn/ui components

- **WHEN** developer runs `npx shadcn-ui add [component]`
- **THEN** component is installed in the correct directory
- **AND** component dependencies are automatically resolved
- **AND** component is ready for use in the application

### Requirement: shadcn/ui Theme System

The system SHALL implement a complete theme system using shadcn/ui CSS variables.

#### Scenario: Light/Dark theme support

- **WHEN** user toggles between light and dark themes
- **THEN** all UI components update their styling accordingly
- **AND** theme preference is persisted
- **AND** CSS variables properly reflect the current theme

#### Scenario: Custom theme configuration

- **WHEN** developer customizes theme colors in CSS variables
- **THEN** all shadcn/ui components reflect the custom colors
- **AND** visual consistency is maintained across the application
- **AND** brand colors are properly integrated

### Requirement: Component Migration Utilities

The system SHALL provide utility functions for working with shadcn/ui components.

#### Scenario: Use cn() utility function

- **WHEN** developer uses cn() function to merge classes
- **THEN** Tailwind classes are properly merged and deduplicated
- **AND** conditional classes work correctly
- **AND** TypeScript types are properly inferred

## MODIFIED Requirements

### Requirement: Client Package Dependencies

The system SHALL update the client package.json to reflect the new dependency structure.

#### Scenario: Update package dependencies

- **WHEN** developer installs shadcn/ui related packages
- **THEN** @noteum/ui dependency is removed
- **AND** shadcn/ui and related dependencies are added
- **AND** all dependencies resolve correctly without conflicts

### Requirement: Component Import Statements

The system SHALL update all component imports to use shadcn/ui instead of @noteum/ui.

#### Scenario: Update component imports

- **WHEN** developer updates import statements
- **THEN** all @noteum/ui imports are replaced with shadcn/ui imports
- **AND** component functionality remains unchanged
- **AND** TypeScript compilation succeeds without errors

## REMOVED Requirements

### Requirement: UI Package Maintenance

The system SHALL remove the need for maintaining a separate @noteum/ui package.

#### Scenario: Simplified development workflow

- **WHEN** team works on UI components
- **THEN** all changes happen directly in the client application
- **AND** no cross-package synchronization is needed
- **AND** build process is simplified without UI package compilation
