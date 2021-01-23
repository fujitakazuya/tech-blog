import { VFC } from 'react'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import type { PostContentData } from '../../lib/posts'
import styles from './Post.module.css'

type CodeProps = {
  value: string
  language?: string
}

const CodeBlock: VFC<CodeProps> = ({ value, language }) => (
  <SyntaxHighlighter language={language} style={a11yDark} customStyle={{ borderRadius: '0.25em', fontSize: '0.9em', padding: '2em' }}>
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
    <ReactMarkdown className={styles.body} renderers={{ code: CodeBlock }} plugins={[gfm]} skipHtml>
      {postData.contentHTML}
    </ReactMarkdown>
  </article>
)
