import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function KanjiHome() {
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!input) return;
    router.push(`/yuuyuu_/kanji/${encodeURIComponent(input)}`);
  };

  return (
    <>
      <Head>
        <title>字体検索</title>
      </Head>

      <main style={{ textAlign: "center", padding: "2em", color: "#f0f0f0", background: "#121212" }}>
        <h1>なんとなく字体検索</h1>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="なかったらわりぃね"
          style={{
            fontSize: "1.2em",
            padding: "0.4em",
            width: "300px",
            textAlign: "center",
            background: "#1e1e1e",
            color: "#fff",
            border: "1px solid #555",
            borderRadius: "6px",
          }}
        />
        <button onClick={handleSearch} style={{ marginLeft: "10px", padding: "0.4em 1em" }}>
          表示
        </button>
      </main>
    </>
  );
}
