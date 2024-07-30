import {ConfigProvider, Divider} from 'antd'
import styles from 'styles/client.module.scss'
import SearchClient from '@/components/client/search.client'
import PostCard from '@/components/client/card/post.card'
import DepartmentCard from '@/components/client/card/department.card'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import vi_VN from 'antd/locale/vi_VN'

dayjs.extend(relativeTime)
dayjs.locale('en')

const HomePage = () => {
  return (
    <ConfigProvider locale={vi_VN}>
      <div className={`${styles['container']} ${styles['home-section']}`}>
        <div className="search-content" style={{paddingTop: 120}}>
          <SearchClient />
        </div>
        {/* <Divider /> */}
        <PostCard />
        <Divider />
        <DepartmentCard />
      </div>
    </ConfigProvider>
  )
}

export default HomePage
