import { GetStaticPaths, GetStaticProps } from 'next'
import { Layout } from '../../components/Layout/Layout'
import { getAllPostIds, fetchPostData, PostContentData } from '../../lib/posts'

type Props = {
  postData: PostContentData
}

const PostPage = ({ postData }: Props): JSX.Element => (
  <Layout title={postData.title}>
    <p>{postData.title}</p>
    <p>{postData.id}</p>
    <p>{postData.date}</p>
    <div dangerouslySetInnerHTML={{ __html: postData.contentHTML }} />
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
