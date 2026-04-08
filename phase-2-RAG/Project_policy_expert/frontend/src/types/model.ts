

// ##################################
// Auth model data types
export interface SignupPayload {
    username: string;
    email: string;
    password: string
};


export interface SigninPayload  {
    username_or_email: string;
    password: string
};


// ##################################
// document model data types
export interface UploadDocumentPayload {
    file: File;
    category?: string;
}

export interface DocumentType {
    id: string;
    file: string ;
    file_hash: string ;
    upload_at:Date ;
    upload_by:number ;
    category:number;
}




// ##################################
// Chat model 
export interface ChatSession {
  session_id: string;
  user: User;
  name: string;
  doc_ids: DocumentType[];
  created_at: string;
  updated_at: string;
}

export type Message = {
  id: string;
  chat_session_id: string;
  query: string;
  response_text: string;
};
