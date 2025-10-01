'use client';

import React from 'react';
import styled, { css } from 'styled-components';

interface StyledButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const ButtonBase = styled.button<{
  variant: 'primary' | 'secondary' | 'glass';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
}>`
  border: none;
  border-radius: 0.75rem;
  font-family: var(--font-inter), sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Size variants */
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        `;
      case 'md':
        return css`
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
        `;
      case 'lg':
        return css`
          padding: 1rem 2rem;
          font-size: 1.125rem;
        `;
    }
  }}
  
  /* Color variants */
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return css`
          background: var(--accent);
          color: white;
          
          &:hover:not(:disabled) {
            background: rgba(0, 191, 166, 0.8);
            box-shadow: 0 8px 25px rgba(0, 191, 166, 0.3);
          }
        `;
      case 'secondary':
        return css`
          background: var(--card);
          color: var(--fg);
          border: 1px solid var(--border);
          
          &:hover:not(:disabled) {
            background: var(--card-hover);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }
        `;
      case 'glass':
        return css`
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--fg);
          
          &:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }
        `;
    }
  }}
`;

const StyledButton: React.FC<StyledButtonProps> = ({
  children,
  variant = 'glass',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
}) => {
  return (
    <ButtonBase
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </ButtonBase>
  );
};

export default StyledButton;
