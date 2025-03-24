import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Calendar } from './Calendar'
import { addDays } from 'date-fns'
import { zhCN } from 'date-fns/locale'

describe('Calendar', () => {
  it('renders calendar with default props', () => {
    render(<Calendar />)
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('handles date selection', () => {
    const onDateSelect = vi.fn()
    render(<Calendar onDateSelect={onDateSelect} />)

    // 找到第一个可点击的日期
    const dayButtons = screen
      .getAllByRole('gridcell')
      .filter((cell) => !cell.hasAttribute('aria-disabled'))
    fireEvent.click(dayButtons[0])

    expect(onDateSelect).toHaveBeenCalled()
  })

  it('handles range selection', () => {
    const onRangeSelect = vi.fn()
    render(<Calendar mode="range" enableRangeSelection onRangeSelect={onRangeSelect} />)

    const dayButtons = screen
      .getAllByRole('gridcell')
      .filter((cell) => !cell.hasAttribute('aria-disabled'))

    // 选择范围
    fireEvent.click(dayButtons[0])
    fireEvent.click(dayButtons[6])

    expect(onRangeSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        from: expect.any(Date),
        to: expect.any(Date),
      }),
    )
  })

  it('changes view when clicking view buttons', () => {
    const onViewChange = vi.fn()
    render(<Calendar onViewChange={onViewChange} />)

    // 先找到视图切换按钮
    const weekViewButton = screen.getByText('周')
    fireEvent.click(weekViewButton)

    expect(onViewChange).toHaveBeenCalledWith('week')
  })

  it('navigates between dates', () => {
    render(<Calendar />)

    const prevButton = screen.getByLabelText('上一个')
    const nextButton = screen.getByLabelText('下一个')
    const todayButton = screen.getByText('今天')

    fireEvent.click(nextButton)
    fireEvent.click(prevButton)
    fireEvent.click(todayButton)

    // 验证导航按钮可以点击且不会报错
    expect(prevButton).not.toBeDisabled()
    expect(nextButton).not.toBeDisabled()
    expect(todayButton).not.toBeDisabled()
  })

  it('displays date data indicators', () => {
    const today = new Date()
    const dateData = {
      [today.toISOString().split('T')[0]]: {
        noteCount: 3,
        hasImportantItems: true,
        activityLevel: 8,
      },
    }

    render(<Calendar dateData={dateData} />)

    // 检查是否显示标记
    const todayCell = screen.getByLabelText(today.toLocaleDateString('zh-CN'))
    expect(todayCell).toBeInTheDocument()
  })

  it('supports localization', () => {
    render(<Calendar locale={zhCN} />)

    // 验证是否使用了中文月份名称
    expect(screen.getByText(/^[一二三四五六日]$/).textContent).toBeTruthy()
  })

  it('handles custom date rendering', () => {
    const renderDateContent = vi.fn((date: Date) => (
      <div data-testid="custom-content">{date.getDate()}</div>
    ))

    render(<Calendar renderDateContent={renderDateContent} />)

    expect(screen.getAllByTestId('custom-content')).not.toHaveLength(0)
    expect(renderDateContent).toHaveBeenCalled()
  })

  it('fetches date data when view changes', async () => {
    const fetchDateData = vi.fn().mockResolvedValue({})
    render(<Calendar fetchDateData={fetchDateData} />)

    const weekViewButton = screen.getByText('周')
    fireEvent.click(weekViewButton)

    expect(fetchDateData).toHaveBeenCalled()
  })

  it('handles view mode changes correctly', () => {
    const onViewChange = vi.fn()
    render(<Calendar onViewChange={onViewChange} />)

    const dayViewButton = screen.getByText('日')
    const weekViewButton = screen.getByText('周')
    const monthViewButton = screen.getByText('月')

    fireEvent.click(dayViewButton)
    expect(onViewChange).toHaveBeenCalledWith('day')

    fireEvent.click(weekViewButton)
    expect(onViewChange).toHaveBeenCalledWith('week')

    fireEvent.click(monthViewButton)
    expect(onViewChange).toHaveBeenCalledWith('month')
  })
})
