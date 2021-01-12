---
title: 'Go 言語で Mecab を使う (Docker)'
published: '2021-01-11'
---

## 概要

MeCabとGo言語を使って形態素解析を実装してみます。
辞書は[neologs/mecab-ipadic-neologd](https://github.com/neologd/mecab-ipadic-neologd)を利用します。

Go言語のライブラリは下記を利用します。
[shogo82148/go-mecab](https://github.com/shogo82148/go-mecab)

## `go-mecab`

```go
package main

import (
	"github.com/shogo82148/go-mecab"
)

func parse() {
	const ipadic = "/usr/lib/x86_65-linux-gnu/mecab/dic/mecab-ipadic-neologd"
	word := "8月3日に放送された「中居正広の金曜日のスマイルたちへ」(TBS系)で、1日たった5分でぽっこりおなかを解消するというダイエット方法を紹介。キンタロー。のダイエットにも密着。"
	args := map[string]string{"dicdir":ipadic}
	tagger, err := mecab.New(args)

	if err != nil {
		return nil, err
	}
	defer tagger.Destroy()

	node, err := tagger.ParseToNode(word)
}
```

`mecab.New` でparserを生成し、 `mecab.ParseToNode` でパース処理を行います。
`New` の引数にはオプションを指定でき、 `dicdir` オプションで使用する辞書を指定できます。
`Parse` 関数であれば戻り値は `string` となりますが、 `ParseToNode` であれば `mecab.Node` 型が戻り値となるため、その後の処理が実装しやすくなります。

以下では、形態素解析後の「単語」「品詞」「品詞の種類」を返すように実装します。
（名詞の「一般」とか「固有名詞」とかを何と呼ぶのかわからなかったので、ここでは品詞の種類と呼んでいます）

```go
type ParsedWord struct {
	Word             string `json:"word"`
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
		Word:             node.Surface(),
		PartOfSpeech:     features[0],
		PartOfSpeechType: features[1],
	}

	parsedWords = append(parsedWords, parsedWord)
}

return parsedWords, nil
```

ループでnodeの値を順番に取得いきます。

<!-- textlint-disable jtf-style/1.2.1.句点(。)と読点(、) -->
<!-- textlint-disable ja-technical-writing/max-comma -->
`node.Feature()` では「名詞,固有名詞,一般,*,*,*,8月3日,ハチガツミッカ,ハチガツミッカ」のような文字列を返します。
<!-- textlint-enable jtf-style/1.2.1.句点(。)と読点(、) -->
<!-- textlint-enable ja-technical-writing/max-comma -->
今回は「名詞」「固有名詞」の情報があればよいので、カンマ区切りで先頭の2つを取得しています。

```go
if features[0] == "BOS/EOS" {
	continue
}
```

<!-- textlint-disable ja-technical-writing/max-comma -->
形態素解析した際に、最初と最後が「BOS/EOS,*,*,*,*,*,*,*,*」のような出力になっていますが、こちらは不要のため除外しています。
<!-- textlint-enable ja-technical-writing/max-comma -->
（BOSはbeginning of sentence、EOSはend of sentenceのこと）


`node.Surface()` では分解されたそれぞれの単語が取得できます。（例）「8月3日」「に」「放送」）

上記の例では構造体の配列として値を返すようにしており、実行結果は下記のようになります。

```
[[{8月3日 名詞 固有名詞} {に 助詞 格助詞} {放送 名詞 サ変接続} {さ 動詞 自立} {れ 動詞 接尾} {た 助動詞 *} {「 記号 括弧開} 
{中居正広の金曜日のスマイルたちへ 名詞 固有名詞} {」( 記号 一般} {TBS 名詞 固有名詞} {系 名詞 接尾} {) 記号 一般} {で 助動詞 *} 
{、 記号 読点} {1日 名詞 固有名詞} {たった 副詞 助詞類接続} {5分 名詞 固有名詞} {で 助詞 格助詞} {ぽっこりおなか 名詞 固有名詞} 
{を 助詞 格助詞} {解消 名詞 サ変接続} {する 動詞 自立} {という 助詞 格助詞} {ダイエット方法 名詞 固有名詞} {を 助詞 格助詞} {紹介 名詞 サ変接続} 
{。 記号 句点} {キ ンタロー。 名詞 固有名詞} {の 助詞 連体化} {ダイエット 名詞 サ変接続} {に 助詞 格助詞} {も 助詞 係助詞} {密着 名詞 サ変接続} {。 記号 句点}]]
```

コード全体は下記です。

```go
package main

import (
	"fmt"
	"strings"

	"github.com/shogo82148/go-mecab"
)

type ParsedWord struct {
	Word             string `json:"noun"`
	PartOfSpeech     string `json:"pos"`
	PartOfSpeechType string `json:"post"`
}

const ipadic = "/usr/lib/x86_64-linux-gnu/mecab/dic/mecab-ipadic-neologd"

func main() {
	parsedWords, err := parse(map[string]string{"dicdir":ipadic}, "8月3日に放送された「中居正広の金曜日のスマイルたちへ」(TBS系)で、1日たった5分でぽっこりおなかを解消するというダイエット方法を紹介。キンタロー。のダイエットにも密着。")
	if err != nil {
		panic(err)
	}

	fmt.Println(parsedWords)
}

func parse(args map[string]string, word string) ([]ParsedWord, error) {
	tagger, err := mecab.New(args)

	if err != nil {
		return nil, err
	}
	defer tagger.Destroy()

	node, err := tagger.ParseToNode(word)

	if err != nil {
		return nil, err
	}

	parsedWords := []ParsedWord{}
	for ; !node.IsZero(); node = node.Next() {
		feature := node.Feature()
		features := strings.Split(feature, ",")

		if features[0] == "BOS/EOS" {
			continue
		}

		parsedWord := ParsedWord{
			Word:             node.Surface(),
			PartOfSpeech:     features[0],
			PartOfSpeechType: features[1],
		}

		parsedWords = append(parsedWords, parsedWord)
	}

	return parsedWords, nil
}
```

`Mecab.New` のオプションと解析する単語は引数として渡すように変えました。

## Dockerfileの作成

```dockerfile
FROM ubuntu:18.04

WORKDIR /home/go-mecab
COPY ./src ./src
RUN apt-get update \
    && apt-get install -y mecab libmecab-dev mecab-ipadic-utf8 git make curl xz-utils file sudo wget gcc build-essential \
    && git clone --depth 1 https://github.com/neologd/mecab-ipadic-neologd.git \
    && mecab-ipadic-neologd/bin/install-mecab-ipadic-neologd -n -a -y \
    && wget https://golang.org/dl/go1.15.6.linux-amd64.tar.gz \
    && tar -C /usr/local -xzf go1.15.6.linux-amd64.tar.gz \
    && export PATH=$PATH:/usr/local/go/bin \
    && export CGO_LDFLAGS="`mecab-config --libs`" \
    && export CGO_CFLAGS="-I`mecab-config --inc-dir`" \
    && go get github.com/shogo82148/go-mecab \
    && go build ./src/main.go
```

ベースイメージはUbuntuとしています。

```sh
apt-get install -y mecab libmecab-dev mecab-ipadic-utf8 git make curl xz-utils file sudo wget gcc build-essential
```

ここではMeCabや `go-mecab` に必要なライブラリをインストールしています。
`wget` はGoをインストールするために必要なので一緒にインストールしておきます。

```sh
git clone --depth 1 https://github.com/neologd/mecab-ipadic-neologd.git
mecab-ipadic-neologd/bin/install-mecab-ipadic-neologd -n -a -y
```

辞書をGitHubから取得しインストールします。
`-a` オプションですべての辞書を、 `-n` オプションで最新の辞書をインストールします。
`-y` オプションをつけることで、確認をせずにインストールできます。

```sh
wget https://golang.org/dl/go1.15.6.linux-amd64.tar.gz
tar -C /usr/local -xzf go1.15.6.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
```

ここはGoの[公式サイト](https://golang.org/dl/)そのままです。
現時点で最新の1.15.6をダウンロードします。

```sh
export CGO_LDFLAGS="`mecab-config --libs`"
export CGO_CFLAGS="-I`mecab-config --inc-dir`"
go get github.com/shogo82148/go-mecab
```

`go-mecab` をインストールします。
READMEに記載されている通りインストール時に環境変数を設定する必要があります。

```dockerfile
WORKDIR /home/go-mecab
COPY ./src ./src

---
go build ./src/main.go
```

Dockerfileの最初のほうでコピーしたソースコードをビルドします。

```sh
docker build -t sample-go-mecab .
```

Dockerfileがあるディレクトリで上記を実行し、ビルドを行います。
`sample-go-mecab` は任意の名前です。

```sh
docker run --rm sample-go-mecab /home/go-mecab/main 
```

上記コマンドでDockerを起動し、ビルドされたソースコードを実行します。
形態素解析された結果が表示されると思います。
