---
title: 'Next.js でブログを作った'
published: '2020-12-30'
---

2021年はアウトプットを増やしていきたいと思い個人ブログを作成しました。
技術構成は下記のようになっています。

## フロントエンド

### Next.js

フロントエンドはNext.js（React, TypeScript）を使っています。
それぞれの記事は静的ファイルとして生成し取得しています。（Static Generation）
CSSはcss-modulesを利用しています。

### それ以外のライブラリ

- [react-markdown](https://github.com/remarkjs/react-markdown): MarkdownをHTMLへ変換する。
- [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter): `react-markdown`だけではコードのハイライトができないため、使用しています。

## バックエンド

ありません。前述の通り、記事はMarkdownファイルとして保持しており、ビルド時に静的ファイルとして取得しています。

## 本番環境のデプロイ

Next.jsとの相性が良いことからVercelを利用しています。
