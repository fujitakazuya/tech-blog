/* eslint jsx-a11y/anchor-is-valid: 0 */
import Link from 'next/link'
import { VFC } from 'react'
import type { PostData } from '../../lib/posts'
import styles from './PostList.module.css'

type Props = {
  allPostData: PostData[]
}

export const PostList: VFC<Props> = ({ allPostData }) => (
  <ul className={styles.list}>
    {allPostData.map(({ id, title, published }) => (
      <li key={id} className={styles.item}>
        <h2>
          <Link href={`/posts/${id}`}>
            <a className={styles.title}>{title}</a>
          </Link>
        </h2>
        <p className={styles.time}>
          公開日:
          <time>{published}</time>
        </p>
      </li>
    ))}
  </ul>
)
