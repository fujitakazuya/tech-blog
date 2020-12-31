import { VFC } from 'react'
import styles from './Footer.module.css'

export const Footer: VFC = () => (
  <footer className={styles.footer}>
    <div className={styles.copyright}>
      <small>&copy; 2020 blog.fuji.gq</small>
    </div>
  </footer>
)
