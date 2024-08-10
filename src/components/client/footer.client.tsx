import styles from '@/styles/client.module.scss'

const Footer = () => {
  return (
    <footer className={styles['footer-section']}>
      <span className={styles['footer-content']}>
        Powered by <span className={styles['highlight']}> stu.edu.vn</span>
      </span>
    </footer>
  )
}

export default Footer
