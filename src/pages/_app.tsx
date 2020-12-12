import type { AppProps } from 'next/app'
import 'modern-css-reset'
import '../styles/variables.css'

const App = ({ Component, pageProps }: AppProps): JSX.Element => <Component {...pageProps} />

export default App
