"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FileOutput, Trash2, Send, Info } from "lucide-react"

interface OutboundFormProps {
  onSubmit: (data: { 
    sellingPrice: number
    exchangeRate: number
    outboundType: "出库" | "折损"
    remark: string
  }) => void
  disabled: boolean
  selectedCount: number
  totalCost: number
}

export function OutboundForm({ onSubmit, disabled, selectedCount, totalCost }: OutboundFormProps) {
  const [sellingPrice, setSellingPrice] = useState("")
  const [exchangeRate, setExchangeRate] = useState("1.00")
  const [outboundType, setOutboundType] = useState<"出库" | "折损">("出库")
  const [remark, setRemark] = useState("")

  const handleSubmit = () => {
    const price = parseFloat(sellingPrice)
    const rate = parseFloat(exchangeRate)

    if (isNaN(price) || price < 0) {
      alert("请输入有效的售价")
      return
    }

    if (isNaN(rate) || rate <= 0) {
      alert("请输入有效的汇率")
      return
    }

    onSubmit({
      sellingPrice: price,
      exchangeRate: rate,
      outboundType,
      remark: remark.trim(),
    })

    // 重置表单
    setSellingPrice("")
    setExchangeRate("1.00")
    setOutboundType("出库")
    setRemark("")
  }

  return (
    <Card className="mb-6 border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileOutput className="h-5 w-5 text-primary" />
            出库信息
          </CardTitle>
          {selectedCount > 0 && (
            <div className="flex items-center gap-3">
              <Badge variant="secondary">
                已选择 {selectedCount} 件产品
              </Badge>
              <Badge variant="outline">
                总成本: ¥{totalCost.toLocaleString()}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap items-end gap-6">
            <FieldGroup className="flex-1 min-w-[200px]">
              <Field>
                <FieldLabel htmlFor="selling-price" className="flex items-center gap-1">
                  售价 (¥)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>该售价是包含所选的所有产品的总售价</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FieldLabel>
                <Input
                  id="selling-price"
                  type="number"
                  placeholder="请输入售价"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </Field>
            </FieldGroup>

            <FieldGroup className="flex-1 min-w-[200px]">
              <Field>
                <FieldLabel htmlFor="exchange-rate">汇率</FieldLabel>
                <Input
                  id="exchange-rate"
                  type="number"
                  placeholder="请输入汇率"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </Field>
            </FieldGroup>

            <FieldGroup className="flex-1 min-w-[200px]">
              <Field>
                <FieldLabel>出库类型</FieldLabel>
                <RadioGroup
                  value={outboundType}
                  onValueChange={(value) => setOutboundType(value as "出库" | "折损")}
                  className="flex gap-6 pt-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="出库" id="type-outbound" />
                    <Label htmlFor="type-outbound" className="flex cursor-pointer items-center gap-1.5">
                      <Send className="h-4 w-4 text-green-600" />
                      出库
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="折损" id="type-loss" />
                    <Label htmlFor="type-loss" className="flex cursor-pointer items-center gap-1.5">
                      <Trash2 className="h-4 w-4 text-destructive" />
                      折损
                    </Label>
                  </div>
                </RadioGroup>
              </Field>
            </FieldGroup>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="remark">备注（选填）</FieldLabel>
              <Textarea
                id="remark"
                placeholder="请输入备注信息..."
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="resize-none"
                rows={2}
              />
            </Field>
          </FieldGroup>

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={disabled}
              size="lg"
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              提交出库
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
