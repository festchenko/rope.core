'use client';

import React from 'react';
import styled from 'styled-components';
import { StyledLogo, StyledStatusPill } from './ui';

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`;

export default function TopBar() {
  return (
    <Header>
      <HeaderContent>
        <StyledLogo size='md' />
        <StyledStatusPill status='demo' label='Demo • Offline' />
      </HeaderContent>
    </Header>
  );
}