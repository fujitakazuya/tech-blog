import { GetStaticProps } from 'next'
import { Layout } from '../components/Layout/Layout'
import { PostList } from '../components/PostList/PostList'
import { getSortedPostsData, PostData } from '../lib/posts'

type Props = {
  allPostsData: PostData[]
}

const IndexPage = ({ allPostsData }: Props): JSX.Element => (
  <Layout>
    <section>
      <PostList allPostData={allPostsData} />
    </section>
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
