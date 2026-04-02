"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import type { Product } from "@/lib/types"

interface SelectedProductsProps {
  products: Product[]
  onDeselect: (products: Product[]) => void
  title: string
  emptyText: string
}

export function SelectedProducts({ products, onDeselect, title, emptyText }: SelectedProductsProps) {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())

  const handleCheckChange = (productId: string, checked: boolean) => {
    setCheckedIds((prev) => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(productId)
      } else {
        newSet.delete(productId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (checkedIds.size === products.length) {
      setCheckedIds(new Set())
    } else {
      setCheckedIds(new Set(products.map((p) => p.id)))
    }
  }

  const handleConfirmDeselect = () => {
    const selectedProducts = products.filter((p) => checkedIds.has(p.id))
    if (selectedProducts.length > 0) {
      onDeselect(selectedProducts)
      setCheckedIds(new Set())
    }
  }

  const isAllChecked = products.length > 0 && checkedIds.size === products.length
  const isIndeterminate = checkedIds.size > 0 && checkedIds.size < products.length

  // 计算总成本
  const totalCost = products.reduce((sum, p) => sum + p.cost, 0)

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShoppingCart className="h-5 w-5 text-primary" />
              {title}
              {products.length > 0 && (
                <Badge className="ml-2">
                  {products.length} 件
                </Badge>
              )}
            </CardTitle>
            {products.length > 0 && (
              <p className="text-sm text-muted-foreground">
                总成本: <span className="font-semibold text-primary">¥{totalCost.toLocaleString()}</span>
              </p>
            )}
          </div>
          {products.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleConfirmDeselect}
              disabled={checkedIds.size === 0}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              移除选中
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <Empty className="py-8">
            <EmptyMedia variant="icon">
              <ShoppingCart className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>{emptyText}</EmptyTitle>
          </Empty>
        ) : (
          <>
            <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
              <Checkbox
                id="deselect-all"
                checked={isIndeterminate ? "indeterminate" : isAllChecked}
                onCheckedChange={handleSelectAll}
              />
              <label
                htmlFor="deselect-all"
                className="cursor-pointer text-sm font-medium text-muted-foreground"
              >
                全选 ({checkedIds.size}/{products.length})
              </label>
            </div>
            <ScrollArea className="h-[280px] pr-4">
              <div className="space-y-2">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 rounded-lg border border-primary/20 bg-background p-3 transition-colors hover:bg-muted/50"
                  >
                    <Checkbox
                      id={`selected-${product.id}`}
                      checked={checkedIds.has(product.id)}
                      onCheckedChange={(checked) =>
                        handleCheckChange(product.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`selected-${product.id}`}
                      className="flex flex-1 cursor-pointer items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-foreground">{product.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{product.type}</span>
                          <span>·</span>
                          <span>{product.brand}</span>
                          <span>·</span>
                          <span>{product.country}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="font-mono shrink-0">
                        ¥{product.cost.toLocaleString()}
                      </Badge>
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  )
}
