import {ConfigProvider, Divider} from 'antd'
import styles from 'styles/client.module.scss'
import PostCard from '@/components/client/card/post.card'
import DepartmentCard from '@/components/client/card/department.card'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import vi_VN from 'antd/locale/vi_VN'
import {useState} from 'react'

dayjs.extend(relativeTime)
dayjs.locale('en')

const HomePage = () => {
  const [filter, setFilter] = useState<string>('')

  return (
    <ConfigProvider locale={vi_VN}>
      <div className={`${styles['container']} ${styles['home-section']}`}>
        <PostCard filter={filter} />
        <Divider />
        <DepartmentCard />
        <Divider />
      </div>
    </ConfigProvider>
  )
}

export default HomePage
