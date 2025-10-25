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

interface MilestoneCompleteEmailProps {
  firstName: string;
  milestoneTitle: string;
  progress: number;
  nextMilestone: string;
  planUrl: string;
}

export default function MilestoneCompleteEmail({
  firstName = 'User',
  milestoneTitle = 'Complete Basic Certification',
  progress = 35,
  nextMilestone = 'Build Portfolio Project',
  planUrl = 'https://launchks.org/dashboard',
}: MilestoneCompleteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Milestone complete! 🎊</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Congratulations! 🎊</Heading>

          <Text style={text}>Hi {firstName},</Text>

          <Text style={text}>
            You just completed a major milestone:
          </Text>

          <Section style={celebrationBox}>
            <Text style={milestoneText}>&quot;{milestoneTitle}&quot;</Text>
          </Section>

          <Section style={statsBox}>
            <Text style={statsText}>
              <strong>Your Progress:</strong> {progress}%
            </Text>
            <Text style={statsText}>
              <strong>What&apos;s Next:</strong> {nextMilestone}
            </Text>
          </Section>

          <Section style={buttonContainer}>
            <Link style={button} href={planUrl}>
              View Your Plan
            </Link>
          </Section>

          <Text style={text}>
            Every milestone brings you closer to your goal. Keep up the excellent work!
          </Text>

          <Text style={footer}>
            Proud of your progress,
            <br />
            The LaunchKS Team
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
  backgroundColor: '#E8F5E9',
  border: '2px solid #28A745',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const milestoneText = {
  color: '#223344',
  fontSize: '20px',
  fontWeight: '600',
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

