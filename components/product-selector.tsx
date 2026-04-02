"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Package, ArrowRight, Search, X } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductSelectorProps {
  products: Product[]
  onSelect: (products: Product[]) => void
  title: string
  emptyText: string
}

export function ProductSelector({ products, onSelect, title, emptyText }: ProductSelectorProps) {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBrand, setFilterBrand] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterCountry, setFilterCountry] = useState<string>("all")

  // 获取所有可用的筛选选项
  const filterOptions = useMemo(() => {
    const brands = [...new Set(products.map((p) => p.brand))].sort()
    const types = [...new Set(products.map((p) => p.type))].sort()
    const countries = [...new Set(products.map((p) => p.country))].sort()
    return { brands, types, countries }
  }, [products])

  // 筛选后的产品列表
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesBrand = filterBrand === "all" || product.brand === filterBrand
      const matchesType = filterType === "all" || product.type === filterType
      const matchesCountry = filterCountry === "all" || product.country === filterCountry
      return matchesSearch && matchesBrand && matchesType && matchesCountry
    })
  }, [products, searchQuery, filterBrand, filterType, filterCountry])

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
    if (checkedIds.size === filteredProducts.length) {
      setCheckedIds(new Set())
    } else {
      setCheckedIds(new Set(filteredProducts.map((p) => p.id)))
    }
  }

  const handleConfirmSelect = () => {
    const selectedProducts = products.filter((p) => checkedIds.has(p.id))
    if (selectedProducts.length > 0) {
      onSelect(selectedProducts)
      setCheckedIds(new Set())
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setFilterBrand("all")
    setFilterType("all")
    setFilterCountry("all")
  }

  const hasActiveFilters = searchQuery || filterBrand !== "all" || filterType !== "all" || filterCountry !== "all"

  const isAllChecked = filteredProducts.length > 0 && checkedIds.size === filteredProducts.length
  const isIndeterminate = checkedIds.size > 0 && checkedIds.size < filteredProducts.length

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5 text-primary" />
            {title}
            {products.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {filteredProducts.length}/{products.length} 件
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
            {/* 搜索栏 */}
            <div className="mb-3 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索产品名（邮箱）..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* 筛选器 */}
            <div className="mb-3 flex flex-wrap gap-2">
              <Select value={filterBrand} onValueChange={setFilterBrand}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="品牌" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部品牌</SelectItem>
                  {filterOptions.brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  {filterOptions.types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="国家" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部国家</SelectItem>
                  {filterOptions.countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                  <X className="h-4 w-4" />
                  清除筛选
                </Button>
              )}
            </div>

            <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
              <Checkbox
                id="select-all"
                checked={isIndeterminate ? "indeterminate" : isAllChecked}
                onCheckedChange={handleSelectAll}
              />
              <label
                htmlFor="select-all"
                className="cursor-pointer text-sm font-medium text-muted-foreground"
              >
                全选 ({checkedIds.size}/{filteredProducts.length})
              </label>
            </div>

            <ScrollArea className="h-[240px] pr-4">
              {filteredProducts.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  没有匹配的产品
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredProducts.map((product) => (
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
                        className="flex flex-1 cursor-pointer items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.type}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className="text-xs">
                            {product.brand}
                          </Badge>
                          <Badge variant="outline" className="font-mono">
                            ¥{product.cost.toLocaleString()}
                          </Badge>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  )
}
