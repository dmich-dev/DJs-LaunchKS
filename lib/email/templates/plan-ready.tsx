import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface PlanReadyEmailProps {
  firstName: string;
  targetCareer: string;
  estimatedDuration: string;
  planUrl: string;
}

export default function PlanReadyEmail({
  firstName = 'User',
  targetCareer = 'Software Developer',
  estimatedDuration = '6-9 months',
  planUrl = 'https://launchks.org/dashboard',
}: PlanReadyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your career transition plan is ready! ✈️</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your Plan is Ready! ✈️</Heading>

          <Text style={text}>Hi {firstName},</Text>

          <Text style={text}>
            Great news! Your personalized career transition plan is ready to view.
          </Text>

          <Section style={highlightBox}>
            <Text style={highlightText}>
              <strong>Your Goal:</strong> {targetCareer}
            </Text>
            <Text style={highlightText}>
              <strong>Estimated Duration:</strong> {estimatedDuration}
            </Text>
          </Section>

          <Text style={text}>
            Your plan includes step-by-step phases, milestones, tasks, and carefully
            curated Kansas resources to help you achieve your career goals.
          </Text>

          <Section style={buttonContainer}>
            <Link style={button} href={planUrl}>
              View Your Plan
            </Link>
          </Section>

          <Text style={text}>
            Remember, this is your journey - you can adjust your plan as you go.
            Let&apos;s get started on your new career!
          </Text>

          <Text style={footer}>
            Best wishes,
            <br />
            The LaunchKS Team
            <br />
            Kansas Department of Labor
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const h1 = {
  color: '#223344',
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '16px 0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const highlightBox = {
  backgroundColor: '#FFF9E6',
  border: '2px solid #FFC107',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
};

const highlightText = {
  color: '#223344',
  fontSize: '16px',
  margin: '8px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#FFC107',
  borderRadius: '8px',
  color: '#223344',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const footer = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '1.6',
  marginTop: '32px',
  borderTop: '1px solid #eaeaea',
  paddingTop: '24px',
};

