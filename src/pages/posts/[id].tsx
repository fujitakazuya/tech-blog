import { GetStaticPaths, GetStaticProps } from 'next'
import { Layout } from '../../components/Layout/Layout'
import { Post } from '../../components/Post/Post'
import { getAllPostIds, fetchPostData, PostContentData } from '../../lib/posts'

type Props = {
  postData: PostContentData
}

const PostPage = ({ postData }: Props): JSX.Element => (
  <Layout title={postData.title}>
    <Post postData={postData} />
  </Layout>
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