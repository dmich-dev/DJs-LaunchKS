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

interface PhaseCompleteEmailProps {
  firstName: string;
  phaseTitle: string;
  progress: number;
  nextPhase: string;
  planUrl: string;
}

export default function PhaseCompleteEmail({
  firstName = 'User',
  phaseTitle = 'Foundation Building',
  progress = 25,
  nextPhase = 'Core Skill Development',
  planUrl = 'https://launchks.org/dashboard',
}: PhaseCompleteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Phase complete! 🌟</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Phase Complete! 🌟</Heading>

          <Text style={text}>Hi {firstName},</Text>

          <Text style={text}>
            Congratulations! You&apos;ve completed an entire phase of your career transition plan:
          </Text>

          <Section style={celebrationBox}>
            <Text style={phaseText}>{phaseTitle}</Text>
          </Section>

          <Text style={text}>
            This is a significant achievement! You&apos;ve built a strong foundation for the next
            phase of your journey.
          </Text>

          <Section style={statsBox}>
            <Text style={statsText}>
              <strong>Overall Progress:</strong> {progress}%
            </Text>
            <Text style={statsText}>
              <strong>Next Phase:</strong> {nextPhase}
            </Text>
          </Section>

          <Section style={buttonContainer}>
            <Link style={button} href={planUrl}>
              Start Next Phase
            </Link>
          </Section>

          <Text style={text}>
            Take a moment to celebrate this milestone before moving forward. You&apos;re making
            excellent progress toward your career goals!
          </Text>

          <Text style={footer}>
            Celebrating your success,
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
  margin: '16px 0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const celebrationBox = {
  backgroundColor: '#FFF9E6',
  border: '3px solid #FFC107',
  borderRadius: '8px',
  padding: '32px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const phaseText = {
  color: '#223344',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0',
};

const statsBox = {
  backgroundColor: '#F8F9FA',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const statsText = {
  color: '#223344',
  fontSize: '16px',
  lineHeight: '1.8',
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
  marginTop: '32px',
  borderTop: '1px solid #eaeaea',
  paddingTop: '24px',
};

