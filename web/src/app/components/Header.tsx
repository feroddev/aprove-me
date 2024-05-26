import Link from "next/link";
import * as Styled from "../styles";
import { useRouter } from "next/navigation";
import { removeToken } from "@/utils/tokenUtils";

export default function Header() {
  const router = useRouter();
  const handleLoggout = () => {
    removeToken()
    router.push('/login');
  }

  return (
    <Styled.Header>
      <Styled.Nav>
        <Styled.Logo src="logo-bankme.png" alt="logo" />
        <Styled.Links>
          <Link href="/payable">
            Payables
          </Link>
          <Link href="/assignor">
            Assignors
          </Link>
        </Styled.Links>
          <Styled.Loggout type="button"
            onClick={handleLoggout}
          >
            Loggout
          </Styled.Loggout>
      </Styled.Nav>
    </Styled.Header>
  );
};
