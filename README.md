# post-css
PostCSSの自分用のClassの作成

## 参考
- [PostCSS](https://postcss.org/)
- [PostCSS GitHub](https://github.com/postcss/postcss)

## How to use
1. クラスをインポートする
```main.js
const sass = require('/path/to/post-css');
```

2. コンパイルする
```main.js
sass.compile();
```
3. 設定を変更する
```main.js
sass.setSrcDir('src/'); // 入力元
sass.setDestDir('src/'); // 出力先
sass.setFilter(new RegExp(/^(?!_).*\.(sass|scss)$/)); // 入力ファイルの条件
sass.setRecursion(true); // サブディレクトリ
```
