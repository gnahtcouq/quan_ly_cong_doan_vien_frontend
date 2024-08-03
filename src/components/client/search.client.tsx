import {Button, Card, Col, DatePicker, Form, Row} from 'antd'
import {ProForm} from '@ant-design/pro-components'
import dayjs from 'dayjs'
import queryString from 'query-string'
import {callFetchPostsByTime} from '@/config/api'
import {useState, useEffect} from 'react'
import {IPost} from '@/types/backend'
import styles from 'styles/client.module.scss'
import logo_cd from '@/assets/logo-cd.png'
import {convertSlug} from '@/config/utils'
import {useNavigate} from 'react-router-dom'

const SearchClient = () => {
  const [form] = Form.useForm()
  const [displayPost, setDisplayPost] = useState<IPost[] | null>(null)
  const [hasSearch, setHasSearch] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values: any) => {
    const createdAt = values.createdAt
      ? dayjs(values.createdAt).format('YYYY-MM-DD')
      : null

    if (!createdAt) {
      setDisplayPost(null)
      setHasSearch(false)
      return
    }

    const query = queryString.stringify({createdAt})

    const res = await callFetchPostsByTime(query)
    if (res.data) {
      setDisplayPost(res.data.result)
      setHasSearch(true)
    }
  }

  useEffect(() => {
    form.setFieldsValue({createdAt: null})
    setDisplayPost(null)
    setHasSearch(false)
  }, [form])

  const handleViewDetailPost = (item: IPost) => {
    const slug = convertSlug(item.name)
    navigate(`/post/${slug}?id=${item._id}`)
  }

  const handleDateChange = () => {
    setHasSearch(false)
  }

  return (
    <>
      <div className={`${styles['card-post-section']}`}>
        <div className={`${styles['post-search']}`}>
          <ProForm
            form={form}
            onFinish={onFinish}
            submitter={{
              render: () => <></>
            }}
          >
            <Row gutter={[20, 5]}>
              <Col span={24}>
                <h1>Tìm kiếm bài đăng</h1>
              </Col>
              <Col span={12}>
                <Form.Item name="createdAt">
                  <DatePicker
                    style={{width: '100%'}}
                    placeholder="Chọn ngày"
                    onChange={handleDateChange}
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Button type="primary" onClick={() => form.submit()}>
                  Tìm kiếm
                </Button>
              </Col>
            </Row>
          </ProForm>

          {hasSearch && displayPost && displayPost.length > 0 && (
            <Row gutter={20}>
              {displayPost.map((item) => {
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
                          <img alt="logo_cd" src={logo_cd} />
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
            </Row>
          )}
        </div>
      </div>
    </>
  )
}

export default SearchClient
