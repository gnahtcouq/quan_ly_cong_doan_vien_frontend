import styles from '@/styles/admin.module.scss'
import logo_cd from '@/assets/logo-cd.png'

const IntroPage = () => {
  return (
    <div className={styles['intro-page']}>
      <div className={styles['text-1']}>Trang quản trị</div>
      <div className={styles['text-2']}>
        CÔNG ĐOÀN TRƯỜNG ĐẠI HỌC CÔNG NGHỆ SÀI GÒN
      </div>
      <div className={styles['text-3']}>
        SAIGON TECHNOLOGY UNIVERSITY FEDERATION OF LABOUR
      </div>
      <div className={styles['logo']}>
        <img src={logo_cd} alt="Logo" />
      </div>
    </div>
  )
}

export default IntroPage
