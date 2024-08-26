import {useLocation, useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {IPost} from '@/types/backend'
import {callFetchPostById} from '@/config/api'
import styles from 'styles/client.module.scss'
import {Col, ConfigProvider, Divider, Row, Skeleton, Tag} from 'antd'
import {HistoryOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import vi_VN from 'antd/locale/vi_VN'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import logo_cd from '@/assets/logo-cd.png'
import {isMobile} from 'react-device-detect'

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
          const deltaOps = JSON.parse(res.data.description)
          const quillHtml = () => {
            const temp = new Quill(document.createElement('div'))
            temp.setContents(deltaOps)
            return temp.root.innerHTML
          }
          setPostDetail({...res.data, description: quillHtml()})
        }
        setIsLoading(false)
      }
    }
    init()
  }, [id])

  return (
    <ConfigProvider locale={vi_VN}>
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
                  <div className={styles['post-updatedAt']}>
                    <HistoryOutlined />
                    {' Cập nhật '}
                    {dayjs(postDetail.updatedAt).format(
                      'DD/MM/YYYY - HH:mm:ss'
                    )}
                  </div>
                  <Divider />
                  <div
                    className="ql-editor"
                    dangerouslySetInnerHTML={{__html: postDetail.description}}
                  ></div>
                </Col>
                {!isMobile ? (
                  <Col span={24} md={8}>
                    <div className={styles['department']}>
                      <div>
                        <img
                          alt="logo_cd"
                          src={logo_cd}
                          style={{
                            height: 250,
                            width: '100%',
                            objectFit: 'cover',
                            paddingTop: 10
                          }}
                        />
                      </div>
                      {/* <div>{postDetail.department?.name}</div> */}
                    </div>
                  </Col>
                ) : null}
              </>
            )}
          </Row>
        )}
      </div>
    </ConfigProvider>
  )
}
export default ClientPostDetailPage
