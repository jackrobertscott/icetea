import React from 'react';
import styled from 'styled-components';

const Layout = styled.div`
  background-color: #eee;
  text-align: center;
  margin: 30px;
  padding: 30px;
`;

export default ({ children }) => <Layout>{children}</Layout>;
