"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Empty, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { ClipboardList, Send, Trash2, Undo2 } from "lucide-react"
import type { OutboundRecord } from "@/lib/types"

interface OutboundHistoryProps {
  records: OutboundRecord[]
  onRevoke: (recordId: string) => void
}

export function OutboundHistory({ records, onRevoke }: OutboundHistoryProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClipboardList className="h-5 w-5 text-primary" />
          出库记录
          {records.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {records.length} 条记录
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <Empty className="py-12">
            <EmptyMedia variant="icon">
              <ClipboardList className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>暂无出库记录</EmptyTitle>
            <EmptyDescription>选择产品并提交出库后，记录将显示在这里</EmptyDescription>
          </Empty>
        ) : (
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">产品名称</TableHead>
                  <TableHead className="min-w-[80px]">类型</TableHead>
                  <TableHead className="min-w-[80px]">品牌</TableHead>
                  <TableHead className="min-w-[60px]">国家</TableHead>
                  <TableHead className="min-w-[80px] text-right">成本 (¥)</TableHead>
                  <TableHead className="min-w-[80px] text-right">售价 (¥)</TableHead>
                  <TableHead className="min-w-[60px] text-right">汇率</TableHead>
                  <TableHead className="min-w-[100px] text-right">换算售价 (¥)</TableHead>
                  <TableHead className="min-w-[80px] text-center">出库类型</TableHead>
                  <TableHead className="min-w-[80px] text-center">状态</TableHead>
                  <TableHead className="min-w-[150px]">备注</TableHead>
                  <TableHead className="min-w-[160px]">出库时间</TableHead>
                  <TableHead className="min-w-[80px] text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => {
                  const convertedPrice = record.sellingPrice * record.exchangeRate
                  const profit = convertedPrice - record.cost
                  const isProfit = profit > 0
                  const isRevoked = record.status === "已撤回"

                  return (
                    <TableRow key={record.id} className={isRevoked ? "opacity-60" : ""}>
                      <TableCell className="font-medium">
                        <span className="truncate block max-w-[180px]" title={record.productName}>
                          {record.productName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground text-sm">{record.productType}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {record.productBrand}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {record.productCountry}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {record.cost.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {record.sellingPrice.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {record.exchangeRate.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-mono">{convertedPrice.toLocaleString()}</div>
                        <div
                          className={`text-xs ${
                            record.outboundType === "折损" || isRevoked
                              ? "text-muted-foreground"
                              : isProfit
                                ? "text-green-600"
                                : "text-destructive"
                          }`}
                        >
                          {record.outboundType === "折损" || isRevoked
                            ? "-"
                            : isProfit
                              ? `+${profit.toLocaleString()}`
                              : profit.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {record.outboundType === "出库" ? (
                          <Badge className="gap-1 bg-green-100 text-green-700 hover:bg-green-100">
                            <Send className="h-3 w-3" />
                            出库
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <Trash2 className="h-3 w-3" />
                            折损
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {isRevoked ? (
                          <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-300">
                            已撤回
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                            有效
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground text-sm truncate block max-w-[150px]" title={record.remark || "-"}>
                          {record.remark || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {record.outboundTime}
                      </TableCell>
                      <TableCell className="text-center">
                        {!isRevoked && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRevoke(record.id)}
                            className="gap-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          >
                            <Undo2 className="h-4 w-4" />
                            撤回
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
