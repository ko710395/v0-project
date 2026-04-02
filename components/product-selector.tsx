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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Package, ArrowRight, Search, X, Tag, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
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
  const [filterTags, setFilterTags] = useState<Set<string>>(new Set())
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false)

  // 获取所有可用的筛选选项
  const filterOptions = useMemo(() => {
    const brands = [...new Set(products.map((p) => p.brand))].sort()
    const types = [...new Set(products.map((p) => p.type))].sort()
    const countries = [...new Set(products.map((p) => p.country))].sort()
    const tags = [...new Set(products.flatMap((p) => p.tags ?? []))].sort()
    return { brands, types, countries, tags }
  }, [products])

  // 筛选后的产品列表
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesBrand = filterBrand === "all" || product.brand === filterBrand
      const matchesType = filterType === "all" || product.type === filterType
      const matchesCountry = filterCountry === "all" || product.country === filterCountry
      const matchesTags =
        filterTags.size === 0 || [...filterTags].some((tag) => (product.tags ?? []).includes(tag))
      return matchesSearch && matchesBrand && matchesType && matchesCountry && matchesTags
    })
  }, [products, searchQuery, filterBrand, filterType, filterCountry, filterTags])

  const handleCheckChange = (productId: string, checked: boolean) => {
    setCheckedIds((prev) => {
      const newSet = new Set(prev)
      if (checked) newSet.add(productId)
      else newSet.delete(productId)
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

  const toggleTag = (tag: string) => {
    setFilterTags((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }

  const clearFilters = () => {
    setSearchQuery("")
    setFilterBrand("all")
    setFilterType("all")
    setFilterCountry("all")
    setFilterTags(new Set())
  }

  const hasActiveFilters =
    searchQuery ||
    filterBrand !== "all" ||
    filterType !== "all" ||
    filterCountry !== "all" ||
    filterTags.size > 0

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
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
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
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="品牌" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部品牌</SelectItem>
                  {filterOptions.brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  {filterOptions.types.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="国家" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部国家</SelectItem>
                  {filterOptions.countries.map((country) => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 标签多选 */}
              <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-9 gap-1.5 px-3 text-sm font-normal",
                      filterTags.size > 0 && "border-primary text-primary"
                    )}
                  >
                    <Tag className="h-3.5 w-3.5" />
                    标签
                    {filterTags.size > 0 && (
                      <Badge variant="secondary" className="h-4 px-1 text-xs">
                        {filterTags.size}
                      </Badge>
                    )}
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-2" align="start">
                  <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">选择标签（可多选）</p>
                  <div className="space-y-1">
                    {filterOptions.tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-muted"
                        onClick={() => toggleTag(tag)}
                      >
                        <Checkbox
                          checked={filterTags.has(tag)}
                          onCheckedChange={() => toggleTag(tag)}
                          id={`tag-filter-${tag}`}
                        />
                        <label
                          htmlFor={`tag-filter-${tag}`}
                          className="cursor-pointer text-sm"
                        >
                          {tag}
                        </label>
                      </div>
                    ))}
                  </div>
                  {filterTags.size > 0 && (
                    <div className="mt-2 border-t border-border pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => setFilterTags(new Set())}
                      >
                        清除标签筛选
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 h-9">
                  <X className="h-4 w-4" />
                  清除全部
                </Button>
              )}
            </div>

            {/* 已选标签展示 */}
            {filterTags.size > 0 && (
              <div className="mb-3 flex flex-wrap gap-1">
                {[...filterTags].map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="gap-1 cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}

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
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  没有匹配的产品
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50"
                    >
                      <Checkbox
                        id={`product-${product.id}`}
                        checked={checkedIds.has(product.id)}
                        onCheckedChange={(checked) =>
                          handleCheckChange(product.id, checked as boolean)
                        }
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={`product-${product.id}`}
                        className="flex flex-1 cursor-pointer items-start justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.type}</p>
                          {(product.tags ?? []).length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {(product.tags ?? []).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="h-4 gap-0.5 px-1 text-[10px]"
                                >
                                  <Tag className="h-2.5 w-2.5" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <Badge variant="outline" className="text-xs">
                            {product.brand}
                          </Badge>
                          <Badge variant="outline" className="font-mono text-xs">
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
