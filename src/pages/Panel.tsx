import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

// ============ TYPES ============
type StaffMember = { id: number; username: string; display_name: string; role: string; works_count: number; experience_text: string; avatar_url: string | null; is_active: boolean };
type Order = { id: number; order_number: number; client_nick: string; service_type: string; description: string; deadline: string; tg_username: string; ds_username: string; vk_username: string; status: string; created_at: string; completed_at: string | null; is_archived: boolean; assigned_name: string | null };
type ChatMsg = { id: number; sender_type: string; sender_name: string; message: string; created_at: string };
type StaffMsg = { id: number; sender_name: string; message: string; created_at: string };
type Review = { id: number; client_name: string; rating: number; text: string; tg_username: string; is_approved: boolean; created_at: string };
type GalleryItem = { id: number; image_url: string; title: string; uploaded_by_name: string; created_at: string };

const SERVICE_LABEL: Record<string, string> = {
  custom: "Кастомный скин",
  simple: "Простой скин",
  rebranding: "Ребрендинг",
  bundle: "Комплект скинов",
};

const STATUS_COLOR: Record<string, string> = {
  new: "#4CAF50",
  in_progress: "#FFD700",
  done: "#4DFFDB",
  cancelled: "#ff5555",
};
const STATUS_LABEL: Record<string, string> = {
  new: "Новый",
  in_progress: "В работе",
  done: "Выполнен",
  cancelled: "Отменён",
};

// ============ LOGIN ============
function LoginPage({ onLogin }: { onLogin: (user: StaffMember) => void }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.username || !form.password) { setError("Введи логин и пароль"); return; }
    setLoading(true);
    const res = await api.login(form.username, form.password);
    setLoading(false);
    if (res?.error) { setError(res.error); return; }
    onLogin(res as StaffMember);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#050a05" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-pixel neon-text mb-2" style={{ fontSize: "20px" }}>
            SKIN<span style={{ color: "var(--mc-diamond)" }}>FORGE</span>
          </div>
          <div className="font-pixel" style={{ fontSize: "9px", color: "rgba(200,240,200,0.5)" }}>ПАНЕЛЬ СОТРУДНИКА</div>
        </div>
        <div className="p-6" style={{ background: "#0a140a", border: "2px solid rgba(76,175,80,0.35)" }}>
          <div className="font-pixel text-center mb-6 text-white" style={{ fontSize: "10px" }}>🔐 ВХОД</div>
          <div className="space-y-4">
            <div>
              <label className="font-pixel block mb-1.5" style={{ fontSize: "7px", color: "rgba(200,240,200,0.5)" }}>ЛОГИН</label>
              <input
                className="w-full px-3 py-2.5 font-rubik text-sm bg-transparent outline-none"
                style={{ border: "2px solid rgba(76,175,80,0.35)", color: "#fff" }}
                placeholder="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
            </div>
            <div>
              <label className="font-pixel block mb-1.5" style={{ fontSize: "7px", color: "rgba(200,240,200,0.5)" }}>ПАРОЛЬ</label>
              <input
                type="password"
                className="w-full px-3 py-2.5 font-rubik text-sm bg-transparent outline-none"
                style={{ border: "2px solid rgba(76,175,80,0.35)", color: "#fff" }}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
            </div>
          </div>
          {error && <div className="mt-3 font-rubik text-sm" style={{ color: "#ff5555" }}>{error}</div>}
          <button className="mc-button w-full mt-5" onClick={submit} disabled={loading}>
            {loading ? "ВХОД..." : "ВОЙТИ →"}
          </button>
        </div>
        <div className="text-center mt-4">
          <a href="/" className="font-pixel" style={{ fontSize: "8px", color: "rgba(200,240,200,0.35)" }}>← ГЛАВНАЯ</a>
        </div>
      </div>
    </div>
  );
}

