"use client";

import { useState } from "react";
import type { Order, CartItem } from "@/lib/types";

interface OrderTableProps {
  orders: Order[];
}

export default function OrderTable({ orders }: OrderTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-tortoise/10 shadow-sm px-6 py-16 text-center text-tortoise/40 text-sm">
        Aucune commande
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-tortoise/10 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-tortoise/50 uppercase tracking-wider text-xs border-b border-tortoise/10">
              <th className="px-5 py-3 w-8"></th>
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Client</th>
              <th className="px-5 py-3 hidden sm:table-cell">Email</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3 hidden md:table-cell">Statut</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => {
              const expanded = expandedId === order.id;
              return (
                <OrderRow
                  key={order.id}
                  order={order}
                  expanded={expanded}
                  onToggle={() => toggle(order.id)}
                  striped={i % 2 === 1}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrderRow({
  order,
  expanded,
  onToggle,
  striped,
}: {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
  striped: boolean;
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className={`border-b border-tortoise/5 cursor-pointer hover:bg-cloud/50 transition-colors ${
          striped ? "bg-cloud/30" : ""
        }`}
      >
        <td className="px-5 py-3 text-tortoise/30">
          <svg
            className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </td>
        <td className="px-5 py-3 font-mono text-xs text-tortoise/60">
          {order.id.slice(0, 8)}
        </td>
        <td className="px-5 py-3 font-medium">{order.customer_name}</td>
        <td className="px-5 py-3 hidden sm:table-cell text-tortoise/60">
          {order.customer_email}
        </td>
        <td className="px-5 py-3 font-medium">
          {order.total.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
          })}
        </td>
        <td className="px-5 py-3 hidden md:table-cell">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            {order.status === "confirmed" ? "Confirmée" : order.status}
          </span>
        </td>
        <td className="px-5 py-3 text-tortoise/60">
          {new Date(order.created_at).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={7} className="px-5 py-4 bg-cloud/50 border-b border-tortoise/10">
            <div className="ml-8">
              <p className="text-xs font-bold uppercase tracking-wider text-tortoise/40 mb-3">
                Articles de la commande
              </p>
              <div className="space-y-2">
                {order.items.map((item: CartItem, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 border border-tortoise/5 text-sm"
                  >
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-tortoise/40 ml-2">
                        {item.color && `${item.color}`}
                        {item.size && ` / ${item.size}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-tortoise/60">
                      <span>x{item.quantity}</span>
                      <span className="font-medium text-tortoise">
                        {item.price.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {order.customer_address && (
                <p className="mt-3 text-xs text-tortoise/40">
                  Adresse : {order.customer_address}
                </p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
