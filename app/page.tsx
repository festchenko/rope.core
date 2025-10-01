'use client';

import React from 'react';
import styled from 'styled-components';
import TopBar from './components/TopBar';

const PageContainer = styled.div`
  min-height: 100vh;
`;

const Main = styled.main`
  padding: 1.5rem;
`;

const CenterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 100px);
`;

const ContentWrapper = styled.div`
  text-align: center;
`;

const Subtitle = styled.p`
  color: var(--muted);
  font-family: var(--font-inter), sans-serif;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

export default function Home() {
  return (
    <PageContainer>
      <TopBar />
      <Main>
        <CenterContainer>
          <ContentWrapper>
            <Subtitle>Digital Twin Interface</Subtitle>
          </ContentWrapper>
        </CenterContainer>
      </Main>
    </PageContainer>
  );
}