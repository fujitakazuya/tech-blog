/* eslint jsx-a11y/anchor-is-valid: 0 */
import { VFC } from 'react'
import Link from 'next/link'

const Custom404: VFC = (): JSX.Element => (
  <div style={{textAlign: 'center', marginTop: '10rem'}}>
    <h1>404 Page Not Found.</h1>
    <Link href="/">
      <a>トップへ戻る</a>
    </Link>
  </div>
)

export default Custom404
