'use client';

import React from 'react';
import styled, { css } from 'styled-components';

interface StyledStatusPillProps {
  status: 'online' | 'offline' | 'demo';
  label?: string;
  className?: string;
}

const PillContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
`;

const StatusDot = styled.div<{ $status: 'online' | 'offline' | 'demo' }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  
  ${({ $status }) => {
    switch ($status) {
      case 'online':
        return css`
          background: #22c55e;
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
        `;
      case 'offline':
        return css`
          background: #ef4444;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
        `;
      case 'demo':
        return css`
          background: var(--accent);
          box-shadow: 0 0 20px var(--accent-glow);
        `;
    }
  }}
`;

const StatusText = styled.span`
  font-size: 0.875rem;
  color: var(--muted);
  font-family: var(--font-inter), sans-serif;
  font-weight: 500;
`;

const StyledStatusPill: React.FC<StyledStatusPillProps> = ({
  status = 'demo',
  label,
  className = '',
}) => {
  const statusConfig = {
    online: 'Online',
    offline: 'Offline',
    demo: 'Demo',
  };

  const displayText = label || statusConfig[status];

  return (
    <PillContainer className={className}>
      <StatusDot $status={status} />
      <StatusText>{displayText}</StatusText>
    </PillContainer>
  );
};

export default StyledStatusPill;
