import { createCanvas, registerFont } from "canvas";
import path from "path";

export default function handler(req, res) {
    const { text = "𱁬" } = req.query;

    // フォント読み込み
    const fontPath = path.join(process.cwd(), "public/static/_fonts/_kBFont_g.ttf");
    registerFont(fontPath, { family: "KBFontG" });

    // 1文字あたりのサイズ
    const charSize = 512;

    // 複数文字にも対応
    const width = charSize;
    const height = charSize * text.length;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // 背景・スタイル設定
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "white";

    // 縦書き
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = `${charSize * 0.9}px "KBFontG"`;

    // 各文字を縦方向に配置
    const x = width / 2;
    for (let i = 0; i < text.length; i++) {
        const y = i * charSize * 0.95; // やや間を詰める
        ctx.fillText(text[i], x, y);
    }

    const buffer = canvas.toBuffer("image/png");
    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
}
