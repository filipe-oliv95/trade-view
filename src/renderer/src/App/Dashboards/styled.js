import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

export const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  list-style-type: none;
  padding: 0;
`;

export const ListItem = styled.li`
  /* background-color: white; */
  padding: 10px;
  border-radius: 5px;
`;

// export const Cards = styled.div`
//   display: flex;
//   gap: 10px;
//   flex-wrap: wrap;
//   justify-content: start;
// `

export const Cards = styled.div`
  display: grid;
  grid-template-areas:
    "finance operations"
    "performance performance"
    "strategy strategy";
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 10px;

  @media (min-width: 1600px) {
    grid-template-areas:
      "finance operations strategy"
      "performance performance strategy";
    grid-template-columns: 1fr 1fr 1fr; /* Três colunas */
    grid-template-rows: auto auto; /* Duas linhas */
  }
`;