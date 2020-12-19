import { VFC } from 'react'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import type { PostContentData } from '../../lib/posts'
import styles from './Post.module.css'

type CodeProps = {
  value: string
  language?: string
}

const CodeBlock: VFC<CodeProps> = ({ value, language }) => (
  <SyntaxHighlighter language={language} style={dracula}>
    {value}
  </SyntaxHighlighter>
)

type Props = {
  postData: PostContentData
  children?: never
}

export const Post: VFC<Props> = ({ postData }) => (
  <article>
    <div className={styles.summary}>
      <h1 className={styles.title}>{postData.title}</h1>
      <span className={styles.time}>
        公開日:
        <time>{postData.published}</time>
      </span>
    </div>
    <ReactMarkdown className={styles.body} renderers={{ code: CodeBlock }}>
      {postData.contentHTML}
    </ReactMarkdown>
  </article>
)
