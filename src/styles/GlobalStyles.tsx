import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    font-family: 'Cormorant Garamond', 'Playfair Display', serif;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-size: 16px;
    color: #fff;
    background-color: #000;
  }
  
  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Playfair Display', serif;
    font-weight: 400;
    letter-spacing: 0.02em;
    line-height: 1.2;
  }
  
  h1 {
    font-size: 3rem;
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }
  
  h2 {
    font-size: 2.5rem;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  h3 {
    font-size: 1.75rem;
  }
  
  p {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    font-family: 'Cormorant Garamond', serif;
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
  
  button {
    font-family: 'Cormorant Garamond', serif;
    cursor: pointer;
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
  
  /* Apply better text rendering for all text */
  * {
    text-shadow: 0 0 0.5px rgba(255, 255, 255, 0.1);
    text-rendering: optimizeLegibility;
  }
  
  /* Improve contrast for better visibility */
  ::selection {
    background-color: rgba(255, 0, 93, 0.7);
    color: white;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 23, 68, 0.5);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 23, 68, 0.7);
  }
`;

export default GlobalStyles; 