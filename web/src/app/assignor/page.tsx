"use client";

import { useEffect, useState } from "react";
import * as Styled from "../styles";
import * as PayableStyle from '../styles/Payable';
import Assignor from "@/interfaces/Assignor";
import Payable from "@/interfaces/Payable";
import { connection } from "@/connection";
import useAuthentication from "@/hooks/useAuthentication";
import Loading from "../components/Loading";
import { getToken } from "@/utils/tokenUtils";
import TablePayable from "../components/TablePayable";
import TableAssignor from "../components/TableAssignor";

export default function AssignorPage() {
  const [assignors, setAssignors] = useState<Assignor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [payable, setPayable] = useState<Payable[]>([]);
  useAuthentication();
  
  useEffect(() => {
    async function data() {
      const token = getToken();
      const assignorsResponse = await connection.get<Assignor[]>("/assignor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payableResponse = await connection.get<Payable[]>("/payable", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAssignors(assignorsResponse.data);
      setPayable(payableResponse.data);
      setLoading(false);
    }
    data();
  }, []);

  if (loading) {
    return <Loading />;
  }
  
  return (
    <Styled.Main>
      <Styled.Container>
        <PayableStyle.Title>Assignors</PayableStyle.Title>
        <PayableStyle.Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {assignors.map((assignor) => {
              return (<TableAssignor key={assignor.id} assignor={assignor} />)
            })}
          </tbody>
        </PayableStyle.Table>
      </Styled.Container>
    </Styled.Main>
  );
}