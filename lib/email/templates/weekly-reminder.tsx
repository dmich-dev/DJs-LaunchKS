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

interface WeeklyReminderEmailProps {
  firstName: string;
  progress: number;
  currentMilestone: string;
  nextTasks: string[];
  dashboardUrl: string;
}

export default function WeeklyReminderEmail({
  firstName = 'User',
  progress = 25,
  currentMilestone = 'Complete Online Coursework',
  nextTasks = ['Enroll in Introduction to Programming', 'Complete Module 1', 'Join study group'],
  dashboardUrl = 'https://launchks.org/dashboard',
}: WeeklyReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Keep up the momentum on your career journey! 🚀</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Keep Up the Momentum! 🚀</Heading>

          <Text style={text}>Hi {firstName},</Text>

          <Text style={text}>
            You&apos;re {progress}% through your career transition plan - great progress!
          </Text>

          <Section style={progressBox}>
            <Heading style={h2}>What&apos;s Next</Heading>
            <Text style={milestoneTitle}>{currentMilestone}</Text>
            <Text style={text}>Your next tasks:</Text>
            <ul style={taskList}>
              {nextTasks.map((task, i) => (
                <li key={i} style={listItem}>{task}</li>
              ))}
            </ul>
          </Section>

          <Section style={buttonContainer}>
            <Link style={button} href={dashboardUrl}>
              Continue Your Progress
            </Link>
          </Section>

          <Text style={text}>
            Consistency is key! Even small steps forward each week will get you to your goal.
          </Text>

          <Text style={footer}>
            You&apos;ve got this!
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

const h2 = {
  color: '#223344',
  fontSize: '20px',
  fontWeight: '600',
  margin: '12px 0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const progressBox = {
  backgroundColor: '#F8F9FA',
  border: '1px solid #DEE2E6',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const milestoneTitle = {
  color: '#223344',
  fontSize: '18px',
  fontWeight: '600',
  margin: '8px 0 16px 0',
};

const taskList = {
  margin: '12px 0',
  paddingLeft: '20px',
};

const listItem = {
  color: '#333',
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

