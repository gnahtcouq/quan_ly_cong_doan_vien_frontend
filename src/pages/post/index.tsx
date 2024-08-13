import React, {useState} from 'react'
import SearchClient from '@/components/client/search.client'
import {Col, ConfigProvider, Divider, Row} from 'antd'
import styles from 'styles/client.module.scss'
import PostCard from '@/components/client/card/post.card'

import vi_VN from 'antd/locale/vi_VN'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('en')

const ClientPostPage = () => {
  const [filter, setFilter] = useState<string>('')

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
  }

  return (
    <ConfigProvider locale={vi_VN}>
      <div
        className={`${styles['container']} ${styles['post-search']}`}
        style={{minHeight: '150vh', paddingTop: 120}}
      >
        <Row gutter={[10, 10]}>
          <Col span={24}>
            <SearchClient onFilterChange={handleFilterChange} />
          </Col>
          <Col span={24}>
            <PostCard filter={filter} showPagination={true} />
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  )
}

export default ClientPostPage
