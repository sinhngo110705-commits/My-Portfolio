export async function onRequest(context) {
    const { request, env } = context;

    if (request.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            }
        });
    }

    if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        const body = await request.json().catch(() => ({}));
        const messages = body.messages || [];
        const userMsg = (messages.length > 0 ? messages[messages.length - 1].content : "") || "";
        function removeAccents(str) {
            return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
        }
        const clean = removeAccents(userMsg);

        // High-intelligence RAG Knowledge Base Generator
        function getRagReply(query) {
            if (clean.includes("thuy duong") || clean.includes("duong")) {
                return "Trần Thị Thùy Dương (#01 - 96.0 điểm, Tier S+ Apex) là tài năng Khoa học Máy tính tại VKU (GPA 3.61/4.0), cựu chuyên Tin Quốc Học Huế (9.3/10), đạt giải ICPC Quốc gia và Top 6 SheCodes. Dương chuyên sâu thuật toán, C++, Java, Full-Stack Web và Flutter Mobile!";
            }
            if (clean.includes("thai trung") || clean.includes("trung")) {
                return "Lê Thái Trung (#02 - 90.5 điểm, Tier S Professional) là kỹ sư Kỹ nghệ Phần mềm tại ĐH Duy Tân, chuyên về Backend Development, RESTful APIs, IntelliJ IDEA, Postman và Linux/Git.";
            }
            if (clean.includes("quang sinh") || clean.includes("sinh") || clean.includes("founder")) {
                return "Ngô Quang Sinh (#03 - 88.0 điểm, Tier A+ Impressive) là Nhà sáng lập Teemous Digital Lab, sinh viên Digital Marketing tại ĐH Duy Tân. Sinh chuyên kiến trúc Web, tự động hóa AI Workflows, Google AppsScript và phát triển hệ sinh thái số. Bạn có thể liên hệ Sinh qua FB: facebook.com/quang.sinh.5492 hoặc Zalo: 0797747297 nhé!";
            }
            if (clean.includes("bao han") || clean.includes("han")) {
                return "Bùi Lưu Bảo Hân (#04 - 84.0 điểm, Tier A Standard) là sinh viên Kinh doanh Quốc tế tại ĐH Duy Tân, có thế mạnh về Quản trị Nhân sự (HR), vận hành cộng đồng thanh niên, quản trị dữ liệu với Notion & Google Sheets.";
            }
            if (clean.includes("quang tuan") || clean.includes("tuan")) {
                return "Vương Quang Tuấn (#05 - 80.5 điểm, Tier A Standard) là nhân sự Sáng tạo Nội dung năng động, chuyên thiết kế hình ảnh bằng Canva, dựng video ngắn CapCut, quản trị kênh Fanpage và chạy Facebook Ads cơ bản.";
            }
            if (clean.includes("mau") || clean.includes("showcase") || clean.includes("hub") || clean.includes("ho so") || clean.includes("xep hang") || clean.includes("tier") || clean.includes("bac")) {
                return "Portfolio Hub xếp hạng hồ sơ công tâm dựa trên giá trị thực tế tạo ra cho cộng đồng & sản phẩm thực chiến: S+ Apex (>=95.0 - Thùy Dương), S Professional (90.0-94.9 - Thái Trung), A+ Impressive (85.0-89.9 - Quang Sinh), A Standard (80.0-84.9 - Bảo Hân, Quang Tuấn). Bạn bấm mục 'Portfolio Hub' trên menu để xem chi tiết nhé!";
            }
            if (clean.includes("gia") || clean.includes("cost") || clean.includes("price") || clean.includes("bang gia") || clean.includes("chi phi") || clean.includes("bao nhieu") || clean.includes("0d") || clean.includes("free")) {
                return "Hiện tại gói Khởi Tạo Portfolio Cơ Bản đang được TÀI TRỢ 100% SUẤT 0Đ (giá gốc 49k) cho người đăng ký sớm! Gói Khởi Tạo Nâng Cao (Bespoke VIP) hiện đang tạm khóa để remake phiên bản mới. Bạn hãy vào mục SERVICES & SHOP để nhận suất 0đ ngay nha!";
            }
            if (clean.includes("mxh") || clean.includes("smm") || clean.includes("mang xa hoi") || clean.includes("social") || clean.includes("follow") || clean.includes("buff") || clean.includes("like") || clean.includes("tiktok") || clean.includes("facebook") || clean.includes("instagram")) {
                return "Hệ thống SMM của Teemous Digital hỗ trợ tăng like, follow, view, tương tác bài viết cho Facebook, Instagram, Threads, TikTok với giá từ vài chục đồng/tương tác. Tự động lấy UID từ link, bảo mật 100% không cần mật khẩu và nạp tiền tự động qua VietQR!";
            }
            if (clean.includes("aov") || clean.includes("lien quan") || clean.includes("acc") || clean.includes("shop") || clean.includes("nick")) {
                return "Cửa hàng Liên Quân hiện đang tạm ngưng hoạt động để bảo trì hệ thống máy chủ và nâng cấp quy trình giao dịch bảo mật. Bạn vui lòng quay lại sau nhé!";
            }
            if (clean.includes("lien he") || clean.includes("contact") || clean.includes("fb") || clean.includes("admin") || clean.includes("zalo")) {
                return "Bạn có thể liên hệ trực tiếp với Quang Sinh qua Facebook: facebook.com/quang.sinh.5492, Zalo: 0797747297 hoặc email: teemous.contact@gmail.com nha!";
            }
            if (clean.includes("dich vu") || clean.includes("service") || clean.includes("lam gi") || clean.includes("portfolio")) {
                return "Teemous Digital cung cấp các dịch vụ: Khởi tạo Portfolio cá nhân (đang có suất tài trợ 0đ), Dịch vụ tăng trưởng Mạng Xã Hội SMM (Facebook, TikTok, Instagram) và Tự động hóa công cụ AI. Bạn cần mình tư vấn mục nào nhất?";
            }
            return "Chào bạn! Mình là Teemous AI, trợ lý số của Teemous Digital Lab. Mình có thể hỗ trợ tư vấn nhận suất làm Portfolio 0đ, tra cứu hồ sơ Portfolio Hub, dịch vụ buff tương tác MXH hay kết nối trực tiếp với Founder Quang Sinh. Bạn cần mình hỗ trợ gì nè?";
        }

        const reply = getRagReply(userMsg);

        return new Response(JSON.stringify({ content: reply, role: "assistant" }), {
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch(err) {
        return new Response(JSON.stringify({ content: "Chào bạn! Mình là Teemous AI. Mình có thể hỗ trợ bạn về dịch vụ làm Portfolio, buff tương tác mạng xã hội Meta hoặc kết nối trực tiếp với Quang Sinh qua Facebook: facebook.com/quang.sinh.5492 nhé!", role: "assistant" }), {
            headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
        });
    }
}
