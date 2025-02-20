import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  list-style-type: none;
  padding: 0;
  gap: 10px;
`;

export const ListItem = styled.li`
  padding: 0px;
  border-radius: 5px;
`;