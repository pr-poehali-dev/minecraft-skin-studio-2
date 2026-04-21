import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

// ======================== КОНСТАНТЫ ========================
const SERVICES = [
  { id: "custom", label: "Кастомный скин", price: "100 ₽", icon: "🎨", desc: "Полностью уникальный скин по твоему описанию — любой образ, любой стиль" },
  { id: "simple", label: "Простой скин", price: "50 ₽", icon: "👤", desc: "Базовый аккуратный скин — быстро и качественно" },
  { id: "rebranding", label: "Ребрендинг", price: "60 ₽", icon: "🔄", desc: "Переделаем и улучшим твой существующий скин" },
  { id: "bundle", label: "Комплект скинов", price: "от 150 ₽", icon: "👥", desc: "3 и более скинов в одном стиле — для клана или команды" },
];

const STATUS_LABEL: Record<string, string> = {
  new: "Новый",
  in_progress: "В работе",
  done: "Выполнен",
  cancelled: "Отменён",
};

// ======================== NAVBAR ========================
function NavBar({ onOrderClick }: { onOrderClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(8,12,8,0.97)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(76,175,80,0.25)" : "none",
        backdropFilter: scrolled ? "blur(14px)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <a href="#" className="font-pixel text-xs sm:text-sm neon-text">
          SKIN<span style={{ color: "var(--mc-diamond)" }}>FORGE</span>
        </a>
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {[["Услуги", "#services"], ["О нас", "#about"], ["Команда", "#team"], ["Отзывы", "#reviews"]].map(([l, h]) => (
            <a key={l} href={h} className="font-rubik text-sm font-medium text-green-300 hover:text-white transition-colors">
              {l}
            </a>
          ))}
          <button className="mc-button" onClick={onOrderClick}>ЗАКАЗАТЬ</button>
          <a href="/panel" className="font-pixel text-xs px-3 py-2 transition-all" style={{ border: "1px solid rgba(76,175,80,0.4)", color: "rgba(76,175,80,0.7)", fontSize: "8px" }}>
            ПАНЕЛЬ
          </a>
        </div>
        <button className="md:hidden" style={{ color: "var(--mc-green)" }} onClick={() => setMenu(!menu)}>
          <Icon name={menu ? "X" : "Menu"} size={22} />
        </button>
      </div>
      {menu && (
        <div className="md:hidden px-6 py-4 flex flex-col gap-4" style={{ background: "rgba(8,12,8,0.98)", borderTop: "1px solid rgba(76,175,80,0.2)" }}>
          {[["Услуги", "#services"], ["О нас", "#about"], ["Команда", "#team"], ["Отзывы", "#reviews"]].map(([l, h]) => (
            <a key={l} href={h} className="font-rubik text-sm text-green-300" onClick={() => setMenu(false)}>{l}</a>
          ))}
          <button className="mc-button" onClick={() => { setMenu(false); onOrderClick(); }}>ЗАКАЗАТЬ СКИН</button>
          <a href="/panel" className="font-pixel text-center py-2" style={{ border: "1px solid rgba(76,175,80,0.3)", color: "rgba(76,175,80,0.7)", fontSize: "9px" }}>ПАНЕЛЬ СОТРУДНИКА</a>
        </div>
      )}
    </nav>
  );
}

