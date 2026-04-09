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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FileOutput, Trash2, Send, Info, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// 微信群组测试数据
const WECHAT_GROUPS = [
  "邮箱出货群-01",
  "邮箱出货群-02",
  "谷歌邮箱专区群",
  "雅虎邮箱专区群",
  "QQ邮箱专区群",
  "精品邮箱VIP群",
  "微软邮箱批发群",
  "韩国邮箱交流群",
  "日本邮箱专线群",
]

interface OutboundFormProps {
  onSubmit: (data: {
    sellingPrice: number
    exchangeRate: number
    outboundType: "出库" | "折损"
    wechatGroup: string
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
  const [wechatGroup, setWechatGroup] = useState("")
  const [remark, setRemark] = useState("")

  const isLoss = outboundType === "折损"

  const handleSubmit = () => {
    if (!isLoss) {
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
      if (!wechatGroup) {
        alert("请选择出库群")
        return
    }
    }
    if (isLoss && !remark) {
      alert("折损时请输入备注")
      return
    }

    onSubmit({
      sellingPrice: isLoss ? 0 : parseFloat(sellingPrice),
      exchangeRate: isLoss ? 1 : parseFloat(exchangeRate),
      outboundType,
      wechatGroup,
      remark: remark.trim(),
    })

    setSellingPrice("")
    setExchangeRate("1.00")
    setOutboundType("出库")
    setWechatGroup("")
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
              <Badge variant="secondary">已选择 {selectedCount} 件产品</Badge>
              <Badge variant="outline">总成本: ¥ {totalCost.toLocaleString()}</Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 第一行：出库类型 + 出库群 */}
          <div className="flex flex-wrap items-end gap-4">
            {/* 出库类型 */}
            <FieldGroup className="flex-1 min-w-[140px]">
              <Field>
                <FieldLabel>出库类型</FieldLabel>
                <RadioGroup
                  value={outboundType}
                  onValueChange={(value) => {
                    setOutboundType(value as "出库" | "折损")
                    if (value === "折损") setWechatGroup("")
                  }}
                  className="flex gap-4 h-9 items-center"
                >
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="出库" id="type-outbound" className="h-4 w-4" />
                    <Label
                      htmlFor="type-outbound"
                      className="flex cursor-pointer items-center gap-1 text-sm"
                    >
                      <Send className="h-3.5 w-3.5 text-green-600" />
                      出库
                    </Label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="折损" id="type-loss" className="h-4 w-4" />
                    <Label
                      htmlFor="type-loss"
                      className="flex cursor-pointer items-center gap-1 text-sm"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      折损
                    </Label>
                  </div>
                </RadioGroup>
              </Field>
            </FieldGroup>

            {/* 出库群（必填，折损时禁用） */}
            <FieldGroup className="flex-1 min-w-[140px]">
              <Field>
                <FieldLabel
                  htmlFor="wechat-group"
                  className={cn("flex items-center gap-1", isLoss && "text-muted-foreground")}
                >
                  <MessageCircle className="h-3.5 w-3.5 text-green-500" />
                  出库群
                  {!isLoss && <span className="text-destructive text-xs">*</span>}
                </FieldLabel>
                <Select
                  value={wechatGroup}
                  onValueChange={setWechatGroup}
                  disabled={isLoss}
                >
                  <SelectTrigger
                    id="wechat-group"
                    className={cn(
                      !wechatGroup && "text-muted-foreground",
                      isLoss && "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    <SelectValue placeholder={isLoss ? "折损无需选择" : "选择微信群组"} />
                  </SelectTrigger>
                  <SelectContent>
                    {WECHAT_GROUPS.map((group) => (
                      <SelectItem key={group} value={group}>
                        <span className="flex items-center gap-1.5">
                          <MessageCircle className="h-3.5 w-3.5 text-green-500" />
                          {group}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </div>


          {/* 第二行：售价、汇率 */}
          <div className="flex flex-wrap items-end gap-4">
            {/* 售价 */}
            <FieldGroup className="flex-1 min-w-[140px]">
              <Field>
                <FieldLabel
                  htmlFor="selling-price"
                  className={cn("flex items-center gap-1", isLoss && "text-muted-foreground")}
                >
                  总售价
                  {!isLoss && <span className="text-destructive text-xs">*</span>}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>该售价是包含所选的所有产品的总售价；</p>
                        <p>选择多个产品时总售价会按照各成本等比例分配至各个产品；</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FieldLabel>
                <Input
                  id="selling-price"
                  type="number"
                  placeholder={isLoss ? "折损无需填写" : "请输入售价"}
                  value={isLoss ? "" : sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  disabled={isLoss}
                  className={cn(isLoss && "bg-muted text-muted-foreground cursor-not-allowed")}
                />
              </Field>
            </FieldGroup>

            {/* 汇率 */}
            <FieldGroup className="flex-1 min-w-[140px]">
              <Field>
                <FieldLabel
                  htmlFor="exchange-rate"
                  className={cn(isLoss && "text-muted-foreground")}
                >
                  汇率
                  {!isLoss && <span className="text-destructive text-xs">*</span>}
                </FieldLabel>
                <Input
                  id="exchange-rate"
                  type="number"
                  placeholder={isLoss ? "折损无需填写" : "请输入汇率"}
                  value={isLoss ? "" : exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  min="0"
                  step="0.01"
                  disabled={isLoss}
                  className={cn(isLoss && "bg-muted text-muted-foreground cursor-not-allowed")}
                />
              </Field>
            </FieldGroup>
          </div>

          {/* 第三行：备注 + 提交按钮同行 */}
          <div className="flex items-end gap-3">
            <FieldGroup className="flex-1">
              <Field>
                <FieldLabel htmlFor="remark">备注{isLoss ? " (必填)" : " (选填)"}{isLoss && <span className="text-destructive text-xs">*</span>}</FieldLabel>
                <Textarea
                  id="remark"
                  placeholder="请输入备注信息..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="resize-none min-h-0 h-9 py-1.5 leading-5"
                  rows={1}
                />
              </Field>
            </FieldGroup>

            <Button
              onClick={handleSubmit}
              disabled={disabled}
              className="gap-2 shrink-0 mb-px"
            >
              <Send className="h-4 w-4" />
              提交
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
