'use client';

import React from 'react';
import styled from 'styled-components';

interface StyledLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LogoContainer = styled.h1<{ size: 'sm' | 'md' | 'lg' }>`
  font-family: 'LAB-Grotesk', var(--font-labco), sans-serif;
  font-weight: 700;
  letter-spacing: 0.22em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  align-items: baseline;
  
  font-size: ${({ size }) => {
    switch (size) {
      case 'sm': return '1.25rem'; // 20px
      case 'md': return '1.5rem';  // 24px
      case 'lg': return '2rem';    // 32px
      default: return '1.5rem';
    }
  }};
`;

const CoreContainer = styled.span`
  font-size: 0.5em; /* В два раза меньше основного размера */
  display: flex;
  align-items: baseline;
`;

const RopeText = styled.span`
  color: var(--fg);
`;

const SlashText = styled.span`
  color: var(--accent);
  margin: 0 0.25rem;
  font-size: 0.5em; /* Такой же размер как у {core} */
`;

const CoreText = styled.span`
  color: var(--accent);
`;

const BraceText = styled.span`
  color: var(--fg);
`;

const StyledLogo: React.FC<StyledLogoProps> = ({ size = 'md', className = '' }) => {
  return (
    <LogoContainer size={size} className={className}>
      <RopeText key="rope">rope</RopeText>
      <SlashText key="slash">/</SlashText>
      <CoreContainer key="core-container">
        <BraceText key="brace-open">{'{'}</BraceText>
        <CoreText key="core">core</CoreText>
        <BraceText key="brace-close">{'}'}</BraceText>
      </CoreContainer>
    </LogoContainer>
  );
};

export default StyledLogo;
