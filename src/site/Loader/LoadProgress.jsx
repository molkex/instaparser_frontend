import React from "react";
import styled from "styled-components";
import { Progress, Typography } from "antd";
const { Title, Text } = Typography;

const SLoadProgress = styled.div`
  text-align: center;
  padding: 15px 30px;
`;

const STitle = styled(Title)`
  text-align: center;
`;

function LoadProgress({ current, total, username }) {
  const completePercentage = Math.ceil((current.progress / total) * 100);

  return (
    <SLoadProgress>
      <STitle level={3}>{`@${username}`}</STitle>
      <Progress status="active" percent={completePercentage} />
      <Text>
        Просканировано {current.progress} из {total}
      </Text>
    </SLoadProgress>
  );
}

export default LoadProgress;
