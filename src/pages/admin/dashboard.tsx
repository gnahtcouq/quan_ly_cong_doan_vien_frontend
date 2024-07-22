import {Card, Col, Row, Spin, DatePicker, Form, notification} from 'antd'
import {useEffect, useState, useRef} from 'react'
import Chart from 'chart.js/auto'
import {
  callFetchReceiptByMonthAndYear,
  callFetchExpenseByMonthAndYear,
  callFetchNumberOfUsers,
  callFetchNumberOfUnionists,
  callFetchNumberOfDepartments,
  callFetchNumberOfPosts,
  callFetchNumberOfDocuments
} from '@/config/api'
import {ProForm} from '@ant-design/pro-components'

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [receiptData, setReceiptData] = useState<any[]>([])
  const [expenseData, setExpenseData] = useState<any[]>([])
  const [userCount, setUserCount] = useState(0)
  const [unionistCount, setUnionistCount] = useState(0)
  const [departmentCount, setDepartmentCount] = useState(0)
  const [postCount, setPostCount] = useState(0)
  const [documentCount, setDocumentCount] = useState(0)
  const chartRef = useRef<Chart | null>(null)
  const polarChartRef = useRef<Chart<'polarArea', number[], string> | null>(
    null
  )

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

      const userCountResponse = await callFetchNumberOfUsers()
      const unionistCountResponse = await callFetchNumberOfUnionists()
      const departmentCountResponse = await callFetchNumberOfDepartments()
      const postCountResponse = await callFetchNumberOfPosts()
      const documentCountResponse = await callFetchNumberOfDocuments()
      setUserCount(userCountResponse.data || 0)
      setUnionistCount(unionistCountResponse.data || 0)
      setDepartmentCount(departmentCountResponse.data || 0)
      setPostCount(postCountResponse.data || 0)
      setDocumentCount(documentCountResponse.data || 0)
    } catch (error) {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: 'Đã xảy ra lỗi khi tìm nạp dữ liệu'
      })
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

    // Reset canvas
    ctx.width = ctx.width

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

  const renderPolarChart = () => {
    const ctx = document.getElementById('polarChart') as HTMLCanvasElement
    if (!ctx) {
      console.error('Canvas element not found')
      return
    }

    // Reset canvas
    ctx.width = ctx.width

    if (polarChartRef.current) {
      polarChartRef.current.destroy()
    }

    try {
      polarChartRef.current = new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: [
            'Thành viên',
            'Công đoàn viên',
            'Đơn vị',
            'Bài đăng',
            'Văn bản'
          ],
          datasets: [
            {
              label: 'Số lượng',
              data: [
                userCount,
                unionistCount,
                departmentCount,
                postCount,
                documentCount
              ],
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
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
    const currentDate = new Date()
    fetchData(currentDate.getMonth() + 1, currentDate.getFullYear())
  }, [])

  useEffect(() => {
    renderChart()
    renderPolarChart()
  }, [
    receiptData,
    expenseData,
    userCount,
    unionistCount,
    departmentCount,
    postCount,
    documentCount
  ])

  return (
    <Spin spinning={isLoading}>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Card title="Thống kê số lượng" bordered={false}>
            <canvas id="polarChart"></canvas>
          </Card>
        </Col>
        <Col span={24}>
          <Card title="Thống kê số tiền thu và chi" bordered={false}>
            <Form>
              <ProForm.Item
                label="Tháng/năm"
                name="monthYear"
                rules={[{required: false}]}
              >
                <DatePicker
                  format="MM/YYYY"
                  placeholder="tháng/năm"
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
