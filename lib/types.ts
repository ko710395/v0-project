export interface Product {
  id: string
  name: string // 邮箱形式的产品名
  type: "自加ID" | "链接单"
  brand: string
  country: string
  cost: number
}

export interface OutboundRecord {
  id: string
  productName: string
  productType: "自加ID" | "链接单"
  productBrand: string
  productCountry: string
  cost: number
  sellingPrice: number
  exchangeRate: number
  outboundType: "出库" | "折损"
  outboundTime: string
  remark?: string
  status: "有效" | "已撤回"
}
