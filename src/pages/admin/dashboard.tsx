import {
  Card,
  Col,
  Row,
  Spin,
  DatePicker,
  Form,
  notification,
  Statistic,
  Select,
  Tag,
  Table,
  ConfigProvider
} from 'antd'
import {useEffect, useState, useRef} from 'react'
import Chart from 'chart.js/auto'
import {
  callFetchNumberOfUsers,
  callFetchNumberOfUnionists,
  callFetchNumberOfDepartments,
  callFetchNumberOfPosts,
  callFetchNumberOfDocuments,
  callFetchReceiptsByTime,
  callFetchExpensesByTime,
  callFetchIncomeCategoriesByTime,
  callFetchExpenseCategoriesByTime
} from '@/config/api'
import {ProForm} from '@ant-design/pro-components'
import {disabledMonthYear, formatCurrency} from '@/config/utils'
import Access from '@/components/share/access'
import {ALL_PERMISSIONS} from '@/config/permissions'
import CountUp from 'react-countup'
import queryString from 'query-string'
import {IExpense, IReceipt} from '@/types/backend'
import {ColumnsType} from 'antd/es/table'
import vi_VN from 'antd/locale/vi_VN'
import dayjs from 'dayjs'

const DashboardPage = () => {
  const formatter = (value: number | string) => {
    return <CountUp end={Number(value)} separator="," />
  }
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
  const {Option} = Select

  const [currentReceipt, setCurrentReceipt] = useState<number>(1)
  const [pageSizeReceipt, setPageSizeReceipt] = useState<number>(6)
  const [totalReceipt, setTotalReceipt] = useState<number>(0)
  const [totalIncomeCategory, setTotalIncomeCategory] = useState<number>(0)
  const [totalExpenseCategory, setTotalExpenseCategory] = useState<number>(0)
  const [currentExpense, setCurrentExpense] = useState<number>(1)
  const [pageSizeExpense, setPageSizeExpense] = useState<number>(6)
  const [totalExpense, setTotalExpense] = useState<number>(0)
  const [listReceipt, setListReceipt] = useState<IReceipt[]>([])
  const [listExpense, setListExpense] = useState<IExpense[]>([])
  const [monthYear, setMonthYear] = useState<string | null>(null)
  const [year, setYear] = useState<string | null>(null)
  const [startMonthYear, setStartMonthYear] = useState<string | null>(null)
  const [endMonthYear, setEndMonthYear] = useState<string | null>(null)
  const [totalReceiptAmount, setTotalReceiptAmount] = useState<number>(0)
  const [totalExpenseAmount, setTotalExpenseAmount] = useState<number>(0)
  const [datePickerKey, setDatePickerKey] = useState<number>(0) // Thêm state để buộc DatePicker làm mới
  const [searchType, setSearchType] = useState<
    'year' | 'all' | 'monthYear' | 'range'
  >('year')

  useEffect(() => {
    fetchData()
  }, [monthYear, year, startMonthYear, endMonthYear])

  useEffect(() => {
    fetchReceipts()
  }, [
    currentReceipt,
    pageSizeReceipt,
    monthYear,
    year,
    startMonthYear,
    endMonthYear
  ])

  useEffect(() => {
    fetchExpenses()
  }, [
    currentExpense,
    pageSizeExpense,
    monthYear,
    year,
    startMonthYear,
    endMonthYear
  ])

  useEffect(() => {
    fetchIncomeCategories()
    fetchExpenseCategories()
  }, [year])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const query = queryString.stringify({
        current: currentReceipt, // Sử dụng currentReceipt
        pageSize: pageSizeReceipt, // Sử dụng pageSizeReceipt
        ...(year ? {year} : {}),
        ...(monthYear ? {monthYear} : {}),
        ...(startMonthYear ? {startMonthYear} : {}),
        ...(endMonthYear ? {endMonthYear} : {})
      })
      const resReceipt = await callFetchReceiptsByTime(query)
      const resExpense = await callFetchExpensesByTime(query)

      setReceiptData((resReceipt?.data?.result as unknown as any) || [])
      setExpenseData((resExpense?.data?.result as unknown as any) || [])

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

  const fetchReceipts = async () => {
    setIsLoading(true)
    const query = queryString.stringify({
      current: currentReceipt, // Sử dụng currentReceipt
      pageSize: pageSizeReceipt, // Sử dụng pageSizeReceipt
      ...(year ? {year} : {}),
      ...(monthYear ? {monthYear} : {}),
      ...(startMonthYear ? {startMonthYear} : {}),
      ...(endMonthYear ? {endMonthYear} : {})
    })
    const res = await callFetchReceiptsByTime(query)
    if (res && res.data) {
      setListReceipt(res.data.result)
      setTotalReceiptAmount(res.data.meta.totalAmount || 0)
      setTotalReceipt(res.data.meta.total || 1) // Đặt total theo kết quả thực tế hoặc mặc định là 1 nếu có monthYear
    } else {
      setListReceipt([])
      setTotalReceipt(0)
    }
    setIsLoading(false)
  }

  const fetchExpenses = async () => {
    setIsLoading(true)
    const query = queryString.stringify({
      current: currentExpense, // Sử dụng currentExpense
      pageSize: pageSizeExpense, // Sử dụng pageSizeExpense
      ...(year ? {year} : {}),
      ...(monthYear ? {monthYear} : {}),
      ...(startMonthYear ? {startMonthYear} : {}),
      ...(endMonthYear ? {endMonthYear} : {})
    })
    const res = await callFetchExpensesByTime(query)
    if (res && res.data) {
      setListExpense(res.data.result)
      setTotalExpenseAmount(res.data.meta.totalAmount || 0)
      setTotalExpense(res.data.meta.total || 1) // Đặt total theo kết quả thực tế hoặc mặc định là 1 nếu có monthYear
    } else {
      setListExpense([])
      setTotalExpense(0)
    }
    setIsLoading(false)
  }

  const fetchIncomeCategories = async () => {
    setIsLoading(true)
    const query = queryString.stringify({
      ...(year ? {year} : {})
    })
    const res = await callFetchIncomeCategoriesByTime(query)
    if (res && res.data) {
      setTotalIncomeCategory(res.data.meta.totalBudget || 0)
    }
    setIsLoading(false)
  }

  const fetchExpenseCategories = async () => {
    setIsLoading(true)
    const query = queryString.stringify({
      ...(year ? {year} : {})
    })
    const res = await callFetchExpenseCategoriesByTime(query)
    if (res && res.data) {
      setTotalExpenseCategory(res.data.meta.totalBudget || 0)
    }
    setIsLoading(false)
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
      notification.error({
        message: 'Có lỗi xảy ra',
        description: 'Đã xảy ra lỗi khi tìm nạp dữ liệu'
      })
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
      notification.error({
        message: 'Có lỗi xảy ra',
        description: 'Đã xảy ra lỗi khi khởi tạo biểu đồ'
      })
    }
  }

  const renderPolarChart = () => {
    const ctx = document.getElementById('polarChart') as HTMLCanvasElement
    if (!ctx) {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: 'Đã xảy ra lỗi khi tìm nạp dữ liệu'
      })
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
            'CV/VB'
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
      notification.error({
        message: 'Có lỗi xảy ra',
        description: 'Đã xảy ra lỗi khi khởi tạo biểu đồ'
      })
    }
  }

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

  const handleTableChangeReceipt = (pagination) => {
    setCurrentReceipt(pagination.current)
    setPageSizeReceipt(pagination.pageSize)
  }

  const handleTableChangeExpense = (pagination) => {
    setCurrentExpense(pagination.current)
    setPageSizeExpense(pagination.pageSize)
  }

  const handleDateChange = (date) => {
    if (searchType === 'monthYear') {
      if (date) {
        const formattedDate = date.format('YYYY/MM')
        setMonthYear(formattedDate)
        setYear(null)
      } else {
        setMonthYear(null)
      }
    } else if (searchType === 'year') {
      if (date) {
        const formattedDate = date.format('YYYY')
        setYear(formattedDate)
        setMonthYear(null)
      } else {
        setYear(null)
      }
    } else if (searchType === 'range') {
      if (date && date.length === 2) {
        setStartMonthYear(date[0].format('YYYY/MM'))
        setEndMonthYear(date[1].format('YYYY/MM'))
      } else {
        setStartMonthYear(null)
        setEndMonthYear(null)
      }
    } else {
      setMonthYear(null)
      setYear(null)
    }
    setCurrentReceipt(1) // Reset lại trang hiện tại về trang 1 khi có thay đổi tìm kiếm
    setCurrentExpense(1) // Reset lại trang hiện tại về trang 1 khi có thay đổi tìm kiếm
  }

  const handleSearchTypeChange = (value) => {
    setSearchType(value)
    setMonthYear(null)
    setYear(null)
    setCurrentReceipt(1) // Reset lại trang hiện tại về trang 1 khi có thay đổi tìm kiếm
    setCurrentExpense(1) // Reset lại trang hiện tại về trang 1 khi có thay đổi tìm kiếm
    setDatePickerKey((prev) => prev + 1) // Thay đổi key để buộc DatePicker làm mới
  }

  const columnsReceipt: ColumnsType<IReceipt> = [
    {
      title: 'STT',
      key: 'index',
      width: 50,
      align: 'center',
      render: (text, record, index) => {
        return <>{index + 1 + (currentReceipt - 1) * pageSizeReceipt}</>
      }
    },
    {
      title: 'Nội dung',
      dataIndex: 'description'
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      render: (text, record) => {
        return <>{dayjs(record.time).format('DD/MM/YYYY')}</>
      }
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      render: (text, record) => formatCurrency(record.amount)
    }
  ]

  const columnsExpense: ColumnsType<IExpense> = [
    {
      title: 'STT',
      key: 'index',
      width: 50,
      align: 'center',
      render: (text, record, index) => {
        return <>{index + 1 + (currentExpense - 1) * pageSizeExpense}</>
      }
    },
    {
      title: 'Nội dung',
      dataIndex: 'description'
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      render: (text, record) => {
        return <>{dayjs(record.time).format('DD/MM/YYYY')}</>
      }
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      render: (text, record) => formatCurrency(record.amount)
    }
  ]

  return (
    <ConfigProvider locale={vi_VN}>
      <Spin spinning={isLoading}>
        <Access permission={ALL_PERMISSIONS.PERMISSIONS.ACCESS_TO_DASHBOARD}>
          <Row gutter={[20, 20]}>
            <Col span={24} md={8}>
              <ProForm.Item label="Lọc">
                <Select
                  defaultValue="year"
                  style={{width: '50%', paddingRight: '5px'}}
                  onChange={handleSearchTypeChange}
                >
                  <Option value="year">Năm</Option>
                  <Option value="monthYear">Năm/Tháng</Option>
                  <Option value="range">Khoảng thời gian</Option>
                  <Option value="all">Tất cả</Option>
                </Select>

                <DatePicker
                  key={datePickerKey} // Sử dụng key để buộc làm mới DatePicker
                  format={searchType === 'year' ? 'YYYY' : 'YYYY/MM'}
                  placeholder={
                    searchType === 'all'
                      ? '*'
                      : searchType === 'year'
                      ? 'chọn năm'
                      : 'chọn năm/tháng'
                  }
                  picker={searchType === 'year' ? 'year' : 'month'}
                  onChange={handleDateChange}
                  disabled={searchType === 'all' || searchType === 'range'}
                  disabledDate={disabledMonthYear}
                  style={{width: '50%'}}
                />
              </ProForm.Item>

              {searchType === 'range' && (
                <ProForm.Item label="Chọn">
                  <DatePicker.RangePicker
                    key={datePickerKey} // Sử dụng key để buộc làm mới DatePicker
                    format="YYYY/MM"
                    placeholder={['Từ năm/tháng', 'Đến năm/tháng']}
                    picker="month"
                    onChange={handleDateChange}
                    disabledDate={disabledMonthYear}
                    style={{width: '100%'}}
                  />
                </ProForm.Item>
              )}

              {searchType === 'year' && (
                <>
                  <ProForm.Item label="Dự toán danh mục thu">
                    <Tag color="green">
                      {formatCurrency(totalIncomeCategory)}
                    </Tag>
                  </ProForm.Item>
                  <ProForm.Item label="Dự toán danh mục chi">
                    <Tag color="red">
                      {formatCurrency(totalExpenseCategory)}
                    </Tag>
                  </ProForm.Item>
                </>
              )}
            </Col>
            <Col span={24} md={8}>
              <Card title="Tiền thu" bordered={false}>
                <Statistic
                  title="Tổng tiền"
                  value={totalReceiptAmount}
                  formatter={formatter}
                />
              </Card>
            </Col>
            <Col span={24} md={8}>
              <Card title="Tiền chi" bordered={false}>
                <Statistic
                  title="Tổng tiền"
                  value={totalExpenseAmount}
                  formatter={formatter}
                />
              </Card>
            </Col>
            <Col span={12} md={12} style={{height: '400px', overflow: 'auto'}}>
              <Table<IReceipt>
                title={() => (
                  <Tag color="green">
                    Tổng thu: {formatCurrency(totalReceiptAmount)}
                  </Tag>
                )}
                columns={columnsReceipt}
                dataSource={listReceipt.map((item) => ({
                  ...item,
                  key: item._id
                }))}
                // loading={loadingReceipt}
                pagination={{
                  current: currentReceipt,
                  pageSize: pageSizeReceipt,
                  total: totalReceipt,
                  showSizeChanger: true,
                  onChange: (page, pageSize) =>
                    handleTableChangeReceipt({current: page, pageSize}),
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} trên ${total} hàng`
                }}
              />
            </Col>
            <Col span={12} md={12} style={{height: '400px', overflow: 'auto'}}>
              <Table<IExpense>
                title={() => (
                  <Tag color="red">
                    Tổng chi: {formatCurrency(totalExpenseAmount)}
                  </Tag>
                )}
                columns={columnsExpense}
                dataSource={listExpense.map((item) => ({
                  ...item,
                  key: item._id
                }))}
                // loading={loadingExpense}
                pagination={{
                  current: currentExpense,
                  pageSize: pageSizeExpense,
                  total: totalExpense,
                  showSizeChanger: true,
                  onChange: (page, pageSize) =>
                    handleTableChangeExpense({current: page, pageSize}),
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} trên ${total} hàng`
                }}
              />
            </Col>
            <Col span={24}>
              <Card title="Biểu đồ tiền thu/chi" bordered={false}>
                <Form>
                  <Col span={8}>
                    <ProForm.Item label="Lọc">
                      <Select
                        defaultValue="year"
                        style={{width: '50%', paddingRight: '5px'}}
                        onChange={handleSearchTypeChange}
                      >
                        <Option value="all">Tất cả</Option>
                        <Option value="year">Năm</Option>
                        <Option value="monthYear">Năm/Tháng</Option>
                        <Option value="range">Khoảng thời gian</Option>
                      </Select>

                      <DatePicker
                        key={datePickerKey} // Sử dụng key để buộc làm mới DatePicker
                        format={searchType === 'year' ? 'YYYY' : 'YYYY/MM'}
                        placeholder={
                          searchType === 'all'
                            ? '*'
                            : searchType === 'year'
                            ? 'chọn năm'
                            : 'chọn năm/tháng'
                        }
                        picker={searchType === 'year' ? 'year' : 'month'}
                        onChange={handleDateChange}
                        disabled={
                          searchType === 'all' || searchType === 'range'
                        }
                        style={{width: '50%'}}
                      />
                    </ProForm.Item>
                  </Col>

                  {searchType === 'range' && (
                    <Col span={8}>
                      <ProForm.Item label="Chọn">
                        <DatePicker.RangePicker
                          key={datePickerKey} // Sử dụng key để buộc làm mới DatePicker
                          format="YYYY/MM"
                          placeholder={['Từ năm/tháng', 'Đến năm/tháng']}
                          picker="month"
                          onChange={handleDateChange}
                          style={{width: '100%'}}
                        />
                      </ProForm.Item>
                    </Col>
                  )}
                </Form>
                <canvas id="myChart"></canvas>
              </Card>
            </Col>
            <Col span={24}>
              <Card title="Thống kê số lượng" bordered={false}>
                <canvas id="polarChart"></canvas>
              </Card>
            </Col>
          </Row>
        </Access>
      </Spin>
    </ConfigProvider>
  )
}

export default DashboardPage
