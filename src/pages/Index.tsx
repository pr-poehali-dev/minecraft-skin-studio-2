import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/9ab0d17f-a8ab-49c0-b650-17a76a1ed4c7/files/90111c5f-a111-4033-9aaf-b8f30d956ad1.jpg";

const FLOATING_PIXELS = ["🟩", "🟫", "💎", "⚔️", "🛡️", "✨", "🟩", "💎"];

const SERVICES = [
  {
    icon: "👤",
    title: "Базовый скин",
    price: "от 149 ₽",
    desc: "Уникальный персонаж по вашему описанию. 64×64 px, совместимо со всеми версиями.",
    color: "var(--mc-green)",
    tag: "Популярное",
  },
  {
    icon: "💎",
    title: "Премиум скин",
    price: "от 349 ₽",
    desc: "Детализированный скин с 3D-слоем, уникальными текстурами и HD-деталями.",
    color: "var(--mc-diamond)",
    tag: "Хит",
  },
  {
    icon: "🛡️",
    title: "Скин + Плащ",
    price: "от 499 ₽",
    desc: "Комплект: скин и анимированный плащ в одном стиле. Полный образ персонажа.",
    color: "var(--mc-gold)",
    tag: "Комплект",
  },
  {
    icon: "👥",
    title: "Командный набор",
    price: "от 999 ₽",
    desc: "Скины для целой команды или клана в едином корпоративном стиле.",
    color: "#FF6B35",
    tag: "Для кланов",
  },
];

const STEPS = [
  { num: "01", title: "Заявка", desc: "Опишите идею персонажа — характер, стиль, цвета, референсы", icon: "📝" },
  { num: "02", title: "Концепт", desc: "Художник создаёт эскиз и согласовывает образ с вами", icon: "🎨" },
  { num: "03", title: "Пикселизация", desc: "Перевод концепта в пиксельный формат Minecraft 64×64", icon: "⚙️" },
  { num: "04", title: "Доставка", desc: "Готовый файл .png + инструкция по установке в течение 24ч", icon: "📦" },
];

const REVIEWS = [
  {
    name: "Стас_Крипер",
    avatar: "🎮",
    text: "Заказал скин рыцаря-вампира — получилось нереально круто! Все в сервере сразу спросили, где брал.",
    stars: 5,
    date: "2 дня назад",
  },
  {
    name: "XxDarkWolfxX",
    avatar: "🐺",
    text: "Быстро, качественно, слушают пожелания. Переделали детали 2 раза без доп. оплаты. Рекомендую!",
    stars: 5,
    date: "5 дней назад",
  },
  {
    name: "CraftMaster2007",
    avatar: "⛏️",
    text: "Заказываю уже третий раз. Каждый раз удивляют — придумывают детали, о которых сам не думал.",
    stars: 5,
    date: "1 неделю назад",
  },
  {
    name: "LunaPixel",
    avatar: "🌙",
    text: "Сделали скин для всего нашего клана (8 человек). Все в едином стиле, смотрится шикарно на сервере!",
    stars: 5,
    date: "2 недели назад",
  },
];

