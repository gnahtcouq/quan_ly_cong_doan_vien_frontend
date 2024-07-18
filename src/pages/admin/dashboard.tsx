import {Card, Col, Row, Spin, Select, DatePicker, Form} from 'antd'
import {useEffect, useState, useRef} from 'react'
import Chart from 'chart.js/auto'
import {
  callFetchReceiptByMonthAndYear,
  callFetchExpenseByMonthAndYear
} from '@/config/api'
import {ProForm} from '@ant-design/pro-components'

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [receiptData, setReceiptData] = useState<any[]>([])
  const [expenseData, setExpenseData] = useState<any[]>([])
  const chartRef = useRef<Chart | null>(null)

  const fetchData = async (month: number, year: number) => {
    setIsLoading(true)
    try {
      const receiptResponseByTime = await callFetchReceiptByMonthAndYear(
        `month=${month}&year=${year}`
      )
      const expenseResponseByTime = await callFetchExpenseByMonthAndYear(
        `month=${month}&year=${year}`
      )

      setReceiptData((receiptResponseByTime?.data as unknown as any) || [])
      setExpenseData((expenseResponseByTime?.data as unknown as any) || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderChart = () => {
    const receiptAmounts = receiptData.map((item) => Number(item.amount))
    const expenseAmounts = expenseData.map((item) => Number(item.amount))
    const receiptTimes = receiptData.map((item) =>
      new Date(item.time).toLocaleDateString('en-US')
    )
    const expenseTimes = expenseData.map((item) =>
      new Date(item.time).toLocaleDateString('en-US')
    )

    const times = Array.from(new Set([...receiptTimes, ...expenseTimes]))

    const receiptAmountsByTime = times.map((time) => {
      const index = receiptTimes.indexOf(time)
      return index !== -1 ? receiptAmounts[index] : 0
    })

    const expenseAmountsByTime = times.map((time) => {
      const index = expenseTimes.indexOf(time)
      return index !== -1 ? expenseAmounts[index] : 0
    })

    const ctx = document.getElementById('myChart') as HTMLCanvasElement
    if (!ctx) {
      console.error('Canvas element not found')
      return
    }

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    try {
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: times,
          datasets: [
            {
              label: 'Số tiền thu',
              data: receiptAmountsByTime,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            },
            {
              label: 'Số tiền chi',
              data: expenseAmountsByTime,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Số tiền'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Thời gian'
              }
            }
          },
          plugins: {
            legend: {
              position: 'top'
            }
          },
          layout: {
            padding: {
              bottom: 10 // Adjust as needed
            }
          },
          aspectRatio: 3 // Example aspect ratio
        }
      })
    } catch (error) {
      console.error('Error rendering chart:', error)
    }
  }

  const handleDatePickerChange = (date: any) => {
    if (date) {
      const selectedMonth = date.month() + 1 // month is 0-indexed
      const selectedYear = date.year()
      fetchData(selectedMonth, selectedYear)
    }
  }

  useEffect(() => {
    // Fetch initial data for current month and year
    const currentDate = new Date()
    fetchData(currentDate.getMonth() + 1, currentDate.getFullYear())
  }, [])

  useEffect(() => {
    // Render or re-render chart whenever receiptData or expenseData changes
    renderChart()
  }, [receiptData, expenseData])

  return (
    <Spin spinning={isLoading}>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Card title="Thống kê số tiền thu và chi" bordered={false}>
            <Form>
              <ProForm.Item
                label="Tháng/Năm"
                name="monthYear"
                rules={[{required: false}]}
              >
                <DatePicker
                  format="MM/YYYY"
                  placeholder="mm/yyyy"
                  picker="month"
                  onChange={handleDatePickerChange}
                />
              </ProForm.Item>
            </Form>
            <canvas id="myChart"></canvas>
          </Card>
        </Col>
      </Row>
    </Spin>
  )
}

export default DashboardPage
