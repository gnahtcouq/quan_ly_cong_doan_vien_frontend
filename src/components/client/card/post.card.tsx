import {callFetchPost} from '@/config/api'
import {convertSlug} from '@/config/utils'
import {IPost} from '@/types/backend'
import {Card, Col, Empty, Pagination, Row, Spin} from 'antd'
import {useState, useEffect} from 'react'
import {isMobile} from 'react-device-detect'
import {Link, useNavigate} from 'react-router-dom'
import styles from 'styles/client.module.scss'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import logo_sv from '@/assets/logo-sv.png'

dayjs.extend(relativeTime)

interface IProps {
  showPagination?: boolean
}

const PostCard = (props: IProps) => {
  const {showPagination = false} = props

  const [displayPost, setDisplayPost] = useState<IPost[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState('')
  const [sortQuery, setSortQuery] = useState('sort=-createdAt')
  const navigate = useNavigate()

  useEffect(() => {
    fetchPost()
  }, [current, pageSize, filter, sortQuery])

  const fetchPost = async () => {
    setIsLoading(true)
    let accumulatedPosts: IPost[] = []
    let queryPage = current
    let shouldFetchMore = true
    let res: any // Declare the 'res' variable

    while (shouldFetchMore) {
      let query = `current=${queryPage}&pageSize=${pageSize}`
      if (filter) {
        query += `&${filter}`
      }
      if (sortQuery) {
        query += `&${sortQuery}`
      }

      res = await callFetchPost(query) // Assign the value to 'res'
      if (res && res.data) {
        const activePosts = res.data.result.filter(
          (post: IPost) => post.isActive
        )
        accumulatedPosts = [...accumulatedPosts, ...activePosts]
        shouldFetchMore =
          activePosts.length > 0 && accumulatedPosts.length < pageSize
        queryPage += 1
      } else {
        shouldFetchMore = false
      }
    }

    setDisplayPost(accumulatedPosts.slice(0, pageSize))
    setTotal(res.data.meta.total)
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
    <div className={`${styles['card-post-section']}`}>
      <div className={`${styles['post-content']}`}>
        <Spin spinning={isLoading}>
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
              const isNew = dayjs().isSame(dayjs(item.createdAt), 'day')
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
                        <img alt="logo_sv" src={logo_sv} />
                      </div>
                      <div className={styles['card-post-right']}>
                        <div className={styles['post-title']}>
                          {item.name}{' '}
                          {isNew && (
                            <span className={styles['new-badge']}>mới</span>
                          )}
                        </div>
                        <div className={styles['post-createdAt']}>
                          {dayjs(item.createdAt).format('DD/MM/YYYY')}
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
  )
}

export default PostCard
