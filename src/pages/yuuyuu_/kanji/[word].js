import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

export default function KanjiPage() {
    const router = useRouter();
    const { word } = router.query; // URLパラメータを取得
    const kanji = decodeURIComponent(word || "");

    const getImageSrc = (style) => {
        return `/api/yy_app/kanji-img/${style}?text=${encodeURIComponent(kanji)}`;
    };

    if (!kanji) return <p>Loading...</p>;

    return (
        <>
            <Head>
                <title>{kanji} - 字体検索</title>
            </Head>

            <main
                style={{
                    textAlign: "center",
                    padding: "2em",
                    color: "#f0f0f0",
                    background: "#121212",
                }}
            >
                <h1>「{kanji}」の字体検索</h1>

                <div
                    className="container-01"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: "40px",
                        marginTop: "2em",
                    }}
                >
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
            </main>
        </>
    );
}
