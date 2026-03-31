"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Package, ArrowRight } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductSelectorProps {
  products: Product[]
  onSelect: (products: Product[]) => void
  title: string
  emptyText: string
}

export function ProductSelector({ products, onSelect, title, emptyText }: ProductSelectorProps) {
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

  const handleConfirmSelect = () => {
    const selectedProducts = products.filter((p) => checkedIds.has(p.id))
    if (selectedProducts.length > 0) {
      onSelect(selectedProducts)
      setCheckedIds(new Set())
    }
  }

  const isAllChecked = products.length > 0 && checkedIds.size === products.length
  const isIndeterminate = checkedIds.size > 0 && checkedIds.size < products.length

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5 text-primary" />
            {title}
            {products.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {products.length} 件
              </Badge>
            )}
          </CardTitle>
          {products.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleConfirmSelect}
              disabled={checkedIds.size === 0}
              className="gap-1"
            >
              添加选中
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <Empty className="py-8">
            <EmptyMedia variant="icon">
              <Package className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>{emptyText}</EmptyTitle>
          </Empty>
        ) : (
          <>
            <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
              <Checkbox
                id="select-all"
                checked={isAllChecked}
                data-indeterminate={isIndeterminate}
                onCheckedChange={handleSelectAll}
              />
              <label
                htmlFor="select-all"
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
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50"
                  >
                    <Checkbox
                      id={`product-${product.id}`}
                      checked={checkedIds.has(product.id)}
                      onCheckedChange={(checked) =>
                        handleCheckChange(product.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`product-${product.id}`}
                      className="flex flex-1 cursor-pointer items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.type}</p>
                      </div>
                      <Badge variant="outline" className="font-mono">
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
