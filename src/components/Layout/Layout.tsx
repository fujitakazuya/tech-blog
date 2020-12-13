import Head from 'next/head'
import { FC, ReactNode } from 'react'
import styles from './Layout.module.css'

type Props = {
  title?: string
  children: ReactNode
}

export const Layout: FC<Props> = ({ title, children }) => (
  <>
    <Head>
      <title>{title ? `${title} | Fuji Blog` : 'Fuji Blog'}</title>
    </Head>
    <div className={styles.container}>{children}</div>
  </>
)