// ======================== HERO ========================
function HeroSection({ onOrderClick, clientCount }: { onOrderClick: () => void; clientCount: number }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(180deg, #050a05 0%, #080f08 60%, #0a140a 100%)" }}>
      {/* Animated pixel dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: 6 + (i % 3) * 4,
              height: 6 + (i % 3) * 4,
              background: i % 3 === 0 ? "var(--mc-green)" : i % 3 === 1 ? "var(--mc-diamond)" : "var(--mc-gold)",
              left: `${(i * 371) % 100}%`,
              top: `${(i * 197) % 100}%`,
              opacity: 0.12 + (i % 4) * 0.06,
              animation: `float-pixel ${4 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.4) % 3}s`,
            }}
          />
        ))}
        {/* Grid lines */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(76,175,80,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(76,175,80,0.04) 1px,transparent 1px)",
          backgroundSize: "48px 48px"
        }} />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-3 sm:px-4 py-2 font-pixel" style={{ border: "2px solid var(--mc-green)", color: "var(--mc-green)", boxShadow: "var(--neon-glow-sm)", fontSize: "clamp(7px,1.5vw,10px)" }}>
          <span className="animate-pixel-blink">▶</span>
          СТУДИЯ СКИНОВ MINECRAFT · С 2026 ГОДА
        </div>

        <h1 className="font-pixel mb-4 sm:mb-6 animate-slide-up" style={{ fontSize: "clamp(22px,5vw,56px)", lineHeight: 1.3, color: "#fff" }}>
          SKIN<span style={{ color: "var(--mc-green)" }}>FORGE</span>
          <br />
          <span style={{ fontSize: "clamp(12px,2.5vw,24px)", color: "rgba(200,240,200,0.7)" }}>СТУДИЯ СКИНОВ</span>
        </h1>

        <p className="font-rubik mb-8 sm:mb-10 animate-slide-up delay-200" style={{ fontSize: "clamp(14px,2vw,18px)", color: "rgba(200,240,200,0.75)", maxWidth: 520, margin: "0 auto 32px" }}>
          Создаём уникальные скины для Minecraft вручную. Твой персонаж — твоя личность в игре.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-slide-up delay-400">
          <button className="mc-button px-6 sm:px-10 py-3 sm:py-4 text-xs sm:text-sm" onClick={onOrderClick}>
            🎨 ЗАКАЗАТЬ СКИН
          </button>
          <a href="#services" className="font-pixel px-6 sm:px-10 py-3 sm:py-4 transition-all duration-200 text-center" style={{ border: "2px solid rgba(77,255,219,0.5)", color: "var(--mc-diamond)", background: "transparent", fontSize: "clamp(8px,1.5vw,10px)" }}>
            💎 ЦЕНЫ И УСЛУГИ
          </a>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 max-w-sm sm:max-w-md mx-auto animate-slide-up delay-600">
          {[
            { val: clientCount + "+", label: "клиентов" },
            { val: "24ч", label: "время выполнения" },
            { val: "100%", label: "ручная работа" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-pixel mb-1 animate-neon-pulse" style={{ fontSize: "clamp(14px,3vw,22px)", color: "var(--mc-green)" }}>{s.val}</div>
              <div className="font-rubik text-xs" style={{ color: "rgba(200,240,200,0.45)", fontSize: "clamp(9px,1.5vw,11px)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ======================== SERVICES ========================
function ServicesSection({ onOrderClick }: { onOrderClick: (service?: string) => void }) {
  return (
    <section id="services" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="pixel-divider mb-10 sm:mb-16" />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <div className="font-pixel text-xs mb-3" style={{ color: "var(--mc-emerald)", fontSize: "9px" }}>⛏ ВЫБЕРИ ПАКЕТ</div>
          <h2 className="font-pixel" style={{ fontSize: "clamp(16px,3vw,30px)", color: "#fff" }}>
            УСЛУГИ <span style={{ color: "var(--mc-green)" }}>И ЦЕНЫ</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {SERVICES.map((s, i) => (
            <div
              key={s.id}
              className="relative p-5 sm:p-6 cursor-pointer transition-all duration-300 group"
              style={{ background: "#0d150d", border: "2px solid rgba(76,175,80,0.25)", animation: `slide-up 0.5s ease-out ${i * 0.08}s both` }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "var(--mc-green)"; el.style.boxShadow = "0 0 20px rgba(76,175,80,0.2)"; el.style.transform = "translateY(-4px)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "rgba(76,175,80,0.25)"; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}
            >
              <div className="text-3xl sm:text-4xl mb-3">{s.icon}</div>
              <h3 className="font-pixel text-white mb-2" style={{ fontSize: "clamp(8px,1.5vw,11px)" }}>{s.label}</h3>
              <div className="font-pixel mb-3" style={{ fontSize: "clamp(13px,2vw,18px)", color: "var(--mc-green)" }}>{s.price}</div>
              <p className="font-rubik text-sm mb-5" style={{ color: "rgba(200,240,200,0.6)", lineHeight: 1.6, fontSize: "clamp(12px,1.5vw,14px)" }}>{s.desc}</p>
              <button
                className="w-full font-pixel py-2.5 transition-all duration-200"
                style={{ border: "2px solid var(--mc-green)", color: "var(--mc-green)", background: "transparent", fontSize: "8px" }}
                onClick={() => onOrderClick(s.id)}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.background = "var(--mc-green)"; el.style.color = "#050a05"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.background = "transparent"; el.style.color = "var(--mc-green)"; }}
              >
                ЗАКАЗАТЬ →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ======================== ABOUT ========================
function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="pixel-divider mb-10 sm:mb-16" />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <div className="font-pixel text-xs mb-3" style={{ color: "var(--mc-emerald)", fontSize: "9px" }}>👾 О СТУДИИ</div>
            <h2 className="font-pixel mb-5 sm:mb-6" style={{ fontSize: "clamp(14px,2.5vw,28px)", color: "#fff", lineHeight: 1.5 }}>
              SKINFORGE —<br />
              <span style={{ color: "var(--mc-green)" }}>ТВОЯ СТУДИЯ</span><br />
              СКИНОВ
            </h2>
            <p className="font-rubik mb-5" style={{ fontSize: "clamp(13px,1.5vw,16px)", color: "rgba(200,240,200,0.8)", lineHeight: 1.8 }}>
              Мы работаем с 2026 года и создаём уникальные скины для Minecraft вручную. Никаких генераторов — только живой художник, который слышит тебя.
            </p>
            <div className="space-y-3 mb-7">
              {[
                "Каждый скин рисуется вручную — без шаблонов",
                "Работаем с Java Edition, Bedrock, PE",
                "Правки до полного результата бесплатно",
                "Ответ в течение 15 минут",
                "Работаем с 2026 года",
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 mt-1.5 flex-shrink-0" style={{ background: "var(--mc-green)", boxShadow: "var(--neon-glow-sm)" }} />
                  <p className="font-rubik" style={{ fontSize: "clamp(12px,1.5vw,15px)", color: "rgba(200,240,200,0.8)" }}>{t}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="https://t.me/Xezze228" target="_blank" rel="noopener noreferrer" className="mc-button text-xs">💬 TELEGRAM</a>
              <a href="https://discord.com/users/xezze228" target="_blank" rel="noopener noreferrer" className="font-pixel py-3 px-5 transition-all" style={{ border: "2px solid rgba(77,255,219,0.5)", color: "var(--mc-diamond)", background: "transparent", fontSize: "8px" }}>
                🎮 DISCORD
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { icon: "🎨", val: "100%", label: "Ручная работа" },
                { icon: "⚡", val: "24ч", label: "Срок выполнения" },
                { icon: "🛡️", val: "∞", label: "Правки бесплатно" },
                { icon: "💎", val: "2026", label: "Год основания" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 sm:p-6 text-center"
                  style={{ background: "#0d150d", border: "2px solid rgba(76,175,80,0.2)" }}
                >
                  <div className="text-2xl sm:text-3xl mb-2">{item.icon}</div>
                  <div className="font-pixel mb-1" style={{ fontSize: "clamp(14px,2vw,20px)", color: "var(--mc-green)" }}>{item.val}</div>
                  <div className="font-rubik" style={{ fontSize: "clamp(10px,1.2vw,12px)", color: "rgba(200,240,200,0.5)" }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type StaffMember = { id: number; username: string; display_name: string; role: string; works_count: number; experience_text: string; avatar_url: string | null; is_active: boolean };
type Review = { id: number; client_name: string; rating: number; text: string; tg_username: string; is_approved: boolean; created_at: string };

// ======================== TEAM ========================
function TeamSection() {
  const [staff, setStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
    api.getStaff().then((data: unknown) => {
      if (Array.isArray(data)) setStaff((data as StaffMember[]).filter((s) => s.is_active && s.role !== "owner"));
    });
  }, []);

  if (staff.length === 0) return null;

  return (
    <section id="team" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="pixel-divider mb-10 sm:mb-16" />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <div className="font-pixel text-xs mb-3" style={{ color: "var(--mc-emerald)", fontSize: "9px" }}>👾 НАШИ МАСТЕРА</div>
          <h2 className="font-pixel" style={{ fontSize: "clamp(16px,3vw,30px)", color: "#fff" }}>
            КОМАНДА <span style={{ color: "var(--mc-green)" }}>СТУДИИ</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {staff.map((s) => (
            <div
              key={s.id}
              className="p-5 sm:p-6 text-center transition-all duration-300"
              style={{ background: "#0d150d", border: "2px solid rgba(76,175,80,0.2)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(76,175,80,0.6)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(76,175,80,0.2)"; }}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 flex items-center justify-center text-2xl sm:text-3xl" style={{ background: "rgba(76,175,80,0.1)", border: "2px solid rgba(76,175,80,0.3)" }}>
                {s.avatar_url ? <img src={s.avatar_url} alt={s.display_name} className="w-full h-full object-cover" /> : "🎨"}
              </div>
              <div className="font-pixel text-white mb-1" style={{ fontSize: "clamp(9px,1.5vw,11px)" }}>{s.display_name}</div>
              <div className="font-pixel mb-2" style={{ fontSize: "8px", color: "var(--mc-green)" }}>СКИНОДЕЛ</div>
              <div className="font-rubik text-xs mb-1" style={{ color: "rgba(200,240,200,0.5)" }}>{s.experience_text}</div>
              <div className="font-pixel" style={{ fontSize: "8px", color: "var(--mc-diamond)" }}>Работ: {s.works_count}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ======================== REVIEWS ========================
function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ client_name: "", rating: 5, text: "", tg_username: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    api.getReviews().then((data: unknown) => { if (Array.isArray(data)) setReviews(data as Review[]); });
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    setError("");
    if (!form.client_name.trim()) { setError("Введи имя"); return; }
    if (form.text.trim().length < 10) { setError("Отзыв слишком короткий (минимум 10 символов)"); return; }
    setSending(true);
    const res = await api.addReview(form);
    setSending(false);
    if (res?.error) { setError(res.error); return; }
    setSent(true);
    setShowForm(false);
    setForm({ client_name: "", rating: 5, text: "", tg_username: "" });
  };

  return (
    <section id="reviews" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="pixel-divider mb-10 sm:mb-16" />
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-14 gap-4">
          <div>
            <div className="font-pixel text-xs mb-2" style={{ color: "var(--mc-emerald)", fontSize: "9px" }}>⭐ МНЕНИЯ ИГРОКОВ</div>
            <h2 className="font-pixel" style={{ fontSize: "clamp(16px,3vw,30px)", color: "#fff" }}>
              ОТЗЫВЫ <span style={{ color: "var(--mc-green)" }}>КЛИЕНТОВ</span>
            </h2>
          </div>
          <button
            className="mc-button text-xs self-start sm:self-auto"
            onClick={() => setShowForm(!showForm)}
          >
            + ОСТАВИТЬ ОТЗЫВ
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 p-5 sm:p-6" style={{ background: "#0d150d", border: "2px solid rgba(76,175,80,0.4)" }}>
            <div className="font-pixel text-xs mb-5 text-white" style={{ fontSize: "10px" }}>НОВЫЙ ОТЗЫВ</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="font-pixel block mb-2" style={{ fontSize: "8px", color: "rgba(200,240,200,0.6)" }}>ИМЯ / НИК *</label>
                <input
                  className="w-full px-3 py-2.5 font-rubik text-sm bg-transparent outline-none"
                  style={{ border: "2px solid rgba(76,175,80,0.4)", color: "#fff" }}
                  value={form.client_name}
                  onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                  placeholder="Твой ник"
                />
              </div>
              <div>
                <label className="font-pixel block mb-2" style={{ fontSize: "8px", color: "rgba(200,240,200,0.6)" }}>TELEGRAM (необязательно)</label>
                <input
                  className="w-full px-3 py-2.5 font-rubik text-sm bg-transparent outline-none"
                  style={{ border: "2px solid rgba(76,175,80,0.4)", color: "#fff" }}
                  value={form.tg_username}
                  onChange={(e) => setForm({ ...form, tg_username: e.target.value })}
                  placeholder="@username"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="font-pixel block mb-2" style={{ fontSize: "8px", color: "rgba(200,240,200,0.6)" }}>ОЦЕНКА</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    className="text-2xl transition-all"
                    style={{ opacity: n <= form.rating ? 1 : 0.3 }}
                    onClick={() => setForm({ ...form, rating: n })}
                  >★</button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="font-pixel block mb-2" style={{ fontSize: "8px", color: "rgba(200,240,200,0.6)" }}>ОТЗЫВ *</label>
              <textarea
                className="w-full px-3 py-2.5 font-rubik text-sm bg-transparent outline-none resize-none"
                style={{ border: "2px solid rgba(76,175,80,0.4)", color: "#fff", minHeight: 80 }}
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder="Расскажи о своём опыте (минимум 10 символов)"
              />
            </div>
            {error && <div className="font-rubik text-sm mb-4" style={{ color: "#ff5555" }}>{error}</div>}
            {sent && <div className="font-rubik text-sm mb-4" style={{ color: "var(--mc-green)" }}>✓ Отзыв отправлен на проверку!</div>}
            <div className="flex gap-3">
              <button className="mc-button" onClick={submit} disabled={sending}>{sending ? "ОТПРАВКА..." : "ОТПРАВИТЬ"}</button>
              <button className="font-pixel px-4 py-2.5" style={{ border: "1px solid rgba(76,175,80,0.3)", color: "rgba(200,240,200,0.5)", fontSize: "8px" }} onClick={() => setShowForm(false)}>ОТМЕНА</button>
            </div>
          </div>
        )}

        {sent && !showForm && (
          <div className="mb-6 p-4 font-rubik text-sm" style={{ background: "rgba(76,175,80,0.1)", border: "1px solid var(--mc-green)", color: "var(--mc-green)" }}>
            ✓ Твой отзыв отправлен на проверку и появится после одобрения администратором.
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-12 font-rubik" style={{ color: "rgba(200,240,200,0.4)" }}>
            <div className="text-4xl mb-3">💬</div>
            <div>Пока нет одобренных отзывов. Будь первым!</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="p-5 sm:p-6 transition-all duration-300"
                style={{ background: "#0d150d", border: "2px solid rgba(76,175,80,0.2)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(76,175,80,0.5)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(76,175,80,0.2)"; }}
              >
                <div className="flex gap-1 mb-3">
                  {Array(r.rating).fill(null).map((_, i) => (
                    <span key={i} style={{ color: "var(--mc-gold)", fontSize: 18 }}>★</span>
                  ))}
                  {Array(5 - r.rating).fill(null).map((_, i) => (
                    <span key={i} style={{ color: "rgba(200,200,200,0.2)", fontSize: 18 }}>★</span>
                  ))}
                </div>
                <p className="font-rubik mb-4" style={{ color: "rgba(200,240,200,0.85)", lineHeight: 1.7, fontSize: "clamp(13px,1.5vw,15px)" }}>
                  "{r.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center text-lg" style={{ background: "rgba(76,175,80,0.1)", border: "2px solid rgba(76,175,80,0.3)" }}>
                    🎮
                  </div>
                  <div>
                    <div className="font-pixel text-white" style={{ fontSize: "9px" }}>{r.client_name}</div>
                    {r.tg_username && <div className="font-rubik text-xs mt-0.5" style={{ color: "rgba(200,240,200,0.4)" }}>@{r.tg_username.replace("@", "")}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ======================== ORDER MODAL ========================
function OrderModal({ open, onClose, defaultService }: { open: boolean; onClose: () => void; defaultService?: string }) {
  const [form, setForm] = useState({
    client_nick: "",
    service_type: defaultService || "",
    description: "",
    deadline: "",
    tg_username: "",
    ds_username: "",
    vk_username: "",
  });
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderNum, setOrderNum] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      setForm((f) => ({ ...f, service_type: defaultService || "" }));
      setStep("form");
      setError("");
    }
  }, [open, defaultService]);

  if (!open) return null;

  const submit = async () => {
    setError("");
    if (!form.client_nick.trim()) { setError("Введи ник/имя"); return; }
    if (!form.service_type) { setError("Выбери услугу"); return; }
    if (!form.tg_username && !form.ds_username && !form.vk_username) {
      setError("Укажи хотя бы один контакт для связи");
      return;
    }
    setLoading(true);
    const res = await api.createOrder(form);
    setLoading(false);
    if (res?.error) { setError(res.error); return; }
    setOrderNum(res.order_number);
    setStep("success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" style={{ background: "rgba(0,0,0,0.85)" }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="w-full max-w-lg max-h-screen overflow-y-auto"
        style={{ background: "#070e07", border: "2px solid rgba(76,175,80,0.5)", boxShadow: "0 0 40px rgba(76,175,80,0.15)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4" style={{ borderBottom: "1px solid rgba(76,175,80,0.2)" }}>
          <div className="font-pixel text-white" style={{ fontSize: "clamp(9px,1.5vw,11px)" }}>
            {step === "form" ? "🎨 НОВЫЙ ЗАКАЗ" : "✅ ЗАКАЗ ПРИНЯТ"}
          </div>
          <button onClick={onClose} style={{ color: "rgba(200,240,200,0.5)" }}>
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {step === "success" ? (
            <div className="text-center py-4">
              <div className="text-4xl sm:text-5xl mb-4">🎉</div>
              <div className="font-pixel text-white mb-3" style={{ fontSize: "clamp(10px,1.5vw,13px)" }}>ЗАКАЗ #{orderNum} ПРИНЯТ!</div>
              <p className="font-rubik mb-6" style={{ color: "rgba(200,240,200,0.7)", fontSize: "clamp(12px,1.5vw,14px)" }}>
                Мы свяжемся с тобой через указанный контакт в течение 15 минут!
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <a href="https://t.me/Xezze228" target="_blank" rel="noopener noreferrer" className="mc-button text-xs">💬 НАПИСАТЬ В TG</a>
                <button className="font-pixel px-5 py-2.5" style={{ border: "1px solid rgba(76,175,80,0.3)", color: "rgba(200,240,200,0.6)", fontSize: "8px" }} onClick={onClose}>ЗАКРЫТЬ</button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {/* Nick */}
                <div>
                  <label className="font-pixel block mb-1.5" style={{ fontSize: "8px", color: "rgba(200,240,200,0.6)" }}>НИК / ИМЯ *</label>
                  <input
                    className="w-full px-3 py-2.5 font-rubik text-sm bg-transparent outline-none"
                    style={{ border: "2px solid rgba(76,175,80,0.35)", color: "#fff" }}
                    placeholder="Твой игровой ник"
                    value={form.client_nick}
                    onChange={(e) => setForm({ ...form, client_nick: e.target.value })}
                  />
                </div>

                {/* Service */}
                <div>
                  <label className="font-pixel block mb-1.5" style={{ fontSize: "8px", color: "rgba(200,240,200,0.6)" }}>ВЫБОР УСЛУГИ *</label>
                  <select
                    className="w-full px-3 py-2.5 font-rubik text-sm outline-none cursor-pointer"
                    style={{ background: "#0d150d", border: "2px solid rgba(76,175,80,0.35)", color: form.service_type ? "#fff" : "rgba(200,240,200,0.4)" }}
                    value={form.service_type}
                    onChange={(e) => setForm({ ...form, service_type: e.target.value })}
                  >
                    <option value="" disabled>Выбери услугу...</option>
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id} style={{ background: "#0d150d" }}>{s.label} — {s.price}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="font-pixel block mb-1.5" style={{ fontSize: "8px", color: "rgba(200,240,200,0.6)" }}>ОПИСАНИЕ СКИНА</label>
                  <textarea
                    className="w-full px-3 py-2.5 font-rubik text-sm bg-transparent outline-none resize-none"
                    style={{ border: "2px solid rgba(76,175,80,0.35)", color: "#fff", minHeight: 72 }}
                    placeholder="Опиши образ: стиль, цвета, особенности..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                {/* Deadline */}
                <div>
                  <label className="font-pixel block mb-1.5" style={{ fontSize: "8px", color: "rgba(200,240,200,0.6)" }}>ЖЕЛАЕМЫЕ СРОКИ</label>
                  <input
                    className="w-full px-3 py-2.5 font-rubik text-sm bg-transparent outline-none"
                    style={{ border: "2px solid rgba(76,175,80,0.35)", color: "#fff" }}
                    placeholder="Например: до 25 апреля"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  />
                </div>

                <div className="font-pixel text-xs pt-2" style={{ fontSize: "8px", color: "rgba(200,240,200,0.5)" }}>КОНТАКТ ДЛЯ СВЯЗИ (хотя бы один)</div>

                {/* Contacts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-pixel block mb-1.5" style={{ fontSize: "7px", color: "rgba(200,240,200,0.5)" }}>TELEGRAM</label>
                    <input
                      className="w-full px-2.5 py-2 font-rubik text-sm bg-transparent outline-none"
                      style={{ border: "2px solid rgba(76,175,80,0.3)", color: "#fff" }}
                      placeholder="@username"
                      value={form.tg_username}
                      onChange={(e) => setForm({ ...form, tg_username: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="font-pixel block mb-1.5" style={{ fontSize: "7px", color: "rgba(200,240,200,0.5)" }}>DISCORD</label>
                    <input
                      className="w-full px-2.5 py-2 font-rubik text-sm bg-transparent outline-none"
                      style={{ border: "2px solid rgba(76,175,80,0.3)", color: "#fff" }}
                      placeholder="@username"
                      value={form.ds_username}
                      onChange={(e) => setForm({ ...form, ds_username: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="font-pixel block mb-1.5" style={{ fontSize: "7px", color: "rgba(200,240,200,0.5)" }}>ВКонтакте</label>
                    <input
                      className="w-full px-2.5 py-2 font-rubik text-sm bg-transparent outline-none"
                      style={{ border: "2px solid rgba(76,175,80,0.3)", color: "#fff" }}
                      placeholder="vk.com/id..."
                      value={form.vk_username}
                      onChange={(e) => setForm({ ...form, vk_username: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {error && <div className="mt-4 font-rubik text-sm" style={{ color: "#ff5555" }}>{error}</div>}

              <div className="flex gap-3 mt-6">
                <button className="mc-button flex-1" onClick={submit} disabled={loading}>
                  {loading ? "ОТПРАВКА..." : "ЗАКАЗАТЬ →"}
                </button>
                <button className="font-pixel px-4 py-2.5" style={{ border: "1px solid rgba(76,175,80,0.25)", color: "rgba(200,240,200,0.5)", fontSize: "8px" }} onClick={onClose}>
                  ОТМЕНА
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ======================== FOOTER ========================
function Footer({ onOrderClick }: { onOrderClick: () => void }) {
  return (
    <footer className="py-10 sm:py-14 px-4 sm:px-6" style={{ borderTop: "1px solid rgba(76,175,80,0.2)" }}>
      <div className="pixel-divider mb-8" />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="font-pixel text-xs mb-3 neon-text" style={{ fontSize: "14px" }}>
              SKIN<span style={{ color: "var(--mc-diamond)" }}>FORGE</span>
            </div>
            <p className="font-rubik text-sm" style={{ color: "rgba(200,240,200,0.5)", lineHeight: 1.7 }}>
              Студия Minecraft скинов ручной работы.<br />Работаем с 2026 года.
            </p>
          </div>
          <div>
            <div className="font-pixel mb-3 text-white" style={{ fontSize: "9px" }}>КОНТАКТЫ</div>
            <div className="space-y-2">
              <a href="https://t.me/Xezze228" target="_blank" rel="noopener noreferrer" className="block font-rubik text-sm hover:text-green-300 transition-colors" style={{ color: "rgba(200,240,200,0.55)" }}>
                💬 Telegram: @Xezze228
              </a>
              <a href="https://discord.com/users/xezze228" target="_blank" rel="noopener noreferrer" className="block font-rubik text-sm hover:text-green-300 transition-colors" style={{ color: "rgba(200,240,200,0.55)" }}>
                🎮 Discord: @xezze228
              </a>
            </div>
          </div>
          <div>
            <div className="font-pixel mb-3 text-white" style={{ fontSize: "9px" }}>РЕЖИМ РАБОТЫ</div>
            <div className="font-rubik text-sm" style={{ color: "rgba(200,240,200,0.55)", lineHeight: 1.8 }}>
              Пн–Вс: 10:00 – 22:00<br />
              Ответ за 15 минут<br />
              Без выходных
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button className="mc-button self-start" onClick={onOrderClick}>🎨 ЗАКАЗАТЬ СКИН</button>
          <div className="font-pixel" style={{ fontSize: "7px", color: "rgba(200,240,200,0.25)" }}>
            © 2026 SKINFORGE STUDIO. MINECRAFT NOT AFFILIATED.
          </div>
        </div>
      </div>
    </footer>
  );
}

// ======================== MAIN ========================
export default function Index() {
  const [orderOpen, setOrderOpen] = useState(false);
  const [defaultService, setDefaultService] = useState<string | undefined>();
  const [clientCount, setClientCount] = useState(100);

  useEffect(() => {
    api.getCounters().then((data: unknown) => {
      const d = data as Record<string, number>;
      if (d?.clients) setClientCount(d.clients);
    });
  }, []);

  const openOrder = (service?: string) => {
    setDefaultService(service);
    setOrderOpen(true);
  };

  return (
    <div className="min-h-screen" style={{ background: "#050a05" }}>
      <NavBar onOrderClick={() => openOrder()} />
      <HeroSection onOrderClick={() => openOrder()} clientCount={clientCount} />
      <ServicesSection onOrderClick={openOrder} />
      <AboutSection />
      <TeamSection />
      <ReviewsSection />
      <Footer onOrderClick={() => openOrder()} />
      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} defaultService={defaultService} />
    </div>
  );
}