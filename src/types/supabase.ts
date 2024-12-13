export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          icon: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string
          description?: string
          created_at?: string
        }
      }
      luxury_items: {
        Row: {
          id: string
          title: string
          price: number
          image: string
          category_id: string
          description: string
          rating: number | null
          rating_count: number | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          price: number
          image: string
          category_id: string
          description: string
          rating?: number | null
          rating_count?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          price?: number
          image?: string
          category_id?: string
          description?: string
          rating?: number | null
          rating_count?: number | null
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          avatar: string | null
          currency: string
          notifications: boolean
          theme: string
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          avatar?: string | null
          currency?: string
          notifications?: boolean
          theme?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar?: string | null
          currency?: string
          notifications?: boolean
          theme?: string
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          item_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          item_id?: string
          created_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          date: string
          total: number
          subtotal: number
          sales_tax: number
          luxury_tax: number
          shipping: number
          first_name: string
          last_name: string
          address: string
          city: string
          state: string
          zip_code: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          total: number
          subtotal: number
          sales_tax: number
          luxury_tax: number
          shipping: number
          first_name: string
          last_name: string
          address: string
          city: string
          state: string
          zip_code: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          total?: number
          subtotal?: number
          sales_tax?: number
          luxury_tax?: number
          shipping?: number
          first_name?: string
          last_name?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          created_at?: string
        }
      }
      purchase_items: {
        Row: {
          id: string
          purchase_id: string
          item_id: string
          quantity: number
          price_at_time: number
          created_at: string
        }
        Insert: {
          id?: string
          purchase_id: string
          item_id: string
          quantity: number
          price_at_time: number
          created_at?: string
        }
        Update: {
          id?: string
          purchase_id?: string
          item_id?: string
          quantity?: number
          price_at_time?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
