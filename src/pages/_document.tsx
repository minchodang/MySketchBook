import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="ko">
                <Head>
                    <body>
                        <Main />
                        <NextScript />
                    </body>
                </Head>
            </Html>
        );
    }
}

export default MyDocument;
