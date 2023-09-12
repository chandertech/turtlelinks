export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					operationName?: string;
					query?: string;
					variables?: Json;
					extensions?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			billing_customers: {
				Row: {
					active: boolean | null;
					customer_id: string | null;
					email: string | null;
					profile_id: string;
					provider: Database['public']['Enums']['billing_providers'] | null;
				};
				Insert: {
					active?: boolean | null;
					customer_id?: string | null;
					email?: string | null;
					profile_id: string;
					provider?: Database['public']['Enums']['billing_providers'] | null;
				};
				Update: {
					active?: boolean | null;
					customer_id?: string | null;
					email?: string | null;
					profile_id?: string;
					provider?: Database['public']['Enums']['billing_providers'] | null;
				};
				Relationships: [
					{
						foreignKeyName: 'billing_customers_profile_id_fkey';
						columns: ['profile_id'];
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					}
				];
			};
			billing_prices: {
				Row: {
					active: boolean | null;
					billing_product_id: string | null;
					currency: string | null;
					description: string | null;
					id: string;
					interval: Database['public']['Enums']['pricing_plan_interval'] | null;
					interval_count: number | null;
					metadata: Json | null;
					provider: Database['public']['Enums']['billing_providers'] | null;
					trial_period_days: number | null;
					type: Database['public']['Enums']['pricing_type'] | null;
					unit_amount: number | null;
				};
				Insert: {
					active?: boolean | null;
					billing_product_id?: string | null;
					currency?: string | null;
					description?: string | null;
					id: string;
					interval?: Database['public']['Enums']['pricing_plan_interval'] | null;
					interval_count?: number | null;
					metadata?: Json | null;
					provider?: Database['public']['Enums']['billing_providers'] | null;
					trial_period_days?: number | null;
					type?: Database['public']['Enums']['pricing_type'] | null;
					unit_amount?: number | null;
				};
				Update: {
					active?: boolean | null;
					billing_product_id?: string | null;
					currency?: string | null;
					description?: string | null;
					id?: string;
					interval?: Database['public']['Enums']['pricing_plan_interval'] | null;
					interval_count?: number | null;
					metadata?: Json | null;
					provider?: Database['public']['Enums']['billing_providers'] | null;
					trial_period_days?: number | null;
					type?: Database['public']['Enums']['pricing_type'] | null;
					unit_amount?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'billing_prices_billing_product_id_fkey';
						columns: ['billing_product_id'];
						referencedRelation: 'billing_products';
						referencedColumns: ['id'];
					}
				];
			};
			billing_products: {
				Row: {
					active: boolean | null;
					description: string | null;
					id: string;
					image: string | null;
					metadata: Json | null;
					name: string | null;
					provider: Database['public']['Enums']['billing_providers'] | null;
				};
				Insert: {
					active?: boolean | null;
					description?: string | null;
					id: string;
					image?: string | null;
					metadata?: Json | null;
					name?: string | null;
					provider?: Database['public']['Enums']['billing_providers'] | null;
				};
				Update: {
					active?: boolean | null;
					description?: string | null;
					id?: string;
					image?: string | null;
					metadata?: Json | null;
					name?: string | null;
					provider?: Database['public']['Enums']['billing_providers'] | null;
				};
				Relationships: [];
			};
			billing_subscriptions: {
				Row: {
					cancel_at: string | null;
					cancel_at_period_end: boolean | null;
					canceled_at: string | null;
					created: string;
					current_period_end: string;
					current_period_start: string;
					ended_at: string | null;
					id: string;
					organization_id: number;
					price_id: string | null;
					profile_id: string;
					provider: Database['public']['Enums']['billing_providers'] | null;
					quantity: number | null;
					status: Database['public']['Enums']['subscription_status'] | null;
					trial_end: string | null;
					trial_start: string | null;
				};
				Insert: {
					cancel_at?: string | null;
					cancel_at_period_end?: boolean | null;
					canceled_at?: string | null;
					created?: string;
					current_period_end?: string;
					current_period_start?: string;
					ended_at?: string | null;
					id: string;
					organization_id: number;
					price_id?: string | null;
					profile_id: string;
					provider?: Database['public']['Enums']['billing_providers'] | null;
					quantity?: number | null;
					status?: Database['public']['Enums']['subscription_status'] | null;
					trial_end?: string | null;
					trial_start?: string | null;
				};
				Update: {
					cancel_at?: string | null;
					cancel_at_period_end?: boolean | null;
					canceled_at?: string | null;
					created?: string;
					current_period_end?: string;
					current_period_start?: string;
					ended_at?: string | null;
					id?: string;
					organization_id?: number;
					price_id?: string | null;
					profile_id?: string;
					provider?: Database['public']['Enums']['billing_providers'] | null;
					quantity?: number | null;
					status?: Database['public']['Enums']['subscription_status'] | null;
					trial_end?: string | null;
					trial_start?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'billing_subscriptions_organization_id_fkey';
						columns: ['organization_id'];
						referencedRelation: 'organizations';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'billing_subscriptions_price_id_fkey';
						columns: ['price_id'];
						referencedRelation: 'billing_prices';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'billing_subscriptions_profile_id_fkey';
						columns: ['profile_id'];
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					}
				];
			};
			dynamic_links: {
				Row: {
					deep_link: string;
					friendly_name: string;
					link: string;
					suffix: string;
					url: string;
				};
				Insert: {
					deep_link: string;
					friendly_name: string;
					link: string;
					suffix: string;
					url: string;
				};
				Update: {
					deep_link?: string;
					friendly_name?: string;
					link?: string;
					suffix?: string;
					url?: string;
				};
				Relationships: [];
			};
			fake_dns_provider: {
				Row: {
					url: string;
				};
				Insert: {
					url?: string;
				};
				Update: {
					url?: string;
				};
				Relationships: [];
			};
			organization_invites: {
				Row: {
					created_at: string;
					id: number;
					invite_code: string;
					invitee_email: string;
					inviter_id: string;
					organization_id: number;
					status: number;
				};
				Insert: {
					created_at?: string;
					id?: number;
					invite_code: string;
					invitee_email: string;
					inviter_id: string;
					organization_id: number;
					status: number;
				};
				Update: {
					created_at?: string;
					id?: number;
					invite_code?: string;
					invitee_email?: string;
					inviter_id?: string;
					organization_id?: number;
					status?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'organization_invites_inviter_id_fkey';
						columns: ['inviter_id'];
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'organization_invites_organization_id_fkey';
						columns: ['organization_id'];
						referencedRelation: 'organizations';
						referencedColumns: ['id'];
					}
				];
			};
			organizations: {
				Row: {
					created_at: string;
					id: number;
					name: string;
				};
				Insert: {
					created_at?: string;
					id?: number;
					name: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			profiles: {
				Row: {
					avatar_url: string | null;
					email: string;
					full_name: string | null;
					id: string;
					updated_at: string | null;
					username: string | null;
					website: string | null;
				};
				Insert: {
					avatar_url?: string | null;
					email: string;
					full_name?: string | null;
					id: string;
					updated_at?: string | null;
					username?: string | null;
					website?: string | null;
				};
				Update: {
					avatar_url?: string | null;
					email?: string;
					full_name?: string | null;
					id?: string;
					updated_at?: string | null;
					username?: string | null;
					website?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'profiles_id_fkey';
						columns: ['id'];
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			urls: {
				Row: {
					domain: string;
					organization_id: number;
					subdomain: string;
					url: string;
				};
				Insert: {
					domain: string;
					organization_id: number;
					subdomain: string;
					url: string;
				};
				Update: {
					domain?: string;
					organization_id?: number;
					subdomain?: string;
					url?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'urls_organization_id_fkey';
						columns: ['organization_id'];
						referencedRelation: 'organizations';
						referencedColumns: ['id'];
					}
				];
			};
			users_organizations: {
				Row: {
					created_at: string;
					organization_id: number;
					profile_id: string;
				};
				Insert: {
					created_at?: string;
					organization_id: number;
					profile_id: string;
				};
				Update: {
					created_at?: string;
					organization_id?: number;
					profile_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'users_organizations_organization_id_fkey';
						columns: ['organization_id'];
						referencedRelation: 'organizations';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'users_organizations_profile_id_fkey';
						columns: ['profile_id'];
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			get_orgs_for_authenticated_user: {
				Args: Record<PropertyKey, never>;
				Returns: number[];
			};
		};
		Enums: {
			billing_providers: 'stripe';
			pricing_plan_interval: 'day' | 'week' | 'month' | 'year';
			pricing_type: 'one_time' | 'recurring';
			subscription_status:
				| 'trialing'
				| 'active'
				| 'canceled'
				| 'incomplete'
				| 'incomplete_expired'
				| 'past_due'
				| 'unpaid';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	storage: {
		Tables: {
			buckets: {
				Row: {
					allowed_mime_types: string[] | null;
					avif_autodetection: boolean | null;
					created_at: string | null;
					file_size_limit: number | null;
					id: string;
					name: string;
					owner: string | null;
					public: boolean | null;
					updated_at: string | null;
				};
				Insert: {
					allowed_mime_types?: string[] | null;
					avif_autodetection?: boolean | null;
					created_at?: string | null;
					file_size_limit?: number | null;
					id: string;
					name: string;
					owner?: string | null;
					public?: boolean | null;
					updated_at?: string | null;
				};
				Update: {
					allowed_mime_types?: string[] | null;
					avif_autodetection?: boolean | null;
					created_at?: string | null;
					file_size_limit?: number | null;
					id?: string;
					name?: string;
					owner?: string | null;
					public?: boolean | null;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'buckets_owner_fkey';
						columns: ['owner'];
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			migrations: {
				Row: {
					executed_at: string | null;
					hash: string;
					id: number;
					name: string;
				};
				Insert: {
					executed_at?: string | null;
					hash: string;
					id: number;
					name: string;
				};
				Update: {
					executed_at?: string | null;
					hash?: string;
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			objects: {
				Row: {
					bucket_id: string | null;
					created_at: string | null;
					id: string;
					last_accessed_at: string | null;
					metadata: Json | null;
					name: string | null;
					owner: string | null;
					path_tokens: string[] | null;
					updated_at: string | null;
					version: string | null;
				};
				Insert: {
					bucket_id?: string | null;
					created_at?: string | null;
					id?: string;
					last_accessed_at?: string | null;
					metadata?: Json | null;
					name?: string | null;
					owner?: string | null;
					path_tokens?: string[] | null;
					updated_at?: string | null;
					version?: string | null;
				};
				Update: {
					bucket_id?: string | null;
					created_at?: string | null;
					id?: string;
					last_accessed_at?: string | null;
					metadata?: Json | null;
					name?: string | null;
					owner?: string | null;
					path_tokens?: string[] | null;
					updated_at?: string | null;
					version?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'objects_bucketId_fkey';
						columns: ['bucket_id'];
						referencedRelation: 'buckets';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			can_insert_object: {
				Args: {
					bucketid: string;
					name: string;
					owner: string;
					metadata: Json;
				};
				Returns: undefined;
			};
			extension: {
				Args: {
					name: string;
				};
				Returns: string;
			};
			filename: {
				Args: {
					name: string;
				};
				Returns: string;
			};
			foldername: {
				Args: {
					name: string;
				};
				Returns: unknown;
			};
			get_size_by_bucket: {
				Args: Record<PropertyKey, never>;
				Returns: {
					size: number;
					bucket_id: string;
				}[];
			};
			search: {
				Args: {
					prefix: string;
					bucketname: string;
					limits?: number;
					levels?: number;
					offsets?: number;
					search?: string;
					sortcolumn?: string;
					sortorder?: string;
				};
				Returns: {
					name: string;
					id: string;
					updated_at: string;
					created_at: string;
					last_accessed_at: string;
					metadata: Json;
				}[];
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
