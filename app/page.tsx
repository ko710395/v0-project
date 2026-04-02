"use client"

import { useState } from "react"
import { ProductSelector } from "@/components/product-selector"
import { SelectedProducts } from "@/components/selected-products"
import { OutboundForm } from "@/components/outbound-form"
import { OutboundHistory } from "@/components/outbound-history"
import type { Product, OutboundRecord } from "@/lib/types"

// 测试用例数据 - 产品名使用邮箱形式
const initialProducts: Product[] = [
  { id: "1", name: "john.doe@gmail.com", type: "自加ID", brand: "Google", country: "美国", cost: 150 },
  { id: "2", name: "alice.smith@outlook.com", type: "链接单", brand: "Microsoft", country: "美国", cost: 200 },
  { id: "3", name: "zhang.wei@qq.com", type: "自加ID", brand: "腾讯", country: "中国", cost: 80 },
  { id: "4", name: "tanaka.yuki@yahoo.co.jp", type: "链接单", brand: "Yahoo", country: "日本", cost: 180 },
  { id: "5", name: "kim.soo@naver.com", type: "自加ID", brand: "Naver", country: "韩国", cost: 120 },
  { id: "6", name: "maria.garcia@icloud.com", type: "链接单", brand: "Apple", country: "美国", cost: 250 },
  { id: "7", name: "li.ming@163.com", type: "自加ID", brand: "网易", country: "中国", cost: 90 },
  { id: "8", name: "david.wilson@proton.me", type: "链接单", brand: "Proton", country: "瑞士", cost: 300 },
  { id: "9", name: "sakura.hana@docomo.ne.jp", type: "自加ID", brand: "Docomo", country: "日本", cost: 160 },
  { id: "10", name: "emma.brown@hotmail.com", type: "链接单", brand: "Microsoft", country: "英国", cost: 180 },
  { id: "11", name: "wang.fang@sina.com", type: "自加ID", brand: "新浪", country: "中国", cost: 70 },
  { id: "12", name: "park.jimin@kakao.com", type: "链接单", brand: "Kakao", country: "韩国", cost: 140 },
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
  const handleSubmit = (formData: { 
    sellingPrice: number
    exchangeRate: number
    outboundType: "出库" | "折损"
    remark: string
  }) => {
    if (selectedProducts.length === 0) return

    const newRecords: OutboundRecord[] = selectedProducts.map((product) => ({
      id: `${product.id}-${Date.now()}`,
      productName: product.name,
      productType: product.type,
      productBrand: product.brand,
      productCountry: product.country,
      cost: product.cost,
      sellingPrice: formData.sellingPrice,
      exchangeRate: formData.exchangeRate,
      outboundType: formData.outboundType,
      outboundTime: new Date().toLocaleString("zh-CN"),
      remark: formData.remark || undefined,
      status: "有效" as const,
    }))

    setOutboundRecords((prev) => [...newRecords, ...prev])
    setSelectedProducts([])
  }

  // 撤回出库记录
  const handleRevoke = (recordId: string) => {
    setOutboundRecords((prev) =>
      prev.map((record) =>
        record.id === recordId ? { ...record, status: "已撤回" as const } : record
      )
    )
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
          totalCost={selectedProducts.reduce((sum, p) => sum + p.cost, 0)}
        />

        {/* 下部分：出库记录列表 */}
        <OutboundHistory records={outboundRecords} onRevoke={handleRevoke} />
      </div>
    </main>
  )
}
