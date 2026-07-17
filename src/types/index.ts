import type { Dispatch, SetStateAction } from 'react';


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
export type AffiliateStatus = 
    'pending' | 'approved' | 'rejected'; 


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
export type AffiliateStatusFilter =
    | 'all'
    | 'pending'
    | 'approved'
    | 'rejected';


export interface AffiliatesResponse {
    data: Affiliate[];
    pagination: Pagination;
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
    items: number;
    onPageChange: (page: number) => void;
}

export interface StatusFilterProps {
    statusFilter: AffiliateStatusFilter;
    setStatusFilter: Dispatch<SetStateAction<AffiliateStatusFilter>>;
    setPage: Dispatch<SetStateAction<number>>;
}