import { FC } from 'react'
import type { PostContentData } from '../../lib/posts'
import styles from './Post.module.css'

type Props = {
  postData: PostContentData
  children?: never
}

export const Post: FC<Props> = ({ postData }) => (
  <div className={styles.contents}>
    <div className={styles.summary}>
      <h1 className={styles.title}>{postData.title}</h1>
      <time className={styles.time}>{postData.published}</time>
    </div>
    <div className={styles.body} dangerouslySetInnerHTML={{ __html: postData.contentHTML }} />
  </div>
)
