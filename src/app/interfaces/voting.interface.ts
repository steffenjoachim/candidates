export interface Candidate {
    id: string;
    name: string;
    img: string;
    votes: number;
  }
  
  export interface UserVote {
    email: string;
    votedFor: string;
  }