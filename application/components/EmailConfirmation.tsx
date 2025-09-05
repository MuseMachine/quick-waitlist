import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { EmailFooter } from "./EmailFooter";

export const EmailConfirmation = (confirmationLink: string) => {
  const siteLogo = process.env.NEXT_PUBLIC_DOMAIN + "/mm_logo.svg";
  return (
    <Html>
      <Head />
      <Preview>{`Please confirm your Subscription`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img style={img} src={siteLogo} width="400" height="200" alt="Logo" />
          <Section>
            <Text style={text}>{`Please click`}</Text>
            <a style={anchor} href={confirmationLink}>
              here
            </a>
            <Text style={text}>{`to confirm your subscription`}</Text>
          </Section>
        </Container>
      </Body>
      <EmailFooter />
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const img = {
  paddingTop: "40px",
  margin: "0 auto",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "400",
  color: "#404040",
  lineHeight: "26px",
  // padding: "0 40px",
};

const anchor = {
  textDecoration: "underline",
};
