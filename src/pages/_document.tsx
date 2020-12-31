import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
  DocumentInitialProps,
} from 'next/document'
import { GA_TRACKING_ID } from '../lib/gtag'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)
    return initialProps
  }

  render(): JSX.Element {
    return (
      <Html lang="ja">
        <Head>
          <meta name="description" content="fujiの技術ブログ。プログラミング等の備忘録など。" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
