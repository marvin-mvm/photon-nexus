export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      experience: {
        Row: {
          anchor_shard_ids: number[] | null
          consensus_winner: string | null
          created_at: string | null
          description: string | null
          evidence_density: number | null
          handover_summary: string | null
          id: string
          logic_chr: Json | null
          logic_dyn: Json | null
          logic_evi: Json | null
          logic_mis: Json | null
          logic_num: Json | null
          logic_skeleton: Json | null
          logic_spa: Json | null
          physical_seed_label: string | null
          prompt_origin: string | null
          session_id: string | null
          status: string | null
          structural_fingerprint: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          anchor_shard_ids?: number[] | null
          consensus_winner?: string | null
          created_at?: string | null
          description?: string | null
          evidence_density?: number | null
          handover_summary?: string | null
          id?: string
          logic_chr?: Json | null
          logic_dyn?: Json | null
          logic_evi?: Json | null
          logic_mis?: Json | null
          logic_num?: Json | null
          logic_skeleton?: Json | null
          logic_spa?: Json | null
          physical_seed_label?: string | null
          prompt_origin?: string | null
          session_id?: string | null
          status?: string | null
          structural_fingerprint?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          anchor_shard_ids?: number[] | null
          consensus_winner?: string | null
          created_at?: string | null
          description?: string | null
          evidence_density?: number | null
          handover_summary?: string | null
          id?: string
          logic_chr?: Json | null
          logic_dyn?: Json | null
          logic_evi?: Json | null
          logic_mis?: Json | null
          logic_num?: Json | null
          logic_skeleton?: Json | null
          logic_spa?: Json | null
          physical_seed_label?: string | null
          prompt_origin?: string | null
          session_id?: string | null
          status?: string | null
          structural_fingerprint?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      knowledge_shards: {
        Row: {
          content_masked: string
          created_at: string | null
          id: string
          layer: number | null
          parent_id: string | null
          seed_reference: string | null
          user_id: string
        }
        Insert: {
          content_masked: string
          created_at?: string | null
          id?: string
          layer?: number | null
          parent_id?: string | null
          seed_reference?: string | null
          user_id: string
        }
        Update: {
          content_masked?: string
          created_at?: string | null
          id?: string
          layer?: number | null
          parent_id?: string | null
          seed_reference?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_shards_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "knowledge_shards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_shards_seed_reference_fkey"
            columns: ["seed_reference"]
            isOneToOne: false
            referencedRelation: "photon_pool"
            referencedColumns: ["id"]
          },
        ]
      }
      nexus_missions: {
        Row: {
          context_saturation_pct: number | null
          created_at: string | null
          current_experience_id: string | null
          dialogue_logs: Json | null
          id: string
          is_calibrating: boolean | null
          parent_experience_id: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          context_saturation_pct?: number | null
          created_at?: string | null
          current_experience_id?: string | null
          dialogue_logs?: Json | null
          id?: string
          is_calibrating?: boolean | null
          parent_experience_id?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          context_saturation_pct?: number | null
          created_at?: string | null
          current_experience_id?: string | null
          dialogue_logs?: Json | null
          id?: string
          is_calibrating?: boolean | null
          parent_experience_id?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nexus_missions_current_experience_id_fkey"
            columns: ["current_experience_id"]
            isOneToOne: false
            referencedRelation: "experience"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nexus_missions_parent_experience_id_fkey"
            columns: ["parent_experience_id"]
            isOneToOne: false
            referencedRelation: "experience"
            referencedColumns: ["id"]
          },
        ]
      }
      photon_pool: {
        Row: {
          created_at: string | null
          id: string
          raw_payload: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          raw_payload: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          raw_payload?: string
          status?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          credit_balance: number | null
          id: string
          total_prompts_executed: number | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          credit_balance?: number | null
          id: string
          total_prompts_executed?: number | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          credit_balance?: number | null
          id?: string
          total_prompts_executed?: number | null
          username?: string | null
        }
        Relationships: []
      }
      shred_audit_logs: {
        Row: {
          id: string
          seed_id: string | null
          shredded_at: string | null
          signature: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          seed_id?: string | null
          shredded_at?: string | null
          signature?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          seed_id?: string | null
          shredded_at?: string | null
          signature?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          api_key: string | null
          credit_balance: number | null
          device_signature: string | null
          id: string
          last_heartbeat: string | null
          subscription_status: string | null
          updated_at: string | null
        }
        Insert: {
          api_key?: string | null
          credit_balance?: number | null
          device_signature?: string | null
          id: string
          last_heartbeat?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Update: {
          api_key?: string | null
          credit_balance?: number | null
          device_signature?: string | null
          id?: string
          last_heartbeat?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decommission_session: {
        Args: { target_session_id: string }
        Returns: undefined
      }
      match_thought_intent: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_vector: string
        }
        Returns: {
          handover_summary: string
          id: string
          logic_mis: Json
          similarity: number
          title: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
