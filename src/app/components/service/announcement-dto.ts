export interface Announcement {
    id: number;
    title: string;
    content: string;
    created_at: Date;
    updated_at: Date;
    author_id: number;
    author_name: string;
}
