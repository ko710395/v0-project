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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Empty } from "@/components/ui/empty"
import { ClipboardList, Send, Trash2 } from "lucide-react"
import type { OutboundRecord } from "@/lib/types"

interface OutboundHistoryProps {
  records: OutboundRecord[]
}

export function OutboundHistory({ records }: OutboundHistoryProps) {
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
            <Empty.Icon>
              <ClipboardList className="h-12 w-12" />
            </Empty.Icon>
            <Empty.Title>暂无出库记录</Empty.Title>
            <Empty.Description>选择产品并提交出库后，记录将显示在这里</Empty.Description>
          </Empty>
        ) : (
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">产品名称</TableHead>
                  <TableHead className="min-w-[100px]">类型</TableHead>
                  <TableHead className="min-w-[100px] text-right">成本 (¥)</TableHead>
                  <TableHead className="min-w-[100px] text-right">售价 (¥)</TableHead>
                  <TableHead className="min-w-[80px] text-right">汇率</TableHead>
                  <TableHead className="min-w-[120px] text-right">换算售价 (¥)</TableHead>
                  <TableHead className="min-w-[100px] text-center">出库类型</TableHead>
                  <TableHead className="min-w-[160px]">出库时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => {
                  const convertedPrice = record.sellingPrice * record.exchangeRate
                  const profit = convertedPrice - record.cost
                  const isProfit = profit > 0

                  return (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.productName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.productType}</Badge>
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
                            record.outboundType === "折损"
                              ? "text-muted-foreground"
                              : isProfit
                                ? "text-green-600"
                                : "text-destructive"
                          }`}
                        >
                          {record.outboundType === "折损"
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
                      <TableCell className="text-muted-foreground">
                        {record.outboundTime}
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
