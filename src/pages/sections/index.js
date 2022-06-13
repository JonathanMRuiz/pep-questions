import { Checkbox, Collapse, Form, Input, Radio, Select } from "antd";

import React, { useState } from "react";
import { data } from "./data";
const { Panel } = Collapse;
const { Option } = Select;

const sections = [];

for (const section of data.form.sections) {
  const questionFilter = data.form.questions.filter(
    (item) => item.sectionId === section.id
  );

  sections.push({
    sectionTitle: section.display,
    sectionId: section.id,
    questions: questionFilter,
    modalQuestions: data.form.modals,
  });
}

// const AnswerComponent = {
//   TEXT: buildInput,
//   OPTIONS: buildRadio,
//   CHECK_OPTIONS: buildSelect,
//   DROPDOWN: buildCheckbox,
// };

// const buildInput = () => {
//   <Input />;
// };
// const buildRadio = ({ sections }) => {
//   <Radio.Group>
//     <Radio></Radio>
//   </Radio.Group>;
// };
// const buildSelect = () => {
//   <Select></Select>;
// };
// const buildCheckbox = () => {
//   <Checkbox>
//     <span></span>
//   </Checkbox>;
// };

// console.log(AnswerComponent);

const Sections = () => {
  const [form] = Form.useForm();
  //const [isChecked, setIsChecked] = useState(false);
  const [responseModal, setResponseModal] = useState([]);

  const handleResponse = (e) => {};

  console.log(responseModal);

  return (
    <Form form={form}>
      <Collapse accordion>
        {sections.map((section) => (
          <Panel header={section.sectionTitle} key={section.sectionId}>
            {section.questions.map((q) => (
              <Form.Item label={q.question}>
                {q.answerType === "TEXT" && <Input />}
                {q.answerType === "CHECK_OPTIONS" && (
                  <Checkbox>
                    {q.options.map((o) => (
                      <span>{o.display}</span>
                    ))}
                  </Checkbox>
                )}
                {q.answerType === "OPTIONS" && (
                  <Radio.Group>
                    {q.options.map((o) => (
                      <Radio onChange={handleResponse} value={o.code}>
                        {o.display}
                      </Radio>
                    ))}
                  </Radio.Group>
                )}
                {q.answerType === "DROPDOWN" && (
                  <Select placeholder="Dropdown...">
                    {q.options.map((o) => (
                      <Option value={o.display}></Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            ))}
          </Panel>
        ))}
      </Collapse>
    </Form>
  );
};

export default Sections;