// ============ ORDER CHAT MODAL ============
function OrderChatModal({ order, user, onClose }: { order: Order; user: StaffMember; onClose: () => void }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    api.getChat(order.id).then((data: unknown) => {
      if (Array.isArray(data)) setMsgs(data as ChatMsg[]);
    });
  }, [order.id]);

  useEffect(() => {
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = async () => {
    if (!text.trim()) return;
    await api.sendChat({ order_id: order.id, sender_type: "staff", sender_name: user.display_name, message: text });
    setText("");
    load();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" style={{ background: "rgba(0,0,0,0.9)" }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg flex flex-col" style={{ background: "#070e07", border: "2px solid rgba(76,175,80,0.4)", maxHeight: "90vh" }}>
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid rgba(76,175,80,0.2)" }}>
          <div>
            <div className="font-pixel text-white" style={{ fontSize: "9px" }}>ЧАТ — ЗАКАЗ #{order.order_number}</div>
            <div className="font-rubik text-xs mt-0.5" style={{ color: "rgba(200,240,200,0.5)" }}>{order.client_nick}</div>
          </div>
          <button onClick={onClose} style={{ color: "rgba(200,240,200,0.5)" }}>
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 200, maxHeight: 400 }}>
          {msgs.length === 0 && (
            <div className="text-center font-rubik text-sm py-6" style={{ color: "rgba(200,240,200,0.3)" }}>Нет сообщений</div>
          )}
          {msgs.map((m) => (
            <div key={m.id} className={`flex ${m.sender_type === "staff" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-xs px-3 py-2" style={{
                background: m.sender_type === "staff" ? "rgba(76,175,80,0.2)" : "rgba(77,255,219,0.1)",
                border: `1px solid ${m.sender_type === "staff" ? "rgba(76,175,80,0.4)" : "rgba(77,255,219,0.3)"}`,
              }}>
                <div className="font-pixel mb-1" style={{ fontSize: "7px", color: m.sender_type === "staff" ? "var(--mc-green)" : "var(--mc-diamond)" }}>
                  {m.sender_name}
                </div>
                <div className="font-rubik text-sm" style={{ color: "#fff" }}>{m.message}</div>
                <div className="font-rubik text-xs mt-1" style={{ color: "rgba(200,240,200,0.3)" }}>{m.created_at?.slice(11, 16)}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="px-4 pb-4 flex gap-2" style={{ borderTop: "1px solid rgba(76,175,80,0.15)", paddingTop: 12 }}>
          <input
            className="flex-1 px-3 py-2 font-rubik text-sm bg-transparent outline-none"
            style={{ border: "2px solid rgba(76,175,80,0.3)", color: "#fff" }}
            placeholder="Сообщение..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="mc-button px-4" onClick={send}>→</button>
        </div>
      </div>
    </div>
  );
}

// ============ ORDERS TAB ============
function OrdersTab({ user, archived = false }: { user: StaffMember; archived?: boolean }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [chatOrder, setChatOrder] = useState<Order | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>([]);

  const load = useCallback(() => {
    api.getOrders(archived).then((data: unknown) => {
      if (Array.isArray(data)) setOrders(data as Order[]);
    });
    api.getStaff().then((data: unknown) => {
      if (Array.isArray(data)) setStaff(data as StaffMember[]);
    });
  }, [archived]);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (id: number, status: string) => {
    await api.updateOrder({ id, status });
    load();
  };

  const assign = async (id: number, staffId: number | null) => {
    await api.updateOrder({ id, assigned_to: staffId as number });
    load();
  };

  const del = async (id: number) => {
    if (!confirm("Удалить заказ? Это действие необратимо.")) return;
    await api.cancelOrder(id);
    load();
  };

  const filteredOrders = orders.filter((o) => {
    if (archived) return o.is_archived;
    return !o.is_archived;
  });

  return (
    <div>
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 font-rubik" style={{ color: "rgba(200,240,200,0.35)" }}>
          <div className="text-4xl mb-3">{archived ? "📦" : "📋"}</div>
          <div>{archived ? "Архив пуст" : "Активных заказов нет"}</div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((o) => (
            <div
              key={o.id}
              className="p-4 sm:p-5 transition-all"
              style={{ background: "#0a130a", border: `1px solid ${STATUS_COLOR[o.status] || "rgba(76,175,80,0.2)"}22` }}
            >
              <div className="flex flex-wrap items-start gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-pixel" style={{ fontSize: "9px", color: "var(--mc-green)" }}>#{o.order_number}</span>
                    <span className="font-pixel px-2 py-0.5" style={{ fontSize: "7px", background: `${STATUS_COLOR[o.status] || "#555"}22`, color: STATUS_COLOR[o.status] || "#aaa", border: `1px solid ${STATUS_COLOR[o.status] || "#555"}55` }}>
                      {STATUS_LABEL[o.status] || o.status}
                    </span>
                  </div>
                  <div className="font-rubik font-semibold" style={{ color: "#fff", fontSize: "clamp(13px,1.5vw,15px)" }}>{o.client_nick}</div>
                  <div className="font-rubik text-xs mt-0.5" style={{ color: "rgba(200,240,200,0.5)" }}>{SERVICE_LABEL[o.service_type] || o.service_type}</div>
                </div>
                <div className="ml-auto flex gap-2 flex-wrap">
                  {!archived && (
                    <>
                      <button className="font-pixel px-3 py-1.5" style={{ border: "1px solid rgba(77,255,219,0.4)", color: "var(--mc-diamond)", fontSize: "7px" }} onClick={() => setChatOrder(o)}>
                        💬 ЧАТ
                      </button>
                      <button className="font-pixel px-3 py-1.5" style={{ border: "1px solid rgba(76,175,80,0.4)", color: "rgba(200,240,200,0.6)", fontSize: "7px" }} onClick={() => setSelected(selected?.id === o.id ? null : o)}>
                        {selected?.id === o.id ? "▲ СВЕРНУТЬ" : "▼ ДЕТАЛИ"}
                      </button>
                      <button className="font-pixel px-3 py-1.5" style={{ border: "1px solid rgba(255,85,85,0.4)", color: "#ff7777", fontSize: "7px" }} onClick={() => del(o.id)}>
                        🗑 УДАЛИТЬ
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Contacts */}
              <div className="flex flex-wrap gap-2 mb-2">
                {o.tg_username && <span className="font-rubik text-xs px-2 py-0.5" style={{ background: "rgba(0,136,204,0.15)", border: "1px solid rgba(0,136,204,0.3)", color: "#4fc3f7" }}>💬 {o.tg_username}</span>}
                {o.ds_username && <span className="font-rubik text-xs px-2 py-0.5" style={{ background: "rgba(88,101,242,0.15)", border: "1px solid rgba(88,101,242,0.3)", color: "#9fa8da" }}>🎮 {o.ds_username}</span>}
                {o.vk_username && <span className="font-rubik text-xs px-2 py-0.5" style={{ background: "rgba(76,117,163,0.15)", border: "1px solid rgba(76,117,163,0.3)", color: "#90caf9" }}>🟦 {o.vk_username}</span>}
              </div>

              {selected?.id === o.id && (
                <div className="mt-3 pt-3 space-y-3" style={{ borderTop: "1px solid rgba(76,175,80,0.15)" }}>
                  {o.description && (
                    <div>
                      <span className="font-pixel" style={{ fontSize: "7px", color: "rgba(200,240,200,0.5)" }}>ОПИСАНИЕ: </span>
                      <span className="font-rubik text-sm" style={{ color: "rgba(200,240,200,0.8)" }}>{o.description}</span>
                    </div>
                  )}
                  {o.deadline && (
                    <div>
                      <span className="font-pixel" style={{ fontSize: "7px", color: "rgba(200,240,200,0.5)" }}>СРОК: </span>
                      <span className="font-rubik text-sm" style={{ color: "rgba(200,240,200,0.8)" }}>{o.deadline}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-pixel" style={{ fontSize: "7px", color: "rgba(200,240,200,0.5)" }}>СОЗДАН: </span>
                    <span className="font-rubik text-sm" style={{ color: "rgba(200,240,200,0.6)" }}>{o.created_at?.slice(0, 16).replace("T", " ")}</span>
                  </div>

                  {/* Status */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="font-pixel" style={{ fontSize: "7px", color: "rgba(200,240,200,0.5)", alignSelf: "center" }}>СТАТУС:</span>
                    {["new", "in_progress", "done"].map((s) => (
                      <button
                        key={s}
                        className="font-pixel px-3 py-1"
                        style={{
                          fontSize: "7px",
                          border: `1px solid ${STATUS_COLOR[s]}55`,
                          background: o.status === s ? `${STATUS_COLOR[s]}22` : "transparent",
                          color: STATUS_COLOR[s],
                        }}
                        onClick={() => changeStatus(o.id, s)}
                      >
                        {STATUS_LABEL[s]}
                      </button>
                    ))}
                  </div>

                  {/* Assign */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-pixel" style={{ fontSize: "7px", color: "rgba(200,240,200,0.5)" }}>ИСПОЛНИТЕЛЬ:</span>
                    <select
                      className="px-2 py-1 font-rubik text-xs outline-none cursor-pointer"
                      style={{ background: "#0d150d", border: "1px solid rgba(76,175,80,0.3)", color: "#fff" }}
                      value={staff.find((s) => s.display_name === o.assigned_name)?.id ?? ""}
                      onChange={(e) => assign(o.id, e.target.value ? Number(e.target.value) : null)}
                    >
                      <option value="">Не назначен</option>
                      {staff.filter((s) => s.is_active).map((s) => (
                        <option key={s.id} value={s.id} style={{ background: "#0d150d" }}>{s.display_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {chatOrder && <OrderChatModal order={chatOrder} user={user} onClose={() => setChatOrder(null)} />}
    </div>
  );
}

// ============ STAFF TAB ============
function StaffTab({ user }: { user: StaffMember }) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [form, setForm] = useState({ username: "", password: "", display_name: "", role: "worker", works_count: 0, experience_text: "" });
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = () => {
    api.getStaff().then((data: unknown) => { if (Array.isArray(data)) setStaff(data as StaffMember[]); });
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.username || !form.password || !form.display_name) return;
    setLoading(true);
    await api.addStaff(form);
    setLoading(false);
    setShowAdd(false);
    setForm({ username: "", password: "", display_name: "", role: "worker", works_count: 0, experience_text: "" });
    load();
  };

  const save = async () => {
    if (!editing) return;
    setLoading(true);
    await api.updateStaff({ id: editing.id, display_name: editing.display_name, experience_text: editing.experience_text, works_count: editing.works_count, is_active: editing.is_active });
    setLoading(false);
    setEditing(null);
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Деактивировать сотрудника?")) return;
    await api.removeStaff(id);
    load();
  };

  const isOwner = user.role === "owner";

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="font-pixel text-white" style={{ fontSize: "10px" }}>СОТРУДНИКИ</div>
        {isOwner && (
          <button className="mc-button text-xs" onClick={() => setShowAdd(!showAdd)}>+ ДОБАВИТЬ</button>
        )}
      </div>

      {isOwner && showAdd && (
        <div className="mb-5 p-4" style={{ background: "#0a130a", border: "1px solid rgba(76,175,80,0.3)" }}>
          <div className="font-pixel mb-4 text-white" style={{ fontSize: "9px" }}>НОВЫЙ СОТРУДНИК</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: "username", label: "ЛОГИН", placeholder: "username" },
              { key: "password", label: "ПАРОЛЬ", placeholder: "password" },
              { key: "display_name", label: "ИМЯ", placeholder: "Имя сотрудника" },
              { key: "experience_text", label: "ОПИСАНИЕ", placeholder: "Опыт/должность" },
            ].map((f) => (
              <div key={f.key}>
                <label className="font-pixel block mb-1" style={{ fontSize: "7px", color: "rgba(200,240,200,0.5)" }}>{f.label}</label>
                <input
                  className="w-full px-2.5 py-2 font-rubik text-sm bg-transparent outline-none"
                  style={{ border: "1px solid rgba(76,175,80,0.3)", color: "#fff" }}
                  placeholder={f.placeholder}
                  value={(form as Record<string, string | number>)[f.key] as string}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              </div>
            ))}
            <div>
              <label className="font-pixel block mb-1" style={{ fontSize: "7px", color: "rgba(200,240,200,0.5)" }}>КОЛ-ВО РАБОТ</label>
              <input
                type="number"
                className="w-full px-2.5 py-2 font-rubik text-sm bg-transparent outline-none"
                style={{ border: "1px solid rgba(76,175,80,0.3)", color: "#fff" }}
                value={form.works_count}
                onChange={(e) => setForm({ ...form, works_count: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="mc-button" onClick={add} disabled={loading}>{loading ? "..." : "ДОБАВИТЬ"}</button>
            <button className="font-pixel px-4 py-2" style={{ border: "1px solid rgba(76,175,80,0.2)", color: "rgba(200,240,200,0.5)", fontSize: "8px" }} onClick={() => setShowAdd(false)}>ОТМЕНА</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {staff.map((s) => (
          <div key={s.id} className="p-4" style={{ background: "#0a130a", border: "1px solid rgba(76,175,80,0.2)", opacity: s.is_active ? 1 : 0.5 }}>
            {editing?.id === s.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-pixel block mb-1" style={{ fontSize: "7px", color: "rgba(200,240,200,0.5)" }}>ИМЯ</label>
                    <input className="w-full px-2.5 py-2 font-rubik text-sm bg-transparent outline-none" style={{ border: "1px solid rgba(76,175,80,0.3)", color: "#fff" }} value={editing.display_name} onChange={(e) => setEditing({ ...editing, display_name: e.target.value })} />
                  </div>
                  <div>
                    <label className="font-pixel block mb-1" style={{ fontSize: "7px", color: "rgba(200,240,200,0.5)" }}>ОПИСАНИЕ</label>
                    <input className="w-full px-2.5 py-2 font-rubik text-sm bg-transparent outline-none" style={{ border: "1px solid rgba(76,175,80,0.3)", color: "#fff" }} value={editing.experience_text || ""} onChange={(e) => setEditing({ ...editing, experience_text: e.target.value })} />
                  </div>
                  <div>
                    <label className="font-pixel block mb-1" style={{ fontSize: "7px", color: "rgba(200,240,200,0.5)" }}>КОЛ-ВО РАБОТ</label>
                    <input type="number" className="w-full px-2.5 py-2 font-rubik text-sm bg-transparent outline-none" style={{ border: "1px solid rgba(76,175,80,0.3)", color: "#fff" }} value={editing.works_count} onChange={(e) => setEditing({ ...editing, works_count: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="mc-button text-xs" onClick={save} disabled={loading}>{loading ? "..." : "СОХРАНИТЬ"}</button>
                  <button className="font-pixel px-4 py-2" style={{ border: "1px solid rgba(76,175,80,0.2)", color: "rgba(200,240,200,0.5)", fontSize: "8px" }} onClick={() => setEditing(null)}>ОТМЕНА</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0" style={{ background: "rgba(76,175,80,0.1)", border: "1px solid rgba(76,175,80,0.3)" }}>
                  {s.avatar_url ? <img src={s.avatar_url} alt={s.display_name} className="w-full h-full object-cover" /> : "🎨"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-pixel text-white" style={{ fontSize: "9px" }}>{s.display_name}</div>
                  <div className="font-rubik text-xs mt-0.5" style={{ color: "rgba(200,240,200,0.5)" }}>{s.experience_text}</div>
                  <div className="font-pixel mt-1" style={{ fontSize: "7px", color: s.role === "owner" ? "var(--mc-gold)" : "var(--mc-green)" }}>
                    {s.role === "owner" ? "👑 ВЛАДЕЛЕЦ" : "🎨 СКИНОДЕЛ"} · {s.works_count} работ
                  </div>
                </div>
                {isOwner && s.id !== user.id && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="font-pixel px-3 py-1.5" style={{ border: "1px solid rgba(76,175,80,0.3)", color: "var(--mc-green)", fontSize: "7px" }} onClick={() => setEditing(s)}>✏ ИЗМЕНИТЬ</button>
                    {s.is_active && (
                      <button className="font-pixel px-3 py-1.5" style={{ border: "1px solid rgba(255,85,85,0.3)", color: "#ff7777", fontSize: "7px" }} onClick={() => remove(s.id)}>🗑 УДАЛИТЬ</button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ REVIEWS TAB ============
function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const load = () => {
    api.getReviews(true).then((data: unknown) => { if (Array.isArray(data)) setReviews(data as Review[]); });
  };
  useEffect(() => { load(); }, []);

  const approve = async (id: number, val: boolean) => {
    await api.approveReview(id, val);
    load();
  };

  const pending = reviews.filter((r) => !r.is_approved);
  const approved = reviews.filter((r) => r.is_approved);

  return (
    <div className="space-y-6">
      {/* Pending */}
      <div>
        <div className="font-pixel mb-4" style={{ fontSize: "9px", color: "var(--mc-gold)" }}>⏳ НА ПРОВЕРКЕ ({pending.length})</div>
        {pending.length === 0 ? (
          <div className="font-rubik text-sm py-4" style={{ color: "rgba(200,240,200,0.3)" }}>Нет отзывов на проверке</div>
        ) : pending.map((r) => (
          <div key={r.id} className="p-4 mb-3" style={{ background: "#0d120a", border: "1px solid rgba(255,215,0,0.3)" }}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="font-pixel text-white mb-1" style={{ fontSize: "9px" }}>{r.client_name}</div>
                <div className="flex gap-1 mb-2">{"★".repeat(r.rating).split("").map((s, i) => <span key={i} style={{ color: "var(--mc-gold)" }}>{s}</span>)}</div>
                <p className="font-rubik text-sm" style={{ color: "rgba(200,240,200,0.8)" }}>{r.text}</p>
                {r.tg_username && <div className="font-rubik text-xs mt-1" style={{ color: "rgba(200,240,200,0.4)" }}>@{r.tg_username}</div>}
              </div>
              <div className="flex gap-2">
                <button className="font-pixel px-3 py-1.5" style={{ border: "1px solid rgba(76,175,80,0.5)", color: "var(--mc-green)", fontSize: "7px" }} onClick={() => approve(r.id, true)}>✓ ОДОБРИТЬ</button>
                <button className="font-pixel px-3 py-1.5" style={{ border: "1px solid rgba(255,85,85,0.4)", color: "#ff7777", fontSize: "7px" }} onClick={() => approve(r.id, false)}>✗ ОТКЛОНИТЬ</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Approved */}
      <div>
        <div className="font-pixel mb-4" style={{ fontSize: "9px", color: "var(--mc-green)" }}>✓ ОДОБРЕННЫЕ ({approved.length})</div>
        {approved.length === 0 ? (
          <div className="font-rubik text-sm py-2" style={{ color: "rgba(200,240,200,0.3)" }}>Нет одобренных отзывов</div>
        ) : approved.map((r) => (
          <div key={r.id} className="p-4 mb-3 flex items-start justify-between gap-3 flex-wrap" style={{ background: "#0a130a", border: "1px solid rgba(76,175,80,0.2)" }}>
            <div>
              <div className="font-pixel text-white mb-1" style={{ fontSize: "9px" }}>{r.client_name}</div>
              <div className="flex gap-1 mb-2">{"★".repeat(r.rating).split("").map((s, i) => <span key={i} style={{ color: "var(--mc-gold)" }}>{s}</span>)}</div>
              <p className="font-rubik text-sm" style={{ color: "rgba(200,240,200,0.7)" }}>{r.text}</p>
            </div>
            <button className="font-pixel px-3 py-1.5" style={{ border: "1px solid rgba(255,85,85,0.3)", color: "#ff7777", fontSize: "7px" }} onClick={() => approve(r.id, false)}>СКРЫТЬ</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ GALLERY TAB ============
function GalleryTab({ user }: { user: StaffMember }) {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    api.getGallery().then((data: unknown) => { if (Array.isArray(data)) setGallery((data as GalleryItem[]).filter((g) => g.image_url)); });
  };
  useEffect(() => { load(); }, []);

  const upload = async (file: File) => {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(",")[1];
      await api.uploadPhoto({ image_base64: base64, title: title || "Работа студии", uploaded_by_name: user.display_name });
      setTitle("");
      setUploading(false);
      load();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="mb-5 p-4" style={{ background: "#0a130a", border: "1px solid rgba(76,175,80,0.2)" }}>
        <div className="font-pixel mb-4 text-white" style={{ fontSize: "9px" }}>📸 ЗАГРУЗИТЬ ФОТО</div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="flex-1 px-3 py-2 font-rubik text-sm bg-transparent outline-none"
            style={{ border: "1px solid rgba(76,175,80,0.3)", color: "#fff" }}
            placeholder="Название работы"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="mc-button text-xs" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? "ЗАГРУЗКА..." : "📁 ВЫБРАТЬ ФАЙЛ"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
        </div>
      </div>

      {gallery.length === 0 ? (
        <div className="text-center py-12 font-rubik" style={{ color: "rgba(200,240,200,0.3)" }}>
          <div className="text-4xl mb-3">🖼</div>
          <div>Галерея пуста</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {gallery.map((g) => (
            <div key={g.id} className="relative group" style={{ border: "1px solid rgba(76,175,80,0.2)" }}>
              <img src={g.image_url} alt={g.title || ""} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.7)" }}>
                <div className="font-rubik text-xs text-white mb-1">{g.title}</div>
                <button className="font-pixel px-2 py-1" style={{ border: "1px solid rgba(255,85,85,0.5)", color: "#ff7777", fontSize: "7px" }} onClick={async () => { const delFn = (api as Record<string, (id: number) => Promise<unknown>>).deleteGallery; if (delFn) await delFn(g.id); load(); }}>
                  УДАЛИТЬ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ STAFF CHAT TAB ============
function StaffChatTab({ user }: { user: StaffMember }) {
  const [msgs, setMsgs] = useState<StaffMsg[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    api.getStaffChat().then((data: unknown) => { if (Array.isArray(data)) setMsgs(data as StaffMsg[]); });
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async () => {
    if (!text.trim()) return;
    await api.sendStaffChat({ sender_name: user.display_name, message: text });
    setText("");
    load();
  };

  return (
    <div className="flex flex-col" style={{ height: "60vh" }}>
      <div className="font-pixel mb-4 text-white" style={{ fontSize: "10px" }}>💬 ЧАТ КОМАНДЫ</div>
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
        {msgs.length === 0 && <div className="font-rubik text-sm py-6 text-center" style={{ color: "rgba(200,240,200,0.3)" }}>Нет сообщений</div>}
        {msgs.map((m) => {
          const isMe = m.sender_name === user.display_name;
          return (
            <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className="max-w-xs px-3 py-2" style={{
                background: isMe ? "rgba(76,175,80,0.2)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${isMe ? "rgba(76,175,80,0.4)" : "rgba(255,255,255,0.1)"}`,
              }}>
                <div className="font-pixel mb-1" style={{ fontSize: "7px", color: isMe ? "var(--mc-green)" : "var(--mc-diamond)" }}>{m.sender_name}</div>
                <div className="font-rubik text-sm" style={{ color: "#fff" }}>{m.message}</div>
                <div className="font-rubik text-xs mt-1" style={{ color: "rgba(200,240,200,0.3)" }}>{m.created_at?.slice(11, 16)}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 px-3 py-2.5 font-rubik text-sm bg-transparent outline-none"
          style={{ border: "2px solid rgba(76,175,80,0.3)", color: "#fff" }}
          placeholder="Сообщение команде..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="mc-button px-5" onClick={send}>→</button>
      </div>
    </div>
  );
}

// ============ MAIN PANEL ============
export default function Panel() {
  const [user, setUser] = useState<StaffMember | null>(null);
  const [tab, setTab] = useState<"orders" | "archive" | "staff" | "reviews" | "gallery" | "chat">("orders");

  useEffect(() => {
    const saved = localStorage.getItem("sf_user");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  const handleLogin = (u: StaffMember) => {
    setUser(u);
    localStorage.setItem("sf_user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sf_user");
  };

  if (!user) return <LoginPage onLogin={handleLogin} />;

  const TABS = [
    { key: "orders", label: "📋 ЗАКАЗЫ" },
    { key: "archive", label: "📦 АРХИВ" },
    { key: "reviews", label: "⭐ ОТЗЫВЫ" },
    { key: "chat", label: "💬 ЧАТ КОМАНДЫ" },
    { key: "gallery", label: "🖼 ГАЛЕРЕЯ" },
    ...(user.role === "owner" ? [{ key: "staff", label: "👥 СОТРУДНИКИ" }] : []),
  ];

  return (
    <div className="min-h-screen" style={{ background: "#050a05" }}>
      {/* Top bar */}
      <div className="sticky top-0 z-40" style={{ background: "rgba(5,10,5,0.97)", borderBottom: "1px solid rgba(76,175,80,0.2)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div>
            <div className="font-pixel neon-text" style={{ fontSize: "clamp(10px,2vw,14px)" }}>
              SKIN<span style={{ color: "var(--mc-diamond)" }}>FORGE</span>
              <span className="ml-3" style={{ color: "rgba(200,240,200,0.4)", fontSize: "clamp(7px,1vw,9px)" }}>ПАНЕЛЬ</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <span className="font-pixel" style={{ fontSize: "8px", color: "rgba(200,240,200,0.5)" }}>Привет, </span>
              <span className="font-pixel" style={{ fontSize: "8px", color: "var(--mc-green)" }}>{user.display_name}</span>
            </div>
            <a href="/" className="font-pixel px-3 py-1.5" style={{ border: "1px solid rgba(76,175,80,0.25)", color: "rgba(200,240,200,0.5)", fontSize: "7px" }}>← САЙТ</a>
            <button className="font-pixel px-3 py-1.5" style={{ border: "1px solid rgba(255,85,85,0.3)", color: "#ff7777", fontSize: "7px" }} onClick={logout}>ВЫЙТИ</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto">
          <div className="flex gap-0 min-w-max pb-0">
            {TABS.map((t) => (
              <button
                key={t.key}
                className="font-pixel px-3 sm:px-4 py-2.5 transition-all whitespace-nowrap"
                style={{
                  fontSize: "clamp(7px,1.2vw,9px)",
                  color: tab === t.key ? "var(--mc-green)" : "rgba(200,240,200,0.45)",
                  background: tab === t.key ? "rgba(76,175,80,0.1)" : "transparent",
                  borderBottom: tab === t.key ? "2px solid var(--mc-green)" : "2px solid transparent",
                }}
                onClick={() => setTab(t.key as typeof tab)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {tab === "orders" && <OrdersTab user={user} archived={false} />}
        {tab === "archive" && <OrdersTab user={user} archived={true} />}
        {tab === "reviews" && <ReviewsTab />}
        {tab === "chat" && <StaffChatTab user={user} />}
        {tab === "gallery" && <GalleryTab user={user} />}
        {tab === "staff" && user.role === "owner" && <StaffTab user={user} />}
      </div>
    </div>
  );
}