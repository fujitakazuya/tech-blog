import { VFC } from 'react'
import Link from 'next/link'
import { GitHub, Twitter } from '../Icon/Icon'
import styles from './Header.module.css'

type Props = {
  title: string
}

export const Header: VFC<Props> = ({ title }) => (
  <header className={styles.header}>
    <h1>
      <Link href="/" passHref>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a>{title}</a>
      </Link>
    </h1>
    <div>
      <a
        href="https://github.com/fujitakazuya"
        rel="nofollow noopener noreferrer"
        target="_blank"
        aria-label="GitHubアカウントへのリンク"
        className={styles.icon}
      >
        <GitHub />
      </a>
      <a
        href="https://twitter.com/fjkffjt"
        rel="nofollow noopener noreferrer"
        target="_blank"
        aria-label="Twitterアカウントへのリンク"
        className={styles.icon}
      >
        <Twitter />
      </a>
    </div>
  </header>
)
