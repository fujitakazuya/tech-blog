import { GetStaticProps } from 'next'
import { Layout } from '../components/Layout/Layout'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Profile } from '../components/Profile/Profile'
import { PostList } from '../components/PostList/PostList'
import { getSortedPostsData, PostData } from '../lib/posts'

type Props = {
  allPostsData: PostData[]
}

const IndexPage = ({ allPostsData }: Props): JSX.Element => (
  <Layout>
    <main role="main" className="main">
      <section>
        <PostList allPostData={allPostsData} />
      </section>
    </main>
    <Sidebar>
      <Profile />
    </Sidebar>
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
