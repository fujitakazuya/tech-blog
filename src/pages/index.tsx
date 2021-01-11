import { GetStaticProps } from 'next'
import Head from 'next/head'
import { Layout } from '../components/Layout/Layout'
import { PostList } from '../components/PostList/PostList'
import { getSortedPostsData, PostData } from '../lib/posts'
import styles from '../styles/page.module.css'

type Props = {
  allPostsData: PostData[]
}

const IndexPage = ({ allPostsData }: Props): JSX.Element => (
  <>
    <Head>
      <meta name="description" content="fujiの技術ブログ。プログラミング等の備忘録など。" />
    </Head>
    <Layout>
      <main className={styles.main}>
        <div>
          <PostList allPostData={allPostsData} />
        </div>
      </main>
    </Layout>
  </>
)

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData,
    },
  }
}

export default IndexPage
