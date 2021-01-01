import { GetStaticProps } from 'next'
import { Layout } from '../components/Layout/Layout'
import { PostList } from '../components/PostList/PostList'
import { getSortedPostsData, PostData } from '../lib/posts'
import styles from '../styles/page.module.css'

type Props = {
  allPostsData: PostData[]
}

const IndexPage = ({ allPostsData }: Props): JSX.Element => (
  <Layout>
    <main role="main" className={styles.main}>
      <section>
        <PostList allPostData={allPostsData} />
      </section>
    </main>
  </Layout>
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
