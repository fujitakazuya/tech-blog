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
      <h1>
        <Link href="/">
          <a>{title}</a>
        </Link>
      </h1>
    </div>
  </header>
)
