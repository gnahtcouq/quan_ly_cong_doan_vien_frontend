import {Col, Row} from 'antd'
import styles from 'styles/client.module.scss'
import DepartmentCard from '@/components/client/card/department.card'

const ClientDepartmentPage = (props: any) => {
  return (
    <div className={styles['container']} style={{marginTop: 20}}>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <DepartmentCard showPagination={true} />
        </Col>
      </Row>
    </div>
  )
}

export default ClientDepartmentPage
