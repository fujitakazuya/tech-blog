/* eslint jsx-a11y/anchor-is-valid: 0 */
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { Layout } from '../components/Layout/Layout'
import { getSortedPostsData, PostData } from '../lib/posts'

type Props = {
  allPostsData: PostData[]
}

const IndexPage = ({ allPostsData }: Props): JSX.Element => (
  <Layout>
    <section>
      <ul>
        {allPostsData.map(({ id, published, title }) => (
          <li key={id}>
            <Link href={`/posts/${id}`}>
              <a>{title}</a>
            </Link>
            <p>{published}</p>
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
