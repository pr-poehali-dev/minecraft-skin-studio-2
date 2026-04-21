const URLS = {
  gallery: "https://functions.poehali.dev/044099ab-4e08-4a87-b665-5172e3e57a68",
  reviews: "https://functions.poehali.dev/69fcc234-dd2c-44df-83fe-5b5c95460c82",
  orders: "https://functions.poehali.dev/d67bfd49-dd5e-408d-b141-e199704fa6bc",
  api: "https://functions.poehali.dev/f99f16b4-a679-4727-994c-52fd26f2ee7e",
  staff: "https://functions.poehali.dev/eacdcb58-8394-41d0-9597-8982d1ffaef1",
};

async function req(url: string, method = "GET", body?: object) {
  const opts: RequestInit = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export const api = {
  // Orders
  getOrders: (archived = false) => req(`${URLS.orders}/?archived=${archived}`),
  createOrder: (data: object) => req(`${URLS.orders}/`, "POST", data),
  updateOrder: (data: object) => req(`${URLS.orders}/`, "PUT", data),
  cancelOrder: (id: number) => req(`${URLS.orders}/`, "DELETE", { id }),

  // Reviews
  getReviews: (all = false) => req(`${URLS.reviews}/${all ? "?all=true" : ""}`),
  addReview: (data: object) => req(`${URLS.reviews}/`, "POST", data),
  approveReview: (id: number, approved: boolean) => req(`${URLS.reviews}/`, "PUT", { id, is_approved: approved }),

  // Staff
  getStaff: () => req(`${URLS.staff}/`),
  login: (username: string, password: string) => req(`${URLS.staff}/login`, "POST", { username, password }),
  addStaff: (data: object) => req(`${URLS.staff}/`, "POST", data),
  updateStaff: (data: object) => req(`${URLS.staff}/`, "PUT", data),
  removeStaff: (id: number) => req(`${URLS.staff}/`, "DELETE", { id }),

  // Gallery
  getGallery: () => req(`${URLS.gallery}/`),
  uploadPhoto: (data: object) => req(`${URLS.gallery}/`, "POST", data),

  // Chat (order)
  getChat: (orderId: number) => req(`${URLS.api}/chat?order_id=${orderId}`),
  sendChat: (data: object) => req(`${URLS.api}/chat`, "POST", data),

  // Staff chat
  getStaffChat: () => req(`${URLS.api}/staff-chat`),
  sendStaffChat: (data: object) => req(`${URLS.api}/staff-chat`, "POST", data),

  // Counters
  getCounters: () => req(`${URLS.api}/`),
};
