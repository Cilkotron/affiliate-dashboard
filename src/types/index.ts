/** Users */
export interface User {
	id: number;
	email: string;
	role: 'admin' | 'affiliate';
}

export interface AuthResponse {
	user: User;
	token: string;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

/** Affiliates  */
export type AffiliateStatus = 'pending' | 'approved' | 'rejected';

export interface Affiliate {
	id: number;
	user_id: number;
	first_name: string;
	last_name: string;
	website?: string;
	status: AffiliateStatus;
	created_at: string;
	email?: string;
	version: number;
}
export type AffiliateStatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export interface AffiliatesResponse {
	data: Affiliate[];
	pagination: Pagination;
}

export interface AffiliateProgram {
	id: number;
	program_id: number;
	name: string;
	commission_rate: string;
	status: 'active' | 'inactive';
	joined_at: string;
}

/** Shared */
export interface Pagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}
export interface PaginationProps {
	page: number;
	totalPages: number;
	totalItems: number;
	pageSize: number;
	onPageChange: (page: number) => void;
}


export interface StatusFilterProps<T extends string> {
    statuses: Exclude<T, 'all'>[];
    statusFilter: T;
    setStatusFilter: (status: T) => void;
    setPage: (page: number) => void;
}

/** Programs */
export interface Program {
	id: number;
	name: string;
	description?: string;
	commission_rate: number;
	status: 'active' | 'inactive';
	created_at: string;
	version: number;
}
export type ProgramFormData = {
	name: string;
	description: string;
	commission_rate: number;
	status: 'active' | 'inactive';
};

export interface ProgramFormProps {
	form: ProgramFormData;
	onChange: (form: ProgramFormData) => void;
	onSubmit: (e: React.SubmitEvent) => void;
	onCancel: () => void;
	isEditing: boolean;
}

/** Links */
export interface Link {
	id: number;
	affiliate_id: number;
	program_id: number;
	slug: string;
	original_url: string;
	created_at: Date;
	program: string;
	affiliate_first_name?: string;
	affiliate_last_name?: string;
}

export interface LinkResponse {
	data: Link[];
	pagination: Pagination;
}

/** Clicks */
export interface Click {
	id: number;
	ip_address?: string;
	user_agent?: string;
	clicked_at: Date;
	slug: string;
	original_url: string;
	first_name?: string;
	last_name?: string;
	program_name: string;
}

export interface ClickResponse {
	data: Click[];
	pagination: Pagination;
}

/** Conversions */
export type ConversionStatusFilter = 'all' | 'paid' | 'pending' | 'approved';

export type ConversionStatus = 'paid' | 'pending' | 'approved';

export interface Conversion {
    id: number; 
    amount: string;
    commission: string;
    status: ConversionStatus;
    created_at: Date;
    first_name?: string;
    last_name?: string;
    program_name: string;
}

export interface ConversionResponse {
	data: Conversion[];
	pagination: Pagination;
}

/** Payouts */
export interface Payout {
    id: number;
    affiliate_id: number;
    amount: string;
    status: 'pending' | 'paid';
    created_at: string;
    paid_at: string | null;
    first_name?: string;
    last_name?: string;
}

export interface PayoutResponse {
    data: Payout[];
    pagination: Pagination;
}

export type PayoutStatusFilter = 'all' | 'pending' | 'paid';