import {useLocation, useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {IDepartment} from '@/types/backend'
import {callFetchDepartmentById} from '@/config/api'
import styles from 'styles/client.module.scss'
import parse from 'html-react-parser'
import {Col, Divider, Row, Skeleton} from 'antd'

const ClientDepartmentDetailPage = (props: any) => {
  const [departmentDetail, setDepartmentDetail] = useState<IDepartment | null>(
    null
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)

  let location = useLocation()
  let params = new URLSearchParams(location.search)
  const id = params?.get('id') // post id

  useEffect(() => {
    const init = async () => {
      if (id) {
        setIsLoading(true)
        const res = await callFetchDepartmentById(id)
        if (res?.data) {
          setDepartmentDetail(res.data)
        }
        setIsLoading(false)
      }
    }
    init()
  }, [id])

  return (
    <div className={`${styles['container']} ${styles['detail-post-section']}`}>
      {isLoading ? (
        <Skeleton />
      ) : (
        <Row gutter={[20, 20]}>
          {departmentDetail && departmentDetail._id && (
            <>
              <Col span={24} md={16}>
                <div className={styles['header']}>
                  Giới thiệu {departmentDetail.name}
                </div>

                <Divider />
                {parse(departmentDetail?.description ?? '')}
              </Col>

              <Col span={24} md={8}>
                <div className={styles['department']}>
                  <div>
                    <img
                      alt="example"
                      src={`${
                        import.meta.env.VITE_BACKEND_URL
                      }/files/department/${departmentDetail?.logo}`}
                      style={{
                        height: 250,
                        width: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <div>{departmentDetail?.name}</div>
                </div>
              </Col>
            </>
          )}
        </Row>
      )}
    </div>
  )
}
export default ClientDepartmentDetailPage
