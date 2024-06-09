import {useLocation, useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {IPost} from '@/types/backend'
import {callFetchPostById} from '@/config/api'
import styles from 'styles/client.module.scss'
import parse from 'html-react-parser'
import {Col, ConfigProvider, Divider, Row, Skeleton, Tag} from 'antd'
import {
  DollarOutlined,
  EnvironmentOutlined,
  HistoryOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ApplyModal from '@/components/client/modal/apply.modal'
import en_US from 'antd/locale/en_US'
dayjs.extend(relativeTime)
dayjs.locale('en')

const ClientPostDetailPage = (props: any) => {
  const [postDetail, setPostDetail] = useState<IPost | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

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
                  {/* <div>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className={styles['btn-apply']}
                    >
                      Upload file Văn Bản
                    </button>
                  </div> */}
                  {/* <Divider /> */}
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
                    <HistoryOutlined /> {dayjs(postDetail.updatedAt).fromNow()}
                  </div>
                  <Divider />
                  {parse(postDetail.description)}
                </Col>

                <Col span={24} md={8}>
                  <div className={styles['department']}>
                    <div>
                      <img
                        alt="example"
                        src={`${
                          import.meta.env.VITE_BACKEND_URL
                        }/files/department/${postDetail.department?.logo}`}
                        style={{
                          height: 250,
                          width: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                    <div>{postDetail.department?.name}</div>
                  </div>
                </Col>
              </>
            )}
          </Row>
        )}
        <ApplyModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          postDetail={postDetail}
        />
      </div>
    </ConfigProvider>
  )
}
export default ClientPostDetailPage
