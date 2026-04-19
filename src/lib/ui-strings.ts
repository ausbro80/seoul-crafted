import { type Lang } from "./i18n";

// Dictionary of every customer-facing UI string. Translations are hand-authored.
// To add a new string: add a key here and reference it via t(lang, "your_key").
const S = {
  // Tab bar
  nav_home: { en: "Home", zh: "首页", ja: "ホーム", vi: "Trang chủ" },
  nav_trips: { en: "Trips", zh: "行程", ja: "旅程", vi: "Chuyến đi" },
  nav_chat: { en: "Chat", zh: "聊天", ja: "チャット", vi: "Trò chuyện" },
  nav_me: { en: "Me", zh: "我", ja: "マイ", vi: "Cá nhân" },

  // Top bar
  brand_tagline: {
    en: "Live Seoul like a local",
    zh: "像本地人一样玩转首尔",
    ja: "ローカルのように、ソウルを",
    vi: "Sống Seoul như người bản xứ",
  },

  // Home hero
  home_hero_1: {
    en: "Your day in Seoul,",
    zh: "首尔的每一天，",
    ja: "あなたのソウル、",
    vi: "Một ngày ở Seoul,",
  },
  home_hero_2: {
    en: "day by day.",
    zh: "日复一日。",
    ja: "毎日を。",
    vi: "từng ngày một.",
  },
  home_search_placeholder: {
    en: "Search routes, neighborhoods, food…",
    zh: "搜索路线、街区、美食…",
    ja: "ルート・エリア・グルメを検索…",
    vi: "Tìm tuyến, khu phố, món ăn…",
  },
  home_start_here: { en: "Start here", zh: "从这里开始", ja: "ここから", vi: "Bắt đầu" },
  home_3_ways: {
    en: "3 ways to go",
    zh: "三种方式",
    ja: "3つの選び方",
    vi: "3 cách đi",
  },
  home_popular: { en: "Popular now", zh: "人气推荐", ja: "人気", vi: "Đang hot" },
  home_see_all: { en: "See all →", zh: "查看全部 →", ja: "すべて見る →", vi: "Xem tất cả →" },
  home_no_routes: {
    en: "No routes published yet. Check back soon.",
    zh: "尚无发布路线，请稍后再来。",
    ja: "まだ公開されたルートはありません。",
    vi: "Chưa có tuyến nào. Quay lại sau nhé.",
  },

  // Category cards
  cat_curated: { en: "Curated", zh: "精选", ja: "厳選", vi: "Chọn lọc" },
  cat_curated_title: {
    en: "Pre-designed\n3-hour tours",
    zh: "精心设计的\n3小时路线",
    ja: "厳選された\n3時間コース",
    vi: "Tour 3 giờ\nđược thiết kế sẵn",
  },
  cat_curated_sub: {
    en: "From $42 · Book and go",
    zh: "起价 $42 · 立即预订",
    ja: "$42から · すぐ予約",
    vi: "Từ $42 · Đặt và đi",
  },
  cat_guided: { en: "Guided", zh: "向导", ja: "ガイド付き", vi: "Có hướng dẫn" },
  cat_guided_title: {
    en: "Plan with\na guide",
    zh: "与向导\n一起规划",
    ja: "ガイドと\n一緒に計画",
    vi: "Lên kế hoạch\nvới hướng dẫn",
  },
  cat_guided_sub: {
    en: "~$120 · 5h max",
    zh: "约 $120 · 最长5小时",
    ja: "約 $120 · 最大5時間",
    vi: "~$120 · Tối đa 5h",
  },
  cat_route: { en: "Route only", zh: "仅路线", ja: "ルートのみ", vi: "Chỉ lộ trình" },
  cat_route_title: {
    en: "We make\nthe map",
    zh: "我们\n做地图",
    ja: "地図を\nお作りします",
    vi: "Chúng tôi\nlập bản đồ",
  },
  cat_route_sub: {
    en: "$18 · No time limit",
    zh: "$18 · 不限时间",
    ja: "$18 · 時間制限なし",
    vi: "$18 · Không giới hạn",
  },

  // Browse
  browse_title: { en: "Browse routes", zh: "浏览路线", ja: "ルートを探す", vi: "Xem tuyến" },
  filter_all: { en: "All", zh: "全部", ja: "すべて", vi: "Tất cả" },
  filter_curated: { en: "Curated", zh: "精选", ja: "厳選", vi: "Chọn lọc" },
  filter_guided: { en: "Guided", zh: "向导", ja: "ガイド付き", vi: "Có hướng dẫn" },
  filter_route_only: { en: "Route only", zh: "仅路线", ja: "ルートのみ", vi: "Chỉ lộ trình" },
  browse_empty: {
    en: "Nothing here yet.",
    zh: "暂无内容。",
    ja: "まだありません。",
    vi: "Chưa có gì.",
  },

  // Route detail
  detail_overview: { en: "Overview", zh: "概览", ja: "概要", vi: "Tổng quan" },
  detail_itinerary: { en: "Itinerary", zh: "行程", ja: "スケジュール", vi: "Lộ trình" },
  detail_reviews: { en: "Reviews", zh: "评价", ja: "レビュー", vi: "Đánh giá" },
  detail_from: { en: "From", zh: "起价", ja: "から", vi: "Từ" },
  detail_book_now: { en: "Book now", zh: "立即预订", ja: "予約する", vi: "Đặt ngay" },

  // Customize wizard
  customize_label: { en: "Customize", zh: "定制", ja: "カスタマイズ", vi: "Tuỳ chỉnh" },
  customize_guided_title: {
    en: "Guided custom tour",
    zh: "向导定制路线",
    ja: "ガイド付きカスタム",
    vi: "Tour có hướng dẫn tuỳ chỉnh",
  },
  customize_guided_sub: {
    en: "~5 hours, matched with a local guide",
    zh: "约5小时，匹配本地向导",
    ja: "約5時間、現地ガイドがご案内",
    vi: "~5 giờ, khớp với hướng dẫn bản xứ",
  },
  customize_route_title: {
    en: "Route only",
    zh: "仅路线",
    ja: "ルートのみ",
    vi: "Chỉ lộ trình",
  },
  customize_route_sub: {
    en: "A printable itinerary — no time limit, $18",
    zh: "可打印的行程 — 不限时间，$18",
    ja: "印刷可能なスケジュール — 時間制限なし、$18",
    vi: "Lộ trình có thể in — không giới hạn, $18",
  },
  step: { en: "Step", zh: "步骤", ja: "ステップ", vi: "Bước" },
  step_when: { en: "When?", zh: "何时？", ja: "いつ？", vi: "Khi nào?" },
  step_how_many: {
    en: "How many?",
    zh: "几个人？",
    ja: "何人？",
    vi: "Mấy người?",
  },
  step_interests: {
    en: "What grabs you?",
    zh: "你感兴趣什么？",
    ja: "気になるのは？",
    vi: "Bạn thích gì?",
  },
  step_interests_sub: {
    en: "Pick 3–4",
    zh: "选3–4个",
    ja: "3〜4つ選ぶ",
    vi: "Chọn 3–4",
  },
  step_pace: {
    en: "What pace?",
    zh: "什么节奏？",
    ja: "どのペース？",
    vi: "Nhịp độ nào?",
  },
  step_contact: {
    en: "How do we reach you?",
    zh: "如何联系你？",
    ja: "ご連絡先は？",
    vi: "Liên hệ bạn thế nào?",
  },
  traveler: { en: "traveler", zh: "位旅客", ja: "人", vi: "khách" },
  travelers: { en: "travelers", zh: "位旅客", ja: "人", vi: "khách" },
  pace_relaxed_label: { en: "Relaxed", zh: "轻松", ja: "のんびり", vi: "Thư giãn" },
  pace_relaxed_sub: {
    en: "Few stops, long breaks",
    zh: "少停留，长休息",
    ja: "少なめ、長めの休憩",
    vi: "Ít điểm, nghỉ dài",
  },
  pace_balanced_label: { en: "Balanced", zh: "均衡", ja: "バランス", vi: "Cân bằng" },
  pace_balanced_sub: {
    en: "Steady pace",
    zh: "稳步前进",
    ja: "ちょうどよく",
    vi: "Đều đặn",
  },
  pace_packed_label: { en: "Packed", zh: "紧凑", ja: "盛りだくさん", vi: "Đầy đủ" },
  pace_packed_sub: {
    en: "See as much as possible",
    zh: "尽可能多看",
    ja: "できる限り見る",
    vi: "Xem càng nhiều càng tốt",
  },
  interest_culture: { en: "Culture", zh: "文化", ja: "文化", vi: "Văn hoá" },
  interest_food: { en: "Food", zh: "美食", ja: "グルメ", vi: "Ẩm thực" },
  interest_nature: { en: "Nature", zh: "自然", ja: "自然", vi: "Thiên nhiên" },
  interest_shopping: { en: "Shopping", zh: "购物", ja: "ショッピング", vi: "Mua sắm" },
  interest_nightlife: { en: "Nightlife", zh: "夜生活", ja: "ナイトライフ", vi: "Đêm" },
  interest_family: { en: "Family", zh: "家庭", ja: "ファミリー", vi: "Gia đình" },
  interest_photo: { en: "Photo", zh: "摄影", ja: "フォト", vi: "Chụp ảnh" },
  interest_craft: { en: "Craft", zh: "工艺", ja: "クラフト", vi: "Thủ công" },
  cta_match_guide: {
    en: "Match me with a guide →",
    zh: "为我匹配向导 →",
    ja: "ガイドとマッチ →",
    vi: "Ghép với hướng dẫn →",
  },
  cta_see_route: {
    en: "See my route — $18",
    zh: "查看我的路线 — $18",
    ja: "ルートを見る — $18",
    vi: "Xem lộ trình — $18",
  },
  submitting: { en: "Submitting…", zh: "提交中…", ja: "送信中…", vi: "Đang gửi…" },

  // Checkout
  checkout_title: { en: "Checkout", zh: "结账", ja: "チェックアウト", vi: "Thanh toán" },
  checkout_tour: { en: "Tour", zh: "路线", ja: "ツアー", vi: "Tour" },
  field_email: { en: "Email", zh: "邮箱", ja: "メール", vi: "Email" },
  field_name_optional: {
    en: "Name (optional)",
    zh: "姓名（可选）",
    ja: "お名前（任意）",
    vi: "Tên (tuỳ chọn)",
  },
  field_date: { en: "Date", zh: "日期", ja: "日付", vi: "Ngày" },
  field_people: { en: "People", zh: "人数", ja: "人数", vi: "Số người" },
  checkout_tour_line: { en: "Tour ×", zh: "路线 ×", ja: "ツアー ×", vi: "Tour ×" },
  checkout_fee: { en: "Booking fee", zh: "预订费", ja: "予約手数料", vi: "Phí đặt" },
  checkout_total: { en: "Total", zh: "总计", ja: "合計", vi: "Tổng" },
  checkout_note: {
    en: "Free cancellation up to 24h before. Payment lands in a later pass — your booking is reserved and our team will follow up.",
    zh: "可在开始前24小时免费取消。支付将在后续版本开放，我们的团队会跟进你的预订。",
    ja: "開始24時間前までキャンセル無料。決済は後日対応予定。予約は仮押さえされ、チームからご連絡します。",
    vi: "Huỷ miễn phí trước 24h. Thanh toán sẽ có sau, đội ngũ sẽ liên hệ xác nhận.",
  },
  checkout_reserve: { en: "Reserve", zh: "预订", ja: "予約", vi: "Đặt chỗ" },
  checkout_reserving: { en: "Reserving…", zh: "预订中…", ja: "予約中…", vi: "Đang đặt…" },

  // Trips
  trips_title: { en: "My trips", zh: "我的行程", ja: "マイトリップ", vi: "Chuyến của tôi" },
  trips_reserved: {
    en: "Reserved ✓ — our team will confirm by email.",
    zh: "已预订 ✓ — 我们的团队将通过邮件确认。",
    ja: "予約済み ✓ — チームからメールでご連絡します。",
    vi: "Đã đặt ✓ — đội ngũ sẽ xác nhận qua email.",
  },
  trips_upcoming: { en: "Upcoming", zh: "即将开始", ja: "これから", vi: "Sắp tới" },
  trips_past: { en: "Past", zh: "已完成", ja: "過去", vi: "Đã qua" },
  trips_empty: {
    en: "No trips yet.",
    zh: "暂无行程。",
    ja: "まだ旅程はありません。",
    vi: "Chưa có chuyến nào.",
  },
  trips_browse: { en: "Browse routes", zh: "浏览路线", ja: "ルートを探す", vi: "Xem tuyến" },
  trip_date_tbd: { en: "Date TBD", zh: "日期待定", ja: "日付未定", vi: "Chưa có ngày" },
  trip_person: { en: "person", zh: "人", ja: "人", vi: "người" },
  trip_people: { en: "people", zh: "人", ja: "人", vi: "người" },
  status_pending: { en: "Pending", zh: "待处理", ja: "保留中", vi: "Chờ xử lý" },
  status_confirmed: { en: "Confirmed", zh: "已确认", ja: "確認済み", vi: "Đã xác nhận" },
  status_completed: { en: "Completed", zh: "已完成", ja: "完了", vi: "Đã hoàn thành" },
  status_cancelled: { en: "Cancelled", zh: "已取消", ja: "キャンセル", vi: "Đã huỷ" },

  // Chat
  chat_title: { en: "Chat", zh: "聊天", ja: "チャット", vi: "Trò chuyện" },
  chat_tab_guide: { en: "Guide", zh: "向导", ja: "ガイド", vi: "Hướng dẫn" },
  chat_tab_support: {
    en: "Support",
    zh: "客服",
    ja: "サポート",
    vi: "Hỗ trợ",
  },
  chat_empty: {
    en: "No messages yet. Say hi.",
    zh: "暂无消息，打个招呼吧。",
    ja: "まだメッセージはありません。まずはご挨拶を。",
    vi: "Chưa có tin nhắn. Gửi lời chào nhé.",
  },
  chat_compose_placeholder: {
    en: "Write a message…",
    zh: "输入消息…",
    ja: "メッセージを入力…",
    vi: "Nhập tin nhắn…",
  },
  chat_send: { en: "Send", zh: "发送", ja: "送信", vi: "Gửi" },
  chat_need_email: {
    en: "Enter your email to start a conversation.",
    zh: "请输入邮箱开始对话。",
    ja: "会話を始めるにはメールを入力してください。",
    vi: "Nhập email để bắt đầu trò chuyện.",
  },
  chat_email_btn: { en: "Start chatting", zh: "开始聊天", ja: "開始する", vi: "Bắt đầu" },

  // Me
  me_title: { en: "Me", zh: "我", ja: "マイ", vi: "Cá nhân" },
  me_traveler: { en: "Traveler", zh: "旅客", ja: "旅行者", vi: "Du khách" },
  me_traveler_sub: {
    en: "Anonymous booking — trips are linked to your email.",
    zh: "匿名预订 — 行程将与你的邮箱关联。",
    ja: "匿名予約 — 旅程はメールに紐付きます。",
    vi: "Đặt ẩn danh — chuyến đi gắn với email.",
  },
  me_language: { en: "Language", zh: "语言", ja: "言語", vi: "Ngôn ngữ" },
  me_about: { en: "About", zh: "关于", ja: "このアプリ", vi: "Thông tin" },
  me_admin_link: {
    en: "Admin console (ops team) →",
    zh: "管理后台（运营团队）→",
    ja: "管理コンソール（運営）→",
    vi: "Quản trị (đội vận hành) →",
  },
  me_change_language: {
    en: "Change language",
    zh: "更改语言",
    ja: "言語を変更",
    vi: "Đổi ngôn ngữ",
  },

  // Generic
  back: { en: "Back", zh: "返回", ja: "戻る", vi: "Quay lại" },
  saving: { en: "Saving…", zh: "保存中…", ja: "保存中…", vi: "Đang lưu…" },
} as const;

export type StringKey = keyof typeof S;

export function t(lang: Lang, key: StringKey): string {
  const entry = S[key];
  return entry[lang] ?? entry.en;
}

export function getT(lang: Lang) {
  return (key: StringKey) => t(lang, key);
}
