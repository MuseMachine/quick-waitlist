import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { EmailFooter } from "@/components/EmailFooter";

export const WelcomeEmail = (unsubscribeLink: string) => {
  const siteName = "MuseBoard";
  const contactEmail = "info@updates.musemachine.ai";
  const siteLogo =
    process.env.NEXT_PUBLIC_DOMAIN + "/mm_logo.svg" ||
    "http://localhost:3000/mm_logo.svg";
  const waitlistpage =
    process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
  return (
    <Html>
      <Head />
      <Preview>{`You've secured your spot! Get ready for ${siteName}.`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img style={img} src={siteLogo} width="200" height="50" alt="Logo" />
          <Heading style={heading}>You're officially on the list! 🎉</Heading>
          <Section>
            {/* EINLEITUNG: Bestätigung und das Gefühl, etwas Besonderes zu sein. */}
            <Text style={text}>
              Thank you for signing up for the waitlist for our prototype,{" "}
              <strong>{siteName}</strong>. We're genuinely excited to have you
              among the first to experience what we're building.
            </Text>

            {/* MEHRWERT & VISION: Erklärt, warum ihre Teilnahme wichtig ist. */}
            <Text style={text}>
              As you know, staying updated in the creative AI space can be
              overwhelming. We're crafting a tool to solve exactly that, and
              your early feedback will be invaluable in shaping a product that
              truly makes a difference. You're not just a user on a list; you're
              a co-creator.
            </Text>

            <Hr style={hr} />

            {/* NÄCHSTE SCHRITTE: Klare und transparente Erwartungen setzen. */}
            <Text style={emphasizedText}>So, what happens next?</Text>
            <Text style={text}>
              We're putting the final touches on the prototype right now. As
              soon as it's ready, you will receive an exclusive invitation to be
              one of the very first to take it for a spin.
            </Text>
            <Text style={text}>
              <strong>
                To ensure your invitation doesn't get lost, please add{" "}
                <Link href={`mailto:${contactEmail}`}>{contactEmail}</Link> to
                your contacts.
              </strong>{" "}
              This is the best way to make sure our updates land safely in your
              main inbox.
            </Text>
            <Hr style={hr} />
            <Text style={unsubscribeText}>
              You are receiving this email because you opted in via our{" "}
              <a style={anchor} href={waitlistpage}>
                waitlist
              </a>
              .
            </Text>
            <Text style={unsubscribeText}>
              Want to change how you receive these emails? <br />
              You can{" "}
              <a style={anchor} href={unsubscribeLink}>
                unsubscribe from this list
              </a>
              .
            </Text>
          </Section>
        </Container>
      </Body>
      <div style={footer}>
        <EmailFooter />
      </div>
    </Html>
  );
};

export default WelcomeEmail;

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

const emphasizedText = {
  ...text,
  fontWeight: "bold" as const,
  color: "#000",
};

const unsubscribeText = {
  fontSize: "14px",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  textAlign: "center" as const,
  color: "#1a1a1a",
  margin: "30px 0",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  display: "flex",
  justifyContent: "center",
};

const anchor = {
  textDecoration: "underline",
};
