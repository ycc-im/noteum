'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { API_ENDPOINTS } from '@/lib/api-config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  MessageSquare,
  PlayCircle,
  RefreshCw,
  Settings,
  TrendingUp,
  Zap
} from 'lucide-react'

interface HealthStatus {
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY'
  timestamp: number
  adapter: {
    connected: boolean
    type: string
    features: string[]
  }
  metrics: {
    messagesProduced: number
    messagesConsumed: number
    errorsCount: number
    uptime: number
    responseTime: number
  }
  issues: string[]
  recommendations: string[]
}

interface TestResult {
  scenario: string
  success: boolean
  duration?: number
  error?: string
  [key: string]: any
}

export default function MessagingTestDashboard() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [metrics, setMetrics] = useState<any>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([
    'basic-produce-consume',
    'error-recovery',
    'circuit-breaker'
  ])

  const testScenarios = [
    { id: 'basic-produce-consume', name: '基础生产消费', description: '测试基本的消息生产和消费' },
    { id: 'error-recovery', name: '错误恢复', description: '测试错误恢复机制' },
    { id: 'circuit-breaker', name: '断路器', description: '测试断路器模式' },
    { id: 'performance-benchmark', name: '性能基准', description: '测试性能基准' },
    { id: 'load-testing', name: '负载测试', description: '进行负载测试' }
  ]

  useEffect(() => {
    fetchHealthData()

    if (isAutoRefresh) {
      const interval = setInterval(fetchHealthData, 3000)
      return () => clearInterval(interval)
    }
  }, [isAutoRefresh])

  const fetchHealthData = async () => {
    try {
      const [healthRes, metricsRes] = await Promise.all([
        fetch(API_ENDPOINTS.MESSAGING.HEALTH),
        fetch(API_ENDPOINTS.MESSAGING.METRICS)
      ])

      const healthData = await healthRes.json()
      const metricsData = await metricsRes.json()

      setHealth(healthData)
      setMetrics(metricsData)
    } catch (error) {
      console.error('Failed to fetch health data:', error)
    }
  }

  const runSelectedTests = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.MESSAGING.TEST_SCENARIOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedScenarios)
      })

      const results = await response.json()
      setTestResults(results.scenarios || [])
    } catch (error) {
      console.error('Failed to run tests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const simulateLoad = async (config: any) => {
    setIsLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.MESSAGING.SIMULATE_LOAD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      const result = await response.json()
      setTestResults(prev => [...prev, {
        scenario: 'load-test',
        success: result.successRate > 80,
        ...result
      }])
    } catch (error) {
      console.error('Failed to simulate load:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const produceTestMessage = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.MESSAGING.PRODUCE('test-topic'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: {
            test: true,
            timestamp: Date.now(),
            message: 'Test message from dashboard'
          }
        })
      })

      const result = await response.json()
      console.log('Message sent:', result)
      fetchHealthData() // Refresh data
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'text-green-600'
      case 'DEGRADED': return 'text-yellow-600'
      case 'UNHEALTHY': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'bg-green-100 text-green-800'
      case 'DEGRADED': return 'bg-yellow-100 text-yellow-800'
      case 'UNHEALTHY': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            消息中间件测试控制台
          </h1>
          <p className="text-gray-600 mt-1">
            实时监控和测试 Redis Stream / Kafka 消息中间件
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="auto-refresh">自动刷新</Label>
            <Switch
              id="auto-refresh"
              checked={isAutoRefresh}
              onCheckedChange={setIsAutoRefresh}
            />
          </div>
          <Button variant="outline" onClick={fetchHealthData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
        </div>
      </div>

      {/* 健康状态概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4" />
              系统状态
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {health ? (
                <Badge className={getStatusBgColor(health.status)}>
                  {health.status}
                </Badge>
              ) : (
                <Badge variant="outline">未知</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="w-4 h-4" />
              连接状态
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {health?.adapter.connected ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  已连接
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  未连接
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              消息总数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.health?.totalMessages || 0}
            </div>
            <p className="text-xs text-gray-500">
              生产: {health?.metrics.messagesProduced || 0} |
              消费: {health?.metrics.messagesConsumed || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              错误率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.health?.errorRate
                ? `${(metrics.health.errorRate * 100).toFixed(2)}%`
                : '0%'
              }
            </div>
            <p className="text-xs text-gray-500">
              错误数: {health?.metrics.errorsCount || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monitoring" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monitoring">实时监控</TabsTrigger>
          <TabsTrigger value="testing">功能测试</TabsTrigger>
          <TabsTrigger value="load">负载测试</TabsTrigger>
          <TabsTrigger value="configuration">配置信息</TabsTrigger>
        </TabsList>

        {/* 实时监控标签页 */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 适配器信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  适配器信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                {health?.adapter ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">类型:</span>
                      <Badge variant="outline">{health.adapter.type}</Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium">功能特性:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {health.adapter.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">运行时间:</span>
                      <span className="text-sm">
                        {Math.floor((health.metrics.uptime || 0) / 1000 / 60)} 分钟
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">响应时间:</span>
                      <span className="text-sm">{health.metrics.responseTime}ms</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">无适配器信息</p>
                )}
              </CardContent>
            </Card>

            {/* 错误统计 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  错误统计
                </CardTitle>
              </CardHeader>
              <CardContent>
                {metrics?.errors ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">总错误数:</span>
                      <span className="text-sm font-bold text-red-600">
                        {metrics.errors.totalErrors}
                      </span>
                    </div>

                    {Object.entries(metrics.errors.errorsByOperation).map(([operation, count]) => (
                      <div key={operation} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{operation}:</span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={(count as number / metrics.errors.totalErrors) * 100}
                            className="w-20 h-2"
                          />
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">无错误数据</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 健康问题和建议 */}
          {health && (health.issues.length > 0 || health.recommendations.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {health.issues.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">检测到的问题</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {health.issues.map((issue, index) => (
                        <Alert key={index} variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{issue}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {health.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600">优化建议</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {health.recommendations.map((rec, index) => (
                        <Alert key={index}>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>{rec}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* 功能测试标签页 */}
        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5" />
                功能测试
              </CardTitle>
              <CardDescription>
                选择测试场景来验证消息中间件的各种功能
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 测试场景选择 */}
              <div>
                <Label className="text-base font-medium">选择测试场景:</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {testScenarios.map((scenario) => (
                    <div key={scenario.id} className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id={scenario.id}
                        checked={selectedScenarios.includes(scenario.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedScenarios(prev => [...prev, scenario.id])
                          } else {
                            setSelectedScenarios(prev => prev.filter(s => s !== scenario.id))
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor={scenario.id} className="text-sm font-medium cursor-pointer">
                          {scenario.name}
                        </Label>
                        <p className="text-xs text-gray-500">{scenario.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 运行测试 */}
              <div className="flex gap-2">
                <Button
                  onClick={runSelectedTests}
                  disabled={isLoading || selectedScenarios.length === 0}
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <PlayCircle className="w-4 h-4 mr-2" />
                  )}
                  运行选中的测试
                </Button>

                <Button variant="outline" onClick={produceTestMessage}>
                  <Zap className="w-4 h-4 mr-2" />
                  发送测试消息
                </Button>
              </div>

              {/* 测试结果 */}
              {testResults.length > 0 && (
                <div>
                  <Label className="text-base font-medium">测试结果:</Label>
                  <div className="mt-2 space-y-2">
                    {testResults.map((result, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">
                            {result.scenario.replace(/-/g, ' ')}
                          </span>
                          <Badge className={result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {result.success ? '成功' : '失败'}
                          </Badge>
                        </div>

                        {result.duration && (
                          <p className="text-sm text-gray-600 mt-1">
                            耗时: {result.duration}ms
                          </p>
                        )}

                        {result.error && (
                          <p className="text-sm text-red-600 mt-1">
                            错误: {result.error}
                          </p>
                        )}

                        {result.totalMessages && (
                          <div className="mt-2 text-sm">
                            <p>总消息数: {result.totalMessages}</p>
                            <p>成功率: {result.successRate?.toFixed(2)}%</p>
                            <p>平均耗时: {result.averageDuration?.toFixed(2)}ms</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 负载测试标签页 */}
        <TabsContent value="load" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                负载测试
              </CardTitle>
              <CardDescription>
                模拟高负载场景测试消息中间件的性能
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="messageCount">消息数量</Label>
                  <Input
                    id="messageCount"
                    type="number"
                    defaultValue="100"
                    min="1"
                    max="10000"
                  />
                </div>
                <div>
                  <Label htmlFor="messageSize">消息大小 (bytes)</Label>
                  <Input
                    id="messageSize"
                    type="number"
                    defaultValue="1000"
                    min="10"
                    max="100000"
                  />
                </div>
                <div>
                  <Label htmlFor="concurrency">并发数</Label>
                  <Input
                    id="concurrency"
                    type="number"
                    defaultValue="5"
                    min="1"
                    max="100"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => {
                      const messageCount = parseInt((document.getElementById('messageCount') as HTMLInputElement).value)
                      const messageSize = parseInt((document.getElementById('messageSize') as HTMLInputElement).value)
                      const concurrency = parseInt((document.getElementById('concurrency') as HTMLInputElement).value)

                      simulateLoad({
                        topic: `load-test-${Date.now()}`,
                        messageCount,
                        messageSize,
                        concurrency
                      })
                    }}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <PlayCircle className="w-4 h-4 mr-2" />
                    )}
                    开始负载测试
                  </Button>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  负载测试会发送大量消息来测试系统性能，请确保有足够的资源。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 配置信息标签页 */}
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                配置信息
              </CardTitle>
              <CardDescription>
                查看当前消息中间件的配置信息
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">当前配置</Label>
                  <pre className="mt-2 bg-gray-50 p-3 rounded-lg text-sm overflow-auto max-h-96">
                    {JSON.stringify(health, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}