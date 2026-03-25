// Chạy đoạn script này trong Console (F12) của web và gửi kết quả cho tôi nhé bro
async function debugAI() {
    const url = 'http://127.0.0.1:1234/v1/chat/completions';
    console.log("--- Bắt đầu Debug tới:", url);
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer lm-studio' },
            body: JSON.stringify({
                messages: [{role: "user", content: "hi"}]
            })
        });
        console.log("Status:", res.status);
        console.log("Headers:", [...res.headers.entries()]);
        const text = await res.text();
        console.log("Raw Response Body:", text);
        try {
            console.log("Parsed JSON:", JSON.parse(text));
        } catch(e) {
            console.log("Body không phải JSON");
        }
    } catch(err) {
        console.error("Lỗi Fetch:", err);
    }
}
debugAI();
