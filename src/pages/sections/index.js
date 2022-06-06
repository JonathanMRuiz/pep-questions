import { Collapse } from "antd";
import React from "react";
const { Panel } = Collapse;
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const Sections = () => {
  const onChange = (key) => {
    console.log(key);
  };

  return (
    <Collapse defaultActiveKey={["1"]} onChange={onChange}>
      <Panel header="This is panel header 1" key="1">
        <p>{text}</p>
      </Panel>
    </Collapse>
  );
};

export default Sections;
