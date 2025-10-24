// API 配置
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production'
    ? window.location.origin
    : 'http://localhost:9168',
  PREFIX: '/api/v1',
}

export const API_ENDPOINTS = {
  MESSAGING: {
    HEALTH: `${API_CONFIG.BASE_URL}${API_CONFIG.PREFIX}/messaging-test/health`,
    METRICS: `${API_CONFIG.BASE_URL}${API_CONFIG.PREFIX}/messaging-test/metrics`,
    PRODUCE: (topic: string) => `${API_CONFIG.BASE_URL}${API_CONFIG.PREFIX}/messaging-test/produce/${topic}`,
    TEST_SCENARIOS: `${API_CONFIG.BASE_URL}${API_CONFIG.PREFIX}/messaging-test/test-scenarios`,
    SIMULATE_LOAD: `${API_CONFIG.BASE_URL}${API_CONFIG.PREFIX}/messaging-test/simulate-load`,
    CONFIGURATION: `${API_CONFIG.BASE_URL}${API_CONFIG.PREFIX}/messaging-test/configuration`,
    ADAPTER_INFO: `${API_CONFIG.BASE_URL}${API_CONFIG.PREFIX}/messaging-test/adapter-info`,
    TRIGGER_ERROR: `${API_CONFIG.BASE_URL}${API_CONFIG.PREFIX}/messaging-test/trigger-error`,
    TEST_REPORT: `${API_CONFIG.BASE_URL}${API_CONFIG.PREFIX}/messaging-test/test-report`,
  }
}