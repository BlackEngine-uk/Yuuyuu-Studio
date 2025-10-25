import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

export default function KanjiPage() {
  const [input, setInput] = useState("");
  const [kanji, setKanji] = useState("");
  const [option, setOption] = useState("");

  const handleSearch = () => {
    const [text, opt] = input.split("/");
    setKanji(text.slice(0, 10)); // 最大10文字
    setOption(opt || "");
  };

  // Enterキーで検索
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getImageSrc = (style) => {
    return `/api/yy_app/kanji-img/${style}?text=${encodeURIComponent(kanji)}`;
  };

  return (
    <>
      <Head>
        <title>かんたんな漢字検索</title>
        <style>{`
          body {
            font-family: sans-serif;
            background: #121212;
            color: #f0f0f0;
            text-align: center;
            padding: 2em;
            transition: background 0.3s ease;
          }
          input {
            font-size: 1.2em;
            padding: 0.4em;
            width: 300px;
            text-align: center;
            background: #1e1e1e;
            color: #fff;
            border: 1px solid #555;
            border-radius: 6px;
          }
          button {
            padding: 0.4em 1em;
            margin-left: 0.5em;
            font-size: 1em;
            background: #333;
            color: #fff;
            border: 1px solid #555;
            border-radius: 6px;
            cursor: pointer;
          }
          button:hover {
            background: #444;
          }
          .container-01 {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-top: 2em;
            flex-wrap: wrap;
          }
          .kanji-block {
            background: #1b1b1b;
            border: 2px solid #444;
            border-radius: 12px;
            width: 180px;
            padding: 1em;
            box-shadow: 0 0 15px rgba(0,0,0,0.5);
            transition: transform 0.2s ease;
          }
          .kanji-block:hover {
            transform: scale(1.05);
          }
          img {
            width: 100%;
            height: auto;
            border-radius: 6px;
            background: #fff;
          }
        `}</style>
      </Head>

      <main>
        <h1>なんとなく字体検索</h1>

        <div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown} 
            placeholder="なかったらわりぃね"
          />
          <button onClick={handleSearch}>表示</button>
        </div>

        {kanji && (
          <div className="container-01">
            <div className="kanji-block">
              <h3>AC楷書</h3>
              <Image
                src={getImageSrc("k")}
                alt={`楷書 ${kanji}`}
                width={125}
                height={125 * kanji.length}
                unoptimized
              />
            </div>

            <div className="kanji-block">
              <h3>AC行書</h3>
              <Image
                src={getImageSrc("g")}
                alt={`行書 ${kanji}`}
                width={125}
                height={125 * kanji.length}
                unoptimized
              />
            </div>

            <div className="kanji-block">
              <h3>衡山行書</h3>
              <Image
                src={getImageSrc("g2")}
                alt={`衡山行書 ${kanji}`}
                width={125}
                height={125 * kanji.length}
                unoptimized
              />
            </div>

            <div className="kanji-block">
              <h3>衡山草書</h3>
              <Image
                src={getImageSrc("s")}
                alt={`草書 ${kanji}`}
                width={125}
                height={125 * kanji.length}
                unoptimized
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
