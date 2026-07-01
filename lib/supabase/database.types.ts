// Auto-shaped to match supabase/migrations/0001_foundation.sql.
// If you have the Supabase CLI linked, prefer regenerating this with:
//   supabase gen types typescript --linked > lib/supabase/database.types.ts
// This hand-written version is kept in sync with the migration in the
// meantime and is the source of truth for app-level types.
//
// IMPORTANT: @supabase/postgrest-js's internal GenericTable/GenericSchema
// constraints require every table to carry a `Relationships` array and
// every schema to carry `Tables` + `Views` + `Functions` (we also add
// `Enums`/`CompositeTypes` to match the shape `supabase gen types` produces).
// Omitting any of these doesn't error where you'd expect — it makes the
// whole `Database` generic silently fail its constraint, which degrades
// `.insert()`/`.update()` argument types everywhere, not just here.

export type ProfileRole = "owner" | "admin" | "staff";
export type InvoiceType = "sale" | "rental";
export type InvoiceStatus = "draft" | "sent" | "partial" | "paid" | "overdue" | "void";
export type TeamInviteStatus = "pending" | "accepted" | "revoked" | "expired";

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          logo_url: string | null;
          currency: string;
          invoice_prefix: string;
          payment_terms: string | null;
          bank_name: string | null;
          account_name: string | null;
          account_number: string | null;
          next_invoice_seq: number;
          default_deposit_percentage: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["organizations"]["Row"]> & {
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["organizations"]["Row"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          organization_id: string | null;
          full_name: string | null;
          email: string | null;
          avatar_url: string | null;
          role: ProfileRole;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          }
        ];
      };
      team_invites: {
        Row: {
          id: string;
          organization_id: string;
          email: string;
          role: ProfileRole;
          token: string;
          invited_by: string | null;
          status: TeamInviteStatus;
          expires_at: string;
          accepted_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["team_invites"]["Row"]> & {
          organization_id: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["team_invites"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "team_invites_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          }
        ];
      };
      customers: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["customers"]["Row"]> & {
          organization_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "customers_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          }
        ];
      };
      products: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          description: string | null;
          sku: string | null;
          sale_price: number | null;
          rental_price: number | null;
          stock: number;
          low_stock_threshold: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]> & {
          organization_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "products_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          }
        ];
      };
      invoices: {
        Row: {
          id: string;
          organization_id: string;
          customer_id: string;
          invoice_number: string;
          type: InvoiceType;
          status: InvoiceStatus;
          currency: string;
          subtotal: number;
          total: number;
          amount_paid: number;
          issue_date: string;
          due_date: string | null;
          start_date: string | null;
          end_date: string | null;
          notes: string | null;
          created_by: string | null;
          paid_at: string | null;
          voided_at: string | null;
          created_at: string;
          updated_at: string;
        };
        // invoices are only ever created via the create_invoice() RPC — Insert
        // is intentionally unusable directly, but still shaped as a Record
        // (not `never`) so it doesn't break the GenericTable constraint.
        Insert: Record<string, never>;
        Update: Partial<Pick<Database["public"]["Tables"]["invoices"]["Row"], "notes" | "due_date">>;
        Relationships: [
          {
            foreignKeyName: "invoices_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          }
        ];
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          product_id: string | null;
          name: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          start_date: string | null;
          end_date: string | null;
          created_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      stock_movements: {
        Row: {
          id: string;
          organization_id: string;
          product_id: string;
          invoice_id: string | null;
          change: number;
          reason: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "stock_movements_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          }
        ];
      };
      payments: {
        Row: {
          id: string;
          organization_id: string;
          invoice_id: string;
          amount: number;
          note: string | null;
          recorded_by: string | null;
          created_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_organization: {
        Args: { p_name: string };
        Returns: Database["public"]["Tables"]["organizations"]["Row"];
      };
      accept_invite: {
        Args: { p_token: string };
        Returns: Database["public"]["Tables"]["organizations"]["Row"];
      };
      get_invite_preview: {
        Args: { p_token: string };
        Returns: {
          organization_name: string;
          email: string;
          role: ProfileRole;
          status: TeamInviteStatus;
          expires_at: string;
        }[];
      };
      remove_team_member: {
        Args: { p_profile_id: string };
        Returns: void;
      };
      update_team_member_role: {
        Args: { p_profile_id: string; p_role: "admin" | "staff" };
        Returns: Database["public"]["Tables"]["profiles"]["Row"];
      };
      create_invoice: {
        Args: {
          p_customer_id: string;
          p_type: InvoiceType;
          p_items: { product_id: string; quantity: number; start_date?: string; end_date?: string }[];
          p_start_date?: string | null;
          p_end_date?: string | null;
          p_due_date?: string | null;
          p_notes?: string | null;
        };
        Returns: Database["public"]["Tables"]["invoices"]["Row"];
      };
      mark_invoice_paid: {
        Args: { p_invoice_id: string };
        Returns: Database["public"]["Tables"]["invoices"]["Row"];
      };
      record_payment: {
        Args: { p_invoice_id: string; p_amount: number; p_note?: string | null };
        Returns: Database["public"]["Tables"]["invoices"]["Row"];
      };
      void_invoice: {
        Args: { p_invoice_id: string };
        Returns: Database["public"]["Tables"]["invoices"]["Row"];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type TeamInvite = Database["public"]["Tables"]["team_invites"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
export type InvoiceItem = Database["public"]["Tables"]["invoice_items"]["Row"];
export type StockMovement = Database["public"]["Tables"]["stock_movements"]["Row"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
