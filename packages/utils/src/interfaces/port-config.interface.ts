/**
 * Port configuration interfaces and types
 * Defines comprehensive type system for port management
 */

import { ServiceType } from '../port-config'

/**
 * Base port configuration interface
 */
export interface IPortConfiguration {
  service: ServiceType
  internalPort: number
  externalPort: number
  protocol: 'tcp' | 'udp'
  description: string
  environment: 'development' | 'production' | 'test'
}

/**
 * Extended port configuration with additional metadata
 */
export interface IExtendedPortConfiguration extends IPortConfiguration {
  id: string
  status: PortStatus
  healthCheck?: IHealthCheck
  dependencies?: ServiceType[]
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

/**
 * Port status enumeration
 */
export enum PortStatus {
  UNKNOWN = 'unknown',
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  CONFLICTED = 'conflicted',
  RESERVED = 'reserved',
  ERROR = 'error'
}

/**
 * Port health check configuration
 */
export interface IHealthCheck {
  enabled: boolean
  path?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  interval: number // milliseconds
  timeout: number // milliseconds
  retries: number
  expectedStatus?: number
  headers?: Record<string, string>
}

/**
 * Port check result interface
 */
export interface IPortCheckResult {
  port: number
  isAvailable: boolean
  status: PortStatus
  occupiedBy?: string
  processId?: number
  lastChecked: Date
  responseTime?: number
  error?: string
}

/**
 * Port scan configuration
 */
export interface IPortScanConfig {
  ports: number[]
  timeout: number // milliseconds per port
  parallel: boolean
  maxConcurrency: number
  includeProcessInfo: boolean
  retryFailed: boolean
  retryAttempts: number
}

/**
 * Port scan results
 */
export interface IPortScanResult {
  config: IPortScanConfig
  results: IPortCheckResult[]
  summary: IPortScanSummary
  duration: number // milliseconds
  timestamp: Date
}

/**
 * Port scan summary
 */
export interface IPortScanSummary {
  totalPorts: number
  availablePorts: number
  occupiedPorts: number
  conflictedPorts: number
  errorPorts: number
  scanRate: number // ports per second
}

/**
 * Port reservation interface
 */
export interface IPortReservation {
  port: number
  service: ServiceType
  reservedBy: string
  reservedAt: Date
  expiresAt?: Date
  purpose: string
  metadata?: Record<string, unknown>
}

/**
 * Port conflict resolution
 */
export interface IPortConflictResolution {
  originalPort: number
  conflictingServices: string[]
  resolution: ConflictResolutionType
  resolvedPort?: number
  requiresAction: boolean
  actionDescription?: string
  automated: boolean
}

/**
 * Conflict resolution types
 */
export enum ConflictResolutionType {
  KILL_PROCESS = 'kill_process',
  CHANGE_PORT = 'change_port',
  WAIT_FOR_RELEASE = 'wait_for_release',
  IGNORE = 'ignore',
  MANUAL_INTERVENTION = 'manual_intervention'
}

/**
 * Port monitoring configuration
 */
export interface IPortMonitoringConfig {
  enabled: boolean
  interval: number // milliseconds
  notifyOnChanges: boolean
  persistHistory: boolean
  maxHistoryEntries: number
  alertThresholds: IAlertThresholds
}

/**
 * Alert thresholds for port monitoring
 */
export interface IAlertThresholds {
  conflictCount: number
  unavailableDuration: number // milliseconds
  responseTime: number // milliseconds
}

/**
 * Port monitoring event
 */
export interface IPortMonitoringEvent {
  id: string
  port: number
  service: ServiceType
  type: MonitoringEventType
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: Date
  metadata?: Record<string, unknown>
}

/**
 * Monitoring event types
 */
export enum MonitoringEventType {
  PORT_OCCUPIED = 'port_occupied',
  PORT_RELEASED = 'port_released',
  PORT_CONFLICT = 'port_conflict',
  HEALTH_CHECK_FAILED = 'health_check_failed',
  HEALTH_CHECK_RESTORED = 'health_check_restored',
  CONFIGURATION_CHANGED = 'configuration_changed',
  RESERVATION_EXPIRED = 'reservation_expired'
}

/**
 * Port configuration template
 */
export interface IPortConfigurationTemplate {
  name: string
  description: string
  version: string
  author: string
  configurations: IPortConfiguration[]
  dependencies?: Record<string, string>
  environmentVariables?: Record<string, string>
  scripts?: IScript[]
}

/**
 * Script configuration for port management
 */
export interface IScript {
  name: string
  description: string
  command: string
  arguments?: string[]
  workingDirectory?: string
  environment?: Record<string, string>
  timeout?: number
  retries?: number
}

/**
 * Port migration configuration
 */
export interface IPortMigrationConfig {
  fromPort: number
  toPort: number
  service: ServiceType
  strategy: MigrationStrategy
  backupConfiguration?: boolean
  validationRequired: boolean
  rollbackEnabled: boolean
}

/**
 * Migration strategies
 */
export enum MigrationStrategy {
  IMMEDIATE = 'immediate',
  GRACEFUL = 'graceful',
  BLUE_GREEN = 'blue_green',
  ROLLING = 'rolling'
}

/**
 * Port audit log entry
 */
export interface IPortAuditLog {
  id: string
  timestamp: Date
  action: AuditAction
  actor: string
  port: number
  service?: ServiceType
  details: Record<string, unknown>
  previousState?: Record<string, unknown>
  newState?: Record<string, unknown>
}

/**
 * Audit actions
 */
export enum AuditAction {
  PORT_CREATED = 'port_created',
  PORT_UPDATED = 'port_updated',
  PORT_DELETED = 'port_deleted',
  PORT_RESERVED = 'port_reserved',
  PORT_RELEASED = 'port_released',
  CONFLICT_DETECTED = 'conflict_detected',
  CONFLICT_RESOLVED = 'conflict_resolved',
  CONFIGURATION_IMPORTED = 'configuration_imported',
  CONFIGURATION_EXPORTED = 'configuration_exported'
}

/**
 * Port metrics interface
 */
export interface IPortMetrics {
  port: number
  service: ServiceType
  uptime: number // milliseconds
  responseTime: number // milliseconds
  successRate: number // percentage
  errorCount: number
  lastAccess: Date
  totalRequests: number
  averageResponseTime: number
}

/**
 * Service discovery configuration
 */
export interface IServiceDiscoveryConfig {
  enabled: boolean
  protocol: 'http' | 'tcp' | 'udp'
  basePath?: string
  healthCheckPath?: string
  registrationInterval: number // milliseconds
  deregistrationDelay: number // milliseconds
  metadata?: Record<string, string>
}

/**
 * Dynamic port allocation configuration
 */
export interface IDynamicPortAllocationConfig {
  enabled: boolean
  portRange: {
    min: number
    max: number
  }
  excludePorts: number[]
  strategy: AllocationStrategy
  reservationTimeout: number // milliseconds
  cleanupInterval: number // milliseconds
}

/**
 * Port allocation strategies
 */
export enum AllocationStrategy {
  SEQUENTIAL = 'sequential',
  RANDOM = 'random',
  LEAST_RECENTLY_USED = 'least_recently_used',
  ROUND_ROBIN = 'round_robin'
}

/**
 * Port configuration export/import formats
 */
export interface IPortConfigurationExport {
  format: 'json' | 'yaml' | 'toml' | 'env'
  version: string
  timestamp: Date
  configurations: IPortConfiguration[]
  metadata?: {
    environment?: string
    author?: string
    description?: string
    tags?: string[]
  }
}

/**
 * Validation rule interface
 */
export interface IValidationRule {
  name: string
  description: string
  validator: (config: IPortConfiguration) => IValidationResult
  severity: 'error' | 'warning' | 'info'
  enabled: boolean
}

/**
 * Validation result interface
 */
export interface IValidationResult {
  isValid: boolean
  rule: string
  message: string
  severity: 'error' | 'warning' | 'info'
  timestamp: Date
}