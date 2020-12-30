import Head from 'next/head'
import { FC, ReactNode } from 'react'
import styles from './Layout.module.css'
import { Header } from '../Header/Header'
import { Footer } from '../Footer/Footer'
import { BLOG_NAME } from '../../constants'

type Props = {
  title?: string
  children: ReactNode
}

export const Layout: FC<Props> = ({ title, children }) => (
  <>
    <Head>
      <title>{title ? `${title} | ${BLOG_NAME}` : BLOG_NAME}</title>
    </Head>
    <Header title={BLOG_NAME} />
    <div className={styles.container}>{children}</div>
    <Footer />
  </>
)
