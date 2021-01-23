import { FC, ReactNode } from 'react'
import styles from './Sidebar.module.css'

type Props = {
  children: ReactNode
}

export const Sidebar: FC<Props> = ({ children }) => <aside className={styles.aside}>{children}</aside>
