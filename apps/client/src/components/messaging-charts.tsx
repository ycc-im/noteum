'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { API_ENDPOINTS } from '@/lib/api-config'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface ChartData {
  timestamp: number
  value: number
  label?: string
}

interface ErrorData {
  name: string
  value: number
  color: string
}

export default function MessagingCharts() {
  const [messageData, setMessageData] = useState<ChartData[]>([])
  const [errorData, setErrorData] = useState<ChartData[]>([])
  const [performanceData, setPerformanceData] = useState<ChartData[]>([])
  const [errorBreakdown, setErrorBreakdown] = useState<ErrorData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.MESSAGING.METRICS)
        const data = await response.json()

        // 处理消息数据
        const messages = data.health?.totalMessages || 0
        setMessageData(prev => {
          const newData = [...prev, {
            timestamp: Date.now(),
            value: messages,
            label: new Date().toLocaleTimeString()
          }]
          return newData.slice(-20) // 保留最近20个数据点
        })

        // 处理错误数据
        const errors = data.errors?.totalErrors || 0
        setErrorData(prev => {
          const newData = [...prev, {
            timestamp: Date.now(),
            value: errors,
            label: new Date().toLocaleTimeString()
          }]
          return newData.slice(-20)
        })

        // 处理性能数据
        const responseTime = data.health?.responseTime || 0
        setPerformanceData(prev => {
          const newData = [...prev, {
            timestamp: Date.now(),
            value: responseTime,
            label: new Date().toLocaleTimeString()
          }]
          return newData.slice(-20)
        })

        // 处理错误分类数据
        if (data.errors?.errorsByOperation) {
          const breakdown = Object.entries(data.errors.errorsByOperation).map(([key, value]) => ({
            name: key,
            value: value as number,
            color: getColorForOperation(key)
          }))
          setErrorBreakdown(breakdown)
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [])

  const getColorForOperation = (operation: string) => {
    const colors: Record<string, string> = {
      produce: '#ef4444',
      consume: '#f59e0b',
      createTopic: '#10b981',
      deleteTopic: '#3b82f6',
      connect: '#8b5cf6',
      disconnect: '#ec4899'
    }
    return colors[operation] || '#6b7280'
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div className="space-y-6">
      {/* 消息吞吐量图表 */}
      <Card>
        <CardHeader>
          <CardTitle>消息吞吐量</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={messageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(value) => `时间: ${value}`}
                formatter={(value: any) => [`消息数: ${value}`, '总计']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fill="#93c5fd"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 错误趋势图表 */}
      <Card>
        <CardHeader>
          <CardTitle>错误趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={errorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(value) => `时间: ${value}`}
                formatter={(value: any) => [`错误数: ${value}`, '错误']}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 响应时间图表 */}
        <Card>
          <CardHeader>
            <CardTitle>响应时间</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={performanceData.slice(-10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={(value) => `时间: ${value}`}
                  formatter={(value: any) => [`${value}ms`, '响应时间']}
                />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 错误分布饼图 */}
        <Card>
          <CardHeader>
            <CardTitle>错误分布</CardTitle>
          </CardHeader>
          <CardContent>
            {errorBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={errorBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {errorBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                暂无错误数据
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 性能指标统计 */}
      <Card>
        <CardHeader>
          <CardTitle>性能指标统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {messageData.length > 0 ? messageData[messageData.length - 1]?.value : 0}
              </div>
              <div className="text-sm text-gray-600">当前消息数</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {errorData.length > 0 ? errorData[errorData.length - 1]?.value : 0}
              </div>
              <div className="text-sm text-gray-600">当前错误数</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {performanceData.length > 0
                  ? Math.round(performanceData.reduce((sum, d) => sum + d.value, 0) / performanceData.length)
                  : 0}ms
              </div>
              <div className="text-sm text-gray-600">平均响应时间</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {messageData.length > 1
                  ? Math.max(0, messageData[messageData.length - 1]?.value - messageData[0]?.value)
                  : 0}
              </div>
              <div className="text-sm text-gray-600">新增消息数</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}