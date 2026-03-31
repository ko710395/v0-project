export interface Product {
  id: string
  name: string
  type: string
  cost: number
}

export interface OutboundRecord {
  id: string
  productName: string
  productType: string
  cost: number
  sellingPrice: number
  exchangeRate: number
  outboundType: "出库" | "折损"
  outboundTime: string
}
