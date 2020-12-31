import { VFC } from 'react'
import { GitHub, Twitter } from '../Icon/Icon'
import styles from './Profile.module.css'

export const Profile: VFC = () => (
  <div className={styles.profile}>
    <a
      href="https://github.com/fujitakazuya"
      rel="nofollow noopener noreferrer"
      target="_blank"
      className={styles.icon}
    >
      <GitHub />
    </a>
    <a
      href="https://twitter.com/fjkffjt"
      rel="nofollow noopener noreferrer"
      target="_blank"
      className={styles.icon}
    >
      <Twitter />
    </a>
  </div>
)
