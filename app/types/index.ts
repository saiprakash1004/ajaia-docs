export type Doc = {
  id: string;
  title: string;
  content: string;
  owner_email: string;
  created_at: string;
  updated_at: string;
};

export type Share = {
  id: string;
  document_id: string;
  shared_with_email: string;
};