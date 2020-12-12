import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

export type PostData = {
  id: string
  title: string
  published: string
}

export type PostContentData = PostData & {
  contentHTML: string
}

const postsDirectory = path.join(process.cwd(), 'posts')

export const getSortedPostsData = (): PostData[] => {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map(
    (fileName): PostData => {
      const id = fileName.replace(/\.md$/, '')

      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf-8')

      const matterResult = matter(fileContents)

      return {
        id,
        ...(matterResult.data as { published: string; title: string }),
      }
    }
  )

  return allPostsData.sort((a, b) => (a.published < b.published ? 1 : -1))
}

export const getAllPostIds = (): { params: { id: string } }[] => {
  const fileNames = fs.readdirSync(postsDirectory)

  return fileNames.map((fileName) => ({
    params: {
      id: fileName.replace(/\.md$/, ''),
    },
  }))
}

export const fetchPostData = async (id: string): Promise<PostContentData> => {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf-8')

  const matterResult = matter(fileContents)

  const processedContent = await remark().use(html).process(matterResult.content)
  const contentHTML = processedContent.toString()

  return {
    id,
    contentHTML,
    ...(matterResult.data as { published: string; title: string }),
  }
}
