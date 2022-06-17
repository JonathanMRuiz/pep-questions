import { Checkbox, Collapse, Form, Input, Radio, Select } from "antd";

import React, { useEffect, useRef, useState } from "react";
import { data } from "./data";
const { Panel } = Collapse;
const { Option } = Select;

const sections = data.form.sections.reduce((acc, section) => {
  const questionFilter = data.form.questions.filter(
    (item) => item.sectionId === section.id
  );

  acc.push({
    sectionTitle: section.display,
    sectionId: section.id,
    questions: questionFilter,
    modalQuestions: data.form.modals,
  });

  return acc;
}, []);

// const AnswerComponent = {
//   TEXT: buildInput,
//   OPTIONS: buildRadio,
//   CHECK_OPTIONS: buildSelect,
//   DROPDOWN: buildCheckbox,
// };

const Sections = () => {
  const [form] = Form.useForm();
  //const [isChecked, setIsChecked] = useState(false);
  const [responseModal, setResponseModal] = useState([]);
  const handleResponse = (e) => {
    const { value, id } = e.target;

    const isDuplicate = responseModal.some((q) => q.id === id);

    if (!isDuplicate) {
      setResponseModal([...responseModal, { value, id }]);
    } else {
      const newArray = [...responseModal];
      const findResponse = newArray.find((item) => item.id === id);
      findResponse.value = value;
      setResponseModal(newArray);
    }
  };

  return (
    <Form form={form}>
      <Collapse accordion>
        {sections.map((section) => (
          <Panel header={section.sectionTitle}>
            {section.questions.map((q) => (
              <Form.Item label={q.question} key={q.id}>
                {q.answerType === "TEXT" && (
                  <Input id={q.id} onChange={handleResponse} />
                )}
                {q.answerType === "CHECK_OPTIONS" && (
                  <Checkbox id={q.id} value={q.answerCheckOption}>
                    {q.options.map((o) => (
                      <span>{o.display}</span>
                    ))}
                  </Checkbox>
                )}
                {q.answerType === "OPTIONS" && (
                  <Radio.Group>
                    {q.options.map((o) => (
                      <Radio id={q.id} onChange={handleResponse} value={o.code}>
                        {o.display}
                      </Radio>
                    ))}
                  </Radio.Group>
                )}
                {q.answerType === "DROPDOWN" && (
                  <Select placeholder='Dropdown...'>
                    {q.options.map((o) => (
                      <Option
                        id={q.id}
                        onChange={handleResponse}
                        value={o.display}></Option>
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
