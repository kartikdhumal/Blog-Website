export interface HomeProps {
    blogParams?: IBlogParams;
  }
  
  export interface IBlogParams {
    user?: string;
    userId?: string;
    categories?: string;
  }