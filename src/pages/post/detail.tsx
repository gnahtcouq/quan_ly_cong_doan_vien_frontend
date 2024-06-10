import {useLocation, useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {IPost} from '@/types/backend'
import {callFetchPostById} from '@/config/api'
import styles from 'styles/client.module.scss'
import parse from 'html-react-parser'
import {Col, ConfigProvider, Divider, Row, Skeleton, Tag} from 'antd'
import {HistoryOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import en_US from 'antd/locale/en_US'
import logo_sv from '@/assets/logo-sv.png'
dayjs.extend(relativeTime)
dayjs.locale('en')

const ClientPostDetailPage = (props: any) => {
  const [postDetail, setPostDetail] = useState<IPost | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  let location = useLocation()
  let params = new URLSearchParams(location.search)
  const id = params?.get('id') // post id

  useEffect(() => {
    const init = async () => {
      if (id) {
        setIsLoading(true)
        const res = await callFetchPostById(id)
        if (res?.data) {
          setPostDetail(res.data)
        }
        setIsLoading(false)
      }
    }
    init()
  }, [id])

  return (
    <ConfigProvider locale={en_US}>
      <div
        className={`${styles['container']} ${styles['detail-post-section']}`}
      >
        {isLoading ? (
          <Skeleton />
        ) : (
          <Row gutter={[20, 20]}>
            {postDetail && postDetail._id && (
              <>
                <Col span={24} md={16}>
                  <div className={styles['header']}>{postDetail.name}</div>
                  <div className={styles['threads']}>
                    {postDetail?.threads?.map((item, index) => {
                      return (
                        <Tag key={`${index}-key`} color="gold">
                          {item}
                        </Tag>
                      )
                    })}
                  </div>
                  <div>
                    <HistoryOutlined />{' '}
                    {dayjs(postDetail.updatedAt).format('DD/MM/YYYY HH:mm:ss')}
                  </div>
                  <Divider />
                  {parse(postDetail.description)}
                </Col>

                <Col span={24} md={8}>
                  <div className={styles['department']}>
                    <div>
                      <img
                        alt="example"
                        src={logo_sv}
                        style={{
                          height: 250,
                          width: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                    {/* <div>{postDetail.department?.name}</div> */}
                  </div>
                </Col>
              </>
            )}
          </Row>
        )}
      </div>
    </ConfigProvider>
  )
}
export default ClientPostDetailPage
