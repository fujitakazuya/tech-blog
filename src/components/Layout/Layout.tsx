import Head from 'next/head'
import { FC, ReactNode } from 'react'
import styles from './Layout.module.css'

type Props = {
  title?: string
  children: ReactNode
}

export const Layout: FC<Props> = ({ title = 'TECH BLOG', children }) => (
  <div className={styles.container}>
    <Head>
      <title>{title}</title>
    </Head>
    {children}
  </div>
)
