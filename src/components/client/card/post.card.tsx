import {callFetchPost} from '@/config/api'
import {convertSlug} from '@/config/utils'
import {IPost} from '@/types/backend'
import {EnvironmentOutlined, ThunderboltOutlined} from '@ant-design/icons'
import {Card, Col, ConfigProvider, Empty, Pagination, Row, Spin} from 'antd'
import {useState, useEffect} from 'react'
import {isMobile} from 'react-device-detect'
import {Link, useNavigate} from 'react-router-dom'
import styles from 'styles/client.module.scss'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
// import en_US from 'antd/locale/en_US'
import logo_sv from '@/assets/logo-sv.png'

dayjs.extend(relativeTime)
// dayjs.locale('en')

interface IProps {
  showPagination?: boolean
}

const PostCard = (props: IProps) => {
  const {showPagination = false} = props

  const [displayPost, setDisplayPost] = useState<IPost[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState('')
  const [sortQuery, setSortQuery] = useState('sort=-updatedAt')
  const navigate = useNavigate()

  useEffect(() => {
    fetchPost()
  }, [current, pageSize, filter, sortQuery])

  const fetchPost = async () => {
    setIsLoading(true)
    let query = `current=${current}&pageSize=${pageSize}`
    if (filter) {
      query += `&${filter}`
    }
    if (sortQuery) {
      query += `&${sortQuery}`
    }

    const res = await callFetchPost(query)
    if (res && res.data) {
      setDisplayPost(res.data.result)
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

  const handleViewDetailPost = (item: IPost) => {
    const slug = convertSlug(item.name)
    navigate(`/post/${slug}?id=${item._id}`)
  }

  return (
    // <ConfigProvider locale={en_US}>
    <div className={`${styles['card-post-section']}`}>
      <div className={`${styles['post-content']}`}>
        <Spin spinning={isLoading} tip="Loading...">
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <div
                className={
                  isMobile ? styles['dflex-mobile'] : styles['dflex-pc']
                }
              >
                <h2 className={styles['title']}>Bài Đăng Mới Nhất</h2>
                {!showPagination && <Link to="post">Xem tất cả</Link>}
              </div>
            </Col>

            {displayPost?.map((item) => {
              return (
                <Col span={24} md={12} key={item._id}>
                  <Card
                    size="small"
                    title={null}
                    hoverable
                    onClick={() => handleViewDetailPost(item)}
                    style={{height: 100}}
                  >
                    <div className={styles['card-post-content']}>
                      <div className={styles['card-post-left']}>
                        <img alt="example" src={logo_sv} />
                      </div>
                      <div className={styles['card-post-right']}>
                        <div className={styles['post-title']}>{item.name}</div>
                        <div className={styles['post-updatedAt']}>
                          {dayjs(item.updatedAt).format('DD/MM/YYYY')}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              )
            })}

            {(!displayPost || (displayPost && displayPost.length === 0)) &&
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
    // </ConfigProvider>
  )
}

export default PostCard
