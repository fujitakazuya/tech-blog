---
title: ReactでCSSModulesと通常のCSSの読み込みを併用する
published: '2021-01-23'
---

ReactでCSSModulesを使っているときに、外部ライブラリのCSSをインポートした際にうまく読み込むことができなかったので、そのときのメモになります。

## 結論

<!-- textlint-disable prh -->
webpackの設定は下記のようになります
<!-- textlint-enable prh -->

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        include: /src/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        exclude: /src/,
        use: ['style-loader', 'css-loader'],
      }
    ],
  },
  ...
}
```

## 概要

CSSMolesを利用している状態で下記のように外部ライブラリのCSSをインポートしてもスタイルが反映されませんでした。

```tsx
import styles from './style.module.css'; // こちらは反映される
import 'path/to/style.css' // 反映されない
```

<!-- textlint-disable prh -->
そこで、webpackの設定で対象が `node_modules` 配下かどうかによって外部ライブラリかどうかを判断するようにしました。
<!-- textlint-enable prh -->


```javascript
{
  test: /\.css$/,
  include: /src/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'style-loader',
    },
    {
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName: '[path][name]__[local]--[hash:base64:5]',
        },
      },
    },
  ],
},
```

`src` 配下に対してはCSSModulesを利用し、 `node_modules` 配下は対象外とする。


```javascript
{
  test: /\.css$/,
  include: /node_modules/,
  exclude: /src/,
  use: ['style-loader', 'css-loader'],
}
```

逆に、 `node_modules` 配下はCSSModulesを使わず、 `src` 配下は対象外とする。

これで無事外部ライブラリのcssも読み込むことができました。
