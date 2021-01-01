import { VFC } from 'react'
import styles from './Footer.module.css'

export const Footer: VFC = () => (
  <footer className={styles.footer}>
    <div className={styles.annotation}>
      <small>&copy; 2020 blog.fuji.gq</small>
    </div>
    <div className={styles.annotation}>
      <small>
        このサイトは Google Analytics を使用しています。
        <a
          href="https://policies.google.com/technologies/partner-sites?hl=ja"
          rel="nofollow noopener noreferrer"
          target="_blank"
          className={styles.link}
        >
          詳しくはこちら
        </a>
      </small>
    </div>
  </footer>
)
