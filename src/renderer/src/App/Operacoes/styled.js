import styled from 'styled-components';
import CsvDownloadButton from "react-json-to-csv";

export const StyledCsvDownloadButton = styled(CsvDownloadButton)`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  padding: 6px;
  border-radius: 4px;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif; 

  &:hover {
    opacity: 0.8;
    background-color:rgb(71, 71, 71);
    
  }
`;