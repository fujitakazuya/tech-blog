---
title: Vimspector を使っでデバッグする
published: '2021-01-03'
---

## [Vimspector](https://github.com/puremourning/vimspector)とは

vim上でデバッグができるプラグインです。
IDEのようにブレークポイントを貼ってステップ実行ができます。

UIは下のスクショの通りVSCodeのような感じです。

[![vimspectorのUI](/vimspector_ui.png "vimspectorのUI")](/vimspector_ui.png)

## 導入手順

導入手順にはいろいろな方法がありますが、今回は[vim-plug](https://github.com/junegunn/vim-plug)を利用して導入していきます。（それ以外の導入方法はREADMEを参照してください）

`.vimrc` に以下を追記します。

```
Plug 'puremourning/vimspector'
```

### Adapterのインストール

デバッグを利用したい言語のアダプタを別途インストールする必要があります。

vimを開いた状態で `:VimspectorInstall <adapter>` を実行すると指定したアダプタをインストールできます。（TABを押すと候補をサジェストしてくれます）

また、 `.vimrc` にインストールするアダプタを記載する方法もあります。

```
let g:vimspector_install_gadgets = ['vscode-node-debug2', 'debugger-for-chrome']
```

上記の内容を記載し、`:VimspectorInstall` を実行することで指定したアダプタをインストールできます。（この例ではNode.jsとJavaScriptのアダプタをインストールする）

### キーマップの設定

デフォルトでは2種類のキーマップが用意されておりお好みで設定してください。
詳しくは[こちら](https://github.com/puremourning/vimspector#mappings)

```
let g:vimspector_enable_mappings = 'VISUAL_STUDIO'

#or

let g:vimspector_enable_mappings = 'HUMAN'
```

### 設定ファイル

デバッグを実行するには別途設定ファイルを作成する必要があります。
プロジェクトルートに `.vimspector.json` というファイルを作成してください。
内容は下記のようなものになります。

```json
{
  "configurations": {
    "node": {
      "adapter": "vscode-node",
      "configuration": {
        "request": "launch",
        "type": "node",
        "program": "${file}",
        "cwd": "${workspaceRoot}",
        "externalConsole": false,
        "stopAtEntry": true
      }
    },
    "chrome": {
      "adapter": "chrome",
      "configuration": {
        "request": "launch",
        "type": "chrome",
        "url": "http://localhost:1234",
        "webRoot": "${workspaceRoot}"
      }
    }
  }
}
```

#### adapters

adaptersの設定はインストール時に自動で設定されます。
`vim-plug` でインストールした場合は下記に記載されています。
`~/.vim/plugged/vimspector/gadgets/<os>/.gadgets.json`

#### configurations

デバッグ実行する際の設定値を記載します。

上記で設定している内容はそれぞれ下記を表しています。
それ以外の設定については[公式ドキュメント](https://puremourning.github.io/vimspector/configuration.html)を参照してください。
VSCodeの `launch.json` と同じような感じです。

| オプション         | 意味 |
| ----------         | ---- |
| `adapter`          | adapter名 |
| `request`          | `launch`: デバッグ時に新規に起動する。`attach`: アタッチする。     |
| `type`             | プログラムの種類     |
| `program`          | 起動するプログラムのパス。 `${file}` は現在開いているファイル。     |
| `cwd`              | プログラムの実行に使われるディレクトリ。`${workspaceRoot}` は `.vimspector.json` が存在するパス。     |
| `externalConsole`  | コンソール画面を開くかどうか     |
| `stopAtEntry`      | プログラム起動直後にデバッグ実行を中断するか |


## デバッグを実行してみる

`<F9>` キーを押すとブレークポイントを設定できます。

`:call vimspector#Launch()` を実行すると実行する設定を聞かれるため、実行したい設定を指定してください。

[![vimspector実行時のUI](/vimspector_launch_select.png "vimspector実行時のUI")](/vimspector_launch_select.png)

`:call vimspector#LaunchWithSettings({'configuration': <configuration_name>})` と設定を指定して実行する方法もあります。
※ `configuration_name` には `.vimspector.json` に記載した名前を入力します。（上記の例だと `node` や `chrome`）

Node.jsのデバッグ実行をしている様子です。
[![vimspectorでデバッグ実行中](/vimspector_debug.gif "vimspectorでデバッグ実行中")](/vimspector_debug.gif)
