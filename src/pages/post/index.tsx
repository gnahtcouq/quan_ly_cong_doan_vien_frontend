import SearchClient from '@/components/client/search.client'
import {Col, ConfigProvider, Divider, Row} from 'antd'
import styles from 'styles/client.module.scss'
import PostCard from '@/components/client/card/post.card'

import en_US from 'antd/locale/en_US'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('en')

const ClientPostPage = (props: any) => {
  return (
    <ConfigProvider locale={en_US}>
      <div className={styles['container']} style={{marginTop: 20}}>
        <Row gutter={[20, 20]}>
          {/* <Col span={24}>
            <SearchClient />
          </Col>
          <Divider /> */}

          <Col span={24}>
            <PostCard showPagination={true} />
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  )
}

export default ClientPostPage
