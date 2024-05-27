import Assignor from "@/interfaces/Assignor";
import Payable from "@/interfaces/Payable";
import transformDate from "@/utils/transformDate";
import React from "react";
import * as Styled from "../styles/Details";
import { useRouter } from "next/navigation";
import { connection } from "@/connection";

type TablePayableProps = {
  payable: Payable;
  assignor: Assignor;
};

export default function TablePayable({
  payable,
  assignor,
}: TablePayableProps): React.ReactElement {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/payable/${payable.id}`);
  };
  return (
    <tr>
      <td>{payable.id}</td>
      <td>{payable.value}</td>
      <td>{transformDate(payable.emissionDate)}</td>
      <td>{assignor?.name}</td>
      <td>
        <Styled.Button onClick={handleClick}>Details</Styled.Button>
      </td>
    </tr>
  );
}
