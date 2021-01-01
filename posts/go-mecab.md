---
title: 'Go 言語で Mecab を使う (Mac)'
published: '2020-01-02'
---

## 概要

MecabとGo言語を使って形態素解析を実装してみます。
辞書はneologdを利用します。
基本的に下記の公式サイトの内容通りです

[neologs/mecab-ipadic-neologd](https://github.com/neologd/mecab-ipadic-neologd)
[shogo82148/go-mecab](https://github.com/shogo82148/go-mecab)

## インストール

### Mecab

#### 必要なライブラリをインストール

Homebrewをインストール済みであれば下記のコマンドでインストール可能です。
`git`, `curl`, `xz` はインストール済みであれば別途インストールは不要です。

```sh
brew install mecab mecab-ipadic git curl xz
```

### mecab-ipadic-NEologd

#### 辞書のシードデータをGitHubから取得

```sh
git clone --depth 1 git@github.com:neologd/mecab-ipadic-neologd.git

# or
git clone --depth 1 https://github.com/neologd/mecab-ipadic-neologd.git
```

#### mecab-ipadic-NEologdのインストール

cloneしたディレクトリへ移動

```sh
cd mecab-ipadic-neologd
```

インストール

```sh
./bin/install-mecab-ipadic-neologd -n
```

辞書のパスは下記コマンドで確認することができます。

```sh
echo `mecab-config --dicdir`"/mecab-ipadic-neologd"
```

### go-mecab

TODO: CGO_LDFLAGS とは？？

#### パスの設定

ライブラリのインストール前にパスの設定をする必要があります。
下記を `.zshrc` 等に記載します。

```sh
export CGO_LDFLAGS="`mecab-config --libs`"
export CGO_CFLAGS="-I`mecab-config --inc-dir`"
```

ちなみに、それぞれのコマンドの実行結果は筆者の場合、下記のようになりました。

```sh
> mecab-config --libs
-L/usr/local/Cellar/mecab/0.996/lib -lmecab -lstdc++

> mecab-config --inc-dir
/usr/local/Cellar/mecab/0.996/include
```

ライブラリのインストール

```sh
go get github.com/shogo82148/go-mecab
```

## 使い方

### 形態素解析をする

```go
import (
    "github.com/shogo82148/go-mecab"
)


func parse() {
    word := "こんにちは世界"
    args := map[string]string{"dicdir": "/usr/local/lib/mecab/dic/mecab-ipadic-neologd"}

    mecab, err := mecab.New(args)

    if err != nil {
      panic(err)
    }
    defer mecab.Destroy()

    node, err := mecab.ParseToNode(word)
}
```

`mecab.New` で parser を生成し、 `mecab.ParseToNode` でパース処理を行います。
`New` の引数にはオプションを指定することができ、 `dicdir` オプションで使用する辞書を指定することができます。
また、`Parse` 関数であれば戻り値は `string` となりますが、 `PareseToNode` であれば `mecab.Node` 型が戻り値となるため、その後の処理が実装しやすくなります。

以下では、形態素解析後の「単語」「品詞」「品詞の種類」を返すように実装します。
（名詞の「一般」とか「固有名詞」とかを何と呼ぶのかわからなかったので、ここでは品詞の種類と呼んでいます。）

```go
type ParsedWord struct {
  Noun             string `json:"noun"`
  PartOfSpeech     string `json:"pos"`
  PartOfSpeechType string `json:"post"`
}

parsedWords := []ParsedWord{}
for ; !node.IsZero(); node = node.Next() {
    feature := node.Feature()
    features := strings.Split(feature, ",")

    if features[0] == "BOS/EOS" {
        continue
    }

    parsedWord := ParsedWord{
        Noun:             node.Surface(),
        PartOfSpeech:     features[0],
        PartOfSpeechType: features[1],
    }

    parsedWords = append(parsedWords, parsedWord)
}

return parsedWords, nil
```

// TODO: for; node.IsZero の説明

`node.Feature()` では「名詞,一般,*,*,*,*,世界,セカイ,セカイ」のような文字列を返します。
今回は「名詞」「一般」の情報があればよいので、カンマ区切りで先頭の２つを取得しています。

// TODO: BOS/EOS とは何か？
形態素解析した際に、最初と最後が「BOS/EOS,*,*,*,*,*,*,*,*」のような出力になっていますが、こちらは不要のため下記のようにして除外しています。

```go
if features[0] == "BOS/EOS" {
    continue
}
```

`node.Surface()` では分解されたそれぞれの単語が取得できます。（例）「こんにちは」「世界」）

最終的に下記のようなJSONとして出力できます。