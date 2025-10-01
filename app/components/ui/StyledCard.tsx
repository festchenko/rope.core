'use client';

import React from 'react';
import styled, { css } from 'styled-components';

interface StyledCardProps {
  children: React.ReactNode;
  variant?: 'glass' | 'solid' | 'transparent';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CardBase = styled.div<{
  variant: 'glass' | 'solid' | 'transparent';
  padding: 'sm' | 'md' | 'lg';
}>`
  border-radius: 1.5rem;
  border: 1px solid var(--border);
  
  /* Padding variants */
  ${({ padding }) => {
    switch (padding) {
      case 'sm':
        return css`padding: 1rem;`;
      case 'md':
        return css`padding: 1.5rem;`;
      case 'lg':
        return css`padding: 2rem;`;
    }
  }}
  
  /* Style variants */
  ${({ variant }) => {
    switch (variant) {
      case 'glass':
        return css`
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
        `;
      case 'solid':
        return css`
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        `;
      case 'transparent':
        return css`
          background: transparent;
          border: none;
          box-shadow: none;
        `;
    }
  }}
`;

const StyledCard: React.FC<StyledCardProps> = ({
  children,
  variant = 'glass',
  padding = 'md',
  className = '',
}) => {
  return (
    <CardBase variant={variant} padding={padding} className={className}>
      {children}
    </CardBase>
  );
};

export default StyledCard;
