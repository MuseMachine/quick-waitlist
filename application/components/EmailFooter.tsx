import { Section, Text } from "@react-email/components";
// import { LinkedinIcon } from "lucide-react";
// import MMLogo from "./Logo";

export const EmailFooter = () => {
  return (
    <Section>
      <table style={footerBox}>
        {/*<tr>
          <td>
            <MMLogo />
          </td>
        </tr>*/}
        <tr>
          <td>
            <Text>MuseMachine UG・Roehrer Weg 8・71032 Boeblingen Germany</Text>
            <Text style={homepage}>www.musemachine.ai</Text>
          </td>
        </tr>
        {/*<tr style={socialMediaIcons}>
          <td>
            <Link href="https://www.linkedin.com/company/musemachine-ai/">
              <LinkedinIcon />
            </Link>
          </td>
        </tr>*/}
      </table>
    </Section>
  );
};

const footerBox = {
  display: "flex",
  justifyContent: "center",
};

// const socialMediaIcons = {
//   justifySelf: "center",
// };

const homepage = {
  display: "flex",
  justifyContent: "center",
  color: "#09cd9f",
};
