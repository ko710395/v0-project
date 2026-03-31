"use client"

import { useState } from "react"
import { ProductSelector } from "@/components/product-selector"
import { SelectedProducts } from "@/components/selected-products"
import { OutboundForm } from "@/components/outbound-form"
import { OutboundHistory } from "@/components/outbound-history"
import type { Product, OutboundRecord } from "@/lib/types"

// 测试用例数据
const initialProducts: Product[] = [
  { id: "1", name: "iPhone 15 Pro", type: "手机", cost: 6999 },
  { id: "2", name: "MacBook Pro 14", type: "笔记本电脑", cost: 14999 },
  { id: "3", name: "AirPods Pro 2", type: "耳机", cost: 1899 },
  { id: "4", name: "iPad Air", type: "平板电脑", cost: 4799 },
  { id: "5", name: "Apple Watch Ultra", type: "智能手表", cost: 6499 },
  { id: "6", name: "Sony WH-1000XM5", type: "耳机", cost: 2499 },
  { id: "7", name: "Samsung Galaxy S24", type: "手机", cost: 5999 },
  { id: "8", name: "Dell XPS 15", type: "笔记本电脑", cost: 12999 },
  { id: "9", name: "Nintendo Switch", type: "游戏机", cost: 2099 },
  { id: "10", name: "Kindle Paperwhite", type: "电子书阅读器", cost: 999 },
]

export default function OutboundPage() {
  const [availableProducts, setAvailableProducts] = useState<Product[]>(initialProducts)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [outboundRecords, setOutboundRecords] = useState<OutboundRecord[]>([])

  // 从可选列表选择产品
  const handleSelectProducts = (products: Product[]) => {
    setSelectedProducts((prev) => [...prev, ...products])
    setAvailableProducts((prev) =>
      prev.filter((p) => !products.some((selected) => selected.id === p.id))
    )
  }

  // 从已选列表移除产品（反选）
  const handleDeselectProducts = (products: Product[]) => {
    setAvailableProducts((prev) => [...prev, ...products])
    setSelectedProducts((prev) =>
      prev.filter((p) => !products.some((deselected) => deselected.id === p.id))
    )
  }

  // 提交出库
  const handleSubmit = (formData: { sellingPrice: number; exchangeRate: number; outboundType: "出库" | "折损" }) => {
    if (selectedProducts.length === 0) return

    const newRecords: OutboundRecord[] = selectedProducts.map((product) => ({
      id: `${product.id}-${Date.now()}`,
      productName: product.name,
      productType: product.type,
      cost: product.cost,
      sellingPrice: formData.sellingPrice,
      exchangeRate: formData.exchangeRate,
      outboundType: formData.outboundType,
      outboundTime: new Date().toLocaleString("zh-CN"),
    }))

    setOutboundRecords((prev) => [...newRecords, ...prev])
    setSelectedProducts([])
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-foreground text-balance">产品出库管理</h1>

        {/* 上部分：产品选择区域 */}
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          {/* 左上角：可选产品 */}
          <ProductSelector
            products={availableProducts}
            onSelect={handleSelectProducts}
            title="可选产品"
            emptyText="暂无可选产品"
          />

          {/* 右上角：已选产品（反选） */}
          <SelectedProducts
            products={selectedProducts}
            onDeselect={handleDeselectProducts}
            title="已选产品"
            emptyText="请从左侧选择产品"
          />
        </div>

        {/* 中间：出库表单 */}
        <OutboundForm
          onSubmit={handleSubmit}
          disabled={selectedProducts.length === 0}
          selectedCount={selectedProducts.length}
        />

        {/* 下部分：出库记录列表 */}
        <OutboundHistory records={outboundRecords} />
      </div>
    </main>
  )
}
