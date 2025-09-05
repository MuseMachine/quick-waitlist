import { Section, Img, Text, Row, Column, Link } from "@react-email/components";
import { LinkedinIcon } from "lucide-react";
import MMLogo from "./Logo";

export const EmailFooter = () => {
  return (
    <Section className="text-center">
      <table className="w-full">
        <tr className="w-full">
          <td align="center">
            <MMLogo />
          </td>
        </tr>
        <tr className="w-full">
          <td align="center">
            <Text className="my-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]">
              MuseMachine UG
            </Text>
            <Text className="mt-[4px] mb-0 text-[16px] text-gray-500 leading-[24px]">
              Unleach your creativity
            </Text>
          </td>
        </tr>
        <tr>
          <td align="center">
            <Row className="table-cell h-[44px] w-[56px] align-bottom">
              <Column className="pr-[8px]">
                <Link href="https://www.linkedin.com/company/musemachine-ai/">
                  <LinkedinIcon />
                </Link>
              </Column>
            </Row>
          </td>
        </tr>
        <tr>
          <td align="center">
            <Text className="my-[8px] font-semibold text-[16px] text-gray-500 leading-[24px]">
              Roehrer Weg 8, 71032 Boeblingen Germany
            </Text>
            <Text className="mt-[4px] mb-0 font-semibold text-[16px] text-gray-500 leading-[24px]">
              contact@musemachine.de
            </Text>
          </td>
        </tr>
      </table>
    </Section>
  );
};