function PixelBlock({ char, delay = 0, x, y }: { char: string; delay?: number; x: number; y: number }) {
  return (
    <div
      className="absolute text-2xl select-none pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animation: `float-pixel ${3 + (x % 2)}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        opacity: 0.4,
        filter: "drop-shadow(0 0 6px rgba(76, 175, 80, 0.8))",
      }}
    >
      {char}
    </div>
  );
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Услуги", href: "#services" },
    { label: "О нас", href: "#about" },
    { label: "Процесс", href: "#process" },
    { label: "Отзывы", href: "#reviews" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(10, 15, 10, 0.95)" : "transparent",
        borderBottom: scrolled ? "2px solid rgba(76, 175, 80, 0.3)" : "none",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-pixel text-xs neon-text tracking-wider">
          PIXEL<span style={{ color: "var(--mc-diamond)" }}>SKIN</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-rubik text-sm font-medium text-green-300 hover:text-white transition-colors relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-mc-green group-hover:w-full transition-all duration-300" />
            </a>
          ))}
          <button className="mc-button">ЗАКАЗАТЬ</button>
        </div>

        <button className="md:hidden" style={{ color: "var(--mc-green)" }} onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "X" : "Menu"} size={24} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-6 py-4 flex flex-col gap-4" style={{ background: "rgba(10, 15, 10, 0.98)" }}>
          {links.map((l) => (
            <a key={l.label} href={l.href} className="font-rubik text-sm font-medium text-green-300" onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
          <button className="mc-button w-full">ЗАКАЗАТЬ</button>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pixel-grid">
      {FLOATING_PIXELS.map((char, i) => (
        <PixelBlock key={i} char={char} delay={i * 0.5} x={5 + (i * 13) % 90} y={10 + (i * 17) % 75} />
      ))}

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${HERO_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(76, 175, 80, 0.12) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 font-pixel text-xs"
          style={{ border: "2px solid var(--mc-green)", color: "var(--mc-green)", boxShadow: "var(--neon-glow-sm)" }}
        >
          <span className="animate-pixel-blink">▶</span>
          СТУДИЯ MINECRAFT СКИНОВ
        </div>

        <h1 className="font-pixel mb-6 animate-slide-up" style={{ fontSize: "clamp(20px, 5vw, 52px)", lineHeight: "1.4", color: "#fff" }}>
          СОЗДАЙ{" "}
          <span className="animate-neon-pulse" style={{ color: "var(--mc-green)" }}>УНИКАЛЬНЫЙ</span>
          <br />
          ОБРАЗ ДЛЯ
          <br />
          <span style={{ color: "var(--mc-diamond)", textShadow: "var(--diamond-glow)" }}>MINECRAFT</span>
        </h1>

        <p
          className="font-rubik text-lg md:text-xl animate-slide-up delay-200"
          style={{ color: "rgba(200, 240, 200, 0.8)", maxWidth: "560px", margin: "0 auto 40px" }}
        >
          Пиксельные скины ручной работы. Твой персонаж — твоя история. Готово за 24 часа.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-400">
          <button className="mc-button px-8 py-4">🎨 ЗАКАЗАТЬ СКИН</button>
          <button
            className="font-pixel text-xs px-8 py-4 transition-all duration-200"
            style={{ border: "3px solid rgba(77, 255, 219, 0.5)", color: "var(--mc-diamond)", background: "transparent" }}
          >
            💎 ПРИМЕРЫ РАБОТ
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto animate-slide-up delay-600">
          {[
            { val: "1200+", label: "скинов создано" },
            { val: "24ч", label: "время выполнения" },
            { val: "98%", label: "довольных игроков" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-pixel text-lg mb-1" style={{ color: "var(--mc-green)" }}>{s.val}</div>
              <div className="font-rubik text-xs" style={{ color: "rgba(200, 240, 200, 0.5)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="font-pixel text-xs" style={{ color: "var(--mc-green)" }}>SCROLL</span>
        <div className="flex flex-col gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2" style={{ background: "var(--mc-green)", animation: `pixel-blink 1s step-end infinite`, animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="py-24 px-6 relative">
      <div className="pixel-divider mb-16" />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="font-pixel text-xs mb-4" style={{ color: "var(--mc-emerald)" }}>⛏ ВЫБЕРИ СВОЙ ПАКЕТ</div>
          <h2 className="font-pixel mb-4" style={{ fontSize: "clamp(16px, 3vw, 32px)", color: "#fff" }}>
            УСЛУГИ <span style={{ color: "var(--mc-green)" }}>СТУДИИ</span>
          </h2>
          <p className="font-rubik text-base" style={{ color: "rgba(200, 240, 200, 0.6)" }}>
            От базового персонажа до полного образа клана
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="relative p-6 group cursor-pointer transition-all duration-300"
              style={{
                background: "var(--bg-card)",
                border: "2px solid rgba(76, 175, 80, 0.3)",
                animation: `slide-up 0.5s ease-out ${i * 0.1}s both`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = s.color;
                el.style.boxShadow = `0 0 20px ${s.color}33`;
                el.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "rgba(76, 175, 80, 0.3)";
                el.style.boxShadow = "none";
                el.style.transform = "translateY(0)";
              }}
            >
              <div className="absolute -top-3 right-4 font-pixel px-3 py-1" style={{ background: s.color, color: "#0a0f0a", fontSize: "8px" }}>
                {s.tag}
              </div>
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="font-pixel text-xs mb-2 text-white">{s.title}</h3>
              <div className="font-pixel text-sm mb-3" style={{ color: s.color }}>{s.price}</div>
              <p className="font-rubik text-sm" style={{ color: "rgba(200, 240, 200, 0.6)", lineHeight: 1.6 }}>{s.desc}</p>
              <button
                className="mt-6 w-full font-pixel py-3 transition-all duration-200"
                style={{ border: `2px solid ${s.color}`, color: s.color, background: "transparent", fontSize: "8px" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.background = s.color; el.style.color = "#0a0f0a"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.background = "transparent"; el.style.color = s.color; }}
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

function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden">
      <div className="pixel-divider mb-16" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 30% 50%, rgba(77, 255, 219, 0.04) 0%, transparent 70%)" }}
      />
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div
            className="w-full aspect-square max-w-md mx-auto relative"
            style={{ background: "var(--bg-card)", border: "3px solid var(--mc-green)", boxShadow: "var(--neon-glow-sm)" }}
          >
            <img src={HERO_IMAGE} alt="Студия скинов" className="w-full h-full object-cover opacity-70" />
            <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: "linear-gradient(transparent, rgba(10, 15, 10, 0.95))" }}>
              <div className="font-pixel text-xs text-center" style={{ color: "var(--mc-green)" }}>PixelSkin Studio © 2024</div>
            </div>
            {[{ top: -6, left: -6 }, { top: -6, right: -6 }, { bottom: -6, left: -6 }, { bottom: -6, right: -6 }].map((pos, i) => (
              <div key={i} className="absolute w-3 h-3" style={{ ...pos, background: "var(--mc-diamond)" }} />
            ))}
          </div>
          <div className="absolute -top-4 -right-4 px-4 py-3 font-pixel" style={{ background: "var(--mc-green)", color: "#0a0f0a", fontSize: "9px", boxShadow: "4px 4px 0 #1a3d10" }}>
            ✓ С 2021 ГОДА
          </div>
          <div className="absolute -bottom-4 -left-4 px-4 py-3 font-pixel" style={{ background: "var(--mc-diamond)", color: "#0a0f0a", fontSize: "9px", boxShadow: "4px 4px 0 #0a6b5e" }}>
            ♦ ТОП СТУДИЯ
          </div>
        </div>

        <div>
          <div className="font-pixel text-xs mb-4" style={{ color: "var(--mc-emerald)" }}>👾 О СТУДИИ</div>
          <h2 className="font-pixel mb-6" style={{ fontSize: "clamp(14px, 2.5vw, 28px)", color: "#fff", lineHeight: 1.5 }}>
            МЫ — ХУДОЖНИКИ,<br />
            <span style={{ color: "var(--mc-green)" }}>КОТОРЫЕ ЖИВУТ</span><br />
            В МАЙНКРАФТЕ
          </h2>
          <div className="space-y-4 mb-8">
            {[
              "Команда из 5 художников-пикселистов с опытом 3+ лет",
              "Каждый скин рисуется вручную — никаких шаблонов и генераторов",
              "Работаем со всеми версиями: Java Edition, Bedrock, PE",
              "Бесплатные правки до полного результата",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-3 h-3 mt-1 flex-shrink-0" style={{ background: "var(--mc-green)", boxShadow: "var(--neon-glow-sm)" }} />
                <p className="font-rubik text-base" style={{ color: "rgba(200, 240, 200, 0.8)" }}>{text}</p>
              </div>
            ))}
          </div>
          <button className="mc-button">💬 НАПИСАТЬ НАМ</button>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section id="process" className="py-24 px-6">
      <div className="pixel-divider mb-16" />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="font-pixel text-xs mb-4" style={{ color: "var(--mc-emerald)" }}>⚙ КАК ЭТО РАБОТАЕТ</div>
          <h2 className="font-pixel" style={{ fontSize: "clamp(16px, 3vw, 32px)", color: "#fff" }}>
            ПРОЦЕСС <span style={{ color: "var(--mc-green)" }}>СОЗДАНИЯ</span>
          </h2>
        </div>

        <div className="relative">
          <div
            className="hidden lg:block absolute top-12 left-0 right-0 h-0.5"
            style={{ background: "repeating-linear-gradient(90deg, var(--mc-green) 0, var(--mc-green) 8px, transparent 8px, transparent 16px)", opacity: 0.4 }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative text-center" style={{ animation: `slide-up 0.5s ease-out ${i * 0.15}s both` }}>
                <div
                  className="w-24 h-24 mx-auto mb-6 flex items-center justify-center relative"
                  style={{ background: "var(--bg-card)", border: "3px solid var(--mc-green)", boxShadow: "var(--neon-glow-sm)" }}
                >
                  <span className="text-3xl">{step.icon}</span>
                  <div className="absolute -top-3 -right-3 w-7 h-7 flex items-center justify-center font-pixel" style={{ background: "var(--mc-green)", color: "#0a0f0a", fontSize: "8px" }}>
                    {step.num}
                  </div>
                </div>
                <h3 className="font-pixel text-xs mb-3 text-white">{step.title}</h3>
                <p className="font-rubik text-sm" style={{ color: "rgba(200, 240, 200, 0.6)", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-20 p-10 text-center relative"
          style={{ background: "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(77, 255, 219, 0.05) 100%)", border: "2px solid rgba(76, 175, 80, 0.4)" }}
        >
          <div className="font-pixel text-xs mb-4" style={{ color: "var(--mc-green)" }}>⚡ ГОТОВ НАЧАТЬ?</div>
          <h3 className="font-pixel mb-6" style={{ fontSize: "clamp(14px, 2vw, 24px)", color: "#fff" }}>ПОЛУЧИ СКИН ЗА 24 ЧАСА</h3>
          <button className="mc-button px-12 py-4">🎮 ЗАКАЗАТЬ СЕЙЧАС</button>
        </div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  return (
    <section id="reviews" className="py-24 px-6">
      <div className="pixel-divider mb-16" />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="font-pixel text-xs mb-4" style={{ color: "var(--mc-emerald)" }}>⭐ ЧТО ГОВОРЯТ ИГРОКИ</div>
          <h2 className="font-pixel" style={{ fontSize: "clamp(16px, 3vw, 32px)", color: "#fff" }}>
            ОТЗЫВЫ <span style={{ color: "var(--mc-green)" }}>КЛИЕНТОВ</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS.map((r, i) => (
            <div
              key={r.name}
              className="p-6 transition-all duration-300"
              style={{ background: "var(--bg-card)", border: "2px solid rgba(76, 175, 80, 0.2)", animation: `slide-up 0.5s ease-out ${i * 0.1}s both` }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "rgba(76, 175, 80, 0.6)"; el.style.boxShadow = "0 0 15px rgba(76, 175, 80, 0.1)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "rgba(76, 175, 80, 0.2)"; el.style.boxShadow = "none"; }}
            >
              <div className="flex gap-1 mb-4">
                {Array(r.stars).fill(null).map((_, si) => (<span key={si} style={{ color: "var(--mc-gold)" }}>★</span>))}
              </div>
              <p className="font-rubik text-base mb-6" style={{ color: "rgba(200, 240, 200, 0.8)", lineHeight: 1.7 }}>"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center text-xl" style={{ background: "rgba(76, 175, 80, 0.15)", border: "2px solid rgba(76, 175, 80, 0.3)" }}>
                  {r.avatar}
                </div>
                <div>
                  <div className="font-pixel text-xs text-white" style={{ fontSize: "9px" }}>{r.name}</div>
                  <div className="font-rubik text-xs mt-1" style={{ color: "rgba(200, 240, 200, 0.4)" }}>{r.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6" style={{ borderTop: "2px solid rgba(76, 175, 80, 0.2)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="pixel-divider mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="font-pixel text-xs mb-4 neon-text">PIXEL<span style={{ color: "var(--mc-diamond)" }}>SKIN</span></div>
            <p className="font-rubik text-sm" style={{ color: "rgba(200, 240, 200, 0.5)" }}>Студия уникальных Minecraft скинов ручной работы с 2021 года</p>
          </div>
          <div>
            <div className="font-pixel text-xs mb-4 text-white" style={{ fontSize: "9px" }}>КОНТАКТЫ</div>
            <div className="space-y-2">
              {["💬 Telegram: @pixelskin", "📧 info@pixelskin.ru", "🎮 Discord: PixelSkin#1234"].map((c) => (
                <div key={c} className="font-rubik text-sm" style={{ color: "rgba(200, 240, 200, 0.5)" }}>{c}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="font-pixel text-xs mb-4 text-white" style={{ fontSize: "9px" }}>РАБОТАЕМ</div>
            <div className="font-rubik text-sm" style={{ color: "rgba(200, 240, 200, 0.5)" }}>
              Пн–Вс: 10:00 – 22:00<br />Без выходных<br />Ответ за 15 минут
            </div>
          </div>
        </div>
        <div className="pixel-divider mb-6" />
        <div className="text-center font-pixel" style={{ fontSize: "8px", color: "rgba(200, 240, 200, 0.3)" }}>
          © 2024 PIXELSKIN STUDIO. ALL RIGHTS RESERVED. MINECRAFT IS NOT AFFILIATED.
        </div>
      </div>
    </footer>
  );
}

export default function Index() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-dark)" }}>
      <NavBar />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <ProcessSection />
      <ReviewsSection />
      <Footer />
    </div>
  );
}
