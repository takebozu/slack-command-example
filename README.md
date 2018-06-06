# Slash Commands/Interactive Components Example for Slack

SlackのSlash Commandで出来ることを調査するために作成したサンプル。
（なお、Node.jsは勉強し始めたばかりですので、その前提で見てください。）

* /command weather により天気情報をテキストで返す
* /command button によりボタンの選択肢が表示される
* /command dialog によりダイアログ（入力フォーム）が開く

## 必要な設定
次の環境変数を.envにセットしてください。

* VERIFICATION_TOKEN
* ACCESS_TOKEN