import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { resolveRole } from "./roles";

const statusValidator = v.union(v.literal("pending"), v.literal("needs_info"), v.literal("approved"), v.literal("rejected"));

async function currentUser(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("سجّل الدخول بالبريد الإلكتروني أولاً");
  const user = await ctx.db.get(userId);
  return { userId, user };
}

export const submit = mutation({
  args: {
    companyName: v.string(), contactName: v.string(), phone: v.string(),
    city: v.string(), address: v.optional(v.string()), routes: v.string(),
    commercialRegistrationNumber: v.optional(v.string()),
    licenseNumber: v.optional(v.string()), notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, user } = await currentUser(ctx);
    const email = (user?.email ?? "").trim().toLowerCase();
    if (!email || !email.includes("@")) throw new Error("يلزم تسجيل الدخول ببريد إلكتروني موثّق");
    const required = [args.companyName, args.contactName, args.phone, args.city, args.routes];
    if (required.some((value) => !value.trim())) throw new Error("أكمل الحقول المطلوبة");
    const duplicate = await ctx.db.query("companyRegistrationRequests").withIndex("by_email", (q: any) => q.eq("email", email)).collect();
    if (duplicate.some((item: any) => item.status === "pending" || item.status === "needs_info")) {
      throw new Error("لديك طلب تسجيل قيد المراجعة بالفعل");
    }
    const now = Date.now();
    return await ctx.db.insert("companyRegistrationRequests", {
      ...args,
      companyName: args.companyName.trim(),
      contactName: args.contactName.trim(),
      phone: args.phone.trim(),
      email,
      city: args.city.trim(),
      address: args.address?.trim() || undefined,
      routes: args.routes.trim(),
      commercialRegistrationNumber: args.commercialRegistrationNumber?.trim() || undefined,
      licenseNumber: args.licenseNumber?.trim() || undefined,
      notes: args.notes?.trim() || undefined,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const mine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const user = await ctx.db.get(userId);
    const email = (user?.email ?? "").trim().toLowerCase();
    if (!email) return [];
    return await ctx.db.query("companyRegistrationRequests").withIndex("by_email", (q) => q.eq("email", email)).collect();
  },
});

export const listForOwner = query({
  args: {},
  handler: async (ctx) => {
    const { userId, user } = await currentUser(ctx);
    if ((await resolveRole(ctx, user?.email, user?.role)).role !== "owner") throw new Error("هذه الصفحة للمالك فقط");
    return await ctx.db.query("companyRegistrationRequests").collect();
  },
});

export const markViewed = mutation({
  args: { id: v.id("companyRegistrationRequests") },
  handler: async (ctx, { id }) => {
    const { userId, user } = await currentUser(ctx);
    if ((await resolveRole(ctx, user?.email, user?.role)).role !== "owner") throw new Error("غير مصرح");
    const item = await ctx.db.get(id);
    if (!item) throw new Error("الطلب غير موجود");
    if (item.status === "pending") await ctx.db.patch(id, { updatedAt: Date.now() });
    return true;
  },
});

export const review = mutation({
  args: {
    id: v.id("companyRegistrationRequests"),
    decision: v.union(v.literal("needs_info"), v.literal("rejected"), v.literal("approved")),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, user } = await currentUser(ctx);
    if ((await resolveRole(ctx, user?.email, user?.role)).role !== "owner") throw new Error("هذه العملية للمالك فقط");
    const application = await ctx.db.get(args.id);
    if (!application) throw new Error("الطلب غير موجود");
    if (application.status === "approved") throw new Error("تم اعتماد هذا الطلب مسبقاً");
    const now = Date.now();
    let companySlug: string | undefined;
    if (args.decision === "approved") {
      const baseSlug = application.companyName.toLowerCase()
        .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "transport-company";
      companySlug = baseSlug;
      let suffix = 2;
      while (await ctx.db.query("companies").withIndex("by_slug", (q) => q.eq("slug", companySlug!)).first()) {
        companySlug = `${baseSlug}-${suffix++}`;
      }
      await ctx.db.insert("companies", {
        slug: companySlug,
        name: application.companyName,
        base: application.city,
        routes: application.routes,
        emails: [application.email],
        status: "active",
        address: application.address,
        contactPhones: [{ number: application.phone, label: "التواصل الرئيسي", active: true }],
      });
    }
    await ctx.db.patch(args.id, {
      status: args.decision,
      updatedAt: now,
      reviewedAt: now,
      reviewedBy: userId,
      reviewNote: args.note?.trim() || undefined,
      ...(companySlug ? { companySlug } : {}),
    });
    return { success: true, companySlug };
  },
});
