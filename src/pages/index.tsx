import { GetStaticProps } from 'next'
import { Layout } from '../components/Layout/Layout'
import { getSortedPostsData, PostData } from '../lib/posts'

type Props = {
  allPostsData: PostData[]
}

const IndexPage = ({ allPostsData }: Props): JSX.Element => (
  <Layout>
    <h1>Index Page</h1>
    <section>
      <h2>Blog</h2>
      <ul>
        {allPostsData.map(({ id, date, title }) => (
          <li key={id}>
            <p>{title}</p>
            <p>{id}</p>
            <p>{date}</p>
          </li>
        ))}
      </ul>
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
