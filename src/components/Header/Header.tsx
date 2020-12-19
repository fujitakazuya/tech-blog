/* eslint jsx-a11y/anchor-is-valid: 0 */
import { VFC } from 'react'
import Link from 'next/link'
import styles from './Header.module.css'

type Props = {
  title: string
}

export const Header: VFC<Props> = ({ title }) => (
  <header className={styles.header}>
    <div>
      <Link href="/">
        <a className={styles.title}>{title}</a>
      </Link>
    </div>
  </header>
)
