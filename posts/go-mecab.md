---
title: 'Go 言語で Mecab を使う (Mac)'
published: '2020-01-02'
---

## 概要

MeCabとGo言語を使って形態素解析を実装してみます。
辞書は[neologs/mecab-ipadic-neologd](https://github.com/neologd/mecab-ipadic-neologd)を利用します。

Go言語のライブラリは下記を利用します。
[shogo82148/go-mecab](https://github.com/shogo82148/go-mecab)

## インストール

### MeCab

#### 必要なライブラリをインストール

Homebrewをインストール済みであれば下記のコマンドでインストール可能です。
`git`, `curl`, `xz` はインストール済みであれば別途インストールは不要です。

```sh
brew install mecab mecab-ipadic git curl xz
```

### `mecab-ipadic-NEologd`

#### 辞書のシードデータをGitHubから取得

```sh
git clone --depth 1 git@github.com:neologd/mecab-ipadic-neologd.git

# or
git clone --depth 1 https://github.com/neologd/mecab-ipadic-neologd.git
```

#### `mecab-ipadic-NEologd` のインストール

cloneしたディレクトリへ移動

```sh
cd mecab-ipadic-neologd
```

インストール

```sh
./bin/install-mecab-ipadic-neologd -n
```

辞書のパスは下記コマンドで確認できます。

```sh
echo `mecab-config --dicdir`"/mecab-ipadic-neologd"
```

### go-mecab

ToDo: CGO_LDFLAGS とは？

#### 環境変数の設定

ライブラリのインストール前に環境変数の設定をする必要があります。

```sh
export CGO_LDFLAGS="`mecab-config --libs`"
export CGO_CFLAGS="-I`mecab-config --inc-dir`"
```

ToDo: mecab-config ??

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

    tagger, err := mecab.New(args)

    if err != nil {
      panic(err)
    }
    defer tagger.Destroy()

    node, err := tagger.ParseToNode(word)
}
```

`mecab.New` でparserを生成し、 `mecab.ParseToNode` でパース処理を行います。
`New` の引数にはオプションを指定でき、 `dicdir` オプションで使用する辞書を指定できます。
また、`Parse` 関数であれば戻り値は `string` となりますが、 `ParseToNode` であれば `mecab.Node` 型が戻り値となるため、その後の処理が実装しやすくなります。

以下では、形態素解析後の「単語」「品詞」「品詞の種類」を返すように実装します。
（名詞の「一般」とか「固有名詞」とかを何と呼ぶのかわからなかったので、ここでは品詞の種類と呼んでいます）

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

// ToDo: for; node.IsZeroの説明

`node.Feature()` では「名詞,一般,*,*,*,*,世界,セカイ,セカイ」のような文字列を返します。
今回は「名詞」「一般」の情報があればよいので、カンマ区切りで先頭の2つを取得しています。

形態素解析した際に、最初と最後が「BOS/EOS,*,*,*,*,*,*,*,*」のような出力になっていますが、こちらは不要のため下記のようにして除外しています。
（BOSはbeginning of sentence、EOSはend of sentenceのこと）

```go
if features[0] == "BOS/EOS" {
    continue
}
```

`node.Surface()` では分解されたそれぞれの単語が取得できます。（例）「こんにちは」「世界」）

最終的に下記のようなJSONとして出力できます。
