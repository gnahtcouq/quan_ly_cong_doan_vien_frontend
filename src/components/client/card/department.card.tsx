import {callFetchDepartment} from '@/config/api'
import {convertSlug} from '@/config/utils'
import {IDepartment} from '@/types/backend'
import {Card, Col, Divider, Empty, Pagination, Row, Spin} from 'antd'
import {useState, useEffect} from 'react'
import {isMobile} from 'react-device-detect'
import {Link, useNavigate} from 'react-router-dom'
import styles from 'styles/client.module.scss'

interface IProps {
  showPagination?: boolean
}

const DepartmentCard = (props: IProps) => {
  const {showPagination = false} = props

  const [displayDepartment, setDisplayDepartment] = useState<
    IDepartment[] | null
  >(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(4)
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState('')
  const [sortQuery, setSortQuery] = useState('sort=-updatedAt')
  const navigate = useNavigate()

  useEffect(() => {
    fetchDepartment()
  }, [current, pageSize, filter, sortQuery])

  const fetchDepartment = async () => {
    setIsLoading(true)
    let query = `current=${current}&pageSize=${pageSize}`
    if (filter) {
      query += `&${filter}`
    }
    if (sortQuery) {
      query += `&${sortQuery}`
    }

    const res = await callFetchDepartment(query)
    if (res && res.data) {
      setDisplayDepartment(res.data.result)
      setTotal(res.data.meta.total)
    }
    setIsLoading(false)
  }

  const handleOnchangePage = (pagination: {
    current: number
    pageSize: number
  }) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current)
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize)
      setCurrent(1)
    }
  }

  const handleViewDetailPost = (item: IDepartment) => {
    if (item.name) {
      const slug = convertSlug(item.name)
      navigate(`/department/${slug}?id=${item._id}`)
    }
  }

  return (
    <div className={`${styles['department-section']}`}>
      <div className={styles['department-content']}>
        <Spin spinning={isLoading} tip="Loading...">
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <div
                className={
                  isMobile ? styles['dflex-mobile'] : styles['dflex-pc']
                }
              >
                <span className={styles['title']}>Các Đơn Vị Nổi Bật</span>
                {!showPagination && <Link to="department">Xem tất cả</Link>}
              </div>
            </Col>

            {displayDepartment?.map((item) => {
              return (
                <Col span={24} md={6} key={item._id}>
                  <Card
                    onClick={() => handleViewDetailPost(item)}
                    style={{height: 400}}
                    hoverable
                    cover={
                      <div className={styles['card-customize']}>
                        <img
                          alt="example"
                          src={`${
                            import.meta.env.VITE_BACKEND_URL
                          }/files/department/${item?.logo}`}
                          style={{
                            height: 250,
                            width: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    }
                  >
                    <Divider />
                    <h3 style={{textAlign: 'center'}}>{item.name}</h3>
                  </Card>
                </Col>
              )
            })}

            {(!displayDepartment ||
              (displayDepartment && displayDepartment.length === 0)) &&
              !isLoading && (
                <div className={styles['empty']}>
                  <Empty description="Không có dữ liệu" />
                </div>
              )}
          </Row>
          {showPagination && (
            <>
              <div style={{marginTop: 30}}></div>
              <Row style={{display: 'flex', justifyContent: 'center'}}>
                <Pagination
                  current={current}
                  total={total}
                  pageSize={pageSize}
                  responsive
                  onChange={(p: number, s: number) =>
                    handleOnchangePage({current: p, pageSize: s})
                  }
                />
              </Row>
            </>
          )}
        </Spin>
      </div>
    </div>
  )
}

export default DepartmentCard
