import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { Layout } from '../../components/Layout/Layout'
import { Post } from '../../components/Post/Post'
import { getAllPostIds, fetchPostData, PostContentData } from '../../lib/posts'
import styles from '../../styles/page.module.css'

type Props = {
  postData: PostContentData
}

const PostPage = ({ postData }: Props): JSX.Element => (
  <>
    <Head>
      <meta name="description" content={postData.title} />
    </Head>
    <Layout title={postData.title}>
      <main role="main" className={styles.main}>
        <section>
          <Post postData={postData} />
        </section>
      </main>
    </Layout>
  </>
)

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await fetchPostData(params?.id as string)

  return {
    props: {
      postData,
    },
  }
}

export default PostPage
