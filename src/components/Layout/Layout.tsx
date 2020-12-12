import Head from 'next/head'
import { FC, ReactNode } from 'react'
import styles from './Layout.module.css'

type Props = {
  title?: string
  children: ReactNode
}

export const Layout: FC<Props> = ({ title = 'TECH BLOG', children }) => (
  <>
    <Head>
      <title>{title}</title>
    </Head>
    <div className={styles.container}>{children}</div>
  </>
)
